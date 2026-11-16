---
title: "Docket"
description: "Self-hosted triage for GitHub Issues and Azure DevOps, with an AI assistant that asks before it writes."
category: "Web application"
cover:
  src: "../../assets/projects/docket-icon.png"
  alt: "Docket logo"
imageStyle: icon
repo: "https://github.com/vakesz/docket"
stack: ["TypeScript", "Next.js", "tRPC", "Postgres"]
pinned: true
order: 2
---

One web app over your GitHub Issues and Azure DevOps work items. The
backlog, the selected item and a chat panel share one screen.

Every write goes through the same gate: proposal, diff, confirm. That holds
for UI buttons, the assistant's tools and the raw API alike, so the
assistant can't quietly move a ticket, rewrite a description or post a
comment behind your back.

It runs with one `docker compose up`. A setup wizard collects the OAuth
provider and an optional model (any OpenAI-compatible endpoint), and the
rest of the configuration lives in the database, editable from the
settings page without a redeploy. Built on Next.js, tRPC, Drizzle and
Postgres, licensed AGPL-3.0.
