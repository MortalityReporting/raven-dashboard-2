import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {DecedentService} from "../../../service/decedent.service";
import {DocumentHandlerService} from "../../../service/document-handler.service";
import { Observable } from "rxjs";
import {CaseHeader} from "../../../model/case-summary-models/case.header";
import {CaseSummary} from "../../../model/case-summary-models/case.summary";
import {CaseComparisonContentComponent} from "./case-comparison-content/case-comparison-content.component";

@Component({
  selector: 'app-case-comparison',
  templateUrl: './case-comparison.component.html',
  styleUrls: ['./case-comparison.component.css']
})
export class CaseComparisonComponent implements OnInit, OnDestroy {
  @ViewChild(CaseComparisonContentComponent) caseComparisonContentComponent: CaseComparisonContentComponent;
  caseHeader$: Observable<CaseHeader>;
  caseSummary$: Observable<CaseSummary>;
  patientResource$: Observable<any>;
  documentBundle$: Observable<any>;
  sidenavExpanded = false;
  autosize: boolean = false;
  selectedAuthor = "VALUE NOT FOUND";

  constructor(
    private route: ActivatedRoute,
    private decedentService: DecedentService,
    public documentHandler: DocumentHandlerService
  ) { }

  ngOnInit(): void {

    let subjectId = this.route.snapshot.params['id'];
    if (subjectId) {
      this.decedentService.getComposition(subjectId).subscribe(
        {next: (composition: any) => {
            this.documentBundle$ = this.documentHandler.getDocumentBundle(composition.entry[0].resource.id);
            this.documentBundle$.subscribe();
          }}
      );
      this.caseHeader$ = this.documentHandler.caseHeader$;
      this.caseSummary$ = this.documentHandler.caseSummary$;
      this.patientResource$ = this.documentHandler.patientResource$;
      this.caseSummary$.subscribe(caseSummary => {
        caseSummary.narratives = this.documentHandler.getCurrentSubjectResource()?.text?.div;
      })
    }
  }

  onSidenavResize(expanded: boolean) {
    this.sidenavExpanded = expanded;
    this.autosize = true;
    setTimeout(() => this.autosize = false, 1);
  }

  onItemClick(id: string) {

    let shouldOpen = false;

    switch (id) {
      case "caseAdminInfo": shouldOpen = !this.caseComparisonContentComponent.caseAdminInfoExpanded; break;
      case "demographics": shouldOpen = !this.caseComparisonContentComponent.demographicsExpanded; break;
      case "circumstances": shouldOpen = !this.caseComparisonContentComponent.circumstancesExpanded; break;
      case "jurisdiction": shouldOpen = !this.caseComparisonContentComponent.jurisdictionExpanded; break;
      case "causeAndManner": shouldOpen = !this.caseComparisonContentComponent.causeAndMannerExpanded; break;
      case "examNotes": shouldOpen = !this.caseComparisonContentComponent.examNotesExpanded; break;
    }

    this.caseComparisonContentComponent.caseAdminInfoExpanded = false;
    this.caseComparisonContentComponent.demographicsExpanded = false;
    this.caseComparisonContentComponent.circumstancesExpanded = false;
    this.caseComparisonContentComponent.jurisdictionExpanded = false;
    this.caseComparisonContentComponent.causeAndMannerExpanded = false;
    this.caseComparisonContentComponent.examNotesExpanded = false;

    if (shouldOpen) {
      this.caseComparisonContentComponent.onItemClick(id);
    }
  }

  ngOnDestroy(): void {
    this.documentHandler.clearObservablesAndCashedData();
  }
}
