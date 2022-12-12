export function formatFlatSharp(value: string): string {
    // doesn't seem to look nice on all browsers
    // return value
    //     .replace('bb', '\u{1D12B}')
    //     .replace('##', '\u{1D12A}')
    //     .replace('b', '\u{266D}')
    //     .replace('#', '\u{266F}');
    return value;
}

export interface Equatable<T> {
    equals(other: T): boolean;
}

export class ValueObjectSet<T extends Equatable<T>> {
    private values: T[];

    static fromArray<T extends Equatable<T>>(values: T[]) {
        return new ValueObjectSet(values.slice());
    }

    constructor(values: T[]) {
        this.values = values;
    }

    toArray(): T[] {
        return this.values.slice();
    }

    add(value: T | T[]) {
        if (Array.isArray(value)) {
            value.forEach(v => this.add(v));
        } else if (!this.contains(value)) {
            this.values.push(value);
        }
    }

    remove(value: T | T[]) {
        if (Array.isArray(value)) {
            value.forEach(v => this.remove(v));
        } else {
            this.values = this.values.filter(v => !v.equals(value));
        }
    }

    contains(value: T) {
        return this.values.some(v => v.equals(value));
    }
}