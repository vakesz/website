---
title: "Org chart"
description: "Python script that walks Microsoft Graph from a top-level user and writes a hierarchical orgchart.json from Azure AD."
repo: "https://github.com/vakesz/orgchart"
stack: ["Python", "Microsoft Graph"]
order: 30
---

A one-file generator. App registration with `User.ReadBasic.All`, a `.env`
for tenant and client credentials, and a starting email. It walks the
manager chain through Graph and dumps `orgchart.json`.

Useful when you need a picture of the tree and do not want to click through
the Azure portal to build one by hand.
