# Faxanadu Titan 1.0

*[Version française](README.fr.md)*

A one-life patch for the NES game *Faxanadu* (USA release). The whole
original adventure, with harder enemies, honest item timers, and one rule
above the others: death is final.

Titan comes as two patches with the same rules:

| patch | base | for |
| --- | --- | --- |
| `faxanadu-titan-vanilla-1.0` | the untouched original game | players who want the original and nothing else |
| `faxanadu-titan-qol-1.0` | [QoL Edition 1.3](../qol-edition): enemy health bars, faster transitions, options menu, battery save, smart keys and mattock | players who want the comforts with the rules |

Both apply to a clean dump of the USA release; you do not patch on top of
the QoL Edition yourself.

## The rules

- **One life.** When your health runs out, the game's own text window opens
  and reads **DEATH IS FINAL.** Press A and the console resets to the title
  screen. There is no return to the last church with your gold and items,
  and nothing to continue. Dying is no longer a free trip back to town.
- **No way back.** The title screen has no CONTINUE, so there is no password
  entry: the Gurus still speak their mantras, but nothing accepts them. In
  the Vanilla patch a run is one sitting. In the QoL patch, CONTINUE stays
  for a living run: the Guru writes the battery save and you can stop there
  and resume later. The moment a blow kills you, that save is wiped, before
  the death window even opens, so after a death CONTINUE is grey.
- **Harder enemies.** Every enemy has 125% of its original health and deals
  150% of its original damage, and an enemy you hit recovers in 6 frames
  instead of 8, so it comes back at you sooner. Experience and gold drops are
  unchanged. Your own speed, jump, sword and invulnerability time after a hit
  are unchanged.
- **Honest item timers.** Wing Boots, Hour Glass, Glove and Ointment run on a
  countdown. In the original, pausing or opening the item menu at the right
  moment skips ticks of that countdown and stretches the item for free. Here
  the countdown's phase is kept across every pause and every menu, so the
  items last exactly as long as they should.
- **The Elixir does not revive you.** In the original, holding an Elixir
  turns a fatal blow into a full refill. Here a fatal blow is fatal, Elixir
  or not. The Elixir is still sold in shops in this version; don't buy it.

## What this version does not do

- **No saving mid-screen.** Vanilla: none at all. QoL: only the Guru save,
  and only while you are alive.
- **Bosses do not get much more health.** Boss health is already stored near
  the game's cap, so the 125% ends up as 102% for the two bosses stored at
  250. They do hit for 150%.
- **Savestates are yours.** A patch cannot stop an emulator from saving and
  loading states, rewinding, or copying a `.sav` file. The one-life rule is
  enforced by the game, not against your emulator.
- **Timers during conversations and lag.** Text boxes let the timers run, as
  in the original. On a lag frame an item can still tick one frame early or
  late; that is bounded and cannot be exploited by pausing.
- **The QoL options menu cannot relax the rules.** It still sets text speed,
  the bug fixes and the fall, jump and ladder feel, as in QoL Edition 1.3.
  Nothing in it touches enemy stats, timers, the save or the death rule.

## Use

Patch a clean dump of the USA release with the `.ips` or `.bps` of the patch
you want. The QoL patch keeps its settings and save in battery RAM, so use an
emulator that keeps battery saves.

The dump is the right one if either hash matches:

| hash | value | check with |
| --- | --- | --- |
| file SHA-1 | `2e2b95db2be615cf588f0d758e0f7b1ccd81590a` | `sha1sum your.nes` |
| body SHA-1 | `5b05c8859f356013d37f0545f5de5fa1693da5da` | `tail -c +17 your.nes \| sha1sum` |

The file hash is the whole `.nes`; the body hash is the same file with its 16
byte header removed, which is what identifies the game whatever header your
dump carries.

The patched game is right if either hash matches:

| patch | file SHA-1 | body SHA-1 |
| --- | --- | --- |
| `faxanadu-titan-vanilla-1.0` | `07be5344b7b41ea6358df7a674e80b00ba448a20` | `6dd16c647d7057ab1b747aa40a62262267dbc25a` |
| `faxanadu-titan-qol-1.0` | `bfea207508838a3f0e6d436efdf84fc4b92f1422` | `357ef78bf13e6d24861bc9fc7b91eb51e171ad7a` |

## Credits

The one-life rule, the enemy scaling (AtlasDevEnemyStats) and the item timer
fix (AtlasDevFairPlayTimers) are our own hacks. The QoL patch carries
everything the [QoL Edition 1.3](../qol-edition) carries, with its credits:
battery saves and the Ointment fix are general hacks from Kai E. Frøland's
[FaxEdit](https://github.com/kaimitai/faxedit). Most of what we know about how
the game works comes from chipx86's
[Faxanadu disassembly](https://github.com/chipx86/faxanadu).

## Versions

- **1.0**: one life with the death window, no password entry, 125% enemy
  health, 150% enemy damage, 6-frame enemy recovery, item timers that pausing
  cannot stretch. Two patches: Vanilla, and QoL (on QoL Edition 1.3) where
  dying wipes the save.
