import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {DecedentRecordsGridComponent} from "./components/pages/decedent-records-grid/decedent-records-grid.component";
import {LandingComponent} from "./components/landing/landing.component";
import {CaseContainerComponent} from "./components/pages/case-container/case-container.component";
import {CaseComparisonComponent} from "./components/pages/case-comparison/case-comparison.component";
import {ImportCaseComponent} from "./components/pages/import-case/import-case.component";
import {FhirValidatorComponent} from "./fhir-validator/components/fhir-validator/fhir-validator.component";

const routes: Routes = [
  {
    path: '',
    component: LandingComponent
  },
  {
    path: 'cases',
    component: DecedentRecordsGridComponent
  },
  {
    path: 'comparison',
    component: CaseComparisonComponent
  },
  {
    path: 'fhir-validator',
    component: FhirValidatorComponent
  },
  {
    path: 'cases/summary/:id',
    component: CaseContainerComponent
  },
  {
    path: 'import-case',
    component: ImportCaseComponent
  },
  { // Do not add any paths below this point, this path MUST ALWAYS be the last path!
    path: '**', redirectTo: ''
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
