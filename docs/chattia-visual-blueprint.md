# Chattia Visual Blueprint

This blueprint translates the OPS experience principles into a tangible interface for the Chattia assistant across desktop and mobile contexts. It assumes the existing on-device retrieval engine and floating action buttons remain intact while focusing on human-centered, compliant presentation.

## 1. Brand Narrative & Tone
- **Identity:** Chattia is positioned as the OPS Edge Copilot—calm, confident, and reassuring. Visuals adopt softened geometric forms echoing the OPS "shield" motif to signal trust and readiness.
- **Voice:** Microcopy stays clear and regulatory friendly. Primary statements reinforce data-handling policies (PCI DSS Req. 10 logging, GDPR/CCPA controls) without overwhelming the user.
- **Moodboard Keywords:** Aurora dusk gradient, electric indigo accents, deep slate neutrals, adaptive glow for focus states.

## 2. Core Layouts
### Floating Action Button (FAB) Entry Point
- **Shape:** 56px circular icon housing an outlined chat bubble with a subtle shield notch.
- **Default State:** Deep slate (`#111827`) body, indigo (`#4C51BF`) icon glyph, 12px drop shadow to elevate above content.
- **Hover/Focus:** Background shifts to indigo with white glyph; adds 1px cyan inner glow to reinforce accessibility focus ring.
- **Label Drawer (Desktop ≥ 901px):** Expands into a pill with text “Chat with Chattia” in semi-bold 15px font. Label fades in with 120ms ease-out.

### Welcome (Modal/Desktop) & Drawer (Mobile)
- **Container:** 480px width modal on desktop with 24px radius corners; mobile slides up from 64px off-screen resting height covering ~85% viewport height.
- **Header:**
  - Avatar: 64px circle gradient (`#312E81` → `#7C3AED`) with animated pulse every 12 seconds, indicating readiness.
  - Title: “Chattia Copilot” set in Inter SemiBold 20px (desktop) / 18px (mobile).
  - Compliance Chip: Right-aligned badge “PCI DSS Ready • CCPA Safe”.
- **Body:**
  - Primary prompt text 16px regular, referencing what Chattia can solve.
  - Quick action cards arranged in a 2x2 grid on desktop, single column on mobile. Cards include icons for “Security Posture Check”, “Activate Concierge”, “File Incident”, “Learn Ops Playbooks”.
  - Honeypot field remains visually hidden but is present after the action button for bot mitigation.
- **Input Zone:**
  - Rounded pill input with leading microphone icon button, central text field, trailing send button.
  - Mic button toggles hot-state with indigo fill and animated waveform bars using CSS transitions.
  - Send button only activates when text is present or voice dictation completes; otherwise remains muted grey with tooltip “Type a question to enable”.

## 3. Interaction Micro-Moments
- **On Launch:** Modal scales from 96% to 100% with 220ms ease; background blur applied to body at `backdrop-filter: blur(8px)` to maintain focus.
- **Response Streaming:** Chat bubbles reveal line-by-line (35ms delay) to mimic live synthesis. Compliance footnote fades in below each assistant response with icon `ⓘ` linking to security policy modal.
- **Escalation:** “Escalate to Specialist” CTA floats after three consecutive unresolved responses. Button opens contact modal with context summary prefilled.
- **Accessibility:**
  - Keyboard trap ensures focus stays inside modal; `aria-live="polite"` for streaming text.
  - High-contrast mode swaps background to pure white (`#FFFFFF`) and text to near-black (`#0B0D17`); gradient avatar shifts to monochrome outlines.
  - Speech features expose `aria-pressed` states and captions.

## 4. Theme Adaptation
- **Light Mode:**
  - Background: `#F9FAFB`; cards use subtle shadow `0 12px 24px -18px rgba(17, 24, 39, 0.35)`.
  - Accent: `#4338CA`; highlight glows in cyan `#22D3EE`.
- **Dark Mode:**
  - Background: `#0F172A`; card surfaces `#111C3A` with border `rgba(148, 163, 184, 0.24)`.
  - Text: `rgba(226, 232, 240, 0.92)`; accent gradient deepens (`#3730A3` → `#7C3AED`).
  - Input field retains 90% opacity fill to minimize glare; placeholder text toned to `rgba(148, 163, 184, 0.64)`.
- **Motion Reduction:** Prefers reduced motion to disable gradient pulsing, scaling transitions, and streaming animation (falls back to instant render).

## 5. Content States
- **First-Time:** Displays short primer with bullet list + “Learn how we safeguard data” link.
- **Returning:** Greets by time of day (e.g., “Good evening, welcome back to Chattia”). Offers button to resume last thread with timestamp.
- **Offline/Fallback:** Presents neutral illustration with message “Edge copilot offline. Try again or contact OPS Concierge.” Provides CTA to open email/phone fallback.
- **Security Lockdown:** When policy triggers a lock, modal header turns amber with lock icon and message “Conversation paused pending security verification.” Offers knowledge base links only.

## 6. Responsive Snapshots
- **Desktop (≥1200px):** Modal anchored center, quick actions grid 2x2, transcript area 320px tall, avatar and compliance chip share header row.
- **Tablet (768–1199px):** Drawer-style overlay; quick actions shift to 2 columns with 16px gap; compliance chip moves beneath title.
- **Mobile (≤767px):** Full-height sheet with sticky header; primary CTA buttons expand full width; floating mic button docks near keyboard.

## 7. Implementation Checklist
1. Extend existing `chatbot/widget.js` to load avatar gradients and compliance chip.
2. Add quick action card component referencing current OPS playbooks (`chatbot/views/QuickActions.js`).
3. Introduce motion-reduction media query and high-contrast tokens to `shared/styles/base.css`.
4. Wire escalation CTA to reuse `comm-us/contact.js` with context payload.
5. Localize new strings in English/Spanish JSON corpora and widget copy utilities.
6. Update analytics/telemetry to flag mic usage and escalation conversions for observability dashboards.

---
This visual blueprint keeps Chattia aligned with OPS CyberSec Core requirements, human-centered UX heuristics, and adaptive branding while remaining feasible for existing SPA and Next.js surfaces.
