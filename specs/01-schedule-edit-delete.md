# SPEC 01 — Edición y eliminación de eventos

> **Status:** Implemented
> **Depends on:** —
> **Date:** 2026-08-27
> **Objective:** Permitir editar un evento pulsando su título en la lista y eliminarlo con un botón de papelera confirmado por diálogo.

## Por qué existe este spec

El calendario solo sabe crear. Una vez creado un evento no hay forma de corregir una hora mal puesta ni de quitarlo, lo que obliga a recargar la página para volver al estado semilla. Este spec cierra el CRUD sobre `schedules`.

## Scope

**Dentro:**

- Pulsar `.schedule-item-time` (el `<h2>` con título + rango horario) abre el formulario existente precargado con los datos de ese evento.
- El formulario distingue modo alta de modo edición: `<h1>` pasa de `New Schedule` a `Edit Schedule` y el botón de `add` a `update`.
- Guardar en modo edición reemplaza el evento en `schedules` conservando su `id`, sin crear uno nuevo.
- Cerrar el formulario con el FAB descarta la edición: resetea el borrador a `SCHEDULE` y sale del modo edición.
- La validación de solapamiento horario ignora el propio evento que se está editando.
- Botón de papelera `<i class="far fa-trash-alt">` en cada item de la lista, en un área `actions` nueva del grid de `.schedule-item`.
- Ese botón abre un `<dialog>` nativo de confirmación con el título y el rango del evento, y botones `cancel` / `delete`.
- Confirmar elimina el evento vía `removeSchedule(id)`, que hoy es código muerto.
- El componente `Notification` se monta también fuera del formulario para poder mostrar `Schedule deleted` y `Schedule updated`. La instancia externa solo se renderiza cuando el formulario está cerrado, para que nunca haya dos banners a la vez sobre el mismo estado del store.
- Simplificación de la condición de solapamiento de `hasTime`: se dejan solo los términos que aportan, sin cambiar el comportamiento observable.
- Cambiar de día con el formulario abierto sale del modo edición y cierra el diálogo de borrado, para que la validación de solapamiento nunca compare contra el día equivocado.
- El botón de papelera se añade como hijo directo de `.schedule-item`, sin envolver ni reordenar items, para no romper el ciclo de color `:nth-child(3n+…)` ni la geometría del punto `::before` y el conector `::after`.

**Fuera de alcance (para futuros specs):**

- Persistencia de los eventos entre recargas (localStorage o backend). Hoy el estado vive solo en memoria.
- Deshacer un borrado.
- Edición o borrado múltiple / selección de varios items.
- Mover un evento a otro día desde el formulario (el campo `day` sigue tomándose del día seleccionado).
- Variante `data-variant="danger"` genérica para `.button` más allá de lo que necesite el diálogo.
- Rediseñar el modelo horario de `checkScheduleDisposition.ts` (el truco de `Date.parse('01/01/1999 ' + hora)`, los eventos que cruzan medianoche). La simplificación que sí entra no cambia el comportamiento.

## Modelo de datos

`Schedule` (`src/interfaces/schedule.interface.ts`) no cambia. `id?: number` ya existe y ya se genera con `Date.now()` en `addSchedule`.

Se amplía `State` (`src/types/State.type.ts`) con dos campos:

```ts
type State = {
  day: string
  schedule: Schedule
  showModal: boolean
  schedules: Schedule[]
  notification: INotification
  editingId: number | null // id del evento en edición; null = modo alta
  pendingDeleteId: number | null // id pendiente de confirmar borrado; null = diálogo cerrado
}
```

Convenciones:

- `editingId` es la única fuente de verdad del modo del formulario. No se infiere de `schedule.id`.
- `pendingDeleteId` gobierna la apertura del `<dialog>`; el componente lo observa y llama a `showModal()` / `close()`.
- El borrador `schedule` sigue siendo el objeto atado a `v-model`; en edición se rellena con una **copia** (`{ ...item }`), nunca con la referencia del array.

## Plan de implementación

1. **Store — estado y acciones.** En `src/module/calendar/store/schedules.store.ts` añadir `editingId` y `pendingDeleteId` al estado (y a `State.type.ts`), más las acciones `editSchedule(schedule)` (copia el evento al borrador y fija `editingId`), `updateSchedule()` (reemplaza por `id` en `schedules`, resetea borrador y `editingId`), `cancelEdit()` (resetea borrador y `editingId`) y `confirmDelete(id)` / `dismissDelete()` sobre `pendingDeleteId`. Limpiar el `reactive()` innecesario de `removeSchedule`. Nada visible aún; la app sigue funcionando.

