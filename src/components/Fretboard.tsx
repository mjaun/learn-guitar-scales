import React from "react";
import Note from "../model/Note";
import Position from "../model/Position";
import ScaleDegree from "../model/ScaleDegree";
import Context, {ContextSettings} from "../model/Context";

const style = {
    maxFretSpacing: 120,
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

type Props = {
    contextSettings: ContextSettings,
    fretboardSettings: FretboardSettings,
    onClick?: (position: Position) => void,
}

type State = {
    fretSpacing: number,
    firstVisibleFret: number,
    lastVisibleFret: number,
}

export default class Fretboard extends React.PureComponent<Props, State> {
    private readonly canvas = React.createRef<HTMLCanvasElement>();
    private readonly stringImage = new Image();

    constructor(props: Readonly<Props>) {
        super(props);

        this.state = {
            fretSpacing: 0,
            firstVisibleFret: 0,
            lastVisibleFret: 0,
        };

        this.stringImage.src = 'data:image/gif;base64,R0lGODdhAgAIAOMQAB0aFSUfDyooKTUxJkA6Gk9EJFlPLFRRSGtnZnNpUHRvXIF3bY+Ifp6Xh7Gunby4rywAAAAAAgAIAAAEDHAERV5xpiW20BFABAA7';
        this.stringImage.onload = () => this.forceUpdate();
    }

    render() {
        const canvasStyle = {
            width: '100%',
            height: style.stringSpacing * this.props.contextSettings.tuning.stringCount + style.topMargin,
        };

        return (
            <canvas
                id="fretboard"
                ref={this.canvas}
                style={canvasStyle}
                onClick={(evt) => this.onClick(evt.clientX, evt.clientY)}
            />
        );
    }

    componentDidMount() {
        this.updateDimensions();
        this.drawCanvas();

        window.addEventListener('resize', () => this.updateDimensions());
    }

    componentWillUnmount() {
        window.removeEventListener('resize', () => this.updateDimensions());
    }

    componentDidUpdate() {
        this.updateDimensions();
        this.drawCanvas();
    }

    private updateDimensions() {
        if (!this.canvas.current) {
            return;
        }

        let containerWidth = this.canvas.current.clientWidth;
        if (this.props.fretboardSettings.openStrings) {
            containerWidth -= style.openNoteSize;
        }

        const fretCount = this.props.fretboardSettings.lastFret - this.props.fretboardSettings.firstFret + 1;
        let fretSpacing = (containerWidth - style.fretWidth) / fretCount;
        let additionalFrets = 0;

        while (fretSpacing > style.maxFretSpacing) {
            additionalFrets++;
            fretSpacing = (containerWidth - style.fretWidth) / (fretCount + additionalFrets);
        }

        let firstVisibleFret = this.props.fretboardSettings.firstFret - Math.floor(additionalFrets / 2);
        let lastVisibleFret = this.props.fretboardSettings.lastFret + Math.ceil(additionalFrets / 2);

        while (firstVisibleFret < 1) {
            firstVisibleFret++;
            lastVisibleFret++;
        }

        this.setState({
            fretSpacing,
            firstVisibleFret,
            lastVisibleFret,
        });
    }

    private drawCanvas() {
        if (!this.canvas.current) {
            return;
        }

        let ctx = this.canvas.current.getContext('2d');

        if (!ctx) {
            return;
        }

        ctx.canvas.width = ctx.canvas.clientWidth;
        ctx.canvas.height = ctx.canvas.clientHeight;

        if (this.props.fretboardSettings.openStrings) {
            ctx.translate(style.openNoteSize, style.topMargin);
        } else {
            ctx.translate(0, style.topMargin);
        }

        this.drawFretboard(ctx);

        const context = new Context(this.props.contextSettings);
        
        for (let string = 0; string < context.tuning.stringCount; string++) {
            for (let fret = this.props.fretboardSettings.firstFret; fret <= this.props.fretboardSettings.lastFret; fret++) {
                const position = { string, fret };
                const note = context.getNoteByPosition(position);
                const scaleDegree = context.getScaleDegreeByPosition(position);

                if (!context.isNoteInScale(note)) {
                    continue;
                }

                this.drawPosition(ctx, position, note, scaleDegree);
            }
        }
    }

    private drawFretboard(ctx: CanvasRenderingContext2D) {
        const fretboardWidth = (this.state.lastVisibleFret - this.state.firstVisibleFret + 1) * this.state.fretSpacing;
        const fretboardHeight = style.stringSpacing * this.props.contextSettings.tuning.stringCount;

        // background
        ctx.fillStyle = 'bisque';
        ctx.fillRect(0, 0, fretboardWidth, fretboardHeight);

        // frets
        for (let i = 0; i <= this.state.lastVisibleFret - this.state.firstVisibleFret + 1; i++) {
            const fret = this.state.firstVisibleFret + i;

            if (fret === this.props.fretboardSettings.firstFret || fret === this.props.fretboardSettings.lastFret + 1) {
                ctx.fillStyle = 'black';
            } else {
                ctx.fillStyle = 'gray';
            }

            ctx.fillRect(i * this.state.fretSpacing, 0, 4, fretboardHeight);
        }

        // markers
        for (let i = 0; i <= this.state.lastVisibleFret - this.state.firstVisibleFret; i++) {
            let fret = this.state.firstVisibleFret + i;
            let drawMarkerText = false;
            let x = (i + 0.5) * this.state.fretSpacing;

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
        ctx.fillStyle = ctx.createPattern(this.stringImage, 'repeat-x') as CanvasPattern;
        ctx.save();
        ctx.translate(0, style.stringSpacing / 2 - this.stringImage.height / 2);
        for (let string = 0; string < this.props.contextSettings.tuning.stringCount; string++) {
            ctx.fillRect(0, 0, fretboardWidth, this.stringImage.height);
            ctx.translate(0, style.stringSpacing);
        }
        ctx.restore();
    }

    private drawPosition(ctx: CanvasRenderingContext2D, position: Position, note: Note, scaleDegree: ScaleDegree) {
        ctx.save();

        if (position.fret === 0) {
            ctx.translate(-0.5 * style.openNoteSize + 2, (position.string + 0.5) * style.stringSpacing);
        } else {
            const visibleFretIndex = position.fret - this.state.firstVisibleFret;
            ctx.translate((visibleFretIndex + 0.5) * this.state.fretSpacing, (position.string + 0.5) * style.stringSpacing);
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

        if (this.props.fretboardSettings.labels === 'notes') {
            ctx.fillText(note.id, 0, 8);
        }

        if (this.props.fretboardSettings.labels === 'scale-degrees') {
            ctx.fillText(scaleDegree.id, 0, 8);
        }

        ctx.restore();
    }

    private onClick(x: number, y: number) {
        if (!this.props.onClick || !this.canvas.current) {
            return;
        }

        const rect = this.canvas.current.getBoundingClientRect();
        x -= rect.left;
        y -= rect.top;

        y -= style.topMargin;

        if (this.props.fretboardSettings.openStrings) {
            x -= style.openNoteSize;
        }

        const string = Math.floor(y / style.stringSpacing);

        if (string < 0 || string >= this.props.contextSettings.tuning.stringCount) {
            return;
        }

        const fretIndex = Math.floor(x / this.state.fretSpacing);
        const openStringClicked = fretIndex < 0 && this.props.fretboardSettings.openStrings;
        const fret = openStringClicked ? 0 : this.state.firstVisibleFret + fretIndex;

        this.props.onClick({fret,  string});
    }
}

function fillCircle(ctx: CanvasRenderingContext2D, centerX: number, centerY: number, radius: number) {
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
    ctx.fill();
}
