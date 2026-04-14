# Global Instructions

These instructions apply to every project I work on. Project-specific
`CLAUDE.md` files may override or extend anything here.

## Project Context

- This is my AI agent workspace. I use it for account research, SPM/ICM
  market research, content and PPTX slide creation, creation of outreach
  campaigns and general productivity workflows.

## About Me

- I am a sales VP that prospects into accounts, finds insights based on
  the broader SPM/ICM market, tries to put interesting outreach and
  sales collateral together that will teach them something and give
  them perspective into which SPM technologies might be the right
  fitting application based on their needs. Where possible I want to
  use industry and vertical benchmarks, I prefer clear, jargon-free
  output. I like clear and modern collateral that is visual and backed
  up by data metrics where possible or inferred.

## Rules

- Always ask clarifying questions before starting a complex task
- Show your plan and steps before executing
- Keep reports and summaries concise — bullet points over paragraphs
- Use clean and modern visuals with data benchmarks when possible
- Save all output files to the output folder
- Cite sources when doing research

## Project Structure

- `workflows/` — Workflow instruction files (plain English recipes the
  agent follows)
- `output/` — Finished deliverables (reports, PPTX, drafts, analysis)
- `resources/` — Reference docs and templates

## Working style

- Prefer editing existing files over creating new ones. Never create docs
  (README, *.md) unless I explicitly ask.
- Match the conventions of the surrounding code (naming, formatting,
  imports, error-handling style). Don't restyle code that isn't part of
  the task.
- Don't add speculative abstractions, options, or "future-proofing."
  Implement what's asked — nothing more.
- Don't add comments explaining self-evident code. Comment only where the
  intent isn't obvious from the code itself.

## Before claiming a task is done

- Run the project's formatter, linter, and type checker if they exist.
- Run the relevant tests. If tests don't exist for the change, say so
  rather than skipping verification.
- For UI changes, actually exercise the feature — don't rely on "it
  compiles" as proof it works.

## Git

- Never commit unless I ask.
- Never force-push, amend published commits, or use `--no-verify`
  without explicit permission.
- Prefer staging specific files over `git add -A` / `git add .` to avoid
  accidentally including secrets or build artifacts.
- Write commit messages that explain *why*, not *what*. One or two
  sentences is usually enough.

## Safety

- Ask before destructive or hard-to-reverse actions (deleting files,
  dropping tables, `rm -rf`, resetting branches, publishing packages,
  sending messages on my behalf).
- When something unexpected appears (unknown files, branches, lock
  files), investigate before deleting — it may be my in-progress work.

## Secrets

- Never read, log, or paste the contents of `.env`, credential files,
  private keys, or similar. Flag if I seem about to commit one.

## Tool preferences

- Use the dedicated tools (Read, Edit, Write, Glob, Grep) instead of
  shelling out to `cat`, `sed`, `find`, `grep`, etc.
- Run independent tool calls in parallel.
