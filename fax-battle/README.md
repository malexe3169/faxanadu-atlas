# Faxanadu Battle 1.6

*[Version française](README.fr.md)*

A versus game built on the NES game *Faxanadu*: pick a fighter, pick an arena,
and fight a friend or the CPU. Experimental; the balance is still being tuned.

## Use

Patch a clean dump of the USA release (SHA-1 of the full `.nes` file:
`2e2b95db2be615cf588f0d758e0f7b1ccd81590a`) with `fax-battle-1.6.ips` or `.bps`. Play in an
emulator such as Mesen: the game needs 8 KB of extra work RAM, so it doesn't run on an
original cartridge.

## Starting a match

Power on, press Start, and the match setup panel opens: Up and Down move between
Mode, Player 1, Player 2 and Difficulty, Left and Right change the value, and A
goes on to the fighters from any row. A side can be a person or a CPU, so you can
play one on one, take on a CPU, or watch two CPUs fight. Player 2 starts as a CPU
with a random personality, on Easy.

Then each player picks a fighter and presses A to be ready (B cancels), and you
pick an arena with Left/Right, seeing the real screen before you confirm with A.
Select returns to the setup panel.

Start pauses a fight. While paused, Up/Down and Left/Right pick a new CPU
personality and difficulty for the next round, A restarts the round, Select quits
to the setup panel, Start resumes.

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
Easy, Normal or Hard, and it is set separately from personality. Easy is the
default: it thinks slower and holds back about half of its attacks up close.

## Modes

- **Crown Scramble:** hold the crown for a total of 30 seconds. A hit makes the
  holder drop it, and it can't be picked up again straight away. Whoever dropped
  it has to wait two seconds; the other fighter can take it at once.
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
| Up / Down at a ladder | Climb (Dartmoor Hall) |
| Start | Pause |
| Select | Back to the setup panel |

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

Now and then a bird flies across the arena and drops bread as it goes, with a cry
for each loaf. One loaf in four is a book instead: pick it up and a monster of
the region fights at your side for fifteen seconds. It takes four hits to put
down, and it hits for 8.

## Visitors

Three characters from the game drop in on a fight.

- **The Hornet** (Courtyard, High Bridge, Mist Clearing, Trunk Hollow): a pickup
  left on the floor for five seconds, or a loaf for four, gets stolen. It flies in,
  grabs it and leaves. Hit it and it drops what it carries.
- **The Guru** (Ruins, Watchtower, Zenith Loop, Dartmoor Hall, Branch Link): ten
  seconds into the round he appears on his spot and stays for twenty-five. Stand
  still beside him and he heals you, 4 HP every half second. Land a hit on a
  fighter he is healing and he vanishes in a burst; he is back twenty seconds
  later.
- **Bihoruda** (every arena): twenty seconds in, and every thirty after that, it
  swoops in on whoever is leading (more HP in a Duel, the crown holder or the
  higher score in Crown Scramble), carries them helpless for two seconds, drops
  them somewhere over the floor and leaves fast. A held fighter can still be hit.
  In Crown Scramble the grab makes the holder drop the crown where they stood.
- **Sugata and Nash** (from a book): the monster of the arena's region, Sugata in
  Eolis and Mist, Nash further on. It walks at whoever you are fighting, strikes
  when it is close, and leaves after fifteen seconds. Either fighter can hit it.

## Sudden death

If a match runs long, a boss shows up after 60 seconds (with a warning at 55)
and throws fireballs that can't be blocked. At 135 seconds an unfinished match
ends: in a Duel the player who took less damage wins, in Crown Scramble the one
with more crown time. A tie shows as a draw.

A knockout, or the thirtieth second of crown time, ends in the game's own death
burst and sound before the results come up.

## Arenas

Nine arenas: Courtyard, Ruins, High Bridge and Watchtower (Eolis), Mist Clearing
(Mist), Trunk Hollow (Trunk), Zenith Loop, Dartmoor Hall and Branch Link.
Platforms can be jumped onto from below, Dartmoor Hall's ladders can be climbed
(the CPU climbs them too), and Zenith Loop wraps around — leave one side and come
back from the other. Switching to a different region takes about two seconds to
load.

Each arena has a trick of its own:

| Arena | Trick |
| --- | --- |
| Courtyard | the well: stand on the floor at the left edge to heal 1 HP every half second |
| Ruins | the two ledges crumble after a second of standing, and come back three seconds later |
| High Bridge | the centre of the span gives way after a second and a half |
| Watchtower | the bird's nest: the bread bird comes twice as often |
| Mist Clearing | the fog rolls in for two seconds at a time |
| Trunk Hollow | gusts push whoever is in the air, one way then the other |
| Zenith Loop | wraps around |
| Dartmoor Hall | ladders |
| Branch Link | two chambers joined by a ladder |

## Results

After a match a panel shows the winner (or a draw), both fighters' names and their
final crown time or health, and lets you rematch or go back to change the setup.
The victory music loops until you leave.

## Versions

- **1.6**: a book that summons a monster, the crown drops when Bihoruda grabs its
  holder and the dropper waits two seconds for it, visitors in their own colours,
  the Hero's beam is the game's Thunder spell, Zenith Loop's ledges match the rock.
- **1.5**: match setup panel, pause menu, a trick in every arena, Dartmoor ladders,
  three visitors, knockout burst, snappier hits.
- **1.1**: play against the CPU, fighter intros, more arenas, an items and results screen.
- **1.0**: first public release.
