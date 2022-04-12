import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import {DecedentService} from "../../../service/decedent.service";
import {DocumentHandlerService} from "../../../service/document-handler.service";
import {BehaviorSubject, Observable, Subject} from "rxjs";
import {PatientHeader} from "../../../model/case-summary-models/patient.header";
import {map} from "rxjs-compat/operator/map";
import {CaseHeader} from "../../../model/case-summary-models/case.header";
import {CaseSummary} from "../../../model/case-summary-models/case.summary";

@Component({
  selector: 'app-case-summary',
  templateUrl: './case-summary.component.html',
  styleUrls: ['./case-summary.component.css']
})
export class CaseSummaryComponent implements OnInit {

  patientHeader$: Observable<PatientHeader>;
  caseHeader$: Observable<CaseHeader>;
  caseSummary$: Observable<CaseSummary>;
  documentBundle$: Observable<any>;

  constructor(
    private route: ActivatedRoute,
    private decedentService: DecedentService,
    public documentHandler: DocumentHandlerService
  ) { }

  ngOnInit(): void {
    let subjectId = this.route.snapshot.params['id'];
    this.decedentService.getComposition(subjectId).subscribe(
      {next: (composition: any) => {
          this.documentBundle$ = this.documentHandler.getDocumentBundle(composition.entry[0].resource.id);
          this.documentBundle$.subscribe();
        }}
    );

    this.patientHeader$ = this.documentHandler.patientHeader$;
    this.caseHeader$ = this.documentHandler.caseHeader$;
    this.caseSummary$ = this.documentHandler.caseSummary$;
  }
}
