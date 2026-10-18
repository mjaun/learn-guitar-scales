import * as React from "react";
import {Grid, IconButton, ListSubheader, MenuItem, SvgIcon, ToggleButton, ToggleButtonGroup, Tooltip} from "@mui/material";
import SelectControl from './SelectControl'
import Note from "../model/Note";
import Tuning from "../model/Tuning";
import Scale from "../model/Scale";
import {settingsToUrl} from "../settingsStore";


const rootLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

type Scales = {
    category: string,
    scales: { id: string, name: string }[],
}[];

const scales: Scales = [
    {
        category: 'Diatonic', scales: [
            {id: '1-2-3-4-5-6-7', name: 'Ionian (Major)'},
            {id: '1-2-b3-4-5-6-b7', name: 'Dorian'},
            {id: '1-b2-b3-4-5-b6-b7', name: 'Phrygian'},
            {id: '1-2-3-#4-5-6-7', name: 'Lydian'},
            {id: '1-2-3-4-5-6-b7', name: 'Mixolydian'},
            {id: '1-2-b3-4-5-b6-b7', name: 'Aeolian (Natural Minor)'},
            {id: '1-b2-b3-4-b5-b6-b7', name: 'Locrian'},
        ]
    },
    {
        category: 'Pentatonic', scales: [
            {id: '1-2-3-5-6', name: 'Major Pentatonic'},
            {id: '1-b3-4-5-b7', name: 'Minor Pentatonic'},
        ]
    },
    {
        category: 'Blues', scales: [
            {id: '1-2-b3-3-5-6', name: 'Major Blues'},
            {id: '1-b3-4-b5-5-b7', name: 'Minor Blues'},
        ]
    },
    {
        category: 'Minor System', scales: [
            {id: '1-2-b3-4-5-b6-7', name: 'Harmonic Minor'},
            {id: '1-2-b3-4-5-6-7', name: 'Melodic Minor'},
            {id: '1-b2-3-4-5-b6-b7', name: 'Phrygian Dominant'},
            {id: '1-2-3-#4-5-6-b7', name: 'Lydian Dominant'},
            {id: '1-b2-b3-b4-b5-b6-b7', name: 'Altered Scale (Super Locrian)'},
        ]
    },
    {
        category: 'Symmetrical', scales: [
            {id: '1-2-b3-4-b5-b6-6-7', name: 'Diminished (Whole-Half)'},
            {id: '1-2-3-#4-#5-b7', name: 'Whole Tone'},
        ]
    },
    {
        category: 'Arpeggios', scales: [
            {id: '1-3-5', name: 'Major Arpeggio'},
            {id: '1-b3-5', name: 'Minor Arpeggio'},
            {id: '1-3-5-7', name: 'Major7 Arpeggio'},
            {id: '1-b3-5-b7', name: 'Minor7 Arpeggio'},
            {id: '1-3-5-b7', name: 'Dominant Arpeggio'},
        ]
    },
    {
        category: 'Various', scales: [
            {id: '1', name: 'Roots'},
            {id: '1-5', name: 'Roots + Fifths'},
            {id: '1-b2-2-b3-3-4-b5-5-b6-6-b7-7', name: 'Chromatic'},
        ]
    },
];

const stringCounts = [4, 5, 6, 7, 8];

type TuningGroups = { category: string, tunings: { id: string, name: string }[] }[];

const tuningGroups: Record<number, TuningGroups> = {
    4: [
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
    ],
    5: [
        {category: 'Standard', tunings: [
            {id: 'B0-E1-A1-D2-G2', name: 'B Standard'},
        ]},
        {category: 'Drop', tunings: [
            {id: 'A0-E1-A1-D2-G2', name: 'Drop A'},
        ]},
    ],
    6: [
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
    ],
    7: [
        {category: 'Standard', tunings: [
            {id: 'B1-E2-A2-D3-G3-B3-E4', name: 'B Standard'},
        ]},
        {category: 'Drop', tunings: [
            {id: 'A1-E2-A2-D3-G3-B3-E4', name: 'Drop A'},
        ]},
    ],
    8: [
        {category: 'Standard', tunings: [
            {id: 'F#1-B1-E2-A2-D3-G3-B3-E4', name: 'F# Standard'},
        ]},
        {category: 'Drop', tunings: [
            {id: 'E1-B1-E2-A2-D3-G3-B3-E4', name: 'Drop E'},
        ]},
    ],
};

