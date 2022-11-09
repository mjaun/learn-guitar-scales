import Note from "./Note";
import Position from "./Position"
import Scale from "./Scale";

export default class Tuning {
    static fromString(tuningString: string): Tuning {
        return new Tuning(tuningString.split('-').map(noteName => Note.fromName(noteName)).reverse());
    }

    readonly notes: Note[];

    constructor(notes: Note[]) {
        this.notes = notes;
    }

    get stringCount(): number {
        return this.notes.length;
    }

    getNote(position: Position, scale: Scale) {
        const value = (this.notes[position.string].value + position.fret) % 12;
        return scale.noteFromValue(value);
    }

    toString(): string {
        return this.notes.map(note => note.name).reverse().join('-');
    }
}
