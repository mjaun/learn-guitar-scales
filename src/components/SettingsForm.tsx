import * as React from "react";
import {Grid, IconButton, ListSubheader, MenuItem, SvgIcon, Tooltip} from "@mui/material";
import SelectControl from './SelectControl'
import Note from "../model/Note";
import Tuning from "../model/Tuning";
import Scale from "../model/Scale";
import {settingsToUrl} from "../settingsStore";


const rootNotes = ['Cb0', 'Gb0', 'Db0', 'Ab0', 'Eb0', 'Bb0', 'F0', 'C0', 'G0', 'D0', 'A0', 'E0', 'B0', 'F#0', 'C#0'];

type Scales = {
    category: string,
    scales: { id: string, name: string }[],
}[];

const scales: Scales = [
    {
        category: 'Pentatonic', scales: [
            {id: '1-2-3-5-6', name: 'Major Pentatonic'},
            {id: '1-b3-4-5-b7', name: 'Minor Pentatonic'},
        ]
    },
    {
        category: 'Major Modes', scales: [
            {id: '1-2-3-4-5-6-7', name: 'Ionian'},
            {id: '1-2-b3-4-5-6-b7', name: 'Dorian'},
            {id: '1-b2-b3-4-5-b6-b7', name: 'Phrygian'},
            {id: '1-2-3-#4-5-6-7', name: 'Lydian'},
            {id: '1-2-3-4-5-6-b7', name: 'Mixolydian'},
            {id: '1-2-b3-4-5-b6-b7', name: 'Aeolian'},
            {id: '1-b2-b3-4-b5-b6-b7', name: 'Locrian'},
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
        category: 'Blues', scales: [
            {id: '1-2-b3-3-5-6', name: 'Major Blues'},
            {id: '1-b3-4-b5-5-b7', name: 'Minor Blues'},
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

const tunings: { id: string, name: string }[] = [
    {id: 'E2-A2-D3-G3-B3-E4', name: 'E Standard'},
    {id: 'Eb2-Ab2-Db3-Gb3-Bb3-Eb4', name: 'Eb Standard'},
    {id: 'D2-G2-C3-F3-A3-D4', name: 'D Standard'},
    {id: 'C2-F2-Bb2-Eb3-G3-C4', name: 'C Standard'},
    {id: 'B1-E2-A2-D3-F#3-B3', name: 'B Standard'},
    {id: 'D2-A2-D3-G3-B3-E4', name: 'Dropped D'},
    {id: 'C2-G2-C3-F3-A3-D4', name: 'Dropped C'},
    {id: 'B1-F#2-B2-E3-G#3-C#4', name: 'Dropped B'},
]

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
            <Grid size="auto">
                <SelectControl
                    id="select-root"
                    label="Root"
                    width={80}
                    value={props.settings.root.id}
                    onChange={id => update({root: Note.fromId(id)})}
                >
                    {rootNotes.map(id => <MenuItem key={id} value={id}>{Note.fromId(id).name}</MenuItem>)}
                </SelectControl>
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
                    id="select-tuning"
                    label="Tuning"
                    width={150}
                    value={props.settings.tuning.id}
                    onChange={value => update({tuning: Tuning.fromId(value)})}
                >
                    {tunings.map(entry => <MenuItem key={entry.id} value={entry.id}>{entry.name}</MenuItem>)}
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