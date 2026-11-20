# cartoon-explainer-video

**Turn a topic into a narrated 2D cartoon explainer video**, written in code and rendered to MP4 with voiceover, captions and sound.

It is for four kinds of content, each with its own fact-checking and storytelling rules:

| Content | What the video does |
|---|---|
| Issues (social, economic, everyday life) | Explains the mechanism behind a problem with visual metaphors and simple charts |
| Sports news | Gives context and reasons, not just the score; tactics as clean diagrams |
| History | One question, a chain of cause and effect, disputed points flagged |
| Philosophy | One concrete situation first, then the schools of thought, fairly |

**Visual language:** one narrator avatar who is part of the story (sits on words, jumps onto a full stop, runs after a line, pushes a chart), text as a physical prop, gentle transitions made by the avatar's own actions, and a pace that changes with the content instead of constant effects.

**Use it:** in Claude Code run the skill and answer one short brief: the topic, the one sentence viewers must remember, format (16:9 or 9:16) and length, narration language, and how you will get the voice. It researches with sources, writes the script and storyboard for you to approve, then builds the animation.

**What you get:** `research.md` (facts with links), `script.md`, `storyboard.md`, `video.html` (scrub it live), a fast draft MP4, then the final MP4 with audio, plus an `.srt` of the captions.

It never invents facts: a number appears on screen only if it is in the research notes with a source. The narrator is the user's own cartoon character, not a likeness of a real person and not anyone's logo or mascot.

**Requirements:** Node 18+, ffmpeg, Playwright (`npm i playwright`; set `CHROME_PATH` to an installed Chrome if the Chromium download is blocked). Works well with the repo's [`sound-effects`](../sound-effects/README.md) skill for the measured sound pass.

**What is inside:** [`SKILL.md`](SKILL.md) (the workflow), `references/` (one guide per content type, plus character system, typography motion, smooth transitions, editorial and philosophical pacing, the engine contract, voiceover and sound), `assets/avatar.js` (the narrator rig, drawn from the reference character sheet), `assets/character/` (37 separate SVG parts, a parts sheet, a pose sheet and the reference image) and `scripts/export-character.mjs` and `assets/template.html` (a working starter: the avatar sits, jumps, rides and runs on animated words), `scripts/render.mjs` (the renderer) and `scripts/inline.mjs` (bundle to one HTML file).

Built on the engine of [`explainer-engaging`](../explainer-engaging/README.md) and [`explainer-default`](../explainer-default/README.md).

## Licence

MIT. Renderer and helper functions come from this repo's explainer skills.
