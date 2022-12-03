import {ValueObjectSet} from "./Util";

export default class Position {
    readonly fret: number;
    readonly string: number;

    constructor({fret, string}: { fret: number, string: number }) {
        this.fret = fret;
        this.string = string;
    }

    equals(other: Position): boolean {
        return this.fret === other.fret && this.string === other.string;
    }
}

export const PositionSet = ValueObjectSet<Position>;