export function limitValue(value: number): number {
    if (value < 0) {
        return value + 12;
    } else if (value >= 12) {
        return value - 12;
    } else {
        return value;
    }
}

export function formatFlatSharp(value: string): string {
    // doesn't seem to look nice on all browsers
    // return value
    //     .replace('bb', '\u{1D12B}')
    //     .replace('##', '\u{1D12A}')
    //     .replace('b', '\u{266D}')
    //     .replace('#', '\u{266F}');
    return value;
}
