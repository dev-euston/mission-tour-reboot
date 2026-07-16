# Story Builder

The creator tool for assembling tasks into a mission's full narrative structure. This is where the spy thriller, detective story, or walking tour comes alive — wrapping story-agnostic tasks in narrative context at every level.

---

## Overview

The Story Builder lets creators compose the Mission → Act → Chapter → ChapterTask hierarchy and author narrative text at each level. The creator brings the voice; the tasks provide the real-world actions. The Story Builder is where those two things are joined.

Any signed-in agent can access the Story Builder. Reputation tier affects how submitted missions are treated in moderation — not whether the tool is available. Revenue sharing eligibility for Architect-tier creators is the one exception: it is gated on tier, not on the tool itself.

---

## Flows

### Create a Mission
1. Creator enters the mission title, mission brief (shown to players on the browse screen), and an estimated duration.
2. Creator sets the reputation tier required to play the mission.
3. Mission is saved as a draft. Acts can now be added.

### Add an Act
1. Creator pins a Stop on a map (lat/lng) and sets the arrival radius.
2. Creator names the act (internal label) and optionally writes act-level narrative framing.
3. Creator configures `summaryFlagConfig`: the threshold rules that compute the act's summary flag at completion (e.g. "if 2 or more success flags → good; if 1 → neutral; if 0 → bad").
4. Chapters can now be added to the Act.

### Add a Chapter
1. Creator writes the chapter `intro_narrative` (shown to the player before any tasks in the chapter).
2. Creator writes the chapter `outro_narrative` (shown after all tasks in the chapter are complete).
3. Tasks can now be placed into the Chapter.

### Place a Task (ChapterTask)
1. Creator selects a task from their library or the community task library.
2. Creator writes the `pre_narrative` — the story context shown to the player before the task begins.
3. Creator configures `outcomeFlags`: for each outcome code (`1` = success, `2` = partial, `3` = fail), which flag name to write to `MissionRun.flags`.
4. Creator writes `outcomeNarratives`: for each outcome code, the narrative text shown to the player immediately after the task resolves.
5. The ChapterTask is saved. The creator can reorder tasks within the chapter.

### Story Beat Variants
For `STORY_BEAT` task placements, the creator can define multiple narrative variants. Each variant has a set of conditions (flag name + expected value pairs). At runtime, the first matching variant is shown. A default (no conditions) is shown if no variant matches.

### Preview & Publish
1. Creator can preview the mission in a read-only walkthrough that shows the narrative text at each level.
2. When ready, the creator submits the mission for moderation review.
3. A moderator approves or rejects the submission. Approved missions are published and visible to players.

---

## Narrative Hierarchy

```
Mission
  Brief: "You've been tasked with recovering a stolen data chip..."

  Act 1  (Stop: 1.285°N, 103.856°E, radius 50m)
    Act narrative framing: "The drop point is Raffles Place MRT..."
    summaryFlagConfig: { good: ≥2 success flags, neutral: 1, bad: 0 }

    Chapter 1  (intro: "Blend in. Do not make eye contact.")
      ChapterTask 1
        pre_narrative: "There's a newspaper on the bench. Check the crossword."
        task: ANSWER_MATCH (answer: "CIPHER")
        outcomeFlags: { "1": "act1_cipher_found", "3": "act1_cipher_missed" }
        outcomeNarratives:
          "1": "You find the code. Your handler will be pleased."
          "2": "Close — but you're not sure. Press on."
          "3": "Nothing. Either it's gone or you missed it."
      outro: "Time to move before anyone notices."
```

---

## UI States

- **Mission draft** — editable; no player access
- **Act / Chapter / ChapterTask** — each has its own edit panel in the builder; reorderable via drag
- **Flag config panel** — visual editor for outcomeFlags and summaryFlagConfig; shows a live flag name preview
- **Preview mode** — read-only narrative walkthrough; no task interaction
- **Submitted for review** — locked; awaiting moderator decision
- **Revision requested** — unlocked with moderator feedback; creator can edit and resubmit
- **Published** — live; read-only in the builder

---

## Data Needs

- `Mission` — `title`, `brief`, `estimatedDurationMinutes`, `reputationTierRequired`, `status`, `createdBy`
- `Act` — `missionId`, `stopLat`, `stopLng`, `stopRadiusM`, `summaryFlagConfig: Json`, `order`
- `Chapter` — `actId`, `introNarrative`, `outroNarrative`, `order`
- `ChapterTask` — `chapterId`, `taskId`, `preNarrative`, `outcomeFlags: Json`, `outcomeNarratives: Json`, `order`
- `StoryBeatVariant` — `chapterTaskId`, `conditions: Json[]`, `narrative`, `order`
- Status flow: `draft → pending_review → approved | rejected → published`
