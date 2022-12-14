import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {PageEvent} from '@angular/material/paginator';
import {MatSort} from "@angular/material/sort";
import {DecedentGridDTO} from "../../../../model/decedent.grid.dto";
import {DecedentService} from "../../../../service/decedent.service";
import {ActivatedRoute, Router} from "@angular/router";
import {mergeMap, forkJoin, map} from "rxjs";

@Component({
  selector: 'app-decedent-records-grid',
  templateUrl: './decedent-records-grid.component.html',
  styleUrls: ['./decedent-records-grid.component.css']
})
export class DecedentRecordsGridComponent implements OnInit {

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['index', 'name', 'gender', 'tod', 'mannerOfDeath', 'system'];
  decedentGridDtoList: DecedentGridDTO[];
  isLoading = true;

  @ViewChild(MatSort) sort: MatSort;

  @ViewChild('input') input: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private decedentService: DecedentService,
    private router: Router,
  ) {
  }

  mapToDto(entry: any): DecedentGridDTO {
    let decedentDTO = new DecedentGridDTO();
    decedentDTO.decedentId = entry.resource?.id;
    decedentDTO.firstName = entry.resource?.name[0]?.given[0];
    decedentDTO.lastName = entry.resource?.name[0]?.family;
    decedentDTO.gender = entry.resource?.gender;
    decedentDTO.system = entry.resource?.identifier[0]?.system || null;
    decedentDTO.age = this.getAgeFromDob(new Date(entry.resource?.birthDate));
    return decedentDTO;
  }

  ngOnInit(): void {
    const loincCauseOfDeath = '69449-7';
    const loincTimeOfDeath = '81956-5';
    const codes = [loincCauseOfDeath, loincTimeOfDeath];
    this.isLoading = true;

    this.decedentService.getDecedentRecords().pipe(
      mergeMap((decedentRecordsList: any[]) =>
        forkJoin(
          decedentRecordsList.map((decedentRecord: any, i) =>

            this.decedentService.getDecedentObservationsByCode(decedentRecord, codes).pipe(
              map((observation: any) => {
                decedentRecord = this.mapToDto(decedentRecord);
                const tod = observation?.entry.find(entry => entry.resource?.code?.coding[0]?.code == loincTimeOfDeath)?.resource?.effectiveDateTime;
                decedentRecord.tod = tod;
                const mannerOfDeath =  observation?.entry.find(entry => entry.resource.code.coding[0].code == loincCauseOfDeath)?.resource?.valueCodeableConcept?.coding[0]?.display;
                decedentRecord.mannerOfDeath = mannerOfDeath;
                decedentRecord.index = i + 1;
                return decedentRecord;
              })
            )
          ))
      )
    ).subscribe({
        next: (data) => {
          this.decedentGridDtoList = data;
          this.dataSource = new MatTableDataSource(data);
          this.dataSource.sort = this.sort;
          },
        error: (e) => {
          console.error(e);
          //TODO render error message to the user
        },
        complete:  () => {
          this.isLoading = false
          }
    });
  }

  onCaseSelected(row: any) {
    this.router.navigate(['cases/summary/', row.decedentId]);
  }

  pageChanged(event: PageEvent) {
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAgeFromDob(birthday: any) {
    const ageDifMs = Date.now() - birthday;
    const ageDate = new Date(ageDifMs);
    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

}
