# Calendar

Calendario/agendador de eventos hecho con Vue 3, TypeScript y Vite. Permite navegar entre meses, seleccionar un día y crear eventos con título, descripción y rango horario, validando que no se solapen con otros eventos del mismo día.

## Stack

- [Vue 3](https://vuejs.org/) (`<script setup>`) + [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) como bundler/dev server
- [Pinia](https://pinia.vuejs.org/) para el estado global
- [Vuelidate](https://vuelidate-next.netlify.app/) para validación de formularios
- CSS con capas [CUBE CSS](https://cube.fyi/) (sin frameworks de CSS)
- [Font Awesome](https://fontawesome.com/) (vía CDN) para iconos

## Requisitos

- Node.js y npm

## Scripts

```bash
npm install       # instalar dependencias
npm run dev       # servidor de desarrollo (Vite)
npm run build     # type-check (vue-tsc) + build de producción
npm run preview   # previsualizar el build de producción
npm run lint       # ESLint con --fix
npm run prettier   # Prettier --write sobre js/ts/vue/html/json
```

No hay test runner configurado en este proyecto.

## Arquitectura

Aplicación de una sola vista: `App.vue` monta directamente `module/calendar/Schedule.vue`, sin router.

### Alias de rutas

Definidos tanto en `tsconfig.json` como en `vite.config.ts`:

| Alias | Ruta |
|---|---|
| `@/*` | `src/*` |
| `@/module/*` | `src/module/*` |
| `@/interfaces/*` | `src/interfaces/*` |
| `@/constants/*` | `src/constants/*` |
| `@/components/*` | `src/components/*` |
| `@/types/*` | `src/types/*` |
| `@/utils/*` | `src/utils/*` |

### Estructura de carpetas

```
src/
├── components/      # Componentes reutilizables (Day, Journal, Notification)
├── constants/        # Constantes (días, meses, valores por defecto de schedule)
├── interfaces/        # Interfaces TypeScript (Day, Schedule, Notification)
├── types/             # Tipos de estado (Month, State)
├── utils/             # Utilidades (getDay)
├── module/
│   └── calendar/       # Módulo de feature: calendario + agenda
│       ├── Schedule.vue       # Vista principal (header, grilla, journal, modal)
│       ├── ScheduleForm.vue   # Formulario de alta de eventos
│       ├── store/              # Pinia stores del módulo
│       ├── validators/         # Reglas de Vuelidate
│       └── composable/         # Lógica de solapamiento de horarios
└── styles/            # CSS por capas (CUBE CSS)
```

### Estado (Pinia)

Hay dos stores, con una dependencia de una sobre la otra:

- **`month.store.ts`**: dueño del mes/fecha visible (`date`, `nextDate`/`prevDate`) y de la grilla de días (`getDays`). Para marcar qué días tienen eventos, consulta `hasSchedules` del store de schedules.
- **`schedules.store.ts`**: dueño de la lista de eventos (`schedules`), el día seleccionado (`day`), el borrador de evento en edición (`schedule`, atado al formulario), el estado del modal (`showModal`) y el estado de la notificación.

Los días se identifican con una clave de string generada por `src/utils/getDay.ts` (`"<día><mes><año>"`, ej. `"25720"` para el 25 del mes 7 —índice 0-based— de 2020), en vez de un objeto `Date`. Esa clave conecta una celda del calendario con sus eventos (`Schedule.day`) y es la que usan `setDay`, `hasSchedules` y `getDayInfo`.

### Validación de horarios

`module/calendar/composable/checkScheduleDisposition.ts` expone `hasTime`/`returnDate`, usado en dos lugares:

1. El validador de Vuelidate (`module/calendar/validators/ScheduleForm.ts`), que bloquea el submit si el rango horario se solapa con otro evento del mismo día.
2. Un `watch` en `ScheduleForm.vue` que dispara en vivo el aviso "you've another schedule on this time" a través del componente `Notification`.

### Estilos

`src/styles/index.css` declara las capas CUBE CSS (`@layer reset, tokens, composition, block, utility, exception;`) e importa cada hoja de estilos explícitamente:

- `tokens/` — design tokens (color, espaciado, tipografía, motion, layout)
- `composition/` — layout de composición (app, layouts)
- `blocks/` — estilos por bloque/componente (button, field, day, calendar, header, schedule-form, schedule-item, schedule-list, notification)
- `utilities/` — utilidades atómicas
- `animations.css` — animaciones

Los iconos son de Font Awesome, cargados vía CDN en `index.html`.
