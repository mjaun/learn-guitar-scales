import {formatFlatSharp, limitValue} from "./Util";

export default class Note {
    static fromId(id: string): Note {
        return new Note(id);
    }

    private static isIdValid(id: string): boolean {
        if (id.length < 1) {
            return false;
        }

        const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const noteModifiers = ['', 'b', 'bb', '#', '##'];

        return noteNames.includes(id.charAt(0)) &&
               noteModifiers.includes(id.substring(1));
    }

    readonly id: string;

    private constructor(id: string) {
        if (!Note.isIdValid(id)) {
            throw new RangeError('Invalid note ID!');
        }

        this.id = id;
    }

    get value(): number {
        const noteValues: { [index: string]: number } = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11};
        const noteModifiers: { [index: string]: number } = {'': 0, 'b': -1, 'bb': -2, '#': 1, '##': 2};

        const noteValue = noteValues[this.id.charAt(0)];
        const noteModifier = noteModifiers[this.id.substring(1)];

        return limitValue(noteValue + noteModifier);
    }

    get text(): string {
        return formatFlatSharp(this.id);
    }

    get naturalNote(): Note {
        return Note.fromId(this.id.charAt(0));
    }
}