2. **Composable — exclusión del propio evento y limpieza de la condición.** En `src/module/calendar/composable/checkScheduleDisposition.ts` cambiar la firma a `hasTime(from, to, ignoreId?: number)` y saltar en el `forEach` el evento cuyo `id` coincida. El tercer argumento es opcional, así que la llamada actual de `ScheduleForm.vue` sigue compilando. En la misma pasada reducir las tres cláusulas del `if` a la única canónica de solapamiento, `sTo > new_from && sFrom < new_to`: la primera (`sFrom > new_from && sTo < new_from`) es inalcanzable porque implicaría `sTo < sFrom`, y la tercera (`sFrom < new_from && sTo > new_to`) ya está contenida en la segunda. Es una simplificación sin cambio de comportamiento. Test manual: crear un evento solapado sigue bloqueándose; crear uno que empieza justo cuando termina otro sigue permitiéndose.

3. **Validador — pasar el id.** En `src/module/calendar/validators/ScheduleForm.ts`, el validador `hasTime(to, { from })` recibe el modelo completo como segundo argumento; leer de ahí también el id del evento en edición y pasarlo a `hasTime`. Test manual: la validación de alta sigue bloqueando solapamientos.

4. **Formulario — modo dual.** En `src/module/calendar/ScheduleForm.vue`, derivar un `isEditing` de `editingId`, cambiar el `<h1>` y el `value` del botón según ese flag, y enrutar el click a `updateSchedule()` o `addSchedule()`. Test manual: el alta sigue igual, porque `editingId` es `null`.

5. **Cancelar al cerrar y al cambiar de día.** En `src/module/calendar/Schedule.vue`, el click del FAB llama a `cancelEdit()` además de `toggleModal()` cuando el modal se está cerrando. Además, `setDay` en el store limpia `editingId` y `pendingDeleteId` y resetea el borrador con el nuevo `day`, de modo que `hasTime` (que recorre `getScheduler`, es decir el día seleccionado) nunca valide contra un día distinto del que se está editando. Test manual: abrir el formulario en edición, pulsar otro día de la grilla, el formulario queda en modo alta.

6. **Lista — abrir edición.** En `src/components/Journal.vue`, `@click` en `.schedule-item-time` que llama a `editSchedule(scheduler)` y abre el modal. Añadir `role="button"` y `tabindex="0"` con `@keydown.enter`/`@keydown.space` para que sea accesible. Test manual: pulsar un título abre el formulario con los datos y `Edit Schedule` en la cabecera; guardar actualiza el item en la lista sin duplicarlo.

7. **Lista — botón de papelera.** Añadir en `Journal.vue` un `<button class="icon-button">` con `<i class="far fa-trash-alt">` y `aria-label`, dentro de un contenedor con `grid-area: actions`, que llama a `confirmDelete(scheduler.id)`. Test manual: el botón aparece alineado a la derecha ocupando ambas filas.

8. **Estilos del item.** En `src/styles/blocks/schedule-item.css`, ampliar el `grid-template` de `.schedule-item` a dos columnas con las áreas `hour actions` / `description actions` y colocar el nuevo bloque. Cuidado: `.schedule-item` cicla color por `:nth-child(3n+…)` y dibuja el punto `::before` y el conector `::after` en posición absoluta — no envolver los items en un contenedor nuevo ni cambiar su orden en el DOM. Seguir la skill `css-guidelines` (capas, propiedades lógicas, tokens L/C/H).

9. **Diálogo de confirmación.** Nuevo componente `src/components/ConfirmDelete.vue` con `<dialog class="confirm-dialog">`, montado una vez en `Schedule.vue`. Un `watch` sobre `pendingDeleteId` llama a `showModal()` / `close()`; el evento `close` nativo llama a `dismissDelete()` para cubrir la tecla Esc. Muestra el título y el rango horario del evento pendiente. `cancel` cierra; `delete` llama a `removeSchedule(id)` y cierra.

