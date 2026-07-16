# Mission Run

The core player experience. A Mission Run is one player's active playthrough of a mission — navigating to physical locations, completing tasks, and experiencing the branching narrative that responds to their outcomes.

---

## Overview

A Mission Run progresses linearly through Acts and Chapters, but the narrative branches based on task outcomes. There are no dead ends — success, partial completion, and failure each produce distinct story responses and write different flags to the run's state. The player always knows what to do next.

---

## Structure

```
MissionRun
  └── Act  (navigate to a Stop)
        └── Chapter  (intro narrative → tasks → outro narrative)
              └── ChapterTask  (pre-narrative → task → outcome narrative)
                    └── Task  (the action: GPS, photo, scan, answer, etc.)
```

---

## Flows

### Entering an Act
1. Player sees the Act introduction: setting context, narrative framing, and the Stop location on a map.
2. A GPS proximity check runs in the background. When the player enters the Stop radius, the first Chapter unlocks.
3. If GPS is unavailable or the player is stuck, a self-report override is available (with a soft warning).

### Running a Chapter
1. The chapter `intro_narrative` is shown as a story beat before any tasks begin.
2. Tasks within the chapter are presented in order. Each task shows its `pre_narrative` first.
3. The player completes the task (photo, scan, answer, etc.).
4. The outcome is evaluated server-side. The appropriate `outcomeNarrative` is shown immediately.
5. Outcome flags are written to `MissionRun.flags`.
6. The next task begins, or the chapter `outro_narrative` closes the chapter.

### Task Retries
If `task.config.retries_allowed` is set and the player does not succeed, they are offered a retry. Each attempt increments `_attempts_<chapterTaskId>` in `MissionRun.flags`. The outcome flag is only written on the final attempt (or first success).

### Story Beats
A `STORY_BEAT` task type shows narrative text only — no pass/fail. The player taps to continue. Story beats read `MissionRun.flags` via `StoryBeatVariant.conditions[]` to pick the correct variant (AND logic; top-to-bottom; first match wins).

### End of Act
After all chapters in an Act are complete, the Act summary flag is computed via `Act.summaryFlagConfig` threshold rules (e.g. `act1_outcome: good | neutral | bad`). This summary flag is written to `MissionRun.flags` and carries forward to later acts.

### Mission Completion
After all Acts are complete, the run is marked complete. A completion summary is shown: narrative outcome, flags earned (translated to human-readable text), and a prompt to rate or share the mission.

---

## Task Types

| Type | Player Action |
|---|---|
| `GPS_ARRIVAL` | Navigate to the Stop; auto-detected by proximity |
| `PHOTO_UPLOAD` | Take and upload a photo |
| `OBJECT_DETECTION` | Take and upload a photo; AI or moderator checks for a specific object |
| `QR_SCAN` | Scan a QR code at the location |
| `ANSWER_MATCH` | Answer a question (free text, multiple choice, or PIN) |
| `SELF_REPORT` | Self-declare completion; optional note required if configured |
| `TIME_WINDOW` | Complete within a configured time window |
| `COUNTDOWN` | Complete before a countdown expires |
| `CHOICE` | Make a choice from options; outcome determined by the choice |
| `STORY_BEAT` | Read narrative; tap to continue |

---

## UI States

- **Navigating** — map view with the Stop location; GPS proximity indicator
- **In chapter** — narrative + task UI; always shows progress (chapter X of Y)
- **Task active** — task-specific UI (camera, QR scanner, text input, etc.)
- **Outcome** — narrative feedback after task completion; distinct treatment for success / partial / fail
- **Retrying** — attempt counter shown; task UI re-presented
- **Story beat** — full-screen narrative; tap anywhere to continue
- **Act complete** — brief act outro + transition to next Act
- **Mission complete** — final narrative + completion summary
- **Offline** — task UI degrades gracefully; queued mutations shown; GPS still works

---

## Data Needs

- `MissionRun` — `id`, `agentId`, `missionId`, `status`, `flags`, `startedAt`, `completedAt`
- `ChapterTaskResult` — `id`, `missionRunId`, `chapterTaskId`, `outcome`, `submittedAt`, `payload` (photo URL, answer text, etc.)
- `ChapterTask` — `pre_narrative`, `outcomeFlags`, `outcomeNarratives`, `taskId`, `chapterId`
- `Task` — type, config (choices, answer, retries, GPS coords, etc.)
- `Act` — `stop_lat`, `stop_lng`, `stop_radius_m`, `summaryFlagConfig`
- `Chapter` — `intro_narrative`, `outro_narrative`

---

## Offline Behaviour

- Narrative content and task config are cached by the service worker when the mission is loaded.
- GPS arrival detection runs locally using the Geolocation API — no server round trip needed.
- Task submissions are queued in IndexedDB and replayed when connectivity returns.
- The player is shown a subtle offline indicator but is never blocked from continuing.
