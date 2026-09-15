# Faxanadu patches

*[Version française](README.fr.md)*

Patches for the NES game *Faxanadu*. Each folder holds one build: its patch
files and a README that explains what it does and how to use it.
One folder is a guide instead: which FaxEdit hacks work together.

| Folder | Version | What it is | For |
|---|---|---|---|
| [qol-edition](qol-edition) | 1.1 | The original game, nicer to play: faster screen transitions, an options menu, battery saves and smart key use. | USA |
| [speedrunner-training](speedrunner-training) | 5.1 | The original game with speedrun practice tools in the pause menu: timer, splits, warp, checkpoints and HUD readouts. With the default settings it plays exactly like the original. | USA, USA Rev 1, Europe |
| [faxoptions-showcase-9.2](faxoptions-showcase-9.2) | 9.2-1 | FaxOptions Showcase 9.2 (Crown Jewels): the FaxEdit 9.2 general hacks in one ROM, with a pause-menu panel that switches them and changes their settings while you play. | USA, USA Rev 1, Europe |
| [faxoptions-debug-9.2](faxoptions-debug-9.2) | 9.2-1 | FaxOptions Debug 9.2: Crown Jewels plus a script runner, to run the game's script commands from the pause menu. For testing, not for play. | USA, USA Rev 1, Europe |
| [faxedit-hack-compatibility-9.2](faxedit-hack-compatibility-9.2) | 9.2-3 | Which FaxEdit 9.2 general hacks work together, plus the hacks not in FaxEdit yet, marked: every pair built in both orders, the pairs that don't work, and why. | FaxEdit 9.2 |
| [fax-battle](fax-battle) | 1.0 | Faxanadu Battle: a two-player versus game built on Faxanadu, with Crown Scramble and Duel modes, seven fighters and six arenas. Experimental. | USA |

## How to patch

1. Start from a clean, unmodified dump of the right version, and keep a copy of it.
2. Pick the patch for your version, `.ips` or `.bps`. A BPS patch checks that
   you picked the right file first; an IPS patch doesn't.
3. Apply it with a patcher, for example [Floating IPS](https://github.com/Alcaro/Flips)
   or [Rom Patcher JS](https://www.marcrobledo.com/RomPatcher.js/) in your browser.
4. Save the result as a new file.

The QoL Edition, SpeedRunner Training and FaxOptions builds keep settings or
saves in battery RAM, so use an emulator that keeps battery saves. Faxanadu
Battle needs 8 KB of extra work RAM, so it plays in emulators, not on an
original cartridge.

## Credits

The FaxOptions builds are built with the general hacks from Kai E. Frøland's
[FaxEdit](https://github.com/kaimitai/faxedit) toolchain, and the QoL Edition's battery
saves use one of them. Most of what we know about the game's code comes from
chipx86's [Faxanadu disassembly](https://github.com/chipx86/faxanadu); everyone else
is thanked below.

## Thanks

Thanks to everyone whose work helped us understand the game:

- chipx86, for the [Faxanadu disassembly](https://github.com/chipx86/faxanadu) and
  [faxanatools](https://github.com/chipx86/faxanatools)
- Invariel, for the [tool-assisted speedrun](https://tasvideos.org/5338S) published on TASVideos
- TASVideos, for the [Faxanadu resources page](https://tasvideos.org/GameResources/NES/Faxanadu),
  an [enemy display user file](https://tasvideos.org/UserFiles/Info/35925051135496342) and the
  [password generator](https://web.archive.org/web/20210301103116/http://tasvideos.org/PasswordGenerators.html)
- Aeon Genesis, for the [Faxanadu chapter](https://web.archive.org/web/20080305153943/http://agtp.romhack.net/docs/tnrb/1-03.html)
  of The New Romhacker's Bible
- the [RockNES savestate guide](https://web.archive.org/web/20190113213948/https://gamefaqs.gamespot.com/nes/587273-faxanadu/faqs/30344) on GameFAQs
- the Speed Demos Archive
  [Faxanadu additional resources](https://kb.speeddemosarchive.com/index.php?title=Faxanadu/Additional_Resources) page
- the 2005 [Faxanadu data dump](https://web.archive.org/web/20160506024847/http://www.the-interweb.com/bdump/faxanadu/faxdump.rar)
  published on the-interweb.com
- ElectronsAndCode ([FaxanaduPW](https://github.com/ElectronsAndCode/FaxanaduPW)),
  sleepy9090 ([FaxanaduShopPriceEditor](https://github.com/sleepy9090/FaxanaduShopPriceEditor)),
  rgeraldporter ([faxanadu-patcher](https://github.com/rgeraldporter/faxanadu-patcher)) and
  mstan ([FaxanaduRecomp](https://github.com/mstan/FaxanaduRecomp))

Faxanadu is a trademark of its respective rights holders. These are unofficial
fan patches, not affiliated with or endorsed by them.
