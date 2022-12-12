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

export default function App() {
    const [settings, setSettings] = React.useState<UserSettings>({
        firstFret: 0,
        lastFret: 15,
        labels: 'scale-degrees',
        root: Note.fromId('A0'),
        scale: Scale.fromId('1-b3-4-5-b7'),
        tuning: Tuning.fromId('E2-A2-D3-G3-B3-E4'),
    });

    const [outlinedPositions, setOutlinedPositions] = React.useState<Position[]>([]);

    const context = new Context({
        root: settings.root,
        scale: settings.scale,
        tuning: settings.tuning,
    });

    const outlinedPositionSet = PositionSet.fromArray(outlinedPositions);
    const scalePositionSet = PositionSet.fromArray(context.getInScalePositions());

    function onFretboardClick(position: Position, ctrl: boolean) {
        if (!scalePositionSet.contains(position)) {
            return;
        }

        const note = context.getNoteByPosition(position);
        const positionsToModify = ctrl ? context.getSameNotePositions(note) : position;

        if (outlinedPositionSet.contains(position)) {
            outlinedPositionSet.remove(positionsToModify);
        } else {
            outlinedPositionSet.add(positionsToModify);
        }

        setOutlinedPositions(outlinedPositionSet.toArray());
    }

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
        visibility: outlinedPositionSet.contains(position) ? 'outlined' : 'full',
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
                    onSettingsChange={(settings) => {
                        setSettings(settings);
                        setOutlinedPositions([]);
                    }}
                />
            </Box>
            <Box marginY={2}>
                Click on a note to outline it. Use Ctrl + Click to outline all the same notes.
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
