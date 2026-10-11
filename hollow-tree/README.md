# Faxanadu: Hollow Tree v53 (Fogwalker)

*[Version française](README.fr.md)*

A soulslike remake of the NES game *Faxanadu* (USA release), built on the
original game. The World Tree is hollow: gold is souls, the gurus keep the
flames, death costs you what you carry, and every monster shows its attack
before it lands. A work in progress, released as numbered previews.

The patch is `faxanadu-hollow-tree-v53-fogwalker.bps`. It makes a 512 KB
cartridge (MMC1, SUROM board) with a battery save.

## What changes

**New game**
- A short prologue, skipped with Start.
- **The vow:** PILGRIM (enemies at 3/4 health and damage), UNDEAD (as
  designed) or HOLLOW (1.5×). It holds for the whole run.
- **A class:** WARRIOR, KNIGHT, THIEF, SORCERER, CLERIC or DEPRIVED, each with
  its own gear, levels and extras. DEPRIVED starts with nothing but 4,000
  souls.
- **A look:** six colours for the hero.

**Souls and death**
- Gold is souls. Monsters pay souls; experience is gone.
- When you die, your souls stay where you fell as a bloodstain. You go back
  to the last guru with none. Touch the stain to take them back; die again
  first and they are lost.
- Killed enemies stay dead until you rest or die. Bosses and elites stay dead
  for good.
- The Ring of Souls (the old Elixir) keeps your souls on one death, then
  breaks.

**Gurus and bonfires**
- The eight gurus are bonfires. Resting refills health, flasks, stamina and
  spells, brings ordinary enemies back and saves the game.
- Each guru sells levels in eight stats: Vitality, Strength, Endurance,
  Attunement, Dexterity, Intelligence, Faith and Resistance.
- Once the King links the keepers, any guru takes you to any other you have
  visited.

**Estus**
- The Red Potion is the Estus Flask (half your health back) and the Black
  Potion the Ashen Flask (spell uses back). Flasks refill when you rest.
- The nine real bosses each leave an Estus Shard; the Eolis smith turns
  shards into more flasks.

**Combat**
- Stamina: every swing, guard and backstep costs it. It shows where
  experience was.
- Hold Down to guard with a shield. Down and A on the ground is a backstep
  with invulnerable frames.
- Armour has weight; heavy gear slows stamina and the walk.
- Damage grows with your stats. Every monster trembles before it lunges,
  leaps, dives or shoots, and stays open after. Monsters hit harder deeper
  in the tree.
- Lords wind up their attacks and turn fiercer below half health. A fog
  wall stands before them.
- Damage numbers rise over the monster you hit. DAMAGE NUMBERS in
  FaxOptions (Start, then Select) turns them off.

**Magic**
- Spells have uses instead of MP, and only attuned spells can be cast. Rest
  with a spell equipped to attune it; Attunement sets how many stay
  attuned.
- A spell passes through a monster that is immune to it.

**Gear**
- Twenty-one new items: eight weapons, five armours, four shields and four
  spells. Some are sold, the rest are found in the world: glints where the
  Poisons were, lord drops, rare drops and church altars. Each is found once.
- The smith sets a stone in your blade: fire, lightning or magic.
- Humanity: picked up in the world and won from bosses. It raises the
  chance of random items.

**The world**
- The original areas, linked in new ways: five doors home to Eolis that open
  from the far side, shortcuts, a cellar to Dartmoor and a hidden Painted
  World.
- The camera follows you from room to room instead of flipping screens.
- Broken walls stay broken.

**Menus, music, look**
- STATUS has three pages, Left and Right to flip: your soul level, the
  eight stats, Humanity and your vow; ATTACK, what your weapon and spell do
  as equipped; DEFENCE, what your armour and shield take, and your equip
  load.
- A new soundtrack. MUSIC in the Select menu switches to the original music
  at any time.
- A new title, smoother walking legs, and a short tuck when you land.
- Your look colours only the hero: the King and the townsfolk keep theirs.
- Two endings and New Game+.

## Not included

- NPC quests for the last three items (Catarina Armor, Fireball, Patches)
- A storage box at the gurus
- The full Fluid Motion animation set
- Parry, weapon speed and reach, elemental weaknesses

## Use

Patch a clean dump of the USA release with the `.bps`. A BPS patch checks
the file first, so a wrong dump is refused. [Floating
IPS](https://github.com/Alcaro/Flips) and [Rom Patcher
JS](https://www.marcrobledo.com/RomPatcher.js/) both apply it. Play in an
emulator that keeps battery saves and runs 512 KB MMC1 games; it is tested
in Mesen.

The dump is the right one if either hash matches:

| hash | value | check with |
| --- | --- | --- |
| file SHA-1 | `2e2b95db2be615cf588f0d758e0f7b1ccd81590a` | `sha1sum your.nes` |
| body SHA-1 | `5b05c8859f356013d37f0545f5de5fa1693da5da` | `tail -c +17 your.nes \| sha1sum` |

The patched game is right if either hash matches:

| patch | file SHA-1 | body SHA-1 |
| --- | --- | --- |
| `faxanadu-hollow-tree-v53-fogwalker` | `b5b71a256509f3ce461e366e556200f0056af832` | `12785747e6483d7c91c5b833dbcfdfb92a328b01` |

The patch carries no data from the original game; it copies what it needs
from your own dump.

## Credits

Hollow Tree is our own work. Its world was built with Kai E. Frøland's
[FaxEdit](https://github.com/kaimitai/faxedit) toolchain, and its options menu
comes from the FaxOptions builds. Most of what we know about how the game
works comes from chipx86's
[Faxanadu disassembly](https://github.com/chipx86/faxanadu).

## Versions

- **v53 (Fogwalker)**: STATUS pages for attack and defence, damage
  numbers, the look no longer recolours the King and the townsfolk. Fixed:
  the Trunk lord on the high ledge could not be reached. His fog now holds
  his room and the room with the ladder up to him, once you have stepped
  into his.
- **v49 (Ghostlight)**: the first public preview. Classes and looks, the
  new gear in the world, the music switch, spells that pass through the
  immune, Landing Tuck.
