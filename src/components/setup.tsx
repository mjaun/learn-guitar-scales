import React from "react";
import {Fretboard, FretboardSettings} from "./fretboard";
import {Note} from "../model/note";
import {Scale} from "../model/scale";
import {FretboardData} from "../model/fretboard-data";
import {ExerciseController} from "./exercise";

type Props = {
    fretboardSettings: FretboardSettings,
    onFretboardSettingsChanged: (fretboardSettings: FretboardSettings) => void,
    scale: Scale,
    controllers: {[index: string]: ExerciseController},
    onScaleChanged: (scale: Scale) => void,
    onStart: (exercise: string) => void,
}

export class Setup extends React.Component<Props> {
    static getDefaultFretboardSettings(): FretboardSettings {
        return {
            firstFret: 5,
            lastFret: 8,
            openStrings: false,
            labels: 'scale-degrees',
            pattern: false,
        }
    };

    static getDefaultScale(): Scale {
        return new Scale(Note.fromName('A'), 'minor-pentatonic');
    }

    private inputs = {
        exercise: React.createRef<HTMLSelectElement>(),
        scale: React.createRef<HTMLSelectElement>(),
        root: React.createRef<HTMLSelectElement>(),
        firstFret: React.createRef<HTMLSelectElement>(),
        lastFret: React.createRef<HTMLSelectElement>(),
        openStrings: React.createRef<HTMLInputElement>(),
        showDegrees: React.createRef<HTMLInputElement>(),
        pattern: React.createRef<HTMLInputElement>(),
    };

    render() {
        const rootNoteOptions = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];
        const fretOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

        const fretboardForm = (
            <form>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="select-scale">Scale</label>
                            <select className="form-control"
                                    id="select-scale"
                                    ref={this.inputs.scale}
                                    value={this.props.scale.name}
                                    onChange={this.onScaleChanged.bind(this)}>
                                <option value="root-fifth">Root + Fifths</option>
                                <option value="major-arpeggio">Major Arpeggio</option>
                                <option value="minor-arpeggio">Minor Arpeggio</option>
                                <option value="dominant-arpeggio">Dominant Arpeggio</option>
                                <option value="major-pentatonic">Major Pentatonic</option>
                                <option value="minor-pentatonic">Minor Pentatonic</option>
                                <option value="ionian">Ionian</option>
                                <option value="dorian">Dorian</option>
                                <option value="phrygian">Phrygian</option>
                                <option value="lydian">Lydian</option>
                                <option value="mixolydian">Mixolydian</option>
                                <option value="aeolian">Aeolian</option>
                                <option value="locrian">Locrian</option>
                                <option value="chromatic">Chromatic</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="select-root">Root Note</label>
                            <select className="form-control"
                                    id="select-root"
                                    ref={this.inputs.root}
                                    value={this.props.scale.root.name}
                                    onChange={this.onScaleChanged.bind(this)}>
                                {rootNoteOptions.map(value => <option key={value}>{value}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label>Options</label>
                            <div className="form-check">
                                <input type="checkbox"
                                       className="form-check-input"
                                       id="check-open-strings"
                                       ref={this.inputs.openStrings}
                                       checked={this.props.fretboardSettings.openStrings}
                                       onChange={this.onFretboardSettingsChanged.bind(this)}/>
                                <label className="form-check-label" htmlFor="check-open-strings">Show Open
                                    Strings</label>
                            </div>
                            <div className="form-check">
                                <input type="checkbox"
                                       className="form-check-input"
                                       id="check-show-degrees"
                                       ref={this.inputs.showDegrees}
                                       checked={this.props.fretboardSettings.labels === "scale-degrees"}
                                       onChange={this.onFretboardSettingsChanged.bind(this)}/>
                                <label className="form-check-label" htmlFor="check-show-degrees">Show Scale
                                    Degrees</label>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="select-first-fret">First Fret</label>
                            <select className="form-control"
                                    id="select-first-fret"
                                    ref={this.inputs.firstFret}
                                    value={this.props.fretboardSettings.firstFret}
                                    onChange={this.onFretboardSettingsChanged.bind(this)}>
                                {fretOptions.map(value => <option key={value}>{value}</option>)}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="select-last-fret">Last Fret</label>
                            <select className="form-control"
                                    id="select-last-fret"
                                    ref={this.inputs.lastFret}
                                    value={this.props.fretboardSettings.lastFret}
                                    onChange={this.onFretboardSettingsChanged.bind(this)}>
                                {fretOptions.map(value => <option key={value}>{value}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
            </form>
        );

        const exerciseForm = (
            <form>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="select-exercise">Exercise</label>
                            <select className="form-control"
                                    id="select-exercise"
                                    ref={this.inputs.exercise}>
                                {Object.keys(this.props.controllers).map(key =>
                                    <option key={key} value={key}>{this.props.controllers[key].name}</option>
                                )}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <div className="form-group">
                            <label>Options</label>
                            <div className="form-check">
                                <input type="checkbox"
                                       className="form-check-input"
                                       id="check-show-pattern"
                                       ref={this.inputs.pattern}
                                       checked={this.props.fretboardSettings.pattern}
                                       onChange={this.onFretboardSettingsChanged.bind(this)}/>
                                <label className="form-check-label" htmlFor="check-show-pattern">Show Scale
                                    Pattern</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        <button type="submit" className="btn btn-primary" id="button-start"
                                onClick={this.onStart.bind(this)}>
                            Start
                        </button>
                    </div>
                </div>
            </form>
        );

        const fretboardData = new FretboardData();
        fretboardData.setScale(this.props.scale);
        fretboardData.clip(
            this.props.fretboardSettings.firstFret,
            this.props.fretboardSettings.lastFret,
            this.props.fretboardSettings.openStrings
        );

        return (
            <div id="setup">
                <Fretboard
                    settings={this.props.fretboardSettings}
                    data={fretboardData}
                />

                <div id="setup-fretboard" className="card">
                    <div className="card-body">
                        <h5 className="card-title">Fretboard</h5>
                        {fretboardForm}
                    </div>
                </div>

                <div id="setup-exercise" className="card">
                    <div className="card-body">
                        <h5 className="card-title">Exercise</h5>
                        {exerciseForm}
                    </div>
                </div>
            </div>
        );
    }

    private onFretboardSettingsChanged() {
        if (this.inputs.firstFret.current && this.inputs.lastFret.current && this.inputs.showDegrees.current &&
            this.inputs.openStrings.current && this.inputs.pattern.current) {
            this.props.onFretboardSettingsChanged({
                firstFret: parseInt(this.inputs.firstFret.current.value),
                lastFret: parseInt(this.inputs.lastFret.current.value),
                labels: this.inputs.showDegrees.current.checked ? "scale-degrees" : "notes",
                openStrings: this.inputs.openStrings.current.checked,
                pattern: this.inputs.pattern.current.checked,
            });
        }
    }

    private onScaleChanged() {
        if (this.inputs.root.current && this.inputs.scale.current) {
            this.props.onScaleChanged(new Scale(
                Note.fromName(this.inputs.root.current.value),
                this.inputs.scale.current.value
            ));
        }
    }

    private onStart() {
        if (this.inputs.exercise.current) {
            this.props.onStart(this.inputs.exercise.current.value);
        }
    }
}
