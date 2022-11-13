import Tuning from "../model/Tuning";
import {FretboardSettings} from "./Fretboard";
import {Box, Checkbox, FormControl, FormControlLabel, InputLabel, MenuItem, Select} from "@mui/material";
import * as React from "react";
import Note from "../model/Note";

type Props = {
    settings: FretboardSettings,
    onSettingsChange: (settings: FretboardSettings) => void,
}

export default function FretboardForm(props: Props) {
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
                <MenuItem value="E-A-D-G-B-E">E Standard</MenuItem>
                <MenuItem value="Eb-Ab-Db-Gb-Bb-Eb">{Note.fromName('Eb').text} Standard</MenuItem>
                <MenuItem value="D-G-C-F-A-D">D Standard</MenuItem>
                <MenuItem value="C-F-Bb-Eb-G-C">C Standard</MenuItem>
                <MenuItem value="B-E-A-D-F#-B">B Standard</MenuItem>
                <MenuItem value="D-A-D-G-B-E">Dropped D</MenuItem>
                <MenuItem value="C-G-C-F-A-D">Dropped C</MenuItem>
                <MenuItem value="B-F#-B-E-G#-C#">Dropped B</MenuItem>
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