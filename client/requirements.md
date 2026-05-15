## Packages
framer-motion | Page transitions and smooth interactive animations
canvas-confetti | Celebration effect on passing the assessment
@types/canvas-confetti | TypeScript definitions for canvas-confetti

## Notes
App relies on localStorage for persisting multi-step form state (Profile -> Resume -> Assessment).
The assessment expects GET /api/questions to return an array of 60 questions.
