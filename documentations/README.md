# Design Documentation

Layered pyramid: each tier narrows scope and increases detail.

```
Tier 1 — Vision          (why / what)
Tier 2 — System          (how the app is structured)
Tier 3 — Features        (how each feature works)
```

---

## Structure

| File / Folder | Tier | Purpose |
|---|---|---|
| `00-vision.md` | 1 — Vision | Product goals, principles, user types, non-goals |
| `01-system-architecture.md` | 2 — System | App layers, auth, data, storage, PWA, offline |
| `features/<feature>.md` | 3 — Features | Per-feature: flows, states, data needs, UI |

---

## Conventions

- Every doc opens with a one-paragraph summary (the "apex" of its local pyramid)
- Mermaid diagrams for flows, state machines, and entity relationships
- Use product terminology from `CLAUDE.md` throughout (Mission, Act, Chapter, Task, Stop, etc.)
