import Position from "./Position";

export default class PositionList {
    private readonly positions: Position[]

    static fromArray(positions: Position[]) {
        return new PositionList(positions.slice());
    }

    private constructor(positions: Position[]) {
        this.positions = positions;
    }

    toArray(): Position[] {
        return this.positions.slice();
    }

    add(position: Position | Position[]) {
        if (position instanceof Position) {
            if (!this.contains(position)) {
                this.positions.push(position);
            }
        } else {
            position.forEach(p => this.add(p));
        }
    }

    remove(position: Position | Position[]) {
        if (position instanceof Position) {
            const index = this.positions.findIndex(p => p.equals(position));
            if (index !== -1) {
                this.positions.splice(index, 1);
            }
        } else {
            position.forEach(p => this.remove(p));
        }
    }

    contains(position: Position): boolean {
        return this.positions.some(p => p.equals(position));
    }
}
