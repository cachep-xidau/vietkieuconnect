
# Plan: UI/UX Fixes for VietKieuConnect

**Goal:** Address critical UI/UX issues identified in the review to improve trust, accessibility, and mobile experience.

## Phase 1: Visual Polish & Mobile Layout (Priority: High)
- [ ] **Fix Mobile "Blue Glow"**
    -   **Context:** The side glow effect (`box-shadow` or `background-image`) is too intense on mobile (<768px), causing a tunnel vision effect.
    -   **Action:** Modify `globals.css` or logical layout wrapper to disable or significantly reduce this effect on mobile breakpoints.
    -   **Verification:** Check mobile view; content should extend closer to edges without visual noise.

- [ ] **Accessibility Contrast Fixes**
    -   **Context:** Footer links and secondary buttons use light grey text that fails contrast checks.
    -   **Action:** 
        -   Update Footer link colors to `text-gray-600` or darker (light mode).
        -   Update "Cách Hoạt Động" button text/border to ensure legibility.
    -   **Verification:** Run contrast checker; text must be readable.

## Phase 2: Trust Signals & Content (Priority: High)
- [ ] **Add Clinic Placeholder Images**
    -   **Context:** Clinic cards feel like wireframes without images.
    -   **Action:** 
        -   Add high-quality medical/dental placeholder images to `public/images/placeholders/`.
        -   Update `ClinicCard` component to display these images if specific clinic data is missing.
    -   **Verification:** Clinic directory should look populated and professional.

## Phase 3: Mobile Interactions (Priority: Medium)
- [ ] **Refine "How it Works" Section**
    -   **Context:** Steps are too large vertically on mobile.
    -   **Action:** Refactor the mobile layout of this section to use a horizontal scroll snap (carousel) or a compact vertical timeline.
    -   **Verification:** Information density on mobile should be higher; less scrolling required.

- [ ] **Enhance "View Profile" Buttons**
    -   **Context:** Buttons are too subtle.
    -   **Action:** Apply a clearer button style (e.g., `variant="outline"` or `variant="secondary"` from shadcn/ui) to make them distinct CTA targets.

## Agents & Skills
- **Agent:** `frontend-developer`
- **Skills:** `ui-ux-pro-max`, `tailwind-patterns`, `react-patterns`

## Verification Checklist
- [ ] Mobile view does not feel cramped (Glow removed).
- [ ] All text is easily readable (Contrast fixed).
- [ ] Clinic directory looks trustworthy (Images added).
- [ ] Mobile navigation through "How it works" is smooth.