function getTunings(stringCount: number): { id: string, name: string }[] {
    return tuningGroups[stringCount].flatMap(group => group.tunings);
}

export interface UserSettings {
    firstFret: number,
    lastFret: number,
    labels: 'scale-degrees' | 'notes',
    root: Note;
    scale: Scale;
    tuning: Tuning;
}

type Props = {
    settings: UserSettings,
    onSettingsChange: (settings: UserSettings) => void,
    fretboardCanvas: React.RefObject<HTMLCanvasElement | null>,
}

export default function SettingsForm(props: Props) {
    const [copied, setCopied] = React.useState(false);

    function copyLink() {
        navigator.clipboard.writeText(settingsToUrl(props.settings)).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        });
    }

    function downloadImage() {
        const source = props.fretboardCanvas.current;
        if (!source) {
            return;
        }

        // the fretboard canvas is transparent, so draw it onto a white background
        const target = document.createElement('canvas');
        target.width = source.width;
        target.height = source.height;
        const ctx = target.getContext('2d');
        if (!ctx) {
            return;
        }
        ctx.fillStyle = 'white';
        ctx.fillRect(0, 0, target.width, target.height);
        ctx.drawImage(source, 0, 0);

        const link = document.createElement('a');
        link.download = 'fretboard.png';
        link.href = target.toDataURL('image/png');
        link.click();
    }

    function update(settings: Partial<UserSettings>) {
        props.onSettingsChange({...props.settings, ...settings});
    }

    function changeStringCount(stringCount: number) {
        // keep the same kind of tuning (e.g. "Drop A") if the new string count has it
        const current = tunings.find(entry => entry.id === props.settings.tuning.id);
        const available = getTunings(stringCount);
        const next = available.find(entry => entry.name === current?.name) ?? available[0];
        update({tuning: Tuning.fromId(next.id)});
    }

    const tunings = getTunings(props.settings.tuning.stringCount);

    const selectTuningItems = [];

    for (const group of tuningGroups[props.settings.tuning.stringCount]) {
        selectTuningItems.push(<ListSubheader key={`tuning-category-${group.category}`}>{group.category}</ListSubheader>);
        for (const entry of group.tunings) {
            selectTuningItems.push(<MenuItem key={entry.id} value={entry.id}>{entry.name}</MenuItem>);
        }
    }

    const selectFretItems = [];

    for (let fret = 0; fret <= 24; fret++) {
        selectFretItems.push(<MenuItem key={fret} value={fret}>{fret}</MenuItem>);
    }

    const selectScaleItems = [];

    for (let i = 0; i < scales.length; i++) {
        selectScaleItems.push(<ListSubheader key={`category${i}`}>{scales[i].category}</ListSubheader>)
        for (const scale of scales[i].scales) {
            selectScaleItems.push(<MenuItem key={scale.id} value={scale.id}>{scale.name}</MenuItem>)
        }
    }

    return (
        <Grid container spacing={2} sx={{ alignItems: "center" }}>
            <Grid size="auto" sx={{display: 'flex', alignItems: 'center', gap: 0.5}}>
                <SelectControl
                    id="select-root"
                    label="Root"
                    width={80}
                    value={props.settings.root.letter}
                    onChange={letter => update({root: new Note(letter, props.settings.root.accidentals, props.settings.root.octave)})}
                >
                    {rootLetters.map(letter => <MenuItem key={letter} value={letter}>{letter}</MenuItem>)}
                </SelectControl>

                <ToggleButtonGroup
                    exclusive
                    aria-label="Root accidental"
                    value={props.settings.root.accidentals}
                    // clicking the active button deselects it (null), which means natural
                    onChange={(_, accidentals: string | null) => update({
                        root: new Note(props.settings.root.letter, accidentals ?? '', props.settings.root.octave),
                    })}
                    sx={theme => ({
                        height: 56,
                        // same frame colors as the outlined selects: dimmed normally, full contrast on hover
                        '& .MuiToggleButton-root': {
                            borderColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : 'rgba(255, 255, 255, 0.23)',
                            fontSize: '1.2rem',
                        },
                        '&:hover .MuiToggleButton-root': {
                            borderColor: theme.palette.text.primary,
                        },
                        // focus frame like the selects: 2px in the primary color
                        '&:focus-within': {
                            outline: `2px solid ${theme.palette.primary.main}`,
                            outlineOffset: -2,
                        },
                        '&:focus-within .MuiToggleButton-root': {
                            borderColor: theme.palette.primary.main,
                        },
                        // grouped buttons draw their divider with the previous button's right border
                        '& .MuiToggleButton-root:not(:first-of-type)': {
                            borderLeftColor: 'transparent',
                        },
                    })}
                >
                    <ToggleButton value="b" aria-label="Flat" sx={{minWidth: 52}}>♭</ToggleButton>
                    <ToggleButton value="" aria-label="Natural" sx={{minWidth: 52}}>♮</ToggleButton>
                    <ToggleButton value="#" aria-label="Sharp" sx={{minWidth: 52}}>♯</ToggleButton>
                </ToggleButtonGroup>
            </Grid>

            <Grid size="auto">
                <SelectControl
                    id="select-scale"
                    label="Scale"
                    width={200}
                    value={props.settings.scale.id}
                    onChange={value => update({scale: Scale.fromId(value)})}
                >
                    {selectScaleItems}
                </SelectControl>
            </Grid>

            <Grid size="auto">
                <SelectControl
                    id="select-labels"
                    label="Labels"
                    width={160}
                    value={props.settings.labels}
                    onChange={value => update({labels: value as 'scale-degrees' | 'notes'})}
                >
                    <MenuItem value="scale-degrees">Scale Degrees</MenuItem>
                    <MenuItem value="notes">Notes</MenuItem>
                </SelectControl>
            </Grid>

            <Grid size="auto">
                <SelectControl
                    id="select-tuning"
                    label="Tuning"
                    width={150}
                    value={props.settings.tuning.id}
                    onChange={value => update({tuning: Tuning.fromId(value)})}
                >
                    {selectTuningItems}
                </SelectControl>
            </Grid>

            <Grid size="auto">
                <SelectControl
                    id="select-strings"
                    label="Strings"
                    width={80}
                    value={props.settings.tuning.stringCount.toString()}
                    onChange={value => changeStringCount(parseInt(value))}
                >
                    {stringCounts.map(count => <MenuItem key={count} value={count}>{count}</MenuItem>)}
                </SelectControl>
            </Grid>

            <Grid size="auto">
                <SelectControl
                    id="select-first-fret"
                    label="First Fret"
                    width={80}
                    value={props.settings.firstFret.toString()}
                    onChange={value => update({
                        firstFret: parseInt(value),
                        lastFret: Math.max(parseInt(value), props.settings.lastFret),
                    })}
                >
                    {selectFretItems}
                </SelectControl>
            </Grid>

            <Grid size="auto">
                <SelectControl
                    id="select-last-fret"
                    label="Last Fret"
                    width={80}
                    value={props.settings.lastFret.toString()}
                    onChange={value => update({
                        firstFret: Math.min(parseInt(value), props.settings.firstFret),
                        lastFret: parseInt(value)
                    })}
                >
                    {selectFretItems}
                </SelectControl>
            </Grid>

            <Grid size="auto">
                <Tooltip title={copied ? 'Link copied!' : 'Copy Link'}>
                    <IconButton color="primary" aria-label="Copy Link" onClick={copyLink}>
                        <SvgIcon>
                            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
                        </SvgIcon>
                    </IconButton>
                </Tooltip>
                <Tooltip title="Download Image">
                    <IconButton color="primary" aria-label="Download Image" onClick={downloadImage}>
                        <SvgIcon>
                            <path d="M19 9h-4V3H9v6H5l7 7 7-7zM5 18v2h14v-2H5z"/>
                        </SvgIcon>
                    </IconButton>
                </Tooltip>
            </Grid>
        </Grid>
    );
}