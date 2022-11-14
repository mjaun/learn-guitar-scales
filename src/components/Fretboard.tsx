import React from "react";
import Note from "../model/Note";
import Position from "../model/Position";
import ScaleDegree from "../model/ScaleDegree";
import Context, {ContextSettings} from "../model/Context";

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

export interface FretboardSettings {
    firstFret: number,
    lastFret: number,
    openStrings: boolean,
    labels: 'notes' | 'scale-degrees',
}

interface Layout {
    fretSpacing: number,
    firstVisibleFret: number,
    lastVisibleFret: number,
}

type Props = {
    contextSettings: ContextSettings,
    fretboardSettings: FretboardSettings,
    onClick?: (position: Position) => void,
}

export default function Fretboard(props: Props) {
    const fretboardSettings = props.fretboardSettings;

    const context = new Context(props.contextSettings);

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
    }, [fretboardSettings]);

    React.useEffect(() => {
        drawCanvas();
    });

    function updateDimensions() {
        if (!(canvas.current instanceof HTMLCanvasElement)) {
            return;
        }

        let containerWidth = canvas.current.clientWidth;
        if (fretboardSettings.openStrings) {
            containerWidth -= style.openNoteSize;
        }

        const fretCount = fretboardSettings.lastFret - fretboardSettings.firstFret + 1;
        let fretSpacing = (containerWidth - style.fretWidth) / fretCount;
        let additionalFrets = 0;

        while (fretSpacing > style.maxFretSpacing) {
            additionalFrets++;
            fretSpacing = (containerWidth - style.fretWidth) / (fretCount + additionalFrets);
        }

        let firstVisibleFret = fretboardSettings.firstFret - Math.floor(additionalFrets / 2);
        let lastVisibleFret = fretboardSettings.lastFret + Math.ceil(additionalFrets / 2);

        while (firstVisibleFret < 1) {
            firstVisibleFret++;
            lastVisibleFret++;
        }

        setLayout({
            fretSpacing,
            firstVisibleFret,
            lastVisibleFret,
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

        if (fretboardSettings.openStrings) {
            ctx.translate(style.openNoteSize, style.topMargin);
        } else {
            ctx.translate(0, style.topMargin);
        }

        drawFretboard(ctx);

        for (const position of getAllPositions()) {
            const note = context.getNoteByPosition(position);
            const scaleDegree = context.getScaleDegreeByPosition(position);

            if (!context.isNoteInScale(note)) {
                continue;
            }

            drawPosition(ctx, position, note, scaleDegree);
        }
    }

    function drawFretboard(ctx: CanvasRenderingContext2D) {
        const fretboardWidth = (layout.lastVisibleFret - layout.firstVisibleFret + 1) * layout.fretSpacing;
        const fretboardHeight = style.stringSpacing * context.tuning.stringCount;

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
                ctx.fillStyle = 'gray';
                fillCircle(ctx, x, fretboardHeight / 2, style.markerSize / 2);
                drawMarkerText = true;
            }

            if (fret % 12 == 0) {
                ctx.fillStyle = 'gray';
                fillCircle(ctx, x, fretboardHeight / 3, style.markerSize / 2);
                fillCircle(ctx, x, fretboardHeight / 3 * 2, style.markerSize / 2);
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
        for (let string = 0; string < context.tuning.stringCount; string++) {
            ctx.fillRect(0, 0, fretboardWidth, stringImage.height);
            ctx.translate(0, style.stringSpacing);
        }
        ctx.restore();
    }

    function drawPosition(ctx: CanvasRenderingContext2D, position: Position, note: Note, scaleDegree: ScaleDegree) {
        ctx.save();

        if (position.fret === 0) {
            ctx.translate(-0.5 * style.openNoteSize + 2, (position.string + 0.5) * style.stringSpacing);
        } else {
            const visibleFretIndex = position.fret - layout.firstVisibleFret;
            ctx.translate((visibleFretIndex + 0.5) * layout.fretSpacing, (position.string + 0.5) * style.stringSpacing);
        }

        ctx.fillStyle = style.scaleDegreeColors[scaleDegree.value];

        if (position.fret === 0) {
            fillCircle(ctx, 0, 0, style.openNoteSize / 2);
        } else {
            fillCircle(ctx, 0, 0, style.noteSize / 2);
        }

        ctx.fillStyle = 'white';
        ctx.font = 'bold 24px Segoe UI';
        ctx.textAlign = 'center';

        if (fretboardSettings.labels === 'notes') {
            ctx.fillText(note.id, 0, 8);
        }

        if (fretboardSettings.labels === 'scale-degrees') {
            ctx.fillText(scaleDegree.id, 0, 8);
        }

        ctx.restore();
    }

    function onClick(x: number, y: number) {
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

        if (fretboardSettings.openStrings) {
            x -= style.openNoteSize;
        }

        const string = Math.floor(y / style.stringSpacing);

        if (string < 0 || string >= context.tuning.stringCount) {
            return;
        }

        const fretIndex = Math.floor(x / layout.fretSpacing);
        const openStringClicked = fretIndex < 0 && fretboardSettings.openStrings;
        const fret = openStringClicked ? 0 : layout.firstVisibleFret + fretIndex;

        props.onClick({fret, string});
    }

    function getAllPositions(): Position[] {
        const result: Position[] = [];

        for (let string = 0; string < context.tuning.stringCount; string++) {
            if (fretboardSettings.openStrings) {
                result.push({string, fret: 0});
            }
            for (let fret = fretboardSettings.firstFret; fret <= fretboardSettings.lastFret; fret++) {
                result.push({string, fret});
            }
        }

        return result;
    }

    const canvasStyle = {
        width: '100%',
        height: style.stringSpacing * context.tuning.stringCount + style.topMargin,
    };

    return (
        <canvas
            id="fretboard"
            ref={canvas}
            style={canvasStyle}
            onClick={(evt) => onClick(evt.clientX, evt.clientY)}
        />
    );
}

function fillCircle(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fill();
}
