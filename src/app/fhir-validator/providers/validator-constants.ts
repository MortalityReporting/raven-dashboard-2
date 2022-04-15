import { Injectable } from '@angular/core'

@Injectable()
// Add: US Core Patient, US Core Practitioner,
export class ValidatorConstants {

  PROFILE_LIST = [
    { name : "Bundle - Document MDI to EDRS",                      url: "http://hl7.org/fhir/us/mdi/StructureDefinition/Bundle-document-mdi-to-edrs"},
    { name : "Composition - MDI to EDRS",                          url: "http://hl7.org/fhir/us/mdi/StructureDefinition/Composition-mdi-to-edrs"},
    { name : "List - Cause of Death Pathway",                      url: "http://hl7.org/fhir/us/mdi/StructureDefinition/List-cause-of-death-pathway"},
    { name : "Observation - Cause of Death Condition",             url: "http://hl7.org/fhir/us/mdi/StructureDefinition/List-cause-of-death-pathway"},
    { name : "Observation - Condition Contributing to Death",      url: "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-condition-contributing-to-death"},
    { name : "Observation - Death Date",                           url: "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-death-date"},
    { name : "Observation - Death Injury/Event Occurred at Work",  url: "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-death-injury-at-work"},
    { name : "Observation - How Death Injury Occurred",            url: "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-how-death-injury-occurred"},
    { name : "Observation - Manner of Death",                      url: "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-manner-of-death"},
    { name : "Observation - Decedent Pregnancy",                   url: "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-decedent-pregnancy"},
    { name : "Observation - Tobacco Use Contributed to Death",     url: "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-tobacco-use-contributed-to-death"},
    { name : "Bundle - Message Toxicology to MDI",                 url: "http://hl7.org/fhir/us/mdi/StructureDefinition/Bundle-message-tox-to-mdi"},
    { name : "MessageHeader - Toxicology to MDI",                  url: "http://hl7.org/fhir/us/mdi/S∆tructureDefinition/MessageHeader-toxicology-to-mdi"},
    { name : "DiagnosticReport - Toxicology Lab Result to MDI",    url: "http://hl7.org/fhir/us/mdi/StructureDefinition/DiagnosticReport-toxicology-to-mdi"},
    { name : "Specimen - Toxicology Lab",                          url: "http://hl7.org/fhir/us/mdi/StructureDefinition/Specimen-toxicology-lab"},
    { name : "Observation - Toxicology Lab Result",                url: "http://hl7.org/fhir/us/mdi/StructureDefinition/Observation-toxicology-lab-result"},
  ];

}
