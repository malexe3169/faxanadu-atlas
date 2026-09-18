# Faxanadu Battle 1.1

*[Version française](README.fr.md)*

A versus game built on the NES game *Faxanadu*: pick a fighter, pick an arena,
and fight a friend or the CPU. Experimental; the balance is still being tuned.

## Use

Patch a clean dump of the USA release (SHA-1 of the full `.nes` file:
`2e2b95db2be615cf588f0d758e0f7b1ccd81590a`) with `fax-battle-1.1.ips` or `.bps`. Play in an
emulator such as Mesen: the game needs 8 KB of extra work RAM, so it doesn't run on an
original cartridge.

## Starting a match

Power on, press Start, and choose a mode. At the mode screen you can also set who
plays each side: Up and Down move between Player 1, Player 2 and Difficulty, and
Left and Right change the value. A side can be a person or a CPU, so you can play
one on one, take on a CPU, or watch two CPUs fight. Player 2 starts as a CPU with a
random personality.

Then each player picks a fighter and presses A to be ready (B cancels), and you
pick an arena with Left/Right, seeing the real screen before you confirm with A.
Select returns to the mode choice.

## CPU opponents

A CPU plays with one of five personalities, and they are not difficulty
levels — they are different opponents:

| Personality | How it fights |
| --- | --- |
| Brawler | closes and keeps swinging |
| Counter | waits, guards, and punishes what you miss |
| Hunter | goes for the crown and the pickups |
| Trickster | backs off to bait an attack, then comes straight back in |
| Survivor | grabs what it needs, backs away when hurt, protects a lead |

There is also Random, which draws a new personality each round. Difficulty is
Easy, Normal or Hard, and it is set separately from personality.

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
| Up + B | Rising attack: lifts a grounded fighter and can counter a jumper |
| B in the air | Aerial attack |
| Down + B | Special move, uses a full power meter |
| Down while falling | Fall faster |
| Hold Down on the ground | Guard against an attack from the front (costs power) |
| Select | Back to the mode choice |

Hits you land and hits you take fill your power meter, so it rewards fighting
rather than waiting: a hit you land is worth twice one you take. Both fighters
start a round with one special already available.

## Fighters

Six to start with, and they play differently: speed, jump, reach, damage and
timing are all their own.

| Fighter | In one line | Special |
| --- | --- | --- |
| Hero | balanced, quick to recover | Blade Beam, a fast projectile |
| Sword Dwarf | fast on foot, slow to swing | Shoulder Rush, a forward charge |
| Skeleton Knight | the longest reach, the slowest hands | Skewer, a long thrust |
| Wolfman | fastest attack, lowest damage | Pounce, a forward leap |
| Giant Strider | hits hardest, misses worst | Ground Slam, hits all around where it lands |
| Grimlock | fastest walker, fights at range | Retreat Shot, steps back and fires |

There is also a secret seventh fighter. Finding it is up to you.

**[Full fighter guide](FIGHTERS.md)** — every fighter's numbers, what its
special really does, and how the shared moves work.

## Items

A breakable jar appears on the floor ten seconds into a fight, and another
follows a while after each one is taken or expires. Either fighter can break
it, with a melee swing or a projectile, and either can pick up what falls out.

The three pickups heal you, refill your power meter, or give you an extra air
jump for eight seconds. A pickup left alone disappears on its own.

Now and then a bird flies across the arena and drops bread as it goes.

## Sudden death

If a match runs long, a boss shows up after 60 seconds (with a warning at 55)
and throws fireballs that can't be blocked. At 135 seconds an unfinished match
ends: in a Duel the player who took less damage wins, in Crown Scramble the one
with more crown time. A tie shows as a draw.

## Arenas

Nine arenas: Courtyard, Ruins, High Bridge and Watchtower (Eolis), Mist Clearing
(Mist), Trunk Hollow (Trunk), Zenith Loop, Dartmoor Hall and Branch Link.
Platforms can be jumped onto from below, and Zenith Loop wraps around — leave one
side and come back from the other. Switching to a different region takes about two
seconds to load.

## Results

After a match a panel shows the winner (or a draw), both fighters' names and their
final crown time or health, and lets you rematch or go back to change the setup.

## Versions

- **1.1**: play against the CPU, fighter intros, more arenas, an items and results screen.
- **1.0**: first public release.
