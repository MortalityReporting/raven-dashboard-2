import * as Diff from 'diff';
import {DiffValue} from '../diff-value';
import {ObservationDiff} from './observation.diff';

export class ObservationCauseOfDeathPart2Diff extends ObservationDiff { 
    performer: DiffValue;
    valueCodeableConcept: DiffValue;
    
    constructor()
    {
        super();

        this.performer = new DiffValue();
        this.valueCodeableConcept = new DiffValue();
    }

    override doDiff( actual: any, expected: any )
    {    
        super.doDiff( actual, expected );

        try {      
            this.performer.actual = JSON.stringify( actual.performer, null, 4 );
            this.performer.expected = JSON.stringify( expected.performer, null, 4 );
            [this.performer.state,this.performer.difference] = DiffValue.doDiff( Diff.diffChars( this.performer.expected, this.performer.actual ));  

            this.valueCodeableConcept.actual = JSON.stringify( actual.valueCodeableConcept, null, 4 );
            this.valueCodeableConcept.expected = JSON.stringify( expected.valueCodeableConcept, null, 4 );
            [this.valueCodeableConcept.state,this.valueCodeableConcept.difference] = DiffValue.doDiff( Diff.diffChars( this.valueCodeableConcept.expected, this.valueCodeableConcept.actual ));  

            let state =
                this.state === 'valid' &&
                this.performer.state === 'valid' &&
                this.valueCodeableConcept.state === 'valid'
        
            this.state = state ? 'valid' : 'invalid';
        } catch(e) {
            console.log(e);
        }
    }
}