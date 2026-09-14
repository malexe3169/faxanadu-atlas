# Faxanadu Battle

A two-player versus game built on the NES game *Faxanadu*: pick a fighter, pick
an arena, and fight a friend. Experimental; the balance is still being tuned.

## What you need

- Your own clean dump of the USA release of Faxanadu.
  Expected SHA-1 of the full `.nes` file (with its header):
  `2e2b95db2be615cf588f0d758e0f7b1ccd81590a`
- `fax-battle.bps` or `fax-battle.ips` (see the front page for how to patch).
- An emulator such as Mesen, and two controllers. The game uses 8 KB of extra
  work RAM, so it plays in emulators, not on an original cartridge.

## Starting a match

Power on, press Start, choose a mode, then each player picks a fighter and
presses A to be ready (B cancels). Then pick an arena with Left/Right: you see
the real screen before you confirm with A. Select returns to the mode choice.

## Modes

- **Crown Scramble:** hold the crown for a total of 30 seconds. A hit makes the
  holder drop it, and it can't be picked up again straight away.
- **Duel:** both players start at 99 HP. Knock the other one out.

## Controls

| Input | Action |
| --- | --- |
| A | Jump (let go early for a short hop) |
| B | Attack |
| Hold B, release | Charged attack: double damage, slower, breaks through a guard |
| Up + B | Rising attack |
| B in the air | Aerial attack |
| Down + B | Special move, uses a full power meter |
| Down while falling | Fall faster |
| Hold Down on the ground | Guard against an attack from the front (costs power) |
| Select | Back to the mode choice |

Hits you land and hits you take fill your power meter.

## Fighters

| Fighter | Special |
| --- | --- |
| Hero | Blade Beam, a fast projectile |
| Sword Dwarf | Shoulder Rush, a forward charge |
| Skeleton Knight | Skewer, a long thrust |
| Wolfman | Pounce, a forward leap |
| Giant Strider | Ground Slam, hits all around where it lands |
| Grimlock | Retreat Shot, steps back and fires |

There is also a secret seventh fighter, a tank: on the fighter screen, hold Up
and tap B while you are not ready yet. Left/Right goes back to the others.

## Sudden death

If a match runs long, a boss shows up after 60 seconds (with a warning at 55)
and throws fireballs that can't be blocked. At 135 seconds an unfinished match
ends: in a Duel the player who took less damage wins, in Crown Scramble the one
with more crown time.

## Arenas

Courtyard, Ruins, High Bridge and Watchtower (Eolis), Mist Clearing (Mist) and
Trunk Hollow (Trunk). Platforms can be jumped onto from below. Switching to a
different region takes about two seconds to load.
