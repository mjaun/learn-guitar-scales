import React from "react";
import Note from "../model/Note";
import Position from "../model/Position";
import ScaleDegree from "../model/ScaleDegree";

const style = {
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
    openStrings: boolean,
    labels: 'notes' | 'scale-degrees',
}

interface Layout {
    fretSpacing: number,
    firstVisibleFret: number,
    lastVisibleFret: number,
}

type Props = {
    data: FretboardData[],
    settings: FretboardSettings,
    onClick?: (position: Position, ctrl: boolean) => void,
}

export default function Fretboard(props: Props) {
    const canvas = React.useRef<null | HTMLCanvasElement>(null);

    const [stringImage, setStringImage] = React.useState(new Image());

    const [layout, setLayout] = React.useState<Layout>({
        fretSpacing: 0,
        firstVisibleFret: 0,
        lastVisibleFret: 0,
    });

    React.useEffect(() => {
        const image = new Image();
        image.src = 'data:image/gif;base64,R0lGODdhAgAIAOMQAB0aFSUfDyooKTUxJkA6Gk9EJFlPLFRRSGtnZnNpUHRvXIF3bY+Ifp6Xh7Gunby4rywAAAAAAgAIAAAEDHAERV5xpiW20BFABAA7';
        image.onload = () => setStringImage(image);
    }, []);

    React.useEffect(() => {
        const listener = () => updateDimensions();
        window.addEventListener('resize', listener);
        return () => window.removeEventListener('resize', listener);
    }, []);

    React.useEffect(() => {
        updateDimensions();
    }, [props.settings]);

    React.useEffect(() => {
        drawCanvas();
    });

    function updateDimensions() {
        if (!(canvas.current instanceof HTMLCanvasElement)) {
            return;
        }

        let containerWidth = canvas.current.clientWidth;
        if (props.settings.openStrings) {
            containerWidth -= style.openNoteSize;
        }

        const fretCount = props.settings.lastFret - props.settings.firstFret + 1;
        let fretSpacing = Math.min((containerWidth - style.fretWidth) / fretCount, style.maxFretSpacing);

        setLayout({
            fretSpacing,
            firstVisibleFret: props.settings.firstFret,
            lastVisibleFret: props.settings.lastFret,
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

        ctx.canvas.width = ctx.canvas.clientWidth;
        ctx.canvas.height = ctx.canvas.clientHeight;

        if (props.settings.openStrings) {
            ctx.translate(style.openNoteSize, style.topMargin);
        } else {
            ctx.translate(0, style.topMargin);
        }

        drawFretboard(ctx);

        for (const data of props.data) {
            if (data.position.fret === 0 && !props.settings.openStrings) {
                continue;
            }
            if (data.position.string >= props.settings.stringCount) {
                continue;
            }
            if (data.position.fret !== 0 && data.position.fret < layout.firstVisibleFret) {
                continue;
            }
            if (data.position.fret > layout.lastVisibleFret) {
                continue;
            }

            drawPosition(ctx, data);
        }
    }

    function drawFretboard(ctx: CanvasRenderingContext2D) {
        const fretboardWidth = (layout.lastVisibleFret - layout.firstVisibleFret + 1) * layout.fretSpacing;
        const fretboardHeight = style.stringSpacing * props.settings.stringCount;

        // background
        ctx.fillStyle = 'bisque';
        ctx.fillRect(0, 0, fretboardWidth, fretboardHeight);

        // frets
        for (let i = 0; i <= layout.lastVisibleFret - layout.firstVisibleFret + 1; i++) {
            ctx.fillStyle = 'gray';
            ctx.fillRect(i * layout.fretSpacing, 0, 4, fretboardHeight);
        }

        // markers
        for (let i = 0; i <= layout.lastVisibleFret - layout.firstVisibleFret; i++) {
            let fret = layout.firstVisibleFret + i;
            let drawMarkerText = false;
            let x = (i + 0.5) * layout.fretSpacing;

            if ([3, 5, 7, 9].includes(fret % 12)) {
                fillCircle(ctx, x, fretboardHeight / 2, style.markerSize / 2, 'gray');
                drawMarkerText = true;
            }

            if (fret % 12 == 0) {
                fillCircle(ctx, x, fretboardHeight / 3, style.markerSize / 2, 'gray');
                fillCircle(ctx, x, fretboardHeight / 3 * 2, style.markerSize / 2, 'gray');
                drawMarkerText = true;
            }

            if (drawMarkerText) {
                ctx.fillStyle = 'black';
                ctx.font = '24px Segoe UI';
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
            const visibleFretIndex = data.position.fret - layout.firstVisibleFret;
            ctx.translate((visibleFretIndex + 0.5) * layout.fretSpacing, (data.position.string + 0.5) * style.stringSpacing);
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
                text = data.note.text;
            }
            if (props.settings.labels === 'scale-degrees') {
                text = data.scaleDegree.text;
            }

            ctx.fillStyle = 'white';
            ctx.font = 'bold 24px Segoe UI';
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

        if (props.settings.openStrings) {
            x -= style.openNoteSize;
        }

        const string = Math.floor(y / style.stringSpacing);

        if (string < 0 || string >= props.settings.stringCount) {
            return;
        }

        const fretIndex = Math.floor(x / layout.fretSpacing);
        const openStringClicked = fretIndex < 0 && props.settings.openStrings;
        const fret = openStringClicked ? 0 : layout.firstVisibleFret + fretIndex;

        props.onClick(new Position({fret, string}), ctrl);
    }

    const canvasStyle = {
        width: '100%',
        height: style.stringSpacing * props.settings.stringCount + style.topMargin,
    };

    return (
        <canvas
            id="fretboard"
            ref={canvas}
            style={canvasStyle}
            onClick={(evt) => onClick(evt.clientX, evt.clientY, evt.ctrlKey)}
        />
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
