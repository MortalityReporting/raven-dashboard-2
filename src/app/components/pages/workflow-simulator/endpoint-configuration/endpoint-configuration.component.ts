import { Component, OnInit } from '@angular/core';
import {DecedentSimpleInfo} from "../../../../model/decedent-simple-info";
import {SearchEdrsService} from "../../../../service/search-edrs.service";
import {FormBuilder} from "@angular/forms";

@Component({
  selector: 'app-endpoint-configuration',
  templateUrl: './endpoint-configuration.component.html',
  styleUrls: ['./endpoint-configuration.component.css']
})
export class EndpointConfigurationComponent implements OnInit {
  inputTypeOptions: string[] = ['Registered Endpoint', 'Custom Endpoint'];

  //TODO extract those as constants
  serverEndpointList: any[] = [
    {uri: 'www.bluejay.edu', displayName: 'BlueJay'},
    {uri: 'www.gavers.edu', displayName: 'Gavers'},
  ];

  endpointConfigurationFormGroup = this.formBuilder.group({
    inputType: [this.inputTypeOptions[0]],
    serverEndpoint: [this.serverEndpointList[0].uri]
  });

  decedentInfo: DecedentSimpleInfo;

  constructor(
    private searchEdrsService: SearchEdrsService,
    private formBuilder: FormBuilder,
  ) { }

  onSubmitEndpointConfiguration() {
    console.log(this.endpointConfigurationFormGroup);
  }

  ngOnInit(): void {
    this.searchEdrsService.decedentData$.subscribe({
      next: value => {
        this.decedentInfo = value;
      }
    });
  }

}
