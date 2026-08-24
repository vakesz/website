---
title: "Notification App"
description: "Flask app that watches a blog API, filters posts, and pushes them to signed-in users. Azure AD for login, VAPID for web push."
repo: "https://github.com/vakesz/notification_app"
homepage: "https://vakesz.github.io/notification_app/"
stack: ["Python", "Flask", "Azure AD"]
order: 20
---

A monitor for blog posts I actually care about. It polls an API, applies
location and keyword filters, and sends web push when something matches.
Login is Azure AD. UI is English, Hungarian, and Swedish.

Docs and the static landing page live on GitHub Pages. The app itself is
Python 3.10, Docker, and a pile of MSAL and VAPID wiring.
