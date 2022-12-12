import React from "react";
import Note from "../model/Note";
import Position from "../model/Position";
import ScaleDegree from "../model/ScaleDegree";
import {Box} from "@mui/material";

const style = {
    scaleFactor: 2,
    maxFretSpacing: 125,
    stringSpacing: 55,
    markerSize: 30,
    noteSize: 40,
    openNoteSize: 35,
    topMargin: 30,
    fretWidth: 4,
    scaleDegreeColors: [
        'black',
        'darkred',
        'firebrick',
        'darkgreen',
        'limegreen',
        'goldenrod',
        'skyblue',
        'darkblue',
        'purple',
        'mediumpurple',
        'teal',
        'turquoise',
    ],
    fretColor: 'gray',
    fretMarkerColor: 'gray',
    fretMarkerTextColor: 'black',
    fretMarkerTextFont: '24px Arial',
    positionTextColor: 'white',
    positionTextFont: 'bold 24px Arial',
    fretboardColor: 'bisque',
};

export interface FretboardData {
    position: Position,
    scaleDegree: ScaleDegree,
    note: Note,
    visibility: 'full' | 'outlined',
}

export interface FretboardSettings {
    firstFret: number,
    lastFret: number,
    stringCount: number,
    labels: 'notes' | 'scale-degrees',
}

interface Layout {
    width: number,
    height: number,
    fretSpacing: number,
}

type Props = {
    data: FretboardData[],
    settings: FretboardSettings,
    onClick?: (position: Position, ctrl: boolean) => void,
}

