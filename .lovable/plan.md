# LIEN PHAT logo polish

## Changes
- Make the existing 32px header and Business Hub logo containers circular while preserving their current size, spacing, image scaling, and clean borderless treatment.
- Replace the AI CORE Sparkles icon with the existing LIEN PHAT logo as a centered, low-opacity watermark behind the unchanged center text.
- Keep all AI CORE orbit geometry, dragging, connectors, animation, cursor spotlight behavior, and responsive layout unchanged.

## Technical details
- Add circular clipping only to the two existing logo wrappers.
- Remove the now-unused Sparkles import from the AI CORE component.
- Layer the decorative core image beneath a positioned text stack using pointer-safe styling and proportional sizing.

## QA
- Check at 1366px desktop and 390px mobile for circular logos, watermark visibility, text readability, and overflow.
- Verify an AI CORE module still drags and snaps back with aligned connectors.
- Verify the desktop cursor spotlight remains active and browser console stays clean.
- Do not publish.