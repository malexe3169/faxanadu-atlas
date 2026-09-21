# Faxanadu QoL Edition 1.3

*[Version française](README.fr.md)*

A quality-of-life patch for the NES game *Faxanadu* (USA release). It
keeps the original world and story while improving controls, responsiveness,
and combat feedback.

## What it changes

- **Enemy health bar.** Hit an enemy with your sword or magic to show its
  remaining health. The bar stays visible until that enemy dies, disappears,
  or you change rooms. Bar only, without enemy names; enabled by default.
- **Shorter blank redraws (FastBlink).** Doorway and other blank-and-redraw
  transitions spend less time waiting. Horizontal scrolling stays intact.
- **Ointment protection fixed.** Active Ointment also blocks magic while you
  have a shield equipped, including Sugata's screen-wide flash.

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
- **Battery-backed saves.** The game now saves your progress to battery RAM.
  The start screen offers **START**, **CONTINUE** and **PASSWORD**, so the
  original mantras still work exactly as they did.
- **Smart key use.** Carrying the right key opens a locked door automatically
  — no need to open the item menu and select it first. Keys are still spent
  one per door, still counted, still bought in shops; only the extra trip to
  the menu goes away.
- **Smart mattock use.** A rock you could always dig can now be dug without
  selecting the mattock first: press the item button in front of it, or just
  walk into it and keep pushing for a moment. The mattock is still required
  and still wears out as it always did, and rocks that vanilla would not let
  you dig — mid-air, on a ladder, or at the far right edge of a screen —
  still refuse.

## Use

Patch a clean dump of the USA release with `faxanadu-qol-edition-1.3.ips` or `.bps`.
Use an emulator that keeps battery saves.

The dump is the right one if either hash matches:

| hash | value | check with |
| --- | --- | --- |
| file SHA-1 | `2e2b95db2be615cf588f0d758e0f7b1ccd81590a` | `sha1sum your.nes` |
| body SHA-1 | `5b05c8859f356013d37f0545f5de5fa1693da5da` | `tail -c +17 your.nes \| sha1sum` |

The file hash is the whole `.nes`; the body hash is the same file with its 16
byte header removed, which is what identifies the game whatever header your
dump carries.

## Credits

The battery saves use a general hack from Kai E. Frøland's
[FaxEdit](https://github.com/kaimitai/faxedit) ("Echoes of Eolis"), and smart key and
smart mattock use are our own hacks, now part of FaxEdit's general hacks too. Most of
what we know about how the game works comes from chipx86's
[Faxanadu disassembly](https://github.com/chipx86/faxanadu).

## Versions

- **1.3**: persistent enemy health bar, FastBlink, OintmentFix, and a correction
  to CONTINUE so battery saves load properly alongside PASSWORD.

- **1.2**: smart mattock use, and PASSWORD back on the start screen.
- **1.1**: smart key use.
- **1.0**: faster screen transitions, the in-game options menu and battery saves.
