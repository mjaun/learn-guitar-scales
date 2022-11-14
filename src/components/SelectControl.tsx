import * as React from 'react';
import {FormControl, InputLabel, Select} from "@mui/material";

type Props = {
    id: string,
    label: string,
    value: string,
    width: number,
    onChange: (value: string) => void,
    children?: React.ReactNode;
}

export default function SelectControl(props: Props) {
    return (
        <FormControl sx={{width: props.width}}>
            <InputLabel id={props.id + '-label'}>{props.label}</InputLabel>
            <Select
                labelId={props.id + '-label'}
                id={props.id}
                label={props.label}
                value={props.value as any}
                onChange={event => props.onChange(event.target.value as string)}
            >
                {props.children}
            </Select>
        </FormControl>
    );
}
