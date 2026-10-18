import Note from './model/Note';
import Scale from './model/Scale';
import Tuning from './model/Tuning';
import {UserSettings} from './components/SettingsForm';

const STORAGE_KEY = 'learn-guitar-scales.settings';

const defaultSettings: UserSettings = {
    firstFret: 0,
    lastFret: 15,
    labels: 'scale-degrees',
    root: Note.fromId('A0'),
    scale: Scale.fromId('1-b3-4-5-b7'),
    tuning: Tuning.fromId('E2-A2-D3-G3-B3-E4'),
};

function toRecord(settings: UserSettings): Record<string, string> {
    return {
        firstFret: String(settings.firstFret),
        lastFret: String(settings.lastFret),
        labels: settings.labels,
        root: settings.root.id,
        scale: settings.scale.id,
        tuning: settings.tuning.id,
    };
}

export const stringCounts = [4, 5, 6, 7, 8];

function fromRecord(stored: Record<string, string>): UserSettings {
    const firstFret = Number(stored.firstFret);
    const lastFret = Number(stored.lastFret);
    const tuning = Tuning.fromId(stored.tuning);

    // throw on invalid data so the caller falls back to other settings
    if (!Number.isInteger(firstFret) || !Number.isInteger(lastFret) || firstFret < 0 || lastFret > 24 || firstFret > lastFret) {
        throw new RangeError('Invalid fret range!');
    }
    if (!stringCounts.includes(tuning.stringCount)) {
        throw new RangeError('Unsupported string count!');
    }

    return {
        firstFret,
        lastFret,
        labels: stored.labels === 'notes' ? 'notes' : 'scale-degrees',
        root: Note.fromId(stored.root),
        scale: Scale.fromId(stored.scale),
        tuning,
    };
}

const URL_KEYS: Record<string, string> = {
    firstFret: 'ff',
    lastFret: 'lf',
    labels: 'l',
    root: 'r',
    scale: 's',
    tuning: 't',
};

const invertedUrlKeys = Object.fromEntries(Object.entries(URL_KEYS).map(([key, short]) => [short, key]));

function renameKeys(record: Record<string, string>, keys: Record<string, string>): Record<string, string> {
    return Object.fromEntries(Object.entries(record).map(([key, value]) => [keys[key] ?? key, value]));
}

export function settingsToUrl(settings: UserSettings): string {
    const url = new URL(window.location.href);
    url.search = new URLSearchParams(renameKeys(toRecord(settings), URL_KEYS)).toString();
    url.hash = '';
    return url.toString();
}

/** Settings from the URL query (a shared link) take priority over the saved ones. */
export function loadSettings(): UserSettings {
    try {
        const params = new URLSearchParams(window.location.search);
        if (params.has(URL_KEYS.scale)) {
            const settings = fromRecord(renameKeys(Object.fromEntries(params), invertedUrlKeys));
            // consume the link so later changes aren't overridden by it on reload
            window.history.replaceState(null, '', window.location.pathname);
            return settings;
        }
    } catch {
        // invalid link, fall through to the saved settings
    }
    try {
        const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? 'null');
        return stored ? fromRecord(stored) : defaultSettings;
    } catch {
        return defaultSettings;
    }
}

export function saveSettings(settings: UserSettings) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toRecord(settings)));
    } catch {
        // storage unavailable; settings just won't persist
    }
}
