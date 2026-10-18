import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Tuning from './model/Tuning';
import Scale from './model/Scale';
import Note from './model/Note';
import Fretboard, {FretboardSettings, FretboardData} from './components/Fretboard'
import SettingsForm, {UserSettings} from './components/SettingsForm'
import Context from './model/Context';
import Position, {PositionSet} from "./model/Position";

const STORAGE_KEY = 'learn-guitar-scales.settings';

const defaultSettings: UserSettings = {
    firstFret: 0,
    lastFret: 15,
    labels: 'scale-degrees',
    root: Note.fromId('A0'),
    scale: Scale.fromId('1-b3-4-5-b7'),
    tuning: Tuning.fromId('E2-A2-D3-G3-B3-E4'),
};

function loadSettings(): UserSettings {
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
        if (!stored) {
            return defaultSettings;
        }
        return {
            firstFret: Number(stored.firstFret),
            lastFret: Number(stored.lastFret),
            labels: stored.labels === 'notes' ? 'notes' : 'scale-degrees',
            root: Note.fromId(stored.root),
            scale: Scale.fromId(stored.scale),
            tuning: Tuning.fromId(stored.tuning),
        };
    } catch {
        return defaultSettings;
    }
}

function saveSettings(settings: UserSettings) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify({
            firstFret: settings.firstFret,
            lastFret: settings.lastFret,
            labels: settings.labels,
            root: settings.root.id,
            scale: settings.scale.id,
            tuning: settings.tuning.id,
        }));
    } catch {
        // storage unavailable; settings just won't persist
    }
}

export default function App() {
    const [settings, setSettings] = React.useState<UserSettings>(loadSettings);

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
                    onSettingsChange={(settings) => {
                        setSettings(settings);
                    }}
                />
            </Box>
            <Box>
                <Fretboard
                    data={fretboardData}
                    settings={fretboardSettings}
                />
            </Box>
        </Container>
    );
}
