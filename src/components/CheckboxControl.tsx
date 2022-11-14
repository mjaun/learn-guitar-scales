import * as React from 'react';
import {Checkbox, FormControlLabel} from "@mui/material";

type Props = {
    id: string,
    label: string,
    checked: boolean,
    onChange: (checked: boolean) => void,
}

export default function CheckboxControl(props: Props) {
    return (
        <FormControlLabel label={props.label} control={
            <Checkbox
                id={props.id}
                checked={props.checked}
                onChange={event => props.onChange(event.target.checked)}
            />
        }/>
    );
}
