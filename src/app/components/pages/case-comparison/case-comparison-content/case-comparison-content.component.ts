import { Component, OnInit, ViewChild } from '@angular/core';
import { MatAccordion } from "@angular/material/expansion";
import { DocumentHandlerService } from "../../../../service/document-handler.service";
import { ExpectedDocument } from './expected-document';
import { USCorePatientDiff } from './models/us-core-patient.diff';
import { CompositionMdiToEdrsDiff } from './models/composition-mdi-to-edrs.diff';
import { USCoreLocationDiff } from './models/us-core-location.diff';
import { ObservationTobaccoUseDiff } from './models/observation-tobacco-use.diff';
import { ObservationDecedentPregnancyDiff } from './models/observation_decedent-pregnancy.diff';
import { ObservationDeathDateDiff } from './models/observation-death-date.diff';
import { ObservationMannerOfDeathDiff } from './models/observation-manner-of-death.diff';
import { USCorePractitionerDiff } from './models/us-core-practitioner.diff';
import { ObservationCauseOfDeathPart1Diff } from './models/observation-cause-of-death-part-1.diff';
import { ObservationCauseOfDeathPart2Diff } from './models/observation-cause-of-death-part-2.diff';
import { DecedentService } from "../../../../service/decedent.service";
import { 
  Comp_MDItoEDRS, 
  Obs_CauseOfDeathPart1, 
  Obs_CauseOfDeathPart2, 
  Obs_DeathDate, 
  Obs_DecedentPregnancy, 
  Obs_MannerOfDeath, 
  Obs_TobaccoUseContributedToDeath, 
  USCoreLocation, 
  USCorePatient, 
  USCorePractitioner
} from "../../../../model/mdi/profile.list"
import { Observable } from 'rxjs';

@Component({
  selector: 'app-case-comparison-content',
  templateUrl: './case-comparison-content.component.html',
  styleUrls: ['./case-comparison-content.component.css'],
})
export class CaseComparisonContentComponent implements OnInit {
  @ViewChild(MatAccordion) accordion: MatAccordion;
  
  isLoading = false;

  testCases = [
    {"compositionId": "c926f394-e442-4135-92bc-1e70e8a09b91", "display": "Whago C Brox"},
    {"compositionId": "358a3a7d-6011-463c-ad59-0077ad482b64", "display": "Brenda Estrat"},
    {"compositionId": "f6651a25-0296-4de0-8bd0-00d720607e1b", "display": "Erica Stevens"}, 
    {"compositionId": "c926f394-e442-4135-92bc-1e70e8a09b91", "display": "Whago C Brox"},
  ]

  selectedTestCase = this.testCases[0];

  caseAdminInfoExpanded: boolean = false;
  demographicsExpanded: boolean = false;
  circumstancesExpanded: boolean = false;
  jurisdictionExpanded: boolean = false;
  causeAndMannerExpanded: boolean = false;
  medicalHistoryExpanded: boolean = false;
  examNotesExpanded: boolean = false;
  narrativesExpanded: boolean = false;
  deathCertificateExpanded: boolean = false;

  patientResource: any;
  actualDocument: any;
  expectedDocument: any; 

  patient: USCorePatientDiff = new USCorePatientDiff( undefined, undefined );
  mdiToEdrs: CompositionMdiToEdrsDiff = new CompositionMdiToEdrsDiff( undefined, undefined );
  location: USCoreLocationDiff = new USCoreLocationDiff( undefined, undefined );
  tobaccoUse: ObservationTobaccoUseDiff = new ObservationTobaccoUseDiff( undefined, undefined );
  pregnancy: ObservationDecedentPregnancyDiff = new ObservationDecedentPregnancyDiff( undefined, undefined );
  deathDate: ObservationDeathDateDiff = new ObservationDeathDateDiff( undefined, undefined );
  causeOfDeath1List: ObservationCauseOfDeathPart1Diff[] = [];
  causeOfDeath2: ObservationCauseOfDeathPart2Diff = new ObservationCauseOfDeathPart2Diff( undefined, undefined );
  mannerOfDeath: ObservationMannerOfDeathDiff = new ObservationMannerOfDeathDiff( undefined, undefined );
  practitioner: USCorePractitionerDiff = new USCorePractitionerDiff( undefined, undefined );

