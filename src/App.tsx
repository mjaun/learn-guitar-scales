import * as React from 'react';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import ProTip from './ProTip';
import Fretboard, {FretboardSettings, FretboardContent} from './components/Fretboard'
import Tuning from './model/Tuning';
import Scale from './model/Scale';
import Note from './model/Note';

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
    const tuning = Tuning.fromString('E-A-D-G-B-E');
    const scale = Scale.fromString('A', '1-b3-4-5-b7');

    const settings: FretboardSettings = {
        tuning,
        firstFret: 5,
        lastFret: 8,
        openStrings: false,
        labels: 'scale-degrees',
    }

    const content: FretboardContent = {
        scale,
    }

    return (
        <Container maxWidth="sm">
            <Box sx={{my: 4}}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Create React App example with TypeScript
                </Typography>
                <ProTip/>
                <Fretboard settings={settings} content={content} />
                <Copyright/>
            </Box>
        </Container>
    );
}
