# Faxanadu QoL Edition

A quality-of-life patch for the NES game *Faxanadu* (USA release). It
changes nothing about the game's content, difficulty, or story — only how
it feels to play.

## What it changes

- **Faster screen transitions.** The pause that used to happen when the
  screen scrolled or the game paged in new content is substantially
  shorter, most noticeably in busy indoor rooms.
- **An in-game options menu.** Hold **Select** and press **Start** to open
  a settings panel from the pause screen. From there you can adjust:
  - Text speed
  - A handful of long-standing bug fixes (on by default)
  - Fall, jump, and ladder feel
  Your choices are saved to the cartridge's battery RAM, so they persist
  between play sessions on real hardware or in an emulator that supports
  battery saves.
- **Battery-backed saves.** The game now saves your progress to battery RAM
  instead of (or alongside) the password system.
- **Smart key use.** Carrying the right key opens a locked door automatically
  — no need to open the item menu and select it first. Keys are still spent
  one per door, still counted, still bought in shops; only the extra trip to
  the menu goes away.

## Use

Patch a clean dump of the USA release (SHA-1 of the full `.nes` file:
`2e2b95db2be615cf588f0d758e0f7b1ccd81590a`) with `faxanadu-qol-edition.ips` or `.bps`.
Use an emulator that keeps battery saves.

## Credits

This patch builds on Kai E. Frøland's [FaxEdit](https://github.com/kaimitai/faxedit)
("Echoes of Eolis"): its general hacks (the battery saves and smart key use)
and its knowledge of the game.