export default function Fretboard(props: Props) {
    const firstFret = Math.max(props.settings.firstFret, 1);
    const lastFret = props.settings.lastFret;
    const openStrings = props.settings.firstFret === 0;

    const container = React.useRef<null | HTMLDivElement>(null);
    const canvas = React.useRef<null | HTMLCanvasElement>(null);

    const [stringImage, setStringImage] = React.useState(new Image());

    const [dimensions, setDimensions] = React.useState<Layout>({
        width: 0,
        height: 0,
        fretSpacing: 0,
    });

    React.useEffect(() => {
        const image = new Image();
        image.src = 'data:image/gif;base64,R0lGODdhAgAIAOMQAB0aFSUfDyooKTUxJkA6Gk9EJFlPLFRRSGtnZnNpUHRvXIF3bY+Ifp6Xh7Gunby4rywAAAAAAgAIAAAEDHAERV5xpiW20BFABAA7';
        image.onload = () => setStringImage(image);
    }, []);

    React.useEffect(() => {
        updateDimensions();

        const listener = () => updateDimensions();
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, [props.settings]);

    React.useEffect(() => {
        drawCanvas();
    });

    function updateDimensions() {
        if (!(container.current instanceof HTMLDivElement)) {
            return;
        }

        const openStringsWidth = openStrings ? style.openNoteSize : 0;
        const fretboardWidth = container.current.clientWidth - openStringsWidth;
        const fretCount = lastFret - firstFret + 1;
        const fretSpacing = Math.min((fretboardWidth - style.fretWidth) / fretCount, style.maxFretSpacing);

        setDimensions({
            fretSpacing,
            width: (fretCount * fretSpacing) + openStringsWidth,
            height: style.stringSpacing * props.settings.stringCount + style.topMargin,
        });
    }

    function drawCanvas() {
        if (!(canvas.current instanceof HTMLCanvasElement)) {
            return;
        }

        let ctx = canvas.current.getContext('2d');

        if (!ctx) {
            return;
        }

        ctx.canvas.width = dimensions.width * style.scaleFactor;
        ctx.canvas.height = dimensions.height * style.scaleFactor;
        ctx.scale(style.scaleFactor, style.scaleFactor);

        if (openStrings) {
            ctx.translate(style.openNoteSize, style.topMargin);
        } else {
            ctx.translate(0, style.topMargin);
        }

        drawFretboard(ctx);

        for (const data of props.data) {
            if (data.position.fret === 0 && !openStrings) {
                continue;
            }
            if (data.position.string >= props.settings.stringCount) {
                continue;
            }
            if (data.position.fret !== 0 && data.position.fret < firstFret) {
                continue;
            }
            if (data.position.fret > lastFret) {
                continue;
            }

            drawPosition(ctx, data);
        }
    }

    function drawFretboard(ctx: CanvasRenderingContext2D) {
        const fretboardWidth = (lastFret - firstFret + 1) * dimensions.fretSpacing;
        const fretboardHeight = style.stringSpacing * props.settings.stringCount;

        // background
        ctx.fillStyle = style.fretboardColor;
        ctx.fillRect(0, 0, fretboardWidth, fretboardHeight);

        // frets
        for (let i = 0; i <= lastFret - firstFret + 1; i++) {
            ctx.fillStyle = style.fretColor;
            ctx.fillRect(i * dimensions.fretSpacing, 0, 4, fretboardHeight);
        }

        // markers
        for (let i = 0; i <= lastFret - firstFret; i++) {
            let fret = firstFret + i;
            let drawMarkerText = false;
            let x = (i + 0.5) * dimensions.fretSpacing;

            if ([3, 5, 7, 9].includes(fret % 12)) {
                fillCircle(ctx, x, fretboardHeight / 2, style.markerSize / 2, style.fretMarkerColor);
                drawMarkerText = true;
            }

            if (fret % 12 == 0) {
                fillCircle(ctx, x, fretboardHeight / 3, style.markerSize / 2, style.fretMarkerColor);
                fillCircle(ctx, x, fretboardHeight / 3 * 2, style.markerSize / 2, style.fretMarkerColor);
                drawMarkerText = true;
            }

            if (drawMarkerText) {
                ctx.fillStyle = style.fretMarkerTextColor;
                ctx.font = style.fretMarkerTextFont;
                ctx.textAlign = 'center';
                ctx.fillText(String(fret), x, -8);
            }
        }

        // strings
        ctx.fillStyle = ctx.createPattern(stringImage, 'repeat-x') as CanvasPattern;
        ctx.save();
        ctx.translate(0, style.stringSpacing / 2 - stringImage.height / 2);
        for (let string = 0; string < props.settings.stringCount; string++) {
            ctx.fillRect(0, 0, fretboardWidth, stringImage.height);
            ctx.translate(0, style.stringSpacing);
        }
        ctx.restore();
    }

    function drawPosition(ctx: CanvasRenderingContext2D, data: FretboardData) {
        ctx.save();

        if (data.position.fret === 0) {
            ctx.translate(-0.5 * style.openNoteSize + 2, (data.position.string + 0.5) * style.stringSpacing);
        } else {
            const visibleFretIndex = data.position.fret - firstFret;
            ctx.translate((visibleFretIndex + 0.5) * dimensions.fretSpacing, (data.position.string + 0.5) * style.stringSpacing);
        }

        let radius: number;

        if (data.position.fret === 0) {
            radius = style.openNoteSize / 2;
        } else {
            radius = style.noteSize / 2;
        }

        if (data.visibility === 'full') {
            fillCircle(ctx, 0, 0, radius, style.scaleDegreeColors[data.scaleDegree.value]);
        }
        if (data.visibility === 'outlined') {
            strokeCircle(ctx, 0, 0, radius, style.scaleDegreeColors[data.scaleDegree.value]);
        }

        if (data.visibility !== 'outlined') {
            let text = '';

            if (props.settings.labels === 'notes') {
                text = data.note.name;
            }
            if (props.settings.labels === 'scale-degrees') {
                text = data.scaleDegree.name;
            }

            ctx.fillStyle = style.positionTextColor;
            ctx.font = style.positionTextFont;
            ctx.textAlign = 'center';
            ctx.fillText(text, 0, 8);
        }

        ctx.restore();
    }

    function onClick(x: number, y: number, ctrl: boolean) {
        if (!(canvas.current instanceof HTMLCanvasElement)) {
            return;
        }

        if (!props.onClick) {
            return;
        }

        const rect = canvas.current.getBoundingClientRect();
        x -= rect.left;
        y -= rect.top;

        y -= style.topMargin;

        if (openStrings) {
            x -= style.openNoteSize;
        }

        const string = Math.floor(y / style.stringSpacing);

        if (string < 0 || string >= props.settings.stringCount) {
            return;
        }

        const fretIndex = Math.floor(x / dimensions.fretSpacing);
        const openStringClicked = fretIndex < 0 && openStrings;
        const fret = openStringClicked ? 0 : firstFret + fretIndex;

        props.onClick(new Position({fret, string}), ctrl);
    }

    const canvasStyle = {
        width: dimensions.width,
        height: dimensions.height,
    };

    return (
        <Box ref={container}>
            <canvas
                ref={canvas}
                style={canvasStyle}
                onClick={(evt) => onClick(evt.clientX, evt.clientY, evt.ctrlKey)}
            />
        </Box>
    );
}

function fillCircle(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, color: string) {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fill();
}

function strokeCircle(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number, color: string) {
    ctx.lineWidth = 5;
    ctx.strokeStyle = color;
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius - (ctx.lineWidth / 2), 0, 2 * Math.PI, false);
    ctx.stroke();
}
