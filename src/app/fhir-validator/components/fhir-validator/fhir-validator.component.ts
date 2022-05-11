import { Component, OnInit } from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {DomSanitizer} from "@angular/platform-browser";
import {FhirValidatorService} from "../../service/fhir-validator.service";
import {ValidatorConstants} from "../../providers/validator-constants";
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatTableDataSource} from "@angular/material/table";
import {FormControl} from "@angular/forms";
import {Subscription} from "rxjs";

export interface WarningError {
  severity: string;
  message: string;
  location: string;
  expanded: boolean;
}


@Component({
  selector: 'app-fhir-validator',
  templateUrl: './fhir-validator.component.html',
  styleUrls: ['./fhir-validator.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class FhirValidatorComponent implements OnInit {

  fhirResource: string ='';
  resourceFormat = 'json';
  fileName: string;
  validationErrorStr: string;
  isFormattingPerformedRendered = false;
  hasBackendValidationErrors = false;
  parsedFhirResource : any;
  displayedColumns: string[] = ['toggle', 'icon', 'severity', 'fhirPath', 'location'];
  isLoading = false;
  apiErrorResponse: any = [];
  allExpanded = true;
  selectedSeverityLevel = new FormControl(['warning', 'error']);
  dataSource = new MatTableDataSource([]);
  validatorSubscription$: Subscription;
  validationFinished = false;
  isValidResource = false;

  constructor(
    private fhirValidatorService: FhirValidatorService,
    private _snackBar: MatSnackBar,
    private sanitized: DomSanitizer,
    public constants: ValidatorConstants,
  ) {
  }

  formatFhirResource(){
    if(this.fhirResource){
      if(this.resourceFormat === 'json' && this.fhirValidatorService.isJsonString(this.fhirResource)){
        this.fhirResource = this.fhirValidatorService.beautifyJSON(this.fhirResource);
      }
      else if(this.resourceFormat === 'xml' && this.fhirValidatorService.isXmlString(this.fhirResource)){
        this.fhirResource = this.fhirValidatorService.beautifyXML(this.fhirResource);
      }
    }
  }

  // It is important the format is working with "best effort"
  // That is it may or may not format the text properly and require extensive testing to validate its operation.
  onFormatInput() {
    this.formatFhirResource()
    this.isFormattingPerformedRendered = true;
    setTimeout(() => this.isFormattingPerformedRendered = false, 2000);
  }

  ngOnInit(): void {
  }

  clearUI(){
    this.fhirResource='';
    this.fileName=''
    this.validationErrorStr = '';
    this.isFormattingPerformedRendered = false;
    this.isValidResource = false;
    this.parsedFhirResource = null;
    this.apiErrorResponse = null;
    this.hasBackendValidationErrors = false;
    this.isValidResource = false;
    this.validationFinished = false;
  }

  onClear(){
    this.clearUI();
  }

  onFileSelected(event: any) {

    const file:File = event.target.files[0];

    if (file) {

      // auto toggle the file type radio buttons
      if (file.type === "text/xml"){
        this.resourceFormat = 'xml';
      }
      else if ("application/json"){
        this.resourceFormat = 'json';
      }

      // set the filename in the UI
      this.fileName = file.name;

      const reader = new FileReader();
      reader.readAsText(file, "UTF-8");
      reader.onload = () => {
        this.fhirResource = reader.result as string;
        this.formatFhirResource();
      }
      reader.onerror = () => {
        this._snackBar.open("Unable to open the file.", 'x' ,{
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-color']
        });
      }

    }
    else {
      this._snackBar.open("Unable to open the file.", 'x' ,{
        horizontalPosition: 'center',
        verticalPosition: 'top',
        duration: 3000,
        panelClass: ['danger-color']
      });
    }
  }

  validateFhirResource(fhirResource: any, resourceFormat: string) {

    this.validationErrorStr = this.fhirValidatorService.getUiValidationMessages(fhirResource, resourceFormat);
    if(this.validationErrorStr){
      //see if we can find any obvious issues with the resource here
      this.isValidResource = false;
      this.validationFinished = true;
    }
    else {
      // The UI validation passed successfully, and we execute the backend validation.
      this.executeAPIValidation(fhirResource, resourceFormat);
    }
  }

  onPasteFhirResource(event: ClipboardEvent) {
    // If no text is present in the textarea (this.fhirResource is empty) we toggle the  radio buttons
    // based on the input text format.
    if(!this.fhirResource) {
      this.clearUI();
      let text = event.clipboardData.getData('text');
      if (this.fhirValidatorService.isJsonString(text)) {
        this.resourceFormat = 'json';
      } else if (this.fhirValidatorService.isXmlString(text)) {
        this.resourceFormat = 'xml';
      }
    }
  }

  getLineNumbersBySeverity(apiResponse: any, severity: string): number[]{
    if(!apiResponse || apiResponse.length === 0){
      return null;
    }
    return apiResponse
      .filter((element: any) => element.severity == severity)
      .map((element: any) => this.getLineNumberFromLocation(element.location) - 1);
  };

  escapeHtml(str: string): string {
    // We escape all html tags in order to render the html as text in the innerHTML div
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }

  renderAPIValidationErrors(apiResponse: any) {

    const errorLineNumbers = this.getLineNumbersBySeverity(apiResponse, 'Error');
    const warningLineNumbers = this.getLineNumbersBySeverity(apiResponse, 'Warning');
    const infoLineNumbers = this.getLineNumbersBySeverity(apiResponse, 'Information');
    const noteLineNumbers = this.getLineNumbersBySeverity(apiResponse, 'Note');

    if(errorLineNumbers?.length > 0 || warningLineNumbers?.length > 0 || infoLineNumbers.length > 0){
      this.hasBackendValidationErrors = true;
      this.validationErrorStr = "Please see the validation errors below.";
    }

    const lines = this.fhirResource.split('\n');
    lines.forEach((line, i) => {
      let offsetLine = i + 1;
      const sanitized = this.escapeHtml(line);
      if(!this.parsedFhirResource){
        this.parsedFhirResource = '';
      }
      if(errorLineNumbers?.indexOf(i) != -1){
        let tempText = '<span class="error-mark" id="mark' + offsetLine + '">' + sanitized + '</span>';
        this.parsedFhirResource += tempText;
        this.parsedFhirResource += '\n';
      }
      else if(warningLineNumbers?.indexOf(i) != -1){
        let tempText = '<span class="warning-mark" id="mark' + offsetLine + '">' + sanitized + '</span>';
        this.parsedFhirResource += tempText;
        this.parsedFhirResource += '\n';
      }
      else if(infoLineNumbers?.indexOf(i) != -1){
        let tempText = '<span class="info-mark" id="mark' + offsetLine + '">' + sanitized + '</span>';
        this.parsedFhirResource += tempText;
        this.parsedFhirResource += '\n';
      }
      else if(noteLineNumbers?.indexOf(i) != -1){
        let tempText = '<span class="note-mark" id="mark' + offsetLine + '">' + sanitized + '</span>';
        this.parsedFhirResource += tempText;
        this.parsedFhirResource += '\n';
      }
      else {
        this.parsedFhirResource += sanitized;
        this.parsedFhirResource += '\n';
      }
    });
    this.parsedFhirResource = this.sanitized.bypassSecurityTrustHtml(this.parsedFhirResource);
  }

  scrollToElement(location: string ): void {
    const element = document.querySelector(location);
    if (element) element.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  getLineNumberFromLocation(locationStr: string): number {
    // We grab the location from response
    return parseInt (locationStr.split(",")[0].replace( /^\D+/g, ''));
  }

  // When the user selects a location from the errors and warning results, we want to scroll the page to that location

  onLocationSelected(response: any): void {
    let locationId = ('#mark' + this.getLineNumberFromLocation(response.location)).toLowerCase();
    this.scrollToElement(locationId);
  }

  private executeAPIValidation(fhirResource: any, resourceFormat: string) {
    this.isLoading = true;
    this.parsedFhirResource = null;
    this.apiErrorResponse = null;
    fhirResource = JSON.parse(fhirResource);
    this.validatorSubscription$ = this.fhirValidatorService.validateFhirResource(fhirResource, resourceFormat).subscribe({
      next: (response) => {
        this.validationFinished = true;
        if(response?.length === 1 && response[0].severity === "Information" && response[0].message === "ALL OK"){
          this.isValidResource = true;
        }
        else {
          this.isValidResource = false;
          response.forEach((element: any) => element.message = element.message .replace(/,(?=[^\s])/g, ", "));

          // sort by line numbers
          response = response.sort((a: any, b: any) => {
            return this.getLineNumberFromLocation(a.location) - this.getLineNumberFromLocation(b.location);
          });

          this.dataSource.data = response.map((element: any) => {
            let result: WarningError = Object.assign({}, element);
            result.expanded = true;
            return result
          });

          this.apiErrorResponse = response;
          this.dataSource.filterPredicate = this.getFilterPredicate();

          this.renderAPIValidationErrors(response);
        }
      },
      error: () => {
        this._snackBar.open("Server error occurred.", 'x' ,{
          horizontalPosition: 'center',
          verticalPosition: 'top',
          panelClass: ['error-color']
        });
        this.isLoading = false;
      },
      complete: () => {
        this.isLoading = false;
      }
    });
  }

  toggle() {
    this.allExpanded = !this.allExpanded;
    this.dataSource.data.forEach(item => item.expanded = this.allExpanded);
  }

  onFilterResults() {
    this.dataSource.filter = this.selectedSeverityLevel.value.join(',');
  }

  getFilterPredicate() {
    return function (row: any, filters: string) {
      let matchFilter: boolean = false;
      const filterArray = filters.split(',');
      filterArray.forEach((filter: string) => {
        if(row.severity.toLowerCase().indexOf(filter.toLowerCase())!= -1){
            matchFilter = true;
          }
        }
      )
      return matchFilter;
    };
  }

  onCancelValidation (){
    this.validatorSubscription$.unsubscribe();
    this.isLoading = false;
  }

  checkExpandCollapseAllStatus() {
    // When all elements are collapsed we want to change the expansion icon to render "expand all"
    // When all elements are expanded we want to change the expansion icon to "collapse all"
    // This will save extra unnecessary click for the user
    const expandedElementsCount = this.dataSource.data.filter(element => element.expanded).length;
    if(expandedElementsCount === this.dataSource.data.length){
      this.allExpanded = true;
    }
    else if(expandedElementsCount === 0){
      this.allExpanded = false;
    }
  }
}
