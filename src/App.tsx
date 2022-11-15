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
        firstFret: 5,
        lastFret: 8,
        openStrings: false,
        labels: 'scale-degrees',
        root: Note.fromId('A'),
        scale: Scale.fromId('1-b3-4-5-b7'),
        tuning: Tuning.fromId('E-A-D-G-B-E'),
    });

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

    function getAllPositions(): Position[] {
        const result: Position[] = [];

        for (let string = 0; string < settings.tuning.stringCount; string++) {
            if (settings.openStrings) {
                result.push({string, fret: 0});
            }
            for (let fret = settings.firstFret; fret <= settings.lastFret; fret++) {
                result.push({string, fret});
            }
        }

        return result;
    }

    const fretboardData: FretboardData[] = getAllPositions()
        .filter(position => context.isNoteInScale(context.getNoteByPosition(position)))
        .map(position => ({
            position,
            scaleDegree: context.getScaleDegreeByPosition(position),
            note: context.getNoteByPosition(position),
            visibility: 'full',
        }));

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
                />
            </Box>
        </Container>
    );
}
