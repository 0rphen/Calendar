# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

- `npm run dev` — start Vite dev server
- `npm run build` — type-check (`vue-tsc --noEmit`) then production build
- `npm run preview` — preview production build
- `npm run lint` — ESLint with `--fix`
- `npm run prettier` — Prettier `--write` across js/jsx/ts/tsx/vue/html/json

No test runner is configured in this repo.

## Architecture

Single-page Vue 3 + TypeScript + Vite calendar/scheduling app using Pinia for state and Vuelidate for form validation. No router — `App.vue` renders `module/calendar/Schedule.vue` directly.

**Path aliases** (`@/*` etc., defined in both `tsconfig.json` and `vite.config.ts`): `@/module`, `@/interfaces`, `@/constants`, `@/components`, `@/types`, `@/utils` all resolve under `src/`.

**Feature module vs. shared components**: calendar-specific logic lives under `src/module/calendar/` (Schedule.vue, ScheduleForm.vue, its own `store/`, `validators/`, `composable/`). Generic/reusable pieces live at the top level: `src/components/` (Day, Journal, Notification), `src/constants/`, `src/interfaces/`, `src/types/`, `src/utils/`.

**Two Pinia stores with a dependency between them**:
- `month.store.ts` owns the visible month/date and derives the day grid (`getDays`), pulling `hasSchedules` from the schedules store to flag which days have entries.
- `schedules.store.ts` owns the schedule list, the currently selected `day`, the in-progress `schedule` draft (bound to the form), the create/delete modal state, and the notification banner state.

Days are identified by a string key from `src/utils/getDay.ts` (`"<day><month><year>"`, e.g. `"25720"`), not a Date object — this key links a calendar cell to its schedules (`Schedule.day`) and is what `setDay`/`hasSchedules`/`getDayInfo` all key off of.

**Scheduling conflict check**: `module/calendar/composable/checkScheduleDisposition.ts` exposes `hasTime`/`returnDate`, used both by the Vuelidate validator (`module/calendar/validators/ScheduleForm.ts`) to block overlapping time ranges on submit, and by `ScheduleForm.vue`'s watcher to drive the live "you've another schedule on this time" notification.

**Styling**: CSS follows CUBE CSS layering (`@layer reset, tokens, composition, block, utility, exception;` in `src/styles/index.css`), with design tokens (`styles/tokens/`), composition-level layout (`styles/composition/`), and per-block stylesheets (`styles/blocks/`) each imported explicitly. Icons are Font Awesome (`<i class="fa ...">`), loaded via `index.html`. Before touching any styling, follow the `css-standards` skill rules (see global instructions) rather than improvising.
