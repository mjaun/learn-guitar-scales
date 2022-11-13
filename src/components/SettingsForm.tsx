import {Box, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select} from "@mui/material";
import * as React from "react";
import {ContextSettings} from "../model/Context";
import {FretboardSettings} from "./Fretboard";
import Note from "../model/Note";
import Tuning from "../model/Tuning";
import Scale from "../model/Scale";

const rootNotes = ['Cb', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'];

const scales: { id: string, text: string }[] = [
    {id: '1-5', text: 'Root + Fifths'},
    {id: '1-3-5', text: 'Major Arpeggio'},
    {id: '1-b3-5', text: 'Minor Arpeggio'},
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

const tunings: {id: string, text: string}[] = [
    { id: 'E-A-D-G-B-E', text: 'E Standard' },
    { id: 'Eb-Ab-Db-Gb-Bb-Eb', text: Note.fromId('Eb').text + ' Standard'},
    { id: 'D-G-C-F-A-D', text: 'D Standard' },
    { id: 'C-F-Bb-Eb-G-C', text: 'C Standard' },
    { id: 'B-E-A-D-F#-B', text: 'B Standard' },
    { id: 'D-A-D-G-B-E', text: 'Dropped D' },
    { id: 'C-G-C-F-A-D', text: 'Dropped C' },
    { id: 'B-F#-B-E-G#-C#', text: 'Dropped B' },
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
        <Box>
            <FormControl>
                <InputLabel id="select-tuning-label">Tuning</InputLabel>
                <Select
                    labelId="select-tuning-label"
                    id="select-tuning"
                    label="Tuning"
                    value={props.contextSettings.tuning.id}
                    onChange={(event) => updateContext({tuning: Tuning.fromId(event.target.value as string)})}
                >
                    {tunings.map(entry => <MenuItem key={entry.id} value={entry.id}>{entry.text}</MenuItem>)}
                </Select>
            </FormControl>

            <FormControl>
                <InputLabel id="select-first-fret-label">First Fret</InputLabel>
                <Select
                    labelId="select-first-fret-label"
                    id="select-first-fret"
                    label="First Fret"
                    value={props.fretboardSettings.firstFret}
                    onChange={(event) => updateFretboard({firstFret: event.target.value as number})}
                >
                    {selectFretItems}
                </Select>
            </FormControl>

            <FormControl>
                <InputLabel id="select-last-fret-label">Last Fret</InputLabel>
                <Select
                    labelId="select-last-fret-label"
                    id="select-last-fret"
                    label="Last Fret"
                    value={props.fretboardSettings.lastFret}
                    onChange={(event) => updateFretboard({lastFret: event.target.value as number})}
                >
                    {selectFretItems}
                </Select>
            </FormControl>

            <FormControlLabel label="Open Strings" control={
                <Checkbox
                    checked={props.fretboardSettings.openStrings}
                    onChange={(event) => updateFretboard({openStrings: event.target.checked})}
                />
            }/>

            <FormControlLabel label="Show Scale Degrees" control={
                <Checkbox
                    checked={props.fretboardSettings.labels === 'scale-degrees'}
                    onChange={(event) => updateFretboard({labels: event.target.checked ? 'scale-degrees' : 'notes'})}
                />
            }/>

            <FormControl>
                <InputLabel id="select-root-label">Root</InputLabel>
                <Select
                    labelId="select-root-label"
                    id="select-root"
                    label="Root"
                    value={props.contextSettings.root.id}
                    onChange={(event) => updateContext({root: Note.fromId(event.target.value as string)})}
                >
                    {rootNotes.map(name => <MenuItem key={name} value={name}>{Note.fromId(name).text}</MenuItem>)}
                </Select>
            </FormControl>

            <FormControl>
                <InputLabel id="select-scale-label">Scale</InputLabel>
                <Select
                    labelId="select-scale-label"
                    id="select-scale"
                    label="Scale"
                    value={props.contextSettings.scale.id}
                    onChange={(event) => updateContext({scale: Scale.fromId(event.target.value as string)})}
                >
                    {scales.map(entry => <MenuItem key={entry.id} value={entry.id}>{entry.text}</MenuItem>)}
                </Select>
            </FormControl>
        </Box>
    );
}