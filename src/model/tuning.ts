import {Note} from "./note";

export class Tuning {
    static fromString(tuningString: string): Tuning {
        return new Tuning(tuningString.split('-').map(noteName => Note.fromName(noteName)).reverse());
    }

    readonly notes: Note[];

    private constructor(notes: Note[]) {
        this.notes = notes;
    }

    toString(): string {
        return this.notes.map(note => note.name).reverse().join('-');
    }
}
