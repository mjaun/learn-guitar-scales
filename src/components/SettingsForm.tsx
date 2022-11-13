import Tuning from "../model/Tuning";
import {FretboardSettings} from "./Fretboard";
import {Box, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select} from "@mui/material";
import * as React from "react";
import Note from "../model/Note";

const tunings: {id: string, text: string}[] = [
    { id: 'E-A-D-G-B-E', text: 'E Standard' },
    { id: 'Eb-Ab-Db-Gb-Bb-Eb', text: Note.fromName('Eb').text + ' Standard'},
    { id: 'D-G-C-F-A-D', text: 'D Standard' },
    { id: 'C-F-Bb-Eb-G-C', text: 'C Standard' },
    { id: 'B-E-A-D-F#-B', text: 'B Standard' },
    { id: 'D-A-D-G-B-E', text: 'Dropped D' },
    { id: 'C-G-C-F-A-D', text: 'Dropped C' },
    { id: 'B-F#-B-E-G#-C#', text: 'Dropped B' },
]

type Props = {
    settings: FretboardSettings,
    onSettingsChange: (settings: FretboardSettings) => void,
}

export default function SettingsForm(props: Props) {
    function updateSettings(settings: Partial<FretboardSettings>) {
        props.onSettingsChange({...props.settings, ...settings});
    }

    const selectFretItems = [];

    for (let fret = 1; fret <= 24; fret++) {
        selectFretItems.push(<MenuItem key={fret} value={fret}>{fret}</MenuItem>);
    }

    const tuningControl = (
        <FormControl>
            <InputLabel id="select-tuning-label">Tuning</InputLabel>
            <Select
                labelId="select-tuning-label"
                id="select-tuning"
                label="Tuning"
                value={props.settings.tuning.toString()}
                onChange={(event) => updateSettings({tuning: Tuning.fromString(event.target.value as string)})}
            >
                {tunings.map(entry => <MenuItem key={entry.id} value={entry.id}>{entry.text}</MenuItem>)}
            </Select>
        </FormControl>
    );

    const firstFretControl = (
        <FormControl>
            <InputLabel id="select-first-fret-label">First Fret</InputLabel>
            <Select
                labelId="select-first-fret-label"
                id="select-first-fret"
                label="First Fret"
                value={props.settings.firstFret}
                onChange={(event) => updateSettings({firstFret: event.target.value as number})}
            >
                {selectFretItems}
            </Select>
        </FormControl>
    );

    const lastFretControl = (
        <FormControl>
            <InputLabel id="select-last-fret-label">Last Fret</InputLabel>
            <Select
                labelId="select-last-fret-label"
                id="select-last-fret"
                label="Last Fret"
                value={props.settings.lastFret}
                onChange={(event) => updateSettings({lastFret: event.target.value as number})}
            >
                {selectFretItems}
            </Select>
        </FormControl>
    );

    const openStringsControl = (
        <FormControlLabel label="Open Strings" control={
            <Checkbox
                checked={props.settings.openStrings}
                onChange={(event) => updateSettings({openStrings: event.target.checked})}
            />
        }/>
    );

    const scaleDegreesControl = (
        <FormControlLabel label="Show Scale Degrees" control={
            <Checkbox
                checked={props.settings.labels === 'scale-degrees'}
                onChange={(event) => updateSettings({labels: event.target.checked ? 'scale-degrees' : 'notes'})}
            />
        }/>
    );

    return (
        <Box>
            {tuningControl}
            {firstFretControl}
            {lastFretControl}
            {openStringsControl}
            {scaleDegreesControl}
        </Box>
    );
}