# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Small web app (React 19 + MUI + Vite, TypeScript) that visualizes scales on a guitar fretboard. Hosted at https://logixisland.ch/learn-scales/ (hence `base: './'` in `vite.config.ts`).

## Commands

- `npm start` — Vite dev server on port 3000 (host exposed, polling file watch for the dev container)
- `npm run build` — `tsc` type-check, then `vite build` into `build/`
- `npm run preview` — serve the production build

There is no test runner or linter configured; `tsc` (via `npm run build`) is the only correctness check.

## Architecture

- `src/App.tsx` owns all state (`UserSettings`: frets range, label mode, root note, scale, tuning). On every render it builds a `Context`, computes in-scale positions, and maps them to `FretboardData[]` passed to `Fretboard`. `SettingsForm` edits the settings; there is no other state management.
- `src/model/` holds immutable value-object classes (`Note`, `Scale`, `ScaleDegree`, `Tuning`, `Position`) that are constructed from string ids, e.g. `Note.fromId('A0')`, `Scale.fromId('1-b3-4-5-b7')`, `Tuning.fromId('E2-A2-D3-G3-B3-E4')`. `Util.ts` provides `ValueObjectSet`, a set keyed on `equals()` (used as `PositionSet`).
- `src/model/Context.ts` is the core logic: given root + scale + tuning it maps a fretboard `Position` (string, fret) to a `Note` and `ScaleDegree`. Note spelling is derived from the scale degree (letter from the degree number, accidentals from the semitone difference), so enharmonics follow the scale. It scans frets 0–24 regardless of the displayed range; the `Fretboard` component clips to `firstFret`/`lastFret`.
- `src/components/Fretboard.tsx` renders the fretboard (styling constants in a `style` object at the top, including per-scale-degree colors); `SelectControl.tsx` is a generic MUI select wrapper used by `SettingsForm`.
