import {formatFlatSharp, limitValue} from "./Util";

export default class ScaleDegree {
    static fromId(id: string): ScaleDegree {
        return new ScaleDegree(id);
    }

    private static isIdValid(id: string): boolean {
        if (id.length < 1) {
            return false;
        }

        const degreeNumber = parseInt(id.charAt(id.length - 1));
        const degreeModifier = id.substring(0, id.length - 1);

        if (isNaN(degreeNumber) || degreeNumber < 1 || degreeNumber > 7) {
            return false;
        }

        if (degreeNumber === 1) {
            if (degreeModifier !== '') {
                return false;
            }
        } else {
            if (!['', 'b', 'bb', '#', '##'].includes(degreeModifier)) {
                return false;
            }
        }

        return true;
    }

    readonly id: string;

    private constructor(id: string) {
        if (!ScaleDegree.isIdValid(id)) {
            throw new RangeError('Invalid scale degree ID!');
        }

        this.id = id;
    }

    get value(): number {
        const degreeValues: { [index: string]: number } = {'1': 0, '2': 2, '3': 4, '4': 5, '5': 7, '6': 9, '7': 11};
        const degreeModifiers: { [index: string]: number } = {'': 0, 'b': -1, 'bb': -2, '#': 1, '##': 2};

        const degreeValue = degreeValues[this.id.charAt(this.id.length - 1)];
        const degreeModifier = degreeModifiers[this.id.substring(0, this.id.length - 1)];

        return limitValue(degreeValue + degreeModifier);
    }

    get naturalDegree(): ScaleDegree {
        return ScaleDegree.fromId(this.id.charAt(this.id.length - 1));
    }

    get text(): string {
        return formatFlatSharp(this.id);
    }

    equals(other: ScaleDegree): boolean {
        return this.id === other.id;
    }
}
