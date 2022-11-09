export default class ScaleDegree {
    static fromName(name: string): ScaleDegree {
        return new ScaleDegree(name);
    }

    private static isNameValid(name: string): boolean {
        if (name.length < 1) {
            return false;
        }

        const degreeNumber = parseInt(name.charAt(name.length - 1));
        if (isNaN(degreeNumber) || degreeNumber < 1 || degreeNumber > 7) {
            return false;
        }

        const degreeModifier = ['', 'b', 'bb', '#', '##'];
        return degreeModifier.includes(name.substring(0, name.length - 1));
    }

    readonly name: string;

    private constructor(name: string) {
        if (!ScaleDegree.isNameValid(name)) {
            throw new TypeError('Invalid scale degree name!');
        }

        this.name = name;
    }

    get value(): number {
        const degreeValues: { [index: string]: number } = {'1': 0, '2': 2, '3': 4, '4': 5, '5': 7, '6': 9, '7': 11};
        const degreeModifiers: { [index: string]: number } = {'': 0, 'b': -1, 'bb': -2, '#': 1, '##': 2};

        const degreeValue = degreeValues[this.name.charAt(this.name.length - 1)];
        const degreeModifier = degreeModifiers[this.name.substring(0, this.name.length - 1)];

        return degreeValue + degreeModifier;
    }

    get naturalDegree(): ScaleDegree {
        return ScaleDegree.fromName(this.name.charAt(this.name.length - 1));
    }

    get text(): string {
        if (this.name == '1') {
            return 'root';
        }
        const suffixes: { [index: string]: string } = {
            '2': 'nd', '3': 'rd', '4': 'th', '5': 'th', '6': 'th', '7': 'th'
        };
        let text = this.name
            .replace('b', '\u266D')
            .replace('#', '\u266F');
        return text + suffixes[this.name.charAt(this.name.length - 1)];
    }

}
