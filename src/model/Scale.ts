import Note from "./Note";
import ScaleDegree from "./ScaleDegree";

export default class Scale {
    static fromString(root: string | Note, scaleString: string): Scale {
        const rootNote = typeof(root) === 'string' ? Note.fromName(root) : root;
        const degrees = scaleString.split('-').map(degreeName => ScaleDegree.fromName(degreeName));
        return new Scale(rootNote, degrees);
    }

    readonly root: Note;
    readonly notes: Note[];
    readonly degrees: ScaleDegree[];

    constructor(root: Note, degrees: ScaleDegree[]) {
        this.root = root;
        this.degrees = degrees;
        this.notes = degrees.map(degree => this.noteFromDegree(degree));
    }

    containsNote(note: Note): boolean {
        return this.notes.some(item => item.value === note.value);
    }

    containsDegree(degree: ScaleDegree): boolean {
        return this.degrees.some(item => item.value === degree.value);
    }

    noteFromDegree(degree: ScaleDegree): Note {
        const noteValue = (this.root.value + degree.value) % 12;
        return this.noteFromValue(noteValue);
    }

    degreeFromNote(note: Note): ScaleDegree {
        let degreeValue = (note.value - this.root.value) % 12;

        if (degreeValue < 0) {
            degreeValue += 12;
        }

        return this.degreeFromValue(degreeValue);
    }

    degreeFromValue(value: number): ScaleDegree {
        // try to use the same name as in the scale
        for (const scaleDegree of this.degrees) {
            if (scaleDegree.value === value) {
                return scaleDegree;
            }
        }

        // otherwise use default name
        const defaultNames: { [index: number]: string } = {
            0: '1', 1: 'b2', 2: '2', 3: 'b3', 4: '3', 5: '4', 6: 'b5', 7: '5', 8: 'b6', 9: '6', 10: 'b7', 11: '7'
        };

        return ScaleDegree.fromName(defaultNames[value]);
    }

    noteFromValue(value: number): Note {
        let scaleDegreeValue = value - this.root.value;

        if (scaleDegreeValue < 0) {
            scaleDegreeValue += 12;
        }

        const scaleDegree = this.degreeFromValue(scaleDegreeValue);

        const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const rootNameIndex = noteNames.indexOf(this.root.name.charAt(0));
        const nameOffset = parseInt(scaleDegree.naturalDegree.name) - 1;
        const naturalNoteName = noteNames[(rootNameIndex + nameOffset) % 7];

        let naturalNoteValue = Note.fromName(naturalNoteName).value;

        if (naturalNoteValue > value) {
            naturalNoteValue -= 12;
        }

        const sharps = value - naturalNoteValue;
        const flats = naturalNoteValue - value + 12;
        const noteModifier = sharps < flats ? '#'.repeat(sharps) : 'b'.repeat(flats);

        return Note.fromName(naturalNoteName + noteModifier);
    }
}
