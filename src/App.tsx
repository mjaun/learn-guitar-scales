import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import ProTip from './ProTip';
import Tuning from './model/Tuning';
import Scale from './model/Scale';
import Note from './model/Note';
import Fretboard, {FretboardSettings, FretboardContent} from './components/Fretboard'
import SettingsForm from './components/SettingsForm'
import ContentForm from './components/ContentForm'

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
    const [settings, setSettings] = React.useState<FretboardSettings>({
        tuning: Tuning.fromString('E-A-D-G-B-E'),
        firstFret: 5,
        lastFret: 8,
        openStrings: false,
        labels: 'scale-degrees',
    });

    const [content, setContent] = React.useState<FretboardContent>({
        scale: Scale.fromString('A', '1-b3-4-5-b7'),
    });

    return (
        <Container maxWidth="sm">
            <Box sx={{my: 4}}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Create React App example with TypeScript
                </Typography>
                <ProTip/>
                <Fretboard settings={settings} content={content}/>
                <SettingsForm
                    settings={settings}
                    onSettingsChange={(settings) => setSettings(settings)}
                />
                <ContentForm
                    content={content}
                    onContentChange={(content) => setContent(content)}
                />
                <Copyright/>
            </Box>
        </Container>
    );
}
