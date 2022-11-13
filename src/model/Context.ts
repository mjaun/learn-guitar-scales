import Note from "./Note";
import Scale from "./Scale";
import Tuning from "./Tuning";
import ScaleDegree from "./ScaleDegree";
import Position from "./Position";
import {limitValue} from "./Util";

export interface ContextSettings {
    readonly root: Note;
    readonly scale: Scale;
    readonly tuning: Tuning;
}

export default class Context {
    readonly root: Note;
    readonly scale: Scale;
    readonly tuning: Tuning;

    constructor(settings: ContextSettings) {
        this.root = settings.root;
        this.scale = settings.scale;
        this.tuning = settings.tuning;
    }

    isNoteInScale(note: Note): boolean {
        const notesInScale = this.scale.degrees.map(d => this.getNoteByScaleDegree(d));
        return notesInScale.some(n => n.value === note.value);
    }

    getNoteByPosition(position: Position): Note {
        const scaleDegree = this.getScaleDegreeByPosition(position);
        return this.getNoteByScaleDegree(scaleDegree);
    }

    getScaleDegreeByPosition(position: Position): ScaleDegree {
        if (position.string >= this.tuning.stringCount) {
            throw new RangeError("Tuning doesn't have specified string.");
        }

        const noteValue = limitValue(this.tuning.notes[position.string].value + position.fret);
        const scaleDegreeValue = limitValue(noteValue - this.root.value);
        return this.getScaleDegreeByValue(scaleDegreeValue);
    }

    private getNoteByScaleDegree(degree: ScaleDegree): Note {
        // determine the resulting natural note
        const naturalNoteIds = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const rootIndex = naturalNoteIds.indexOf(this.root.naturalNote.id);
        const degreeOffset = parseInt(degree.naturalDegree.id) - 1;
        const naturalNote = Note.fromId(naturalNoteIds[(rootIndex + degreeOffset) % 7]);

        // determine the resulting note value
        const noteValue = limitValue(this.root.value + degree.value);

        // determine the sharps or flats
        const sharps = limitValue(noteValue - naturalNote.value);
        const flats = limitValue(naturalNote.value - noteValue);
        const noteModifier = sharps < flats ? '#'.repeat(sharps) : 'b'.repeat(flats);

        return Note.fromId(naturalNote.id + noteModifier);
    }

    private getScaleDegreeByValue(value: number): ScaleDegree {
        // try to use the same name as in the scale
        for (const scaleDegree of this.scale.degrees) {
            if (scaleDegree.value === value) {
                return scaleDegree;
            }
        }

        // otherwise use default name
        const defaultNames: { [index: number]: string } = {
            0: '1', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4', 6: 'b5', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7'
        };

        return ScaleDegree.fromId(defaultNames[value]);
    }
}