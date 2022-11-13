export function limitValue(value: number): number {
    if (value < 0) {
        return value + 12;
    } else if (value >= 12) {
        return value - 12;
    } else {
        return value;
    }
}
