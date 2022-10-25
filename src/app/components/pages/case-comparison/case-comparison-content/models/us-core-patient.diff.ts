import * as Diff from 'diff';
import {DiffType} from '../diff-type';

export class USCorePatientDiff {
    address: DiffType;
    birthDate: DiffType;
    ethnicity: DiffType;
    gender: DiffType;
    id: DiffType;
    identifier: DiffType;
    meta: DiffType;
    name: DiffType;
    race: DiffType;
    resourceType: DiffType;
    text: DiffType;

    style: string;

    actual: any;
    expected: any;

    constructor( actual: any, expected: any )
    {
        this.actual = actual;
        this.expected = expected;

        this.style = 'invalid';
        this.address = new DiffType();
        this.birthDate = new DiffType();
        this.ethnicity = new DiffType();
        this.gender = new DiffType();
        this.id = new DiffType();
        this.identifier = new DiffType();
        this.meta = new DiffType();
        this.name = new DiffType();
        this.race = new DiffType();
        this.resourceType = new DiffType();
        this.text = new DiffType();

        this.doDiff();
    }

    doDiff()
    {
        try {
            this.address.expected = JSON.stringify( {address: this.expected.address}, null, 4 );
            this.address.actual = JSON.stringify( {address: this.actual.address}, null, 4 );
            [this.address.style,this.address.difference] = DiffType.doDiff( Diff.diffChars( this.address.expected, this.address.actual ));
        } catch(e) {};

        try {
            this.birthDate.expected = '"birthDate": "' + this.expected.birthDate + '"';
            this.birthDate.actual = '"birthDate": "' + this.actual.birthDate + '"';
            [this.birthDate.style,this.birthDate.difference] = DiffType.doDiff( Diff.diffChars( this.birthDate.expected, this.birthDate.actual ));
        } catch(e) {};

        try {
            let extension = this.expected.extension.find((extension: any) => extension.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race");
            let textExtension = extension.extension.find((extension: any) => extension.url === "text");
            this.race.expected = '"valueString": "' + textExtension.valueString + '"';

            extension = this.actual.extension.find((extension: any) => extension.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-race");
            textExtension = extension.extension.find((extension: any) => extension.url === "text");
            this.race.actual = '"valueString": "' + textExtension.valueString + '"';

            [this.race.style,this.race.difference] = DiffType.doDiff( Diff.diffChars( this.race.expected, this.race.actual ));
        } catch(e) {};

        try {
            let extension = this.expected.extension.find((extension: any) => extension.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity");
            let textExtension = extension.extension.find((extension: any) => extension.url === "text");
            this.ethnicity.expected = '"valueString": "' + textExtension.valueString + '"';

            extension = this.actual.extension.find((extension: any) => extension.url === "http://hl7.org/fhir/us/core/StructureDefinition/us-core-ethnicity");
            textExtension = extension.extension.find((extension: any) => extension.url === "text");
            this.ethnicity.actual = '"valueString": "' + textExtension.valueString + '"';

            [this.ethnicity.style,this.ethnicity.difference] = DiffType.doDiff( Diff.diffChars( this.ethnicity.expected, this.ethnicity.actual ));
        } catch(e) {};

        try {
            this.gender.expected = '"gender": "' + this.expected.gender + '"';
            this.gender.actual = '"gender": "' + this.actual.gender + '"';
            [this.gender.style,this.gender.difference] = DiffType.doDiff( Diff.diffChars( this.gender.expected, this.gender.actual ));
        } catch(e) {};

        try {
            this.id.expected = JSON.stringify({id:  this.expected.id}, null, 4 );
            this.id.actual = JSON.stringify( {id: this.actual.id}, null, 4 );
            [this.id.style,this.id.difference] = DiffType.doDiff( Diff.diffChars( this.id.expected, this.id.actual ));
        } catch(e) {};

        try {
            this.identifier.expected = JSON.stringify( this.expected.identifier[0], null, 4 );
            this.identifier.actual = JSON.stringify( this.actual.identifier[0], null, 4 );
            [this.identifier.style,this.identifier.difference] = DiffType.doDiff( Diff.diffChars( this.identifier.expected, this.identifier.actual ));
        } catch(e) {};

        try {
            this.meta.expected = JSON.stringify( {meta: this.expected.meta}, null, 4 );
            this.meta.actual = JSON.stringify( {meat: this.actual.meta}, null, 4 );
            [this.meta.style,this.meta.difference] = DiffType.doDiff( Diff.diffChars( this.meta.expected, this.meta.actual ));
        } catch(e) {};

        try {
            this.name.expected = JSON.stringify( {name: this.expected.name}, null, 4 );
            this.name.actual = JSON.stringify( {name: this.actual.name}, null, 4 );
            [this.name.style,this.name.difference] = DiffType.doDiff( Diff.diffChars( this.name.expected, this.name.actual ));
        } catch(e) {};

        try {
            this.resourceType.expected = JSON.stringify( {resourceType: this.expected.resourceType}, null, 4 );
            this.resourceType.actual = JSON.stringify( {resourceType: this.actual.resourceType}, null, 4 );
            [this.resourceType.style,this.resourceType.difference] = DiffType.doDiff( Diff.diffChars( this.resourceType.expected, this.resourceType.actual ));
        } catch(e) {};

        try {
            this.text.expected = JSON.stringify( {text: this.expected.text}, null, 4 );
            this.text.actual = JSON.stringify( {text: this.actual.text}, null, 4 );
            [this.text.style,this.text.difference] = DiffType.doDiff( Diff.diffChars( this.text.expected, this.text.actual ));
        } catch(e) {};
    }
}
