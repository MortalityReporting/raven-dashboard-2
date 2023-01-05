import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {DecedentGridDTO} from "../../../../../model/decedent.grid.dto";
import {MatSort} from "@angular/material/sort";
import {ActivatedRoute, Router} from "@angular/router";
import {DecedentService} from "../../../../../service/decedent.service";
import {UtilsService} from "../../../../../service/utils.service";
import {forkJoin, map, mergeMap, switchMap} from "rxjs";
import {SearchEdrsService} from "../../../../../service/search-edrs.service";
import {DecedentSimpleInfo} from "../../../../../model/decedent-simple-info";
import {MatSelect} from "@angular/material/select";

@Component({
  selector: 'app-mdi-to-edrs-grid',
  templateUrl: './mdi-to-edrs-grid.component.html',
  styleUrls: ['./mdi-to-edrs-grid.component.css']
})
// For now this class component is almost exactly the same as the one we use for the decedent-records-grid.
// However, the functionality will be different and we are going to change the code at some point in the near future.
export class MdiToEdrsGridComponent implements OnInit {

  dataSource = new MatTableDataSource<any>();
  displayedColumns: string[] = ['index', 'name', 'gender', 'tod', 'mannerOfDeath', 'caseNumber'];
  decedentGridDtoList: any[];
  isLoading = true;
  selectedCase: any;
  decedentInfo: DecedentSimpleInfo;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('input') input: ElementRef;
  @ViewChild('mannerOfDeathSelect') mannerOfDeathSelect: MatSelect;

  mannerOfDeathList: string [] = [];

  constructor(
    private route: ActivatedRoute,
    private decedentService: DecedentService,
    private router: Router,
    private utilsService: UtilsService,
    private searchEdrsService: SearchEdrsService
  ) {
  }

  mapToDto(entry: any): DecedentGridDTO {
    let decedentDTO = new DecedentGridDTO();
    decedentDTO.decedentId = entry.resource?.id;
    decedentDTO.firstName = entry.resource?.name?.[0]?.given[0];
    decedentDTO.lastName = entry.resource?.name?.[0]?.family;
    decedentDTO.gender = entry.resource?.gender;
    decedentDTO.system = entry.resource?.identifier?.[0]?.system || null;
    decedentDTO.age = this.getAgeFromDob(new Date(entry.resource?.birthDate));
    return decedentDTO;
  }

  ngOnInit(): void {
    const loincCauseOfDeath = '69449-7';
    const loincTimeOfDeath = '81956-5';
    const codes = [loincCauseOfDeath, loincTimeOfDeath];
    this.isLoading = true;

    this.searchEdrsService.documentBundle$.subscribe({
      next: value => {
        if(!value){
          this.selectedCase = null;
          this.searchEdrsService.setDecedentData(null);
        }
      }
    });

    this.decedentService.getDecedentRecords().pipe(
      mergeMap((decedentRecordsList: any[]) =>
        forkJoin(
          decedentRecordsList.map((decedentRecord: any, i) =>
            this.decedentService.getDecedentObservationsByCode(decedentRecord, codes).pipe(
              map((observation: any) => {
                decedentRecord = this.mapToDto(decedentRecord);
                const tod = observation?.entry?.find(entry => entry.resource?.code?.coding[0]?.code == loincTimeOfDeath)?.resource?.effectiveDateTime;
                decedentRecord.tod = tod;
                const mannerOfDeath =  observation?.entry?.find(entry => entry.resource?.code?.coding[0]?.code == loincCauseOfDeath)?.resource?.valueCodeableConcept?.coding[0]?.display;
                decedentRecord.mannerOfDeath = mannerOfDeath;
                decedentRecord.index = i + 1;
                return decedentRecord;
              })
            )
          ))
      )
    ).pipe(
      mergeMap((decedentRecordsList: any[]) =>
        forkJoin(
          decedentRecordsList.map((decedentRecord: any, i) =>
            this.decedentService.getComposition(decedentRecord.decedentId).pipe(
              map((composition: any) => {
                const caseNumber = composition?.entry?.[0]?.resource?.extension?.[0]?.valueIdentifier?.value;
                decedentRecord.caseNumber = caseNumber;
                return decedentRecord
              })
            )
          ))
      )
    )
      .subscribe({
        next: (data) => {
          this.decedentGridDtoList = data;
          this.dataSource = new MatTableDataSource(data);
          this.mannerOfDeathList = this.getMannerOfDeathList(this.decedentGridDtoList);
          this.dataSource.sort = this.sort;
        },
        error: (e) => {
          console.error(e);
          this.utilsService.showErrorMessage();
        },
        complete:  () => {
          this.isLoading = false;
        }
      });
  }

  onCaseSelected(decedent: any) {
    this.selectedCase = decedent;

    this.decedentInfo = new DecedentSimpleInfo();
    this.decedentInfo.mdiTrackingNumber = decedent.caseNumber;
    this.decedentInfo.dateTimeOfDeath = decedent.tod;
    this.decedentInfo.name = decedent.lastName + ', ' + decedent.firstName ? ', ' + decedent.firstName : '';
    this.searchEdrsService.setDecedentData(this.decedentInfo);

    this.decedentService.getComposition(decedent.decedentId).pipe(
      switchMap(composition => this.decedentService.getDocumentBundle(composition?.entry?.[0]?.resource?.id))
    ).subscribe({
      next: result => this.searchEdrsService.setDocumentBundle(result),
      error: err => {
        console.error(err);
        this.utilsService.showErrorMessage("Error retrieving document bundle.")
      }
    });
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

  private getMannerOfDeathList(decedentGridDtoList: DecedentGridDTO[]) {
    const result = [...new Set (decedentGridDtoList.map(decedent => decedent.mannerOfDeath))].filter(element => !!element);
    return result;
  }

  applyMannerOfDeathFilter() {
    const mannerOfDeath = this.mannerOfDeathSelect.value;
    this.dataSource.filter = mannerOfDeath;
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onClearFilters() {
    this.mannerOfDeathSelect.value = null;
    this.input.nativeElement.value = '';
    this.dataSource.filter = '';
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }
}
