import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import ProTip from './ProTip';
import Tuning from './model/Tuning';
import Scale from './model/Scale';
import Note from './model/Note';
import Fretboard, {FretboardSettings} from './components/Fretboard'
import SettingsForm from './components/SettingsForm'
import {ContextSettings} from "./model/Context";

function Copyright() {
    return (
        <Typography variant="body2" color="text.secondary" align="center">
            {'Copyright © '}
            <Link color="inherit" href="https://mui.com/">
                Your Website
            </Link>{' '}
            {new Date().getFullYear()}.
        </Typography>
    );
}

export default function App() {
    const [fretboardSettings, setFretboardSettings] = React.useState<FretboardSettings>({
        firstFret: 5,
        lastFret: 8,
        openStrings: false,
        labels: 'scale-degrees',
    });

    const [contextSettings, setContextSettings] = React.useState<ContextSettings>({
        root: Note.fromId('A'),
        scale: Scale.fromId('1-b3-4-5-b7'),
        tuning: Tuning.fromId('E-A-D-G-B-E'),
    });

    return (
        <Container maxWidth="sm">
            <Box sx={{my: 4}}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Create React App example with TypeScript
                </Typography>
                <ProTip/>
                <Fretboard
                    contextSettings={contextSettings}
                    fretboardSettings={fretboardSettings}
                />
                <SettingsForm
                    contextSettings={contextSettings}
                    onContextSettingsChange={(settings) => setContextSettings(settings)}
                    fretboardSettings={fretboardSettings}
                    onFretboardSettingsChange={(settings) => setFretboardSettings(settings)}
                />
                <Copyright/>
            </Box>
        </Container>
    );
}
