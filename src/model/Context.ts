import Note from "./Note";
import Scale from "./Scale";
import Tuning from "./Tuning";
import ScaleDegree from "./ScaleDegree";
import Position from "./Position";

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

    getAllPositions(): Position[] {
        const result: Position[] = [];

        for (let string = 0; string < this.tuning.stringCount; string++) {
            for (let fret = 0; fret <= 24; fret++) {
                result.push(new Position({string, fret}));
            }
        }

        return result;
    }

    getInScalePositions(): Position[] {
        return this.getAllPositions().filter(position => {
            const scaleDegree = this.getScaleDegreeByPosition(position);
            return this.scale.degrees.some(d => scaleDegree.equals(d));
        });
    }

    getSameNotePositions(note: Note): Position[] {
        return this.getAllPositions().filter(position => {
            return this.getNoteByPosition(position).same(note);
        });
    }

    getNoteByPosition(position: Position): Note {
        const noteValue = this.tuning.notes[position.string].value + position.fret;
        return this.getNoteByValue(noteValue);
    }

    getScaleDegreeByPosition(position: Position): ScaleDegree {
        const noteValue = this.tuning.notes[position.string].value + position.fret;
        const interval = noteValue - this.root.value;
        return this.getScaleDegreeByValue(interval);
    }

    private getNoteByValue(value: number): Note {
        const interval = value - this.root.value;
        const scaleDegree = this.getScaleDegreeByValue(interval);

        // determine letter
        const noteLetters = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const rootLetterIndex = noteLetters.indexOf(this.root.letter);
        const letterIndex = rootLetterIndex + (scaleDegree.number - 1);
        const letter = noteLetters[letterIndex % 7];

        // determine octave
        const octave = this.root.octave + Math.floor(interval / 12) + Math.floor(letterIndex / 7);
        const naturalNote = new Note(letter, '', octave);

        // determine accidentals
        const accidentalsList = ['bb', 'b', '', '#', '##'];
        const accidentals = accidentalsList[(value - naturalNote.value) + 2];

        return new Note(letter, accidentals, octave);
    }

    private getScaleDegreeByValue(value: number): ScaleDegree {
        value = value % 12;

        // try to use the same name as in the scale
        for (const scaleDegree of this.scale.degrees) {
            if (scaleDegree.value === value) {
                return scaleDegree;
            }
        }

        // otherwise use default name
        const defaultNames = ['1', 'b2', '2', 'b3', '3', '4', 'b5', '5', 'b6', '6', 'b7', '7'];

        return ScaleDegree.fromId(defaultNames[value]);
    }
}