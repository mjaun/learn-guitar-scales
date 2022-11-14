import {Grid, MenuItem} from "@mui/material";
import * as React from "react";
import SelectControl from './SelectControl'
import {ContextSettings} from "../model/Context";
import {FretboardSettings} from "./Fretboard";
import Note from "../model/Note";
import Tuning from "../model/Tuning";
import Scale from "../model/Scale";
import CheckboxControl from "./CheckboxControl";

const rootNotes = ['Cb', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'];

const scales: { id: string, text: string }[] = [
    {id: '1', text: 'Root'},
    {id: '1-5', text: 'Root + Fifth'},
    {id: '1-3-5', text: 'Major Arpeggio'},
    {id: '1-b3-5', text: 'Minor Arpeggio'},
    {id: '1-3-5-7', text: 'Major7 Arpeggio'},
    {id: '1-b3-5-b7', text: 'Minor7 Arpeggio'},
    {id: '1-3-5-b7', text: 'Dominant Arpeggio'},
    {id: '1-2-3-5-6', text: 'Major Pentatonic'},
    {id: '1-b3-4-5-b7', text: 'Minor Pentatonic'},
    {id: '1-2-3-4-5-6-7', text: 'Ionian'},
    {id: '1-2-b3-4-5-6-b7', text: 'Dorian'},
    {id: '1-b2-b3-4-5-b6-b7', text: 'Phrygian'},
    {id: '1-2-3-#4-5-6-7', text: 'Lydian'},
    {id: '1-2-3-4-5-6-b7', text: 'Mixolydian'},
    {id: '1-2-b3-4-5-b6-b7', text: 'Aeolian'},
    {id: '1-b2-b3-4-b5-b6-b7', text: 'Locrian'},
    {id: '1-b2-2-b3-3-4-b5-5-b6-6-b7-7', text: 'Chromatic'},
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

type Props = {
    contextSettings: ContextSettings,
    onContextSettingsChange: (settings: ContextSettings) => void,
    fretboardSettings: FretboardSettings,
    onFretboardSettingsChange: (settings: FretboardSettings) => void,
}

export default function SettingsForm(props: Props) {
    function updateFretboard(settings: Partial<FretboardSettings>) {
        props.onFretboardSettingsChange({...props.fretboardSettings, ...settings});
    }

    function updateContext(settings: Partial<ContextSettings>) {
        props.onContextSettingsChange({...props.contextSettings, ...settings});
    }

    const selectFretItems = [];

    for (let fret = 1; fret <= 24; fret++) {
        selectFretItems.push(<MenuItem key={fret} value={fret}>{fret}</MenuItem>);
    }

    return (
        <Grid container alignItems="center" spacing={2}>
            <Grid item xs="auto">
                <SelectControl
                    id="select-root"
                    label="Root"
                    width={80}
                    value={props.contextSettings.root.id}
                    onChange={value => updateContext({root: Note.fromId(value)})}
                >
                    {rootNotes.map(name => <MenuItem key={name} value={name}>{Note.fromId(name).text}</MenuItem>)}
                </SelectControl>
            </Grid>

            <Grid item xs="auto">
                <SelectControl
                    id="select-scale"
                    label="Scale"
                    width={200}
                    value={props.contextSettings.scale.id}
                    onChange={value => updateContext({scale: Scale.fromId(value)})}
                >
                    {scales.map(entry => <MenuItem key={entry.id} value={entry.id}>{entry.text}</MenuItem>)}
                </SelectControl>
            </Grid>

            <Grid item xs="auto">
                <SelectControl
                    id="select-tuning"
                    label="Tuning"
                    width={150}
                    value={props.contextSettings.tuning.id}
                    onChange={value => updateContext({tuning: Tuning.fromId(value)})}
                >
                    {tunings.map(entry => <MenuItem key={entry.id} value={entry.id}>{entry.text}</MenuItem>)}
                </SelectControl>
            </Grid>

            <Grid item xs="auto">
                <SelectControl
                    id="select-first-fret"
                    label="First Fret"
                    width={80}
                    value={props.fretboardSettings.firstFret.toString()}
                    onChange={value => updateFretboard({
                        firstFret: parseInt(value),
                        lastFret: Math.max(parseInt(value), props.fretboardSettings.lastFret),
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
                    value={props.fretboardSettings.lastFret.toString()}
                    onChange={value => updateFretboard({
                        firstFret: Math.min(parseInt(value), props.fretboardSettings.firstFret),
                        lastFret: parseInt(value)
                    })}
                >
                    {selectFretItems}
                </SelectControl>
            </Grid>

            <Grid item xs="auto">
                <SelectControl
                    id="select-labels"
                    label="Labels"
                    width={160}
                    value={props.fretboardSettings.labels}
                    onChange={value => updateFretboard({labels: value as 'scale-degrees' | 'notes'})}
                >
                    <MenuItem value="scale-degrees">Scale Degrees</MenuItem>
                    <MenuItem value="notes">Notes</MenuItem>
                </SelectControl>
            </Grid>

            <Grid item xs="auto">
                <CheckboxControl
                    id="check-open-strings"
                    label="Open Strings"
                    checked={props.fretboardSettings.openStrings}
                    onChange={checked => updateFretboard({openStrings: checked})}
                />
            </Grid>
        </Grid>
    );
}