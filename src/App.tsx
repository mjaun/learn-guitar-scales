import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Fretboard, {FretboardSettings, FretboardData} from './components/Fretboard'
import SettingsForm, {UserSettings} from './components/SettingsForm'
import {loadSettings, saveSettings} from './settingsStore';
import Context from './model/Context';
import Position, {PositionSet} from "./model/Position";

export default function App() {
    const [settings, setSettings] = React.useState<UserSettings>(loadSettings);

    const fretboardCanvas = React.useRef<HTMLCanvasElement | null>(null);

    React.useEffect(() => saveSettings(settings), [settings]);

    const context = new Context({
        root: settings.root,
        scale: settings.scale,
        tuning: settings.tuning,
    });

    const scalePositionSet = PositionSet.fromArray(context.getInScalePositions());

    const fretboardSettings: FretboardSettings = {
        firstFret: settings.firstFret,
        lastFret: settings.lastFret,
        stringCount: settings.tuning.stringCount,
        labels: settings.labels,
    }

    const fretboardData: FretboardData[] = scalePositionSet.toArray().map(position => ({
        position,
        note: context.getNoteByPosition(position),
        scaleDegree: context.getScaleDegreeByPosition(position),
    }));

    return (
        <Container maxWidth="xl">
            <Box sx={{ marginY: 4 }}>
                <Typography variant="h2" component="h1" gutterBottom>
                    Learn Guitar Scales
                </Typography>
            </Box>
            <Box sx={{ marginY: 2 }}>
                <SettingsForm
                    settings={settings}
                    fretboardCanvas={fretboardCanvas}
                    onSettingsChange={(settings) => {
                        setSettings(settings);
                    }}
                />
            </Box>
            <Box>
                <Fretboard
                    data={fretboardData}
                    settings={fretboardSettings}
                    canvasRef={fretboardCanvas}
                />
            </Box>
        </Container>
    );
}
