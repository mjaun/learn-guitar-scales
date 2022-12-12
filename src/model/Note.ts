const noteIdRegEx = /^([A-G])(b|bb|#|##)?(-?[0-9]+)$/;

export default class Note {
    static fromId(id: string): Note {
        const match = id.match(noteIdRegEx);

        if (!match) {
            throw new RangeError('Invalid note!');
        }

        return new Note(match[1], match[2] || '', parseInt(match[3]));
    }

    readonly letter: string;
    readonly accidentals: string;
    readonly octave: number;

    constructor(letter: string, accidentals: string, octave: number) {
        this.letter = letter;
        this.accidentals = accidentals;
        this.octave = octave;
    }

    get id(): string {
        return this.letter + this.accidentals + this.octave.toString();
    }

    get name(): string {
        return this.letter + this.accidentals;
    }

    get value(): number {
        const letterValues: { [index: string]: number } = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11};
        const accidentalValues: { [index: string]: number } = {'': 0, 'b': -1, 'bb': -2, '#': 1, '##': 2};
        return ((this.octave - 1) * 12) + letterValues[this.letter] + accidentalValues[this.accidentals];
    }

    equals(other: Note): boolean {
        return this.id === other.id;
    }

    same(other: Note): boolean {
        return (Math.abs(this.value - other.value) % 12) === 0;
    }
}
