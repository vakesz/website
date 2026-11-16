---
title: "TrackMania Mac"
description: "TrackMania on Apple silicon. One app installs and launches the games, no Windows needed."
category: "macOS application"
cover:
  src: "../../assets/projects/trackmania-mac-icon.png"
  alt: "TrackMania Mac app icon"
imageStyle: icon
repo: "https://github.com/vakesz/TrackMania-MacOS"
homepage: "https://tmmac.vakesz.com/"
stack: ["Swift", "Python", "Wine", "Rosetta 2"]
pinned: true
order: 1
---

A free hub app that installs and launches TrackMania titles on an Apple
silicon Mac. It sets up what each game needs: a patched Wine runtime,
DirectX and, for Nations and United Forever, the Competition Patch. No
Windows, no virtual machine, no developer tools.

Nations Forever and United Forever are supported. The hardest part was the
physics: the Forever games depend on 24-bit x87 floating point, which
Rosetta doesn't reproduce exactly. An x87 accelerator hooks Rosetta on
macOS 15.4 and later so the cars behave the way they do on Windows.

It needs an M1 or later on macOS 14 Sonoma or newer. It's a community
project, not affiliated with Nadeo or Ubisoft, and the games are
downloaded from their original hosts, not redistributed.
