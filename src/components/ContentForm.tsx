import {FretboardContent} from "./Fretboard";
import {Box, FormControl, InputLabel, MenuItem, Select} from "@mui/material";
import * as React from "react";
import Note from "../model/Note";
import Scale from "../model/Scale";

const rootNotes = ['Cb', 'Gb', 'Db', 'Ab', 'Eb', 'Bb', 'F', 'C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#'];

const scales: { name: string, text: string }[] = [
    {name: '1-5', text: 'Root + Fifths'},
    {name: '1-3-5', text: 'Major Arpeggio'},
    {name: '1-b3-5', text: 'Minor Arpeggio'},
    {name: '1-3-5-b7', text: 'Dominant Arpeggio'},
    {name: '1-2-3-5-6', text: 'Major Pentatonic'},
    {name: '1-b3-4-5-b7', text: 'Minor Pentatonic'},
    {name: '1-2-3-4-5-6-7', text: 'Ionian'},
    {name: '1-2-b3-4-5-6-b7', text: 'Dorian'},
    {name: '1-b2-b3-4-5-b6-b7', text: 'Phrygian'},
    {name: '1-2-3-#4-5-6-7', text: 'Lydian'},
    {name: '1-2-3-4-5-6-b7', text: 'Mixolydian'},
    {name: '1-2-b3-4-5-b6-b7', text: 'Aeolian'},
    {name: '1-b2-b3-4-b5-b6-b7', text: 'Locrian'},
    {name: '1-b2-2-b3-3-4-b5-5-b6-6-b7-7', text: 'Chromatic'},
];

type Props = {
    content: FretboardContent,
    onContentChange: (content: FretboardContent) => void,
}

export default function FretboardForm(props: Props) {
    const inputs = {
        root: React.createRef<HTMLSelectElement>(),
        scale: React.createRef<HTMLSelectElement>(),
    }

    function setRoot(rootId: string) {
        if (!inputs.scale.current) {
            return;
        }

        props.onContentChange({
            scale: Scale.fromString(rootId, inputs.scale.current.value),
        });
    }

    function setScale(scaleId: string) {
        if (!inputs.root.current) {
            return;
        }

        props.onContentChange({
            scale: Scale.fromString(inputs.root.current.value, scaleId),
        });
    }

    const rootControl = (
        <FormControl>
            <InputLabel id="select-root-label">Tuning</InputLabel>
            <Select
                labelId="select-root-label"
                id="select-root"
                label="Root"
                inputRef={inputs.root}
                value={props.content.scale.root.name}
                onChange={(event) => setRoot(event.target.value as string)}
            >
                {rootNotes.map(name => <MenuItem key={name} value={name}>{Note.fromName(name).text}</MenuItem>)}
            </Select>
        </FormControl>
    );

    const scaleControl = (
        <FormControl>
            <InputLabel id="select-scale-label">Scale</InputLabel>
            <Select
                labelId="select-scale-label"
                id="select-scale"
                label="Scale"
                inputRef={inputs.scale}
                value={props.content.scale.toString()}
                onChange={(event) => setScale(event.target.value as string)}
            >
                {scales.map(entry => <MenuItem key={entry.name} value={entry.name}>{entry.text}</MenuItem>)}
            </Select>
        </FormControl>
    );

    return (
        <Box>
            {rootControl}
            {scaleControl}
        </Box>
    );
}