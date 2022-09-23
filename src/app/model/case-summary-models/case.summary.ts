import {HumanName} from "../fhir/types/human.name";
import {Identifier} from "../fhir/types/identifier";
import {CodeableConcept} from "../fhir/types/codeable.cocept";
import { stringify } from "querystring";

export class CaseSummary {
  demographics: Demographics;
  circumstances: Circumstances;
  jurisdiction: Jurisdiction;
  causeAndManner: CauseAndManner;
  medicalHistory: string = "Not Implemented"; // TODO: Implement.
  examAndAutopsy: string = "Not Implemented"; // TODO: Implement.
  narratives: string = "Not Implemented"; // TODO: Implement.
}

export class Demographics {
  aliases: HumanName[];
  gender: string;
  birthDate: string;
  ssn: string;
  identifiers: Identifier[]; // Other non-SSN Identifiers present
  race: string; // TODO: Setup FHIR Type
  ethnicity: string; // TODO: Setup FHIR Type
  maritalStatus: string;
  usualWork: UsualWork[];

  constructor() {
    this.usualWork = new Array();
  }
}

export class Circumstances {
  deathLocation: string;
  workInjury: string;
  tobaccoUseContributed: string;
  pregnancy: string;  
}

export class Jurisdiction {
  deathDateTime: string;
  pronouncedDateTime: string;
  establishmentApproach: string;
  typeOfDeathLocation: string;
}

// Individual Resources and Parts

export class UsualWork {
  occupation: string;
  industry: string;
  duration: string;

  constructor( occupation: string, industry: string )
  {
    this.occupation = occupation;
    this.industry = industry;
  }
}

export class CauseAndManner {
  causeOfDeathPart1: CauseOfDeathPart1[];
  causeOfDeathPart2: String[];
  causeOfDeathConditions: CauseOfDeathCondition[];
  contributingConditions: string[]; // TODO: Does this need a model?
  mannerOfDeath: string;
  howDeathInjuryOccurred: string;

  constructor() {
    this.causeOfDeathPart1 = new Array();
    this.causeOfDeathPart2 = new Array();
    this.causeOfDeathConditions = new Array();
  }
}

export class CauseOfDeathPart1 {
  event: string;
  interval: string;
}

export class CauseOfDeathCondition {
  value: CodeableConcept;
  interval: Interval;

  constructor( value: CodeableConcept, interval: Interval ) {    
    this.value = value;
    this.interval = interval;
  }
}

export class Interval {
  text: string; // Either equals valueString directly, or if valueQuantity (value + " " + unit).

  constructor( text: string )
  {
    this.text = text;
  }
}
