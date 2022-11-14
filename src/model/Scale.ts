import ScaleDegree from "./ScaleDegree";

export default class Scale {
    static fromId(id: string): Scale {
        return new Scale(id.split('-').map(degreeName => ScaleDegree.fromId(degreeName)));
    }

    readonly degrees: ScaleDegree[];

    constructor(degrees: ScaleDegree[]) {
        this.degrees = degrees;
    }

    get id(): string {
        return this.degrees.map(degree => degree.id).join('-');
    }
}
