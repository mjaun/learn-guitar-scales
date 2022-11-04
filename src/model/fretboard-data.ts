import {ScaleDegree} from "./scale-degree";
import {Note} from "./note";
import {Scale} from "./scale";
import {Tuning} from "./tuning";

export interface FretboardPosition {
    string: number,
    fret: number,
}

export interface FretboardContent {
    note: Note,
    degree: ScaleDegree,
}

function equal(pos1: FretboardPosition, pos2: FretboardPosition) {
    return pos1.string === pos2.string && pos1.fret === pos2.fret;
}

export class FretboardData {
    private data: { position: FretboardPosition, content: FretboardContent }[] = [];
    private tuning: Tuning;

    constructor(tuning: Tuning) {
        this.tuning = tuning;
    }

    getStringCount(): number {
        return this.tuning.notes.length;
    }

    getFretCount(): number {
        return 24;
    }

    setScale(scale: Scale) {
        for (const position of this.getAllPositions()) {
            const note = this.getNote(position, scale);

            if (scale.containsNote(note)) {
                this.setContent(position, {note, degree: scale.degreeFromNote(note)});
            }
        }
    }

    clip(firstFret: number, lastFret: number, openStrings: boolean) {
        this.data = this.data.filter(item => {
            if (item.position.fret === 0) {
                return openStrings;
            } else {
                return item.position.fret >= firstFret && item.position.fret <= lastFret;
            }
        });
    }

    getContent(position: FretboardPosition): FretboardContent | undefined {
        for (const item of this.data) {
            if (equal(item.position, position)) {
                return item.content;
            }
        }
        return undefined;
    }

    setContent(position: FretboardPosition, content: FretboardContent) {
        this.data = this.data.filter(item => !equal(item.position, position));
        this.data.push({position, content});
    }

    private getNote(position: FretboardPosition, scale: Scale) {
        let openNote = this.tuning.notes[position.string];
        return scale.noteFromValue((openNote.value + position.fret) % 12);
    }

    private getAllPositions(): FretboardPosition[] {
        let positions = [];
        for (let string = 0; string < this.getStringCount(); string++) {
            for (let fret = 0; fret <= this.getFretCount(); fret++) {
                positions.push({string, fret});
            }
        }
        return positions;
    }
}
