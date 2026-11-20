---
name: cartoon-explainer-video
description: >-
  Make a 2D cartoon explainer video from a topic, rendered from code to MP4 with voiceover, captions and sound. Covers four kinds of content, explaining an issue (social, economic, everyday life), sports news, history and philosophy, each with its own way of checking facts and telling the story. Use this whenever someone wants an explainer video, a narrated animation, a story video, a sports recap, a history or philosophy video, a script plus storyboard plus animation, or says "làm video giải thích", "video hoạt hình kể chuyện", "explainer có nhân vật", even if they do not name the skill. Handles research with sources, narration script, storyboard, consistent cartoon characters, camera moves, captions timed to the voice, and the final render.
---

# Cartoon explainer video

Turns a topic into a 60–180 s narrated 2D cartoon video (default 90 s). The viewer should understand **one idea** by the end and want to reach the end. Everything below serves those two things.

It is built on the same engine as the repo's explainer skills: one HTML page that draws any frame from a time value (`seek(t)`), rendered to MP4 with its own audio by `scripts/render.mjs`. What is new here is the part those skills do not have: research and facts, a spoken narration, and a visual language of its own.

## The visual language (three rules that shape every scene)

1. **Gentle, purposeful transitions.** Avoid zooms, shakes, rotations, glitches, flying text and rapid reframing. The viewer follows the content, not the effects. Scenes are joined by an action of the character or an object, and some elements carry across so everything lives in one world.
2. **The avatar is part of the story.** One character runs through the whole video and acts on the text and objects: sits on a word, leans on a title, jumps onto a full stop, runs after a line, drags a word into place, pushes a chart. Not a talking head in the corner.
3. **Animation serves meaning.** Every movement has a storytelling reason. Having a line of narration does not mean something must move; sometimes the character just sits on a word, looks at the viewer or stands still for a few seconds. That restraint is the personality.

## Read what you need, when you need it

| When | Read |
|---|---|
| Always, first | `references/pipeline.md` (steps and file formats) |
| Pick **one** by content | `vande-doisong.md` (issues), `the-thao.md` (sports), `lich-su.md` (history), `triet-hoc.md` (philosophy), all in `references/` |
| Before building the page | `references/character-system.md` (the avatar, its parts and the pose/expression API), `typography-motion.md`, `smooth-transitions.md`, then `engine.md`; start from `assets/template.html` (it uses `assets/avatar.js`) |
| Pacing by content | `references/editorial-explainer.md` for issues, sports and history; `references/philosophical-motion.md` for philosophy |
| More technique and visual metaphors | `references/cartoon-animation.md` |
| Voice, timing, sound | `references/voiceover-and-sound.md` |
| Project already uses Remotion | `references/remotion-build.md` instead of the HTML engine |

## Step 1: Get the brief (one message, then go)

Ask everything in **one** message, then work on your own. Only the topic is required; decide anything left blank yourself and say what you chose.

1. **Topic**, and the **one sentence** the viewer must remember.
2. **Content type**: issue, sports, history or philosophy (guess from the topic if not said).
3. **Format and length**: 16:9 (1920×1080) or 9:16 (1080×1920); default 16:9, 90 s.
4. **Language** of narration and captions (default: the language the person writes in).
5. **Voice**: they record it, you generate it with a connected voice tool, or none yet (silent draft plus a script to record).
6. **Look**: characters or palette they already have (a character sheet, brand colours, earlier videos), or "you decide".
7. **Sources or links** they want used, and anything to avoid.

If they gave links, read them first. Otherwise research in Step 2.

## Step 2: Research, script, storyboard, then stop for review

Follow `references/pipeline.md`: `research.md` (facts with links), `script.md` (narration, counted), `storyboard.md` (scene table). If the person is present, **stop here and let them approve the script and storyboard**. Changing a sentence costs seconds, changing finished animation costs the whole render.

