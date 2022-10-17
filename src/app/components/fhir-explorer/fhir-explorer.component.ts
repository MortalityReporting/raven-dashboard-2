import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {FhirResource} from "../../model/fhir/fhir.resource";
import {FhirResourceProviderService} from "../../service/fhir-resource-provider.service";
import {HttpClient} from "@angular/common/http";
import {DocumentHandlerService} from "../../service/document-handler.service";
import {FhirExplorerService} from 'src/app/service/fhir-explorer.service';
import {UtilsService} from "../../service/utils.service";

@Component({
  selector: 'app-fhir-explorer',
  templateUrl: './fhir-explorer.component.html',
  styleUrls: ['./fhir-explorer.component.css']
})
export class FhirExplorerComponent implements OnInit {

  formattedText: string;
  fhirResource: FhirResource;
  selectedStructure: string = "narrative";

  constructor(
    private httpClient: HttpClient,
    private documentHandler: DocumentHandlerService,
    private fhirExplorerService: FhirExplorerService,
    private fhirResourceProvider: FhirResourceProviderService,
    private utilsService: UtilsService
  ) {
      this.fhirResourceProvider.fhirResource$.subscribe( resource => {

      this.fhirResource = resource;

      if(!this.fhirResource){
        this.formattedText = '';
      }
      else if(this.selectedStructure == "narrative"){
        this.formattedText = this.documentHandler.getCurrentSubjectResource()?.text?.div;
      }
      else if (this.selectedStructure === "xml") {
        this.fhirExplorerService.translateToXml( this.fhirResource ).subscribe( response => {
          this.formattedText = response;
        })
      }
      else {
        this.formattedText = JSON.stringify( resource, null, 2 );
      }
    })
  };

  ngOnInit(): void {
  }

  isNarrative() : boolean {
    return this.selectedStructure === 'narrative';
  }

  onToggleClick() {
    if (this.selectedStructure === "narrative") {
      this.formattedText = this.documentHandler.getCurrentSubjectResource().text.div;
    }
    else {
      // TODO not sure why this is a good idea and we need to fix this code ASAP
      const resource = this.documentHandler.getCurrentSubjectResource();
      this.fhirResourceProvider.setSelectedFhirResource(this.fhirResource);
    }
  }

  onCopyToClipboard(formattedText: string) {
    this.utilsService.showSuccessMessage("Content copied to clipboard.")
  }
}
