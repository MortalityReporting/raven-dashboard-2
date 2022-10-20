import * as Diff from 'diff';
import {DiffType} from '../diff-type';

export class ObservationDiff {
    code: DiffType;
    id: DiffType;
    meta: DiffType;
    resourceType: DiffType;
    subject: DiffType;

    style: string;

    actual: any;
    expected: any;

    constructor( actual: any, expected: any )
    {
        this.actual = actual;
        this.expected = expected;

        this.style = 'invalid';
        this.code = new DiffType();
        this.id = new DiffType();
        this.meta = new DiffType();
        this.resourceType = new DiffType();
        this.subject = new DiffType();
    }

    doDiff()
    {
        try {
            this.code.actual = JSON.stringify( this.actual.code, null, 4 );
            this.code.expected = JSON.stringify( this.expected.code, null, 4 );
            [this.code.style,this.code.difference] = DiffType.doDiff( Diff.diffChars( this.code.expected, this.code.actual ));

            this.id.actual = JSON.stringify( this.actual.id, null, 4 );
            this.id.expected = JSON.stringify( this.expected.id, null, 4 );
            [this.id.style,this.id.difference] = DiffType.doDiff( Diff.diffChars( this.id.expected, this.id.actual ));

            this.meta.actual = JSON.stringify( this.actual.meta, null, 4 );
            this.meta.expected = JSON.stringify( this.expected.meta, null, 4 );
            [this.meta.style,this.meta.difference] = DiffType.doDiff( Diff.diffChars( this.meta.expected, this.meta.actual ));

            this.resourceType.actual = JSON.stringify( this.actual.resourceType, null, 4 );
            this.resourceType.expected = JSON.stringify( this.expected.resourceType, null, 4 );
            [this.resourceType.style,this.resourceType.difference] = DiffType.doDiff( Diff.diffChars( this.resourceType.expected, this.resourceType.actual ));

            this.subject.actual = JSON.stringify( this.actual.subject, null, 4 );
            this.subject.expected = JSON.stringify( this.expected.subject, null, 4 );
            [this.subject.style,this.subject.difference] = DiffType.doDiff( Diff.diffChars( this.subject.expected, this.subject.actual ));

            let style =
                this.code.style === 'valid' &&
                this.id.style === 'valid' &&
                this.meta.style === 'valid' &&
                this.resourceType.style === 'valid' &&
                this.subject.style === 'valid';

            this.style = style ? 'valid' : 'invalid';
        } catch(e) {
          console.error(e);
        }
    }
}