Facts come before animation. For anything current (sports results, prices, policies, news) search the web and note the date; for history and philosophy cross-check at least two sources for dates, names and anything attributed to a person.

## Step 3: Build the page

Copy `assets/template.html` and `assets/avatar.js` into the project (the avatar is the person's character rigged from their reference sheet; to look at all poses and expressions open `assets/character/sheet.html`, and the separate SVG parts are in `assets/character/parts/`) and replace the phrases, props and the `hero(t)` path with the storyboard. The template already stages the example line "The problem is not what we know. It's what we fail to question.": the avatar sits on a question mark, jumps onto the word KNOW, is carried along as it slides away, runs to QUESTION, tilts its head and pauses. Keep to the page contract in `references/engine.md`. Build the avatar's path as a chain of short acts, each tied to a spoken word, each with a preparation and a landing (`references/character-system.md`). Text is a prop with real width and a surface to stand on (`references/typography-motion.md`). Camera stays nearly still; it drifts, it does not zoom or cut (`references/smooth-transitions.md`).

Do not make one rhythm for every topic. Sports speeds up at the climax and slows for tactics; history travels along timelines and maps; philosophy is sparse and still. Set the density of avatar actions from the content type before you write the path.

To ship one file, run `node scripts/inline.mjs video.html out.html` (it inlines `avatar.js`); `render.mjs` works on either.

Put the beat sheet as a comment at the top of the page: time, what the viewer sees, which sound.

## Step 4: Sound

Voiceover first, then real sound-effect files, then music underneath (`references/voiceover-and-sound.md`). Scene lengths come from the **real voice file**, not from estimates. If the `sound-effects` skill is available, use it for the measured sound pass instead of mixing by feel.

## Step 5: Check, render, deliver

Setup once: `npm i playwright`, then `npx playwright install chromium`; ffmpeg on the PATH. If the Chromium download is blocked, point `CHROME_PATH` at an installed Chrome and run the same commands.

1. **Stills**: `node scripts/render.mjs video.html check.png --stills 0.5,2,…` with one time per beat-sheet row. Look at the sheet. Fix anything clipped, overlapping, unreadable, off-model or empty, then check again. Captions must never cover a character's face or a key number.
2. **Draft**: `node scripts/render.mjs video.html draft.mp4 30 1 4`. Send it with the HTML and the script, and ask for changes before the final.
3. **Final**: `node scripts/render.mjs video.html video.mp4 60 4 8` (motion blur multiplies render time by the subframe count; say so before starting, a 90 s final can take a long time). For a hand-drawn feel use 24 fps and 1 subframe.
4. **Deliver**: the MP4, the HTML (they can scrub it), `script.md`, an `.srt` of the captions, the source list, and a short note on what is placeholder and what to change for a second version. Offer one alternative in a sentence (vertical cut, another language).

## Rules

- **Never invent facts.** No made-up statistics, results, dates, quotes or sources. A number appears on screen only if it is in `research.md` with a source; otherwise draw it as a relative shape. The placeholder numbers in the template are examples, replace them. When sources disagree, say so in the narration.
- **Characters are original and consistent.** One narrator avatar for the whole video and series: the person's own character from their reference sheet (`assets/character/`, rigged in `assets/avatar.js`). Keep its look unchanged; vary only expression and pose. Stylised cartoon characters rather than lifelike drawings of real people, and no logos, club badges, kits or characters that belong to someone else. Real names still appear in narration and on-screen text.
- **One idea, one thing to look at.** Each scene has one focus and one line of caption. Pace follows the content (see above), not a fixed cut rate; leave a pause after each important idea.
- **Restraint first.** If a movement would not be missed when removed, remove it.
- **Hook in the first 5 seconds**, not a greeting.
- **Real sound files only**, never beeps synthesised in code. Check licences before publishing and write the credits.
- **Sensitive topics** (violence in history, politics, health, money): calm tone, show the sides fairly, no advice for an individual's decision, no jokes at someone's expense.
