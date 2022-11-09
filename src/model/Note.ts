export default class Note {
    static fromName(name: string): Note {
        return new Note(name);
    }

    private static isNameValid(name: string): boolean {
        if (name.length < 1) {
            return false;
        }

        const noteNames = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
        const noteModifiers = ['', 'b', 'bb', '#', '##'];

        return noteNames.includes(name.charAt(0)) &&
               noteModifiers.includes(name.substring(1));
    }

    readonly name: string;

    private constructor(name: string) {
        if (!Note.isNameValid(name)) {
            throw new TypeError('Invalid note name!');
        }

        this.name = name;
    }

    get value(): number {
        const noteValues: { [index: string]: number } = {'C': 0, 'D': 2, 'E': 4, 'F': 5, 'G': 7, 'A': 9, 'B': 11};
        const noteModifiers: { [index: string]: number } = {'': 0, 'b': -1, 'bb': -2, '#': 1, '##': 2};

        const noteValue = noteValues[this.name.charAt(0)];
        const noteModifier = noteModifiers[this.name.substring(1)];

        let totalValue = noteValue + noteModifier;

        if (totalValue < 0) {
            totalValue += 12;
        }

        return totalValue;
    }

    get text(): string {
        return this.name
            .replace('b', '\u266D')
            .replace('#', '\u266F');
    }

}
