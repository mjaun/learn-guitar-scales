import * as React from "react";
import {Grid, ListSubheader, MenuItem} from "@mui/material";
import SelectControl from './SelectControl'
import Note from "../model/Note";
import Tuning from "../model/Tuning";
import Scale from "../model/Scale";


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
}

export default function SettingsForm(props: Props) {
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
        <Grid container alignItems="center" spacing={2}>
            <Grid item xs="auto">
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

            <Grid item xs="auto">
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

            <Grid item xs="auto">
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

            <Grid item xs="auto">
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

            <Grid item xs="auto">
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

            <Grid item xs="auto">
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
        </Grid>
    );
}