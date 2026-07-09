# Entrenador Base 50 / Conti V2.31

Aplicación web/PWA para practicar el sistema Base 50 / Conti en billar a tres bandas.

## Actualización V2.31

- Las jugadas del curso comienzan desde el Capítulo 2: Práctica básica.
- Se agregaron 7 jugadas seleccionables en el modal del curso y en la mesa interactiva:
  1. Jugada 1: 40 = 50 - 10 · 01:30 a 01:50
  2. Jugada 2: 30 = 50 - 20 · 02:10 a 02:25
  3. Jugada 3: 20 = 50 - 30
  4. Jugada 4: 5 = 50 - 45 · 05:40 a 05:50
  5. Jugada 5: 0 = 50 - 0 · 08:00 a 08:13
  6. Jugada 6: 0 = 60 - 0 · 09:20 a 09:30
  7. Jugada 7: 50 = 60 - 10 · 10:10 a 10:25
- Al seleccionar una jugada en el modal, el video cambia al Capítulo 2 y se ubica en el tiempo indicado.
- En escritorio se usa Google Drive; en móviles se usa YouTube.
- Al seleccionar una jugada en la mesa, se configuran salida, llegada, entrada/ataque, efecto, potencia y posición inicial.

## Publicación

Subir todos los archivos a GitHub Pages. Las rutas son relativas y funcionan incrustadas en Google Sites mediante iframe.

V2.32: Jugada 3 sincronizada en Capítulo 2 de 03:10 a 03:21.


V2.33: se limpió la lectura visual de la mesa dejando únicamente la trayectoria/rastro de la bola blanca con sus proyecciones; las bolas roja y amarilla conservan física, colisiones y sonidos, pero no dibujan líneas de trayectoria.


V2.34: Se corrigió la lógica especial de la cuña/0 en la banda de ataque: desde salida 50 apuntando al ataque 0, la llegada se configura en 50. La Jugada 5 del capítulo 2 queda como llegada 50 = salida 50 - ataque 0, conservando la fórmula principal Entrada/Ataque = Salida - Llegada.

Actualización V2.35: la simulación de la bola blanca ahora sigue la ruta matemática Base 50/Conti. En la cuña, Salida 50 con Ataque 0 llega exactamente a Llegada 50.


V2.36: la ruta guiada ahora continúa después del contacto con la banda de llegada mediante una proyección de rebote real; la bola blanca no se detiene en la llegada y conserva conteo correcto de bandas.

## V2.37
- Jugada 5 del Capítulo 2 recalibrada fotograma a fotograma para salida 50, ataque 0/cuña y llegada 50.
- La segunda banda corta se ubica casi simultánea a la cuña, no a media banda.
- Después de la llegada 50 se proyecta el rebote hacia la zona de carambola como en el video.
- Se ajustaron bolas objetivo para practicar esa jugada de forma más parecida al Cap. 2, 08:00–08:13.


## V2.38
- Movimiento de bolas más natural: aceleración inicial, pérdida de velocidad por rodamiento, rebote con pérdida de energía, impulso realista a roja y amarilla y trayectoria blanca más fluida.
