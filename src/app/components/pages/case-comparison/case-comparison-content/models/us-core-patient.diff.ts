import * as Diff from 'diff';
import {DiffValue} from '../diff-value';

export class USCorePatientDiff {    
    address: DiffValue;
    birthDate: DiffValue;
    extension: DiffValue;
    id: DiffValue;
    identifier: DiffValue;
    gender: DiffValue;
    name: DiffValue;
    resourceType: DiffValue;
    text: DiffValue;

    state: string;

    constructor()
    {
        this.state = 'invalid';
        this.resourceType = new DiffValue();
        this.id = new DiffValue();
        this.text = new DiffValue();
        this.identifier = new DiffValue();
        this.extension = new DiffValue();
        this.name = new DiffValue();
        this.gender = new DiffValue();
        this.birthDate = new DiffValue();
        this.address = new DiffValue();
    }

    doDiff( actual: any, expected: any )
    {    
        try {      
            this.resourceType.actual = JSON.stringify( actual.resourceType, null, 4 );
            this.resourceType.expected = JSON.stringify( expected.resourceType, null, 4 );
            [this.resourceType.state,this.resourceType.difference] = DiffValue.doDiff( Diff.diffChars( this.resourceType.expected, this.resourceType.actual ));  

            this.id.actual = JSON.stringify( actual.id, null, 4 );
            this.id.expected = JSON.stringify( expected.id, null, 4 );
            [this.id.state,this.id.difference] = DiffValue.doDiff( Diff.diffChars( this.id.expected, this.id.actual ));  

            this.text.actual = JSON.stringify( actual.text, null, 4 );
            this.text.expected = JSON.stringify( expected.text, null, 4 );
            [this.text.state,this.text.difference] = DiffValue.doDiff( Diff.diffChars( this.text.expected, this.text.actual ));  

            this.identifier.actual = JSON.stringify( actual.identifier, null, 4 );
            this.identifier.expected = JSON.stringify( expected.identifier, null, 4 );
            [this.identifier.state,this.identifier.difference] = DiffValue.doDiff( Diff.diffChars( this.identifier.expected, this.identifier.actual ));  

            this.extension.actual = JSON.stringify( actual.extension, null, 4 );
            this.extension.expected = JSON.stringify( expected.extension, null, 4 );
            [this.extension.state,this.extension.difference] = DiffValue.doDiff( Diff.diffChars( this.extension.expected, this.extension.actual ));  

            this.name.actual = JSON.stringify( actual.name, null, 4 );
            this.name.expected = JSON.stringify( expected.name, null, 4 );
            [this.name.state,this.name.difference] = DiffValue.doDiff( Diff.diffChars( this.name.expected, this.name.actual ));  

            this.gender.actual = JSON.stringify( actual.gender, null, 4 );
            this.gender.expected = JSON.stringify( expected.gender, null, 4 );
            [this.gender.state,this.gender.difference] = DiffValue.doDiff( Diff.diffChars( this.gender.expected, this.gender.actual ));  

            this.birthDate.actual = JSON.stringify( actual.birthDate, null, 4 );
            this.birthDate.expected = JSON.stringify( expected.birthDate, null, 4 );
            [this.birthDate.state,this.birthDate.difference] = DiffValue.doDiff( Diff.diffChars( this.birthDate.expected, this.birthDate.actual ));  

            this.address.actual = JSON.stringify( actual.address, null, 4 );
            this.address.expected = JSON.stringify( expected.address, null, 4 );
            [this.address.state,this.address.difference] = DiffValue.doDiff( Diff.diffChars( this.address.expected, this.address.actual ));  

            let state = 
                this.address.state === 'valid' &&
                this.birthDate.state === 'valid' &&
                this.extension.state === 'valid' &&
                this.id.state === 'valid' &&
                this.identifier.state === 'valid' &&
                this.gender.state === 'valid' &&
                this.name.state === 'valid' &&
                this.resourceType.state === 'valid' &&
                this.text.state === 'valid'
        
            this.state = state ? 'valid' : 'invalid';

        } catch(e) {
            console.log(e);
        }
    }
}