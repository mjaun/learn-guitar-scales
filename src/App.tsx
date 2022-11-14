import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tuning from './model/Tuning';
import Scale from './model/Scale';
import Note from './model/Note';
import Fretboard, {FretboardSettings} from './components/Fretboard'
import SettingsForm from './components/SettingsForm'
import {ContextSettings} from './model/Context';

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
        <Container maxWidth="xl">
            <Box marginY={4}>
                <Typography variant="h2" component="h1" gutterBottom>
                    Learn Guitar Scales
                </Typography>
            </Box>
            <Box marginY={2}>
                <SettingsForm
                    contextSettings={contextSettings}
                    onContextSettingsChange={(settings) => setContextSettings(settings)}
                    fretboardSettings={fretboardSettings}
                    onFretboardSettingsChange={(settings) => setFretboardSettings(settings)}
                />
            </Box>
            <Box>
                <Fretboard
                    contextSettings={contextSettings}
                    fretboardSettings={fretboardSettings}
                />
            </Box>
        </Container>
    );
}
