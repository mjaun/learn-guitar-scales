const scaleDegreeIdRegEx = /^(b|bb|#|##)?([0-9]+)$/;

export default class ScaleDegree {
    static fromId(id: string): ScaleDegree {
        const match = id.match(scaleDegreeIdRegEx);

        if (!match) {
            throw new RangeError('Invalid scale degree ID!');
        }

        return new ScaleDegree(match[1] || '', parseInt(match[2]));
    }

    readonly accidentals: string;
    readonly number: number;

    constructor(accidentals: string, number: number) {
        if (!['bb', 'b', '', '#', '##'].includes(accidentals)) {
            throw new RangeError('Invalid accidentals!');
        }

        if (number < 1 || number > 7) {
            throw new RangeError('Invalid number!');
        }

        this.accidentals = accidentals;
        this.number = number;
    }

    get id(): string {
        return this.accidentals + this.number.toString();
    }

    get name(): string {
        return this.id;
    }

    get value(): number {
        const numberValues: { [index: string]: number } = {'1': 0, '2': 2, '3': 4, '4': 5, '5': 7, '6': 9, '7': 11};
        const accidentalValues: { [index: string]: number } = {'': 0, 'b': -1, 'bb': -2, '#': 1, '##': 2};
        return accidentalValues[this.accidentals] + numberValues[this.number % 8] + Math.floor(this.number / 8) * 12;
    }

    equals(other: ScaleDegree): boolean {
        return this.id === other.id;
    }
}
