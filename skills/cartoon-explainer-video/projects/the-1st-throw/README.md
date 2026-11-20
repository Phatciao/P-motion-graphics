# THE 1ST THROW — animatic (90 s)
Engine: `skills/cartoon-explainer-video` (page with `window.seek(t)`).
Render: `CHROME_PATH=/usr/bin/google-chrome node ../../scripts/render.mjs video.html out.mp4 30 1 4`
Scrub live: open `video.html`. Timing tables are at the top of the script (CLOSES, SEGS, REV).

## Scene map (global seconds)
01 0-6 empty · 02 6-12 P1 arrives · 03 12-15 close-up throw · 04 15-21 P1 leaves · 05 21-28 P2 notices (long pause)
06 28-32 close-up (hesitates) · 07 32-39 P2 leaves, P3 arrives (short pause) · 08 39-43 close-up
09 43-57 five wide/close cycles, shrinking pauses · 10 57-67 wide, close, wide (no hesitation)
11 67-77 static result · 12 77-90 reverse, P1 frozen before release, black, end card

## Assets
Placeholders drawn in code: 9 flat passer-by specs (SPEC), 6 prop types (item()), pile = items 0..8 added in order (states 1-9), street set.
## Assumptions / limits
- Animatic quality: placeholder flat shapes, synthesized sound (wind, footsteps, thumps), no real sound files yet.
- Salty is NOT used: the brief forbids a narrator/hero and needs distinct passers-by.
- Montage uses time jumps (new person starts mid-stride); pile has 9 items max.
- Reverse: wide steps remove items, two reversed close-ups; not every close-up is rewound.
- Not yet checked: smoothness of leave/turn animation frame by frame; final polish, real foley.
