import * as React from "react";
import {Grid, ListSubheader, MenuItem} from "@mui/material";
import SelectControl from './SelectControl'
import CheckboxControl from "./CheckboxControl";
import Note from "../model/Note";
import Tuning from "../model/Tuning";
import Scale from "../model/Scale";


const rootNotes = ['Cb', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'];

type Scales = {
    category: string,
    scales: { id: string, text: string }[],
}[];

const scales: Scales = [
    {
        category: 'Pentatonic', scales: [
            {id: '1-2-3-5-6', text: 'Major Pentatonic'},
            {id: '1-b3-4-5-b7', text: 'Minor Pentatonic'},
        ]
    },
    {
        category: 'Major Modes', scales: [
            {id: '1-2-3-4-5-6-7', text: 'Ionian'},
            {id: '1-2-b3-4-5-6-b7', text: 'Dorian'},
            {id: '1-b2-b3-4-5-b6-b7', text: 'Phrygian'},
            {id: '1-2-3-#4-5-6-7', text: 'Lydian'},
            {id: '1-2-3-4-5-6-b7', text: 'Mixolydian'},
            {id: '1-2-b3-4-5-b6-b7', text: 'Aeolian'},
            {id: '1-b2-b3-4-b5-b6-b7', text: 'Locrian'},
        ]
    },
    {
        category: 'Arpeggios', scales: [
            {id: '1-3-5', text: 'Major Arpeggio'},
            {id: '1-b3-5', text: 'Minor Arpeggio'},
            {id: '1-3-5-7', text: 'Major7 Arpeggio'},
            {id: '1-b3-5-b7', text: 'Minor7 Arpeggio'},
            {id: '1-3-5-b7', text: 'Dominant Arpeggio'},
        ]
    },
    {
        category: 'Blues', scales: [
            {id: '1-2-b3-3-5-6', text: 'Major Blues'},
            {id: '1-b3-4-b5-5-b7', text: 'Minor Blues'},
        ]
    },
    {
        category: 'Various', scales: [
            {id: '1', text: 'Roots'},
            {id: '1-5', text: 'Roots + Fifths'},
            {id: '1-b2-2-b3-3-4-b5-5-b6-6-b7-7', text: 'Chromatic'},
        ]
    },
];

const tunings: { id: string, text: string }[] = [
    {id: 'E-A-D-G-B-E', text: 'E Standard'},
    {id: 'Eb-Ab-Db-Gb-Bb-Eb', text: Note.fromId('Eb').text + ' Standard'},
    {id: 'D-G-C-F-A-D', text: 'D Standard'},
    {id: 'C-F-Bb-Eb-G-C', text: 'C Standard'},
    {id: 'B-E-A-D-F#-B', text: 'B Standard'},
    {id: 'D-A-D-G-B-E', text: 'Dropped D'},
    {id: 'C-G-C-F-A-D', text: 'Dropped C'},
    {id: 'B-F#-B-E-G#-C#', text: 'Dropped B'},
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
            selectScaleItems.push(<MenuItem key={scale.id} value={scale.id}>{scale.text}</MenuItem>)
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
                    onChange={value => update({root: Note.fromId(value)})}
                >
                    {rootNotes.map(name => <MenuItem key={name} value={name}>{Note.fromId(name).text}</MenuItem>)}
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
                    {tunings.map(entry => <MenuItem key={entry.id} value={entry.id}>{entry.text}</MenuItem>)}
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