import Note from "./Note";
import ScaleDegree from "./ScaleDegree";
import {limitValue} from "./Util";

export default class Scale {
    static fromId(id: string): Scale {
        return new Scale(id.split('-').map(degreeName => ScaleDegree.fromId(degreeName)));
    }

    readonly degrees: ScaleDegree[];

    constructor(degrees: ScaleDegree[]) {
        this.degrees = degrees;
    }

    get id(): string {
        return this.degrees.map(degree => degree.id).join('-');
    }

    /*
    containsNote(root: Note, note: Note): boolean {
        return this.getNotes(root).some(item => item.value === note.value);
    }

    containsDegree(degree: ScaleDegree): boolean {
        return this.degrees.some(item => item.value === degree.value);
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

        return ScaleDegree.fromId(defaultNames[value]);
    }

    noteFromValue(value: number): Note {
        let scaleDegreeValue = value - this.root.value;

        if (scaleDegreeValue < 0) {
            scaleDegreeValue += 12;
        }

        const scaleDegree = this.degreeFromValue(scaleDegreeValue);

        const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const rootNameIndex = noteNames.indexOf(this.root.name.charAt(0));
        const nameOffset = parseInt(scaleDegree.naturalDegree.id) - 1;
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
    */
}
