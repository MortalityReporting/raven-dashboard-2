import * as Diff from 'diff';
import {DiffType} from '../diff-type';
import {ObservationDiff} from './observation.diff';

export class ObservationAutopsyPerformedDiff extends ObservationDiff { 
    component: DiffType;
    status: DiffType;
    valueCodeableConcept: DiffType;
    
    constructor( actual: any, expected: any )
    {
        super( actual, expected );

        this.style = 'invalid';
        this.component = new DiffType();
        this.status = new DiffType();
        this.valueCodeableConcept = new DiffType();

        this.doDiff();
    }

    override doDiff()
    {    
        super.doDiff();

        try {      
            this.component.expected = JSON.stringify( this.expected.component, null, 4 );
            this.component.actual = JSON.stringify( this.actual.component, null, 4 );
            [this.component.style,this.component.difference] = DiffType.doDiff( Diff.diffChars( this.component.expected, this.component.actual ));  
        } catch(e) {};

        try {      
            this.status.expected = JSON.stringify( this.expected.status, null, 4 );
            this.status.actual = JSON.stringify( this.actual.status, null, 4 );
            [this.status.style,this.status.difference] = DiffType.doDiff( Diff.diffChars( this.status.expected, this.status.actual ));  
        } catch(e) {};

        try {
            this.valueCodeableConcept.expected = JSON.stringify( this.expected.valueCodeableConcept, null, 4 );
            this.valueCodeableConcept.actual = JSON.stringify( this.actual.valueCodeableConcept, null, 4 );
            [this.valueCodeableConcept.style,this.valueCodeableConcept.difference] = DiffType.doDiff( Diff.diffChars( this.valueCodeableConcept.expected, this.valueCodeableConcept.actual ));  
        } catch(e) {};
    }
}