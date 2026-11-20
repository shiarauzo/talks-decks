# Microinteracciones y movimiento

Guion de práctica para una charla de 60 minutos.

## Tesis

> Sin reglas, el movimiento se decide a ojo.

Taste en motion es un sistema: propósito, frecuencia, duración y curva.

## Resultado

Al terminar, la audiencia puede:

1. Nombrar qué hace buena o mala una microinteracción.
2. Elegir duration y easing sin adivinar.
3. Aplicar 5 patrones (press, origin, stagger, transitions, frequency).
4. Salir con un checklist accionable para el siguiente PR de UI.

## Cronograma

| Slides | Contenido | Tiempo |
| --- | --- | ---: |
| 1–2 | Título + reglas del calentamiento | 2:00 |
| 3–6 | 4 pares A/B en loop (votar) | 7:00 |
| 8 | Respuestas del calentamiento | 2:00 |
| 9–11 | Mapa + tesis | 4:00 |
| 12–13 | Qué es / propósito | 7:00 |
| 14–19 | Buenas vs malas (demos) | 10:00 |
| 20–27 | Duration, easing, bezier, transform | 18:00 |
| 28–31 | Patrones + checklist | 12:00 |
| 33–39 | Vocabulario clickable (easing → feedback) | 8:00 |
| 40 | Cierre | 3:00 |
|  | **Total** | **60:00** |

## Guion

### Slide 1 — 1:00

> Hoy no vamos a decorar pantallas. Vamos a aprender a decidir cuándo mover
> algo, cuánto, con qué curva, y cuándo no animar nada.

### Slide 2 — 1:00

> Antes de teoría: calentamos el ojo. Cuatro pares en loop. A y B. Voten con
> la mano cuál se siente mejor. No revelo todavía qué cambia.

### Slide 3 — 1:30 — Easing

Modal en loop. A = ease-in. B = ease-out. Misma duración.

> ¿Cuál se siente más responsiva? Manos por A… manos por B.

### Slide 4 — 1:30 — Duration

> Misma curva. ¿Cuál hace que la app se sienta más rápida?

### Slide 5 — 1:30 — Scale

> ¿Cuál aparece con más naturalidad?

### Slide 6 — 1:30 — Origin

> ¿Cuál parece salir del botón?

### Slide 7 — 1:30 — Stagger

> ¿Cuál entrada se siente más ordenada?

### Slide 8 — 0:30 — Diferencias

> Solo el título. En voz: ease-out, scale suave, origin en el trigger, stagger.
> Ahora les ponemos nombre.

### Slide 9 — 1:00

> Mapa de la hora. El calentamiento ya pasó; ahora nombramos lo que sintieron.

### Slide 10 — 2:30

> Sin reglas, el movimiento se decide a ojo. Hoy salimos con un sistema:
> propósito, frecuencia, duración y curva.

Referencia: animations.dev — taste explicado con razones (ease-out, 180ms,
springs, scale 0.97, o ninguna animación).

### Slide 4 — 4:00

> Microinteracción = un momento con un solo trabajo. Trigger, rules, feedback,
> loops. Like, toggle, toast, press, validación de un campo.

### Slide 5 — 4:00

> Antes de codear motion: ¿para qué existe? Feedback, estado, espacio,
> explicación, o evitar un salto. Si solo “queda cool” y se ve 100 veces al
> día: no animes.

### Slide 6 — 1:00

> Ahora vamos a sentir la diferencia. Misma intención, distinto craft.

### Slide 7 — 2:30

Demo press. Pedir que miren la izquierda y la derecha.

> La derecha confirma que la UI escuchó. La izquierda se siente muerta o
> perezosa. ROI más alto del día: `scale(0.97)` en `:active`.

### Slide 8 — 3:00

Abrir ambos dropdowns.

> Misma familia de duración. ease-in empieza lento; el usuario espera. ease-out
> empieza rápido; se siente snappy. Nunca ease-in para UI iniciada por el
> usuario.

### Slide 9 — 2:00

> Perceived performance. El spinner rápido no acorta la red. Cambia cómo se
> siente la app. Un select a 180ms gana a uno a 400ms.

### Slide 10 — 2:00

> Nada en el mundo real aparece desde cero. Empieza en 0.95 + opacity. El
> objeto ya tiene cuerpo.

### Slide 11 — 2:30

> Frecuencia manda. Command palette / atajos: sin animación. Raycast no anima
> al abrir. Keyboard-initiated: no animes.

### Slide 12 — 1:00

> Basics: duration, easing, curves, bezier, transform. Vocabulario para dejar
> de decir “se siente raro”.

### Slide 13 — 3:00

Recorrer la tabla.

> UI bajo 300ms. Press 100–160. Tooltip 125–200. Dropdown 150–250. Modal puede
> subir. Si dudas, acorta.

### Slide 14 — 1:00

> La duración dice cuánto. El easing dice cómo se reparte: acelera, frena o
> constante.

### Slides 15–18 — 4:00

Una curva por slide:
- **linear** — velocidad constante
- **ease-in** — empieza lento; evitar en UI
- **ease-out** — empieza rápido; default
- **ease-in-out** — acelera y frena; morphs

### Slide 19 — 2:00

> Blueprint: entra/sale → out. Morph → in-out. Hover → ease. Constante →
> linear. Default → out.

### Slide 16 — 4:00

> Bezier te da precisión. Las built-in son débiles. Tokens:

```css
--ease-out: cubic-bezier(0.23, 1, 0.32, 1);
--ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
--ease-drawer: cubic-bezier(0.32, 0.72, 0, 1);
```

Recurso: easing.dev

### Slide 17 — 3:00

> Anima transform y opacity. Evita width/height/top/left y `transition: all`.

### Slide 18 — 3:00

> translateY(%) relativo al propio elemento. scale afecta hijos.
> transform-origin: popovers desde el trigger; modales en centro.

### Slide 19 — 3:00

Abrir ambos popovers.

> El de la derecha se siente causado por el botón. Ese detalle invisible, en
> agregado, hace que el producto se sienta caro.

### Slide 20 — 1:00

> Patrones: recetas, no librerías.

### Slide 21 — 2:00

> Press feedback. Si solo implementan un patrón hoy, que sea este.

### Slide 22 — 2:30

Replay del stagger.

> Chunks semánticos. Delays 30–80ms. Exit más sutil que enter.

### Slide 23 — 2:30

Nombrar rápido: transitions interruptibles, tooltips instant en serie, enter
lento / exit rápido, blur 2px, springs para gestos.

### Slide 24 — 1:30

Pausar para foto del checklist.

### Slide 25 — 0:30 + Q&A

Abrir preguntas. Si sobra tiempo: live-fix de un componente de alguien.

## Controles del deck

| Tecla | Acción |
| --- | --- |
| → · Espacio · clic | Siguiente |
| ← | Anterior |
| N | Notas |
| F | Fullscreen |

## Ensayo

1. Correr `bun run dev` y recorrer demos una vez en silencio.
2. Cronometrar bloque 02 (demos) y bloque 03 (teoría); son los que se alargan.
3. Preparar un ejemplo de producto propio (toast, modal, botón) para el Q&A.