10. **Estilos del diálogo.** Nuevo `src/styles/blocks/confirm-dialog.css` en la capa `block`, importado en `src/styles/index.css` respetando el orden alfabético/existente, con `::backdrop`. Reutilizar `.button` con `data-variant="primary"` para el confirmar y `.icon-button` o un botón neutro para el cancelar.

11. **Notification fuera del formulario.** Montar `Notification` también en `Schedule.vue` (fuera de `.schedule-form`) para que sea visible con el modal cerrado, y emitir `setNotification` con `Schedule deleted` tras borrar y `Schedule updated` tras actualizar, ambas con `type: 'info'` y `hasVisible: true`. Las dos instancias comparten el mismo `store.notification`, así que la externa se monta con `v-if="!showModal"`: con el formulario abierto manda la de dentro, con el formulario cerrado manda la de fuera, y nunca se ven dos banners simultáneos.

12. **Limpieza final.** `npm run lint`, `npm run prettier` y `npm run build` (type-check con `vue-tsc`) sin errores.

## Criterios de aceptación

- [x] Pulsar el título de un evento abre el formulario con `title`, `description`, `from` y `to` precargados.
- [x] Con el formulario en modo edición, la cabecera dice `Edit Schedule` y el botón dice `update`.
- [x] Guardar en modo edición deja la lista con el mismo número de eventos y con los datos nuevos.
- [x] Guardar un evento en edición sin cambiar sus horas **no** dispara el aviso de solapamiento.
- [x] Editar un evento y ponerle un rango que pisa a otro evento del mismo día sí bloquea el botón `update`.
- [x] Cerrar el formulario con el FAB durante una edición y volver a abrirlo muestra el formulario vacío y la cabecera `New Schedule`.
- [x] Tras editar, crear un evento nuevo sigue funcionando y genera un `id` distinto.
- [x] Cada item de la lista muestra un botón con el icono de papelera visible (`far fa-trash-alt`).
- [x] Pulsar la papelera abre un `<dialog>` que nombra el evento afectado y no borra nada todavía.
- [x] `cancel` y la tecla Esc cierran el diálogo dejando el evento intacto.
- [x] `delete` elimina el evento de la lista y cierra el diálogo.
- [x] Borrar el último evento de un día quita el marcador de día ocupado en la grilla del calendario.
- [x] Tras borrar se ve la notificación `Schedule deleted` con el formulario cerrado.
- [x] El título del evento es accesible por teclado: recibe foco y se activa con Enter.
- [x] Los colores ciclados del item y la línea conectora entre items siguen renderizándose igual que antes.
- [x] Con el formulario abierto en edición, pulsar otro día de la grilla deja el formulario en modo alta y con los campos vacíos.
- [x] Nunca se ven dos banners de notificación a la vez: con el formulario abierto solo aparece el de dentro. **Nota:** tras el [ajuste 4](#ajustes-post-implementación) hay una única instancia de `Notification` (`<Teleport>`), así que esto se cumple por construcción — no hay una segunda instancia que pueda coexistir.
- [x] Tras simplificar `hasTime`, crear un evento que empieza exactamente cuando termina otro sigue permitido, y uno que pisa un minuto sigue bloqueado.
- [x] `npm run build` termina sin errores de tipos.

## Decisiones

- **Sí:** modal de confirmación antes de borrar. Elegido por el usuario frente al borrado directo; el borrado es irreversible porque no hay persistencia ni deshacer.
- **Sí:** `<dialog>` nativo con `::backdrop`. Aporta top-layer, atrapado de foco y cierre con Esc sin código propio.
- **No:** reutilizar el patrón de panel deslizante de `.schedule-form` para el diálogo. Habría exigido implementar a mano la accesibilidad que `<dialog>` ya da.
- **Sí:** `editingId` explícito en el store en vez de deducir el modo de `schedule.id`. Un `id` residual en el borrador daría un modo ambiguo.
- **Sí:** copiar el evento al borrador (`{ ...item }`) en vez de editar la referencia del array. Sin la copia, cerrar el formulario dejaría los cambios a medias ya aplicados en la lista.
- **Sí:** parámetro opcional `ignoreId` en `hasTime`. Sin él, editar un evento siempre chocaría consigo mismo y `update` quedaría permanentemente deshabilitado.
- **Sí:** área `actions` nueva en el grid de `.schedule-item`. Elegido por el usuario frente a meter la papelera dentro de `.schedule-item-time`, cuyo `space-between` ya está ocupado por el rango horario.
- **Sí:** montar `Notification` fuera del formulario. Hoy solo existe dentro de `ScheduleForm.vue`, invisible con el modal cerrado, que es justo el estado en que se borra.
- **Sí:** icono `far fa-trash-alt`. El pedido original era `fa fa-trash-o`, sintaxis de Font Awesome 4; el proyecto carga FA 5.13 (`index.html:14`), donde esa clase no renderiza. `far fa-trash-alt` es su equivalente visual de contorno.
- **No:** bajar el CDN a Font Awesome 4 para conservar `fa-trash-o` literal. Retroceder una major por un icono no compensa.
- **No:** deshacer el borrado. Requiere una pila de historial; va en su propio spec si se pide.
- **No:** persistencia. Es ortogonal a este spec y de mayor calado.

## Riesgos

Los cuatro riesgos detectados durante el análisis tienen su mitigación **dentro** del alcance de este spec, no diferida.

| Riesgo | Mitigación (en alcance) |
| --- | --- |
| Tocar el DOM de `.schedule-item` rompe el ciclo de color `:nth-child(3n+…)` y la geometría del punto `::before` y el conector `::after` | Paso 7: la papelera entra como hijo directo del item, sin envolver ni reordenar. Criterio de aceptación que verifica los tres colores y la línea. |
| `hasTime` recorre `getScheduler`, es decir el día seleccionado; cambiar de día durante una edición haría validar contra el día equivocado | Paso 5: `setDay` limpia `editingId`, `pendingDeleteId` y el borrador. Criterio de aceptación propio. |
| Dos instancias de `Notification` sobre el mismo `store.notification` mostrándose a la vez | Paso 11: la instancia externa se monta con `v-if="!showModal"`. Criterio de aceptación propio. **Superado:** ver [Ajustes post-implementación](#ajustes-post-implementación) — se pasó a una única instancia con `<Teleport>`. |
| Las tres cláusulas del `if` de solapamiento incluyen una inalcanzable y otra redundante, lo que dificulta razonar sobre la validación al añadir `ignoreId` | Paso 2: se reducen a la condición canónica `sTo > new_from && sFrom < new_to` antes de añadir la exclusión. Criterio de aceptación que fija el comportamiento en los bordes. |

Riesgo residual asumido: `returnDate` parsea las horas contra la fecha fija `01/01/1999`, así que un evento que cruce medianoche se evalúa mal. Es preexistente y queda fuera de alcance.

## Lo que **no** entra en este spec

- Persistencia de los eventos entre recargas.
- Deshacer un borrado.
- Selección y borrado múltiple.
- Cambiar el día de un evento desde el formulario.
- Rediseñar el modelo horario de `checkScheduleDisposition.ts` (fecha fija `01/01/1999`, eventos que cruzan medianoche). Sí entra la simplificación de la condición de solapamiento, que no cambia el comportamiento.

Cada una de esas, si llega, va en su propio spec.

## Ajustes post-implementación

Encontrados y resueltos durante pruebas manuales en la rama `spec-01-schedule-edit-delete`, después de completar el plan de 12 pasos. No estaban previstos en el plan original; se registran aquí para dejar rastro de por qué el código quedó distinto de lo descrito arriba.

1. **Bug: navegar de mes y ver el día quedaron rotos.** Al montar `Notification` fuera del formulario (paso 11) sin contenedor posicionado, el `<div class="notification">` (`position: absolute; inline-size: 100%; block-size: 100%`) heredaba el contexto de posicionamiento del ancestro más cercano y terminaba cubriendo gran parte de la pantalla — invisible (`opacity: 0`) pero seguía interceptando clics. Fix: `pointer-events: none` por defecto en `.notification`, `pointer-events: auto` solo en `[data-state='visible']` (`src/styles/blocks/notification.css`). Ver también el ajuste 4, que eliminó por completo la necesidad de envolverlo.

2. **Papelera: solo ícono, color acorde al título.** El `<button>` de borrar heredaba el estilo nativo del navegador (no hay reset de `button` en `reset.css`). Se añadió `appearance: none; background: none; border: none; font: inherit;` a `.icon-button` (`src/styles/blocks/button.css`). El color pasó de `--color-neutral` fijo a `var(--item-color)` (la misma variable que cicla el color del título), con un estado `:hover` que oscurece igual que el resto de los botones (`src/styles/blocks/schedule-item.css`).

3. **Diálogo de confirmación: centrado, botón cancelar visible, botones a ancho igual.**
   - El reset global (`* { margin: 0 }`) anulaba el `margin: auto` que el UA aplica a `<dialog>` para centrarlo. Fix: `position: fixed; inset: 0; margin: auto;` explícito en `.confirm-dialog`.
   - `cancel` usaba `.icon-button` (texto blanco/neutral) sobre un diálogo de fondo blanco: invisible. Se añadió una variante `[data-variant='accent']` a `.button` (mismo patrón que `primary`, con canales de `accent`) y `cancel` pasó a usarla.
   - `.confirm-dialog-actions > *` recibió `flex: 1` para que ambos botones repartan el ancho, separados por el `gap` existente.
   (`src/styles/blocks/confirm-dialog.css`, `src/styles/blocks/button.css`, `src/components/ConfirmDelete.vue`).

4. **Notificaciones unificadas en un solo toast.** El diseño original de dos instancias (una en el `<h1>` del formulario, otra fuera con `v-if="!showModal"`) producía tamaños y posiciones distintas para el mismo tipo de aviso. Se reemplazó por una única instancia de `Notification`, envuelta en `<Teleport to="body">` (para escapar del ancestro transformado `.schedule-form`, que si no redefine el *containing block* de cualquier descendiente `position: fixed`), montada siempre en `Schedule.vue`. `.notification` pasó de `position: absolute` (100% del ancestro) a `position: fixed` con tamaño intrínseco (`inline-size: max-content; max-inline-size: min(90dvi, 25rem)`), esquina superior derecha. Se retiraron `.l-banner` (composición) y `u-relative` del `<h1>` del formulario, ya innecesarios. El keyframe `show-notification` se simplificó (ya no anima `block-size` de 0 a 100%, que solo tenía sentido con el modelo anterior). (`src/components/Notification.vue`, `src/module/calendar/Schedule.vue`, `src/module/calendar/ScheduleForm.vue`, `src/styles/blocks/notification.css`, `src/styles/composition/layouts.css`, `src/styles/animations.css`).

5. **Posición del toast: distinta en pantallas pequeñas y grandes.** En viewports angostos, el toast en la esquina superior derecha quedaba encima de los botones de mes. Se le dio `inset-block-start: calc(var(--space-l) + var(--space-m))` (despeja la altura del `.header`) por defecto, y `@media (width >= 55rem) { inset-block-start: var(--space-s) }` para restaurar el offset original en pantallas anchas, mismo *breakpoint* usado en el resto del proyecto.

6. **Auto-cierre de los toasts persistentes.** `Schedule updated` y `Schedule deleted` se muestran con `close: true` (botón `×`) pero no se ocultaban solos. `setNotification` (`schedules.store.ts`) ahora agenda un `setTimeout` de 4000 ms que fuerza `hasVisible: false` cuando `show.close && show.hasVisible`, cancelando cualquier temporizador pendiente en cada llamada para evitar carreras entre notificaciones sucesivas.

7. **Punto de "ocupado" en días con eventos: posición inconsistente.** El `::after` del punto rojo estaba anclado a `.day-number`, cuya caja cambia de tamaño entre un día normal (`100%` de la celda) y el día actual (badge fijo de `--today-marker-size`, 2.5em). Eso dejaba el punto pegado al número en "hoy" pero lejos, al borde inferior de la celda, en cualquier otro día. Fix: el `::after` se ancló a `.day` y se calculó su posición como un offset fijo desde el centro vertical de la celda (`inset-block-start: calc(50% + var(--today-marker-size, 2.5em) / 2)`), igual para todos los días — reutiliza el mismo token del badge de "hoy" en vez de inventar un valor nuevo. (`src/styles/blocks/day.css`).

8. **`no-undef` desactivado en ESLint.** `ConfirmDelete.vue` usa el tipo global `HTMLDialogElement` para tipar el `ref` del `<dialog>`. El proyecto no declara entorno `browser` en `eslint.config.js`, así que `no-undef` (de `js.configs.recommended`) lo marcaba como no definido pese a ser válido TypeScript. Se desactivó la regla (`eslint.config.js`) — es redundante en un proyecto TS, donde el compilador ya cubre ese chequeo.
