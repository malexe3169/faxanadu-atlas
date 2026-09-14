# Faxanadu patches

Patches for the NES game *Faxanadu*. Each folder holds one build: its patch
files and a README that explains what it does and how to use it.

| Folder | What it is | For |
|---|---|---|
| [qol-edition](qol-edition) | The original game, nicer to play: faster screen transitions, an options menu, battery saves and smart key use. | USA |
| [speedrunner-training](speedrunner-training) | The original game with speedrun practice tools in the pause menu: timer, splits, warp, checkpoints and HUD readouts. With the default settings it plays exactly like the original. | USA, USA Rev 1, Europe |
| [faxoptions-showcase-9.2](faxoptions-showcase-9.2) | FaxOptions Showcase 9.2 (Crown Jewels): the FaxEdit 9.2 general hacks in one ROM, with a pause-menu panel that switches them and changes their settings while you play. | USA, USA Rev 1, Europe |
| [faxoptions-debug-9.2](faxoptions-debug-9.2) | FaxOptions Debug 9.2: Crown Jewels plus a script runner, to run the game's script commands from the pause menu. For testing, not for play. | USA, USA Rev 1, Europe |

## How to patch

1. Start from a clean, unmodified dump of the right version, and keep a copy of it.
2. Pick the patch for your version, `.ips` or `.bps`. A BPS patch checks that
   you picked the right file first; an IPS patch doesn't.
3. Apply it with a patcher, for example [Floating IPS](https://github.com/Alcaroo/floating-ips)
   or [Rom Patcher JS](https://www.marcrobledo.com/RomPatcher.js/) in your browser.
4. Save the result as a new file.

All four builds keep settings or saves in battery RAM, so use an emulator that
keeps battery saves.

## Credits

The FaxOptions builds are built with the general hacks from Kai E. Frøland's
[FaxEdit](https://github.com/kaimitai/faxedit) toolchain. The QoL Edition builds on
FaxEdit as well: its general hacks (battery saves and smart key use) and its
knowledge of the game.

## Thanks

Thanks to everyone whose work helped us understand the game:

- chipx86, for the [Faxanadu disassembly](https://github.com/chipx86/faxanadu) and
  [faxanatools](https://github.com/chipx86/faxanatools)
- Invariel, for the [tool-assisted speedrun](https://tasvideos.org/5338S) published on
  TASVideos, and TASVideos for its Faxanadu resource pages
- [Data Crystal](https://datacrystal.tcrf.net/wiki/Faxanadu),
  [GameFAQs](https://gamefaqs.gamespot.com/nes/587273-faxanadu/faqs),
  the [Speed Demos Archive](https://kb.speeddemosarchive.com) knowledge base and
  [VGMaps](https://vgmaps.com)
- sporst ([Daybreak](https://github.com/sporst/Daybreak), [NHF](https://github.com/sporst/NHF)),
  Notlobb ([Randumizer](https://github.com/Notlobb/Randumizer)),
  Daivuk ([Daxanadu](https://github.com/Daivuk/Daxanadu)),
  mstan ([FaxanaduRecomp](https://github.com/mstan/FaxanaduRecomp)),
  ElectronsAndCode ([FaxanaduPW](https://github.com/ElectronsAndCode/FaxanaduPW)),
  sleepy9090 ([FaxanaduShopPriceEditor](https://github.com/sleepy9090/FaxanaduShopPriceEditor)),
  rgeraldporter ([faxanadu-patcher](https://github.com/rgeraldporter/faxanadu-patcher)),
  UnsavoryMaggot ([Faxanadu-Retranslation](https://github.com/UnsavoryMaggot/Faxanadu-Retranslation)) and
  Ehseezed ([Faxanadu-Tracker](https://github.com/Ehseezed/Faxanadu-Tracker))

Faxanadu is a trademark of its respective rights holders. These are unofficial
fan patches, not affiliated with or endorsed by them.