  constructor(
    private decedentService: DecedentService,
    private documentHandler: DocumentHandlerService
  ) { }

  documentBundle$: Observable<any>;

  ngOnInit(): void 
  {
    this.isLoading = true;

    this.decedentService.getDocumentBundle("c926f394-e442-4135-92bc-1e70e8a09b91").subscribe(
      {next: (documentBundle: any) => {
        this.expectedDocument = documentBundle;
        this.isLoading = false;
      }
    });
  }

  selectionChange( event: any )
  {    
    this.isLoading = true;

    this.decedentService.getDocumentBundle(event.value).subscribe(
      {next: (documentBundle: any) => {
        this.expectedDocument = documentBundle;
        this.dodiff();
      },
      complete:  () => {
        this.isLoading = false
      }
    });
  }

  onItemClick( id: any )
  {  
    switch (id)
    {
      case 'caseAdminInfo': this.caseAdminInfoExpanded = !this.caseAdminInfoExpanded; break;      
      case 'demographics': this.demographicsExpanded = !this.demographicsExpanded; break;
      case 'circumstances':  this.circumstancesExpanded = !this.circumstancesExpanded; break;
      case 'jurisdiction': this.jurisdictionExpanded = !this.jurisdictionExpanded; break;
      case 'causeAndManner': this.causeAndMannerExpanded = !this.causeAndMannerExpanded; break;
      case 'medicalHistory': this.medicalHistoryExpanded = !this.medicalHistoryExpanded; break;
      case 'examAndAutopsy': this.examNotesExpanded = !this.examNotesExpanded; break;
      case 'narratives': this.narrativesExpanded = !this.narrativesExpanded; break;
      case 'deathCertificate': this.deathCertificateExpanded = !this.deathCertificateExpanded; break;
    }
  }

  demographicsStyle = 'invalid';
  circumstancesStyle = 'invalid';
  caseAdminInfoStyle = 'invalid';
  jurisdictionStyle = 'invalid';
  causeAndMannerStyle = 'invalid';
  medicalHistoryStyle = 'invalid';
  examAndHistoryStyle = 'invalid';
  narrativesStyle = 'invalid';
  deathCertificateStyle = 'invalid';
  deathDateStyle = 'invalid';

  onValueChange(event: Event) 
  {  
    try 
    {
      this.actualDocument = JSON.parse( (event.target as any).value );

      this.dodiff();
    } 
    catch(e) 
    {
      console.log(e);
    }
  }

