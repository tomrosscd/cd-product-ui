# Active work and handoff

Last updated: 8 September 2026. Update this file at each meaningful checkpoint and before stopping or handing off. Record completed checks separately from pending checks. Read AGENTS.md and the linked release documentation before editing.

## Current state

**0.3.1 is prepared and verified, on branch `feature/product-ui-0.3.1`, not yet pushed/PR'd/tagged.** It's a patch release from a full codebase audit: bug fixes, no public API changes. See CHANGELOG.md for the exact list and docs/validation.md for what was checked.

## Repository and branch

- Repository: https://github.com/tomrosscd/cd-product-ui
- Branch: `feature/product-ui-0.3.1` (started from `main` at commit 9d33f20, the closed-out 0.3.0 checkpoint)
- All work is committed in five commits: quick fixes (docs/hardcoded-path/a11y/href-guard/component-reuse), jsx-a11y lint addition, CI/Dependabot/governance/coverage/backward-compat-policy, ROADMAP.md, and the version bump to 0.3.1.
- Not yet pushed to origin, no PR opened, no tag created.

## Exact next steps

1. Push `feature/product-ui-0.3.1` to origin and open a PR into `main`.
2. This is the first PR that will actually run the new `.github/workflows/ci.yml` — watch it, since it's never executed on GitHub's runners before (only reproduced locally). If it fails for an environment reason (not a real bug), fix the workflow, don't disable the check.
3. Get it reviewed (the user does this) before merging.
4. After approval: merge, tag `v0.3.1`, rebuild the archive from that tag. No stable-install-instruction changes needed beyond what's already in this branch (README already points at v0.3.1).
5. Ask the user to update CONSUMERS.md with their coworker's actual project name/contact once known — it currently has a placeholder row.

## What NOT to do next

Do not start on ROADMAP.md items (the naming/consistency refactor, new components) without the user explicitly asking — they were deliberately deferred, not forgotten. The naming refactor specifically is breaking and needs a CONSUMERS.md check first per docs/release-process.md.

## References and boundaries

- Original Convert logo archive: /Users/tomross/Downloads/Convert_Logos_2024 (2) 2.zip. Raw downloads were copied unchanged into assets/brand with SHA256 hashes recorded in src/brand-assets.ts.
- Preserve original Koko reference projects, all versions including V8, and the website project byte for byte. No writes to them.
- Brand Hub planning is in the sibling convert-brand-hub repository (latest planning commit c769b4f at last check). No Brand Hub application build is authorised from this repository.
- Brand serif Denton x Condensed is never used in Product UI; Roobert with Geist fallback remains the UI font.
- The Brand Hub will be the real internal-tool example. Do not add authentication, databases or a duplicate full admin application to Product UI.
- No sub-agents unless the user asks. No unsolicited remote publishing or licence/font distribution changes.
- A coworker's project already depends on this package (per the user, 8 September 2026) — see CONSUMERS.md and the backward-compatibility policy in docs/release-process.md before shipping anything breaking.
