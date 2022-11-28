import {Component, OnInit} from '@angular/core';
import {FormBuilder} from "@angular/forms";
import {MatDialog} from "@angular/material/dialog";
import {openInputTextDialog} from "../../../widgets/input-text-dialog/input-text-dialog.component";

@Component({
  selector: 'app-search-edrs',
  templateUrl: './search-edrs.component.html',
  styleUrls: ['./search-edrs.component.css']
})
export class SearchEdrsComponent implements OnInit {

  inputTypeOptions: string[] = ['Registered Endpoint', 'Custom Endpoint'];

  serverEndpointList: any[] = [
    {uri: 'www.bluejay.edu', displayName: 'BlueJay'},
    {uri: 'www.gavers.edu', displayName: 'Gavers'},
  ];

  endpointConfigurationFormGroup = this.formBuilder.group({
    inputType: [this.inputTypeOptions[0]],
    serverEndpoint: [this.serverEndpointList[0].uri]
  });

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog
  ) {
  }

  ngOnInit(): void {
  }

  onSubmitEndpointConfiguration() {
    console.log(this.endpointConfigurationFormGroup);
  }

  onInputMdiToEdrsBundle() {
    openInputTextDialog(
      this.dialog,
      {
        title: "Input MDI to EDRS Document Bundle ",
        primaryActionBtnTitle: "Save",
        secondaryActionBtnTitle: "Cancel",
        isPrimaryButtonLeft: false
      })
      .subscribe(
        data => {
          console.log(data);
        }
      );
  }
}
