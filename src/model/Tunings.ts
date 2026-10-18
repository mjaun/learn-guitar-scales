export const stringCounts = [4, 5, 6, 7, 8];

type TuningGroups = { category: string, tunings: { id: string, name: string }[] }[];

export function getTuningGroups(stringCount: number): TuningGroups {
    switch (stringCount) {
        case 4:
            return [
                {category: 'Standard', tunings: [
                    {id: 'Eb1-Ab1-Db2-Gb2', name: 'Eb Standard'},
                    {id: 'E1-A1-D2-G2', name: 'E Standard'},
                    {id: 'D1-G1-C2-F2', name: 'D Standard'},
                    {id: 'C1-F1-Bb1-Eb2', name: 'C Standard'},
                    {id: 'C#1-F#1-B1-E2', name: 'C# Standard'},
                    {id: 'B0-E1-A1-D2', name: 'B Standard'},
                ]},
                {category: 'Drop', tunings: [
                    {id: 'A0-E1-A1-D2', name: 'Drop A'},
                    {id: 'B0-F#1-B1-E2', name: 'Drop B'},
                    {id: 'C1-G1-C2-F2', name: 'Drop C'},
                    {id: 'C#1-G#1-C#2-F#2', name: 'Drop C#'},
                    {id: 'D1-A1-D2-G2', name: 'Drop D'},
                ]},
            ];
        case 5:
            return [
                {category: 'Standard', tunings: [
                    {id: 'B0-E1-A1-D2-G2', name: 'B Standard'},
                ]},
                {category: 'Drop', tunings: [
                    {id: 'A0-E1-A1-D2-G2', name: 'Drop A'},
                ]},
            ];
        case 7:
            return [
                {category: 'Standard', tunings: [
                    {id: 'B1-E2-A2-D3-G3-B3-E4', name: 'B Standard'},
                ]},
                {category: 'Drop', tunings: [
                    {id: 'A1-E2-A2-D3-G3-B3-E4', name: 'Drop A'},
                ]},
            ];
        case 8:
            return [
                {category: 'Standard', tunings: [
                    {id: 'F#1-B1-E2-A2-D3-G3-B3-E4', name: 'F# Standard'},
                ]},
                {category: 'Drop', tunings: [
                    {id: 'E1-B1-E2-A2-D3-G3-B3-E4', name: 'Drop E'},
                ]},
            ];
        default:
            return [
                {category: 'Standard', tunings: [
                    {id: 'B1-E2-A2-D3-F#3-B3', name: 'B Standard'},
                    {id: 'C2-F2-Bb2-Eb3-G3-C4', name: 'C Standard'},
                    {id: 'C#2-F#2-B2-E3-G#3-C#4', name: 'C# Standard'},
                    {id: 'D2-G2-C3-F3-A3-D4', name: 'D Standard'},
                    {id: 'Eb2-Ab2-Db3-Gb3-Bb3-Eb4', name: 'Eb Standard'},
                    {id: 'E2-A2-D3-G3-B3-E4', name: 'E Standard'},
                ]},
                {category: 'Drop', tunings: [
                    {id: 'A1-E2-A2-D3-F#3-B3', name: 'Drop A'},
                    {id: 'B1-F#2-B2-E3-G#3-C#4', name: 'Drop B'},
                    {id: 'C2-G2-C3-F3-A3-D4', name: 'Drop C'},
                    {id: 'C#2-G#2-C#3-F#3-A#3-D#4', name: 'Drop C#'},
                    {id: 'D2-A2-D3-G3-B3-E4', name: 'Drop D'},
                ]},
                {category: 'Open', tunings: [
                    {id: 'E2-A2-E3-A3-C#4-E4', name: 'Open A'},
                    {id: 'C2-G2-C3-G3-C4-E4', name: 'Open C'},
                    {id: 'D2-A2-D3-F#3-A3-D4', name: 'Open D'},
                    {id: 'E2-B2-E3-G#3-B3-E4', name: 'Open E'},
                    {id: 'D2-G2-D3-G3-B3-D4', name: 'Open G'},
                ]},
            ];
    }
}

export function getTunings(stringCount: number): { id: string, name: string }[] {
    return getTuningGroups(stringCount).flatMap(group => group.tunings);
}
