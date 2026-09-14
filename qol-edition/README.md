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

## Requirements

- Your own legally-obtained USA release ROM of Faxanadu, unmodified.
  - Expected SHA-1 of the full `.nes` file (with its 16-byte header):
    `2e2b95db2be615cf588f0d758e0f7b1ccd81590a`
  - If your file's hash doesn't match, this patch will refuse to apply
    cleanly (BPS) or may produce a broken ROM (IPS) — get a clean dump.
- A patcher that supports IPS or BPS, for example:
  - [Floating IPS (flips)](https://github.com/Alcaro/Flips) — supports both formats, and will warn you if you picked the wrong source ROM (BPS only)
  - [Lunar IPS](https://fusoya.eludevisibility.org/lips/) — IPS only

## How to apply

1. Back up your original ROM file somewhere safe.
2. Open your patcher of choice.
3. Choose `faxanadu-qol-edition.ips` (or `.bps`) as the patch.
4. Choose your clean Faxanadu ROM as the file to patch.
5. Save the output as a new file — don't overwrite your clean ROM.

## Credits

This patch builds on Kai E. Frøland's [FaxEdit](https://github.com/kaimitai/faxedit)
("Echoes of Eolis"): its general hacks (the battery saves and smart key use)
and its knowledge of the game.

Faxanadu is a trademark of its respective rights holders. This is an
unofficial fan patch, not affiliated with or endorsed by them.
