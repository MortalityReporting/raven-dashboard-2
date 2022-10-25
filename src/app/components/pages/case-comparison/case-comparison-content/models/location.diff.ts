import * as Diff from 'diff';
import {DiffType} from '../diff-type';

export class LocationDiff {
    address: DiffType;
    id: DiffType;
    meta: DiffType;
    name: DiffType;
    resourceType: DiffType;
    type: DiffType;

    style: string;

    actual: any;
    expected: any;

    constructor( actual: any, expected: any )
    {
        this.actual = actual;
        this.expected = expected;

        this.style = 'invalid';
        this.address = new DiffType();
        this.id = new DiffType();
        this.meta = new DiffType();
        this.name = new DiffType();
        this.resourceType = new DiffType();
        this.type = new DiffType();
    }

    doDiff()
    {
        try {
            this.address.expected = JSON.stringify( { address: this.expected.address } , null, 4 );
            this.address.actual = JSON.stringify( {address: this.actual.address}, null, 4 );
            [this.address.style,this.address.difference] = DiffType.doDiff( Diff.diffChars( this.address.expected, this.address.actual ));
        } catch(e) {};

        try {
            this.id.expected = JSON.stringify({id: this.expected.id}, null, 4 );
            this.id.actual = JSON.stringify( {id: this.actual.id}, null, 4 );
            [this.id.style,this.id.difference] = DiffType.doDiff( Diff.diffChars( this.id.expected, this.id.actual ));
        } catch(e) {};

        try {
            this.meta.expected = JSON.stringify( {meta: this.expected.meta}, null, 4 );
            this.meta.actual = JSON.stringify( {meta: this.actual.meta}, null, 4 );
            [this.meta.style,this.meta.difference] = DiffType.doDiff( Diff.diffChars( this.meta.expected, this.meta.actual ));
        } catch(e) {};

        try {
            this.name.expected = '"name": "' + this.expected.name + '"';
            this.name.actual = '"name": "' + this.expected.name + '"';
            [this.name.style,this.name.difference] = DiffType.doDiff( Diff.diffChars( this.name.expected, this.name.actual ));
        } catch(e) {};

        try {
            this.resourceType.expected = JSON.stringify( {resourceType: this.expected.resourceType}, null, 4 );
            this.resourceType.actual = JSON.stringify( {resourceType: this.actual.resourceType}, null, 4 );
            [this.resourceType.style,this.resourceType.difference] = DiffType.doDiff( Diff.diffChars( this.resourceType.expected, this.resourceType.actual ));
        } catch(e) {};

        try {
            this.type.expected = JSON.stringify( {type: this.expected.type}, null, 4 );
            this.type.actual = JSON.stringify( {type: this.actual.type}, null, 4 );
            [this.type.style,this.type.difference] = DiffType.doDiff( Diff.diffChars( this.type.expected, this.type.actual ));
        } catch(e) {};
    }
}
