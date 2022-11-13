import Note from "./Note";

export default class Tuning {
    static fromId(id: string): Tuning {
        return new Tuning(id.split('-').map(noteId => Note.fromId(noteId)).reverse());
    }

    readonly notes: Note[];

    constructor(notes: Note[]) {
        this.notes = notes;
    }

    get id(): string {
        return this.notes.map(note => note.id).reverse().join('-');
    }

    get stringCount(): number {
        return this.notes.length;
    }
}