  dodiff() 
  {
    try {
      this.mdiToEdrs = new CompositionMdiToEdrsDiff(
        this.documentHandler.findResourceByProfileName( this.actualDocument, Comp_MDItoEDRS ),
        this.documentHandler.findResourceByProfileName( this.expectedDocument, Comp_MDItoEDRS ));

      this.location = new USCoreLocationDiff(
        this.documentHandler.findResourceByProfileName( this.actualDocument, USCoreLocation ),
        this.documentHandler.findResourceByProfileName( this.expectedDocument, USCoreLocation ));
      
      this.tobaccoUse = new ObservationTobaccoUseDiff(
        this.documentHandler.findResourceByProfileName( this.actualDocument, Obs_TobaccoUseContributedToDeath ),
        this.documentHandler.findResourceByProfileName( this.expectedDocument, Obs_TobaccoUseContributedToDeath ));

      this.pregnancy = new ObservationDecedentPregnancyDiff(
        this.documentHandler.findResourceByProfileName( this.actualDocument, Obs_DecedentPregnancy ),
        this.documentHandler.findResourceByProfileName( this.expectedDocument, Obs_DecedentPregnancy ));

      this.deathDate = new ObservationDeathDateDiff(
        this.documentHandler.findResourceByProfileName( this.actualDocument, Obs_DeathDate ),
        this.documentHandler.findResourceByProfileName( this.expectedDocument, Obs_DeathDate ));

      this.causeOfDeath1List = [];
      let actualCauseOfDeath1List = this.documentHandler.findResourcesByProfileName( this.actualDocument, Obs_CauseOfDeathPart1 );
      let expectedCauseOfDeath1List = this.documentHandler.findResourcesByProfileName( this.expectedDocument, Obs_CauseOfDeathPart1 );

      for (let i = 0; i < actualCauseOfDeath1List.length; i++) {
        let causeOfDeath1 = new ObservationCauseOfDeathPart1Diff( actualCauseOfDeath1List[i], expectedCauseOfDeath1List[i] );
        this.causeOfDeath1List.push( causeOfDeath1 );
      }

      this.causeOfDeath2 = new ObservationCauseOfDeathPart2Diff(
        this.documentHandler.findResourceByProfileName( this.actualDocument, Obs_CauseOfDeathPart2 ),
        this.documentHandler.findResourceByProfileName( this.expectedDocument, Obs_CauseOfDeathPart2 ));

      this.mannerOfDeath = new ObservationMannerOfDeathDiff(
        this.documentHandler.findResourceByProfileName( this.actualDocument, Obs_MannerOfDeath ),
        this.documentHandler.findResourceByProfileName( this.expectedDocument, Obs_MannerOfDeath ));
      
      this.patient = new USCorePatientDiff(
        this.documentHandler.findResourceByProfileName( this.actualDocument, USCorePatient ),
        this.documentHandler.findResourceByProfileName( this.expectedDocument, USCorePatient ));  

      this.practitioner = new USCorePractitionerDiff(
        this.documentHandler.findResourceByProfileName( this.actualDocument, USCorePractitioner ),
        this.documentHandler.findResourceByProfileName( this.expectedDocument, USCorePractitioner ));

      this.caseAdminInfoStyle = ( 
        this.mdiToEdrs.extension.style === 'valid' &&
        this.practitioner.name.style === 'valid' &&
        this.practitioner.identifier.style === 'valid' &&
        this.practitioner.telecom.style === 'valid' &&
        this.practitioner.address.style === 'valid'
      ) ? 'valid' : 'invalid';

      this.demographicsStyle = ( 
        this.patient.gender.style === 'valid' &&
        this.patient.birthDate.style === 'valid' &&
        this.patient.extension.style === 'valid' &&
        this.patient.address.style === 'valid'
      ) ? 'valid' : 'invalid';

      this.circumstancesStyle = ( 
        this.location.address.style === 'valid' &&
        this.tobaccoUse.valueCodeableConcept.style === 'valid' &&
        this.pregnancy.valueCodeableConcept.style === 'valid'
      ) ? 'valid' : 'invalid';

      this.jurisdictionStyle = ( 
        this.deathDate.effectiveDateTime.style === 'valid' 
      ) ? 'valid' : 'invalid';

      this.causeAndMannerStyle = 'valid';

      for (let i = 0; i < actualCauseOfDeath1List.length; i++) {
        let causeOfDeath1 = new ObservationCauseOfDeathPart1Diff( actualCauseOfDeath1List[i], expectedCauseOfDeath1List[i] );
        if (causeOfDeath1.valueCodeableConcept.style === 'invalid')
        {
          this.causeAndMannerStyle = 'invalid';
        }
        if (causeOfDeath1.component.style === 'invalid')
        {
          this.causeAndMannerStyle = 'invalid';
        }
      }

      if (this.causeOfDeath2.valueCodeableConcept.style === 'invalid' )
      {
        this.causeAndMannerStyle = 'invalid';
      }

      if (this.mannerOfDeath.valueCodeableConcept.style === 'invalid' )
      {
        this.causeAndMannerStyle = 'invalid';
      }

    } catch(e) {
      console.log(e);
    }
  }
}