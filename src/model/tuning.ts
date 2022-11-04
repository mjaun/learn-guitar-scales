import {Note} from "./note";

export class Tuning {
    static fromString(tuningString: string): Tuning {
        return new Tuning(tuningString.split('-').reverse().map(noteName => Note.fromName(noteName)));
    }

    readonly notes: Note[];

    private constructor(notes: Note[]) {
        this.notes = notes;
    }

    toString(): string {
        return this.notes.reverse().map(note => note.name).join('-');
    }
}
