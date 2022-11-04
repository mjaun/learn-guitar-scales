import {ExerciseController} from "../components/exercise";
import {FretboardSettings} from "../components/fretboard";
import {Scale} from "../model/scale";
import {ScaleDegree} from "../model/scale-degree";
import {FretboardData} from "../model/fretboard-data";
import {Note} from "../model/note";
import {Tuning} from "../model/tuning";

export class MarkDegreeExercise implements ExerciseController {
    private readonly fretboardSettings: FretboardSettings;
    private readonly scale: Scale;
    private readonly tuning: Tuning;

    private currentDegree: ScaleDegree;

    constructor(fretboardSettings: FretboardSettings, scale: Scale, tuning: Tuning) {
        this.fretboardSettings = fretboardSettings;
        this.scale = scale;
        this.tuning = tuning;
        this.currentDegree = this.scale.degrees[0];
    }

    get name(): string {
        return "Mark Degree";
    }

    nextQuestion(): { question: string; degree: ScaleDegree; note: Note } {
        const availableDegrees = this.scale.degrees.filter(degree => degree.value !== this.currentDegree.value);
        this.currentDegree = availableDegrees[Math.floor(Math.random() * availableDegrees.length)];

        return {
            question: `In the key of ${this.scale.root.name}, where do you find the ${this.currentDegree.text}?`,
            degree: this.currentDegree,
            note: this.scale.noteFromDegree(this.currentDegree),
        };
    }

    validateAnswer(selection: FretboardData): boolean {
        const correct = new FretboardData(this.tuning);
        correct.setDegree(this.currentDegree, this.scale);
        correct.clip(
            this.fretboardSettings.firstFret,
            this.fretboardSettings.lastFret,
            this.fretboardSettings.openStrings
        );

        return selection.equals(correct);
    }

}
