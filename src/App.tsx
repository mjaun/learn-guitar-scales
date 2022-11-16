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
import Position from "./model/Position";

export default function App() {
    const [settings, setSettings] = React.useState<UserSettings>({
        firstFret: 1,
        lastFret: 12,
        openStrings: true,
        labels: 'scale-degrees',
        root: Note.fromId('A'),
        scale: Scale.fromId('1-b3-4-5-b7'),
        tuning: Tuning.fromId('E-A-D-G-B-E'),
    });

    const [outlinedPositions, setOutlinedPositions] = React.useState<Position[]>([]);

    const context = new Context({
        root: settings.root,
        scale: settings.scale,
        tuning: settings.tuning,
    });

    const fretboardSettings: FretboardSettings = {
        firstFret: settings.firstFret,
        lastFret: settings.lastFret,
        openStrings: settings.openStrings,
        stringCount: settings.tuning.stringCount,
        labels: settings.labels,
    }

    function positionEqual(p1: Position, p2: Position) {
        return p1.fret === p2.fret && p1.string === p2.string;
    }

    function onFretboardClick(position: Position) {
        const index = outlinedPositions.findIndex(p => positionEqual(p, position));
        const newPositions = outlinedPositions.slice();

        if (index === -1) {
            newPositions.push(position);
            setOutlinedPositions(newPositions);
        } else {
            newPositions.splice(index, 1);
            setOutlinedPositions(newPositions);
        }
    }

    const fretboardData: FretboardData[] = [];

    for (const position of context.getAllScalePositions()) {
        const note = context.getNoteByPosition(position);
        const scaleDegree = context.getScaleDegreeByPosition(position);

        let visibility: 'outlined' | 'full';

        if (outlinedPositions.some(p => positionEqual(p, position))) {
            visibility = 'outlined';
        } else {
            visibility = 'full';
        }

        fretboardData.push({
            position,
            note,
            scaleDegree,
            visibility,
        });
    }

    return (
        <Container maxWidth="xl">
            <Box marginY={4}>
                <Typography variant="h2" component="h1" gutterBottom>
                    Learn Guitar Scales
                </Typography>
            </Box>
            <Box marginY={2}>
                <SettingsForm
                    settings={settings}
                    onSettingsChange={(settings) => setSettings(settings)}
                />
            </Box>
            <Box>
                <Fretboard
                    data={fretboardData}
                    settings={fretboardSettings}
                    onClick={onFretboardClick}
                />
            </Box>
        </Container>
    );
}
