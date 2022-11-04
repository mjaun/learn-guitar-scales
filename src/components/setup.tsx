import React from "react";
import {Fretboard, FretboardSettings} from "./fretboard";
import {Note} from "../model/note";
import {Scale} from "../model/scale";
import {FretboardData} from "../model/fretboard-data";
import {Tuning} from "../model/tuning";

type Props = {
    fretboardSettings: FretboardSettings,
    onFretboardSettingsChanged: (fretboardSettings: FretboardSettings) => void,
    scale: Scale,
    onScaleChanged: (scale: Scale) => void,
    tuning: Tuning,
    onTuningChanged: (tuning: Tuning) => void,
}

export class Setup extends React.Component<Props> {
    static getDefaultFretboardSettings(): FretboardSettings {
        return {
            firstFret: 5,
            lastFret: 8,
            openStrings: false,
            labels: 'scale-degrees',
        }
    };

    static getDefaultScale(): Scale {
        return new Scale(Note.fromName('A'), 'minor-pentatonic');
    }

    static getDefaultTuning() {
        return Tuning.fromString('E-A-D-G-B-E');
    }

    private inputs = {
        exercise: React.createRef<HTMLSelectElement>(),
        tuning: React.createRef<HTMLSelectElement>(),
        scale: React.createRef<HTMLSelectElement>(),
        root: React.createRef<HTMLSelectElement>(),
        firstFret: React.createRef<HTMLSelectElement>(),
        lastFret: React.createRef<HTMLSelectElement>(),
        openStrings: React.createRef<HTMLInputElement>(),
        showDegrees: React.createRef<HTMLInputElement>(),
    };

    render() {
        const rootNoteOptions = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb'];
        const fretOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24];

        const fretboardForm = (
            <form>
                <div className="row">
                    <div className="col-md-6">
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
                    </div>
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
                    </div>
                    <div className="col-md-6">
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
                    <div className="col-md-6">
                        <div className="form-group">
                            <label htmlFor="select-scale">Tuning</label>
                            <select className="form-control"
                                    id="select-tuning"
                                    ref={this.inputs.tuning}
                                    value={this.props.tuning.toString()}
                                    onChange={this.onTuningChanged.bind(this)}>
                                <option value="E-A-D-G-B-E">E Standard</option>
                                <option value="Eb-Ab-Db-Gb-Bb-Eb">{Note.fromName('Eb').text} Standard</option>
                                <option value="D-G-C-F-A-D">D Standard</option>
                                <option value="C-F-Bb-Eb-G-C">C Standard</option>
                                <option value="B-E-A-D-F#-B">B Standard</option>
                                <option value="D-A-D-G-B-E">Dropped D</option>
                                <option value="C-G-C-F-A-D">Dropped C</option>
                                <option value="B-F#-B-E-G#-C#">Dropped B</option>
                            </select>
                        </div>
                    </div>
                    <div className="col-md-6">
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
                </div>
            </form>
        );

        const fretboardData = new FretboardData(this.props.tuning);
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
            </div>
        );
    }

    private onFretboardSettingsChanged() {
        if (this.inputs.firstFret.current && this.inputs.lastFret.current && this.inputs.showDegrees.current &&
            this.inputs.openStrings.current && this.inputs.tuning.current) {
            this.props.onFretboardSettingsChanged({
                firstFret: parseInt(this.inputs.firstFret.current.value),
                lastFret: parseInt(this.inputs.lastFret.current.value),
                labels: this.inputs.showDegrees.current.checked ? "scale-degrees" : "notes",
                openStrings: this.inputs.openStrings.current.checked,
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

    private onTuningChanged() {
        if (this.inputs.tuning.current) {
            this.props.onTuningChanged(Tuning.fromString(this.inputs.tuning.current.value));
        }
    }
}
