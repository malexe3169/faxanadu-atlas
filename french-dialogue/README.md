# Atlas French Dialogue 0.1

*[Version française](README.fr.md)*

French dialogue for the original game, in two variants: France French (`fr`)
and Canadian French / Québec (`qc`). This first release translates **dialogue
only**. Menus, item names, title, passwords, and Japanese name entry stay in
their original language.

Based on the FR/QC scripts in
[UnsavoryMaggot's Faxanadu Translation Table, PR 2](https://github.com/UnsavoryMaggot/Faxanadu-Translation-Table/pull/2).
The Translation Table and [Faxanadu Retranslation](https://github.com/UnsavoryMaggot/Faxanadu-Retranslation)
are the foundation of this adaptation, not competing projects.

Unlike the earlier FR/QC patches over Retranslation, these patches start from
clean retail ROMs. Each base keeps its original gameplay, music, art outside
text glyphs, password saving, mapper, and ROM size. No SRAM saves, QoL features,
gameplay fixes, or Retranslation ROM expansion are included. The Japanese base
needs a small Latin-dialogue renderer adapter; its Japanese interface remains.

## Choose your patch

Use `faxanadu-atlas-LOCALE-dialogue-0.1-BASE.ips` or `.bps`:

| LOCALE | BASE |
|---|---|
| `fr` — France French | `usa`, `usa-rev1`, `europe`, `japan` |
| `qc` — Canadian French / Québec | `usa`, `usa-rev1`, `europe`, `japan` |

1. Start with a clean dump of the matching base. See the [ROM hashes](../README.md#which-rom-you-need).
2. Apply its patch with [Floating IPS](https://github.com/Alcaro/Flips)
   or [Rom Patcher JS](https://www.marcrobledo.com/RomPatcher.js/).
3. Save as a new file. Do not apply over Retranslation, QoL Edition, or another hack.

BPS verifies the complete input file, including its header. IPS also works with
an alternate 16-byte header when the ROM body matches the documented hash.
No ROMs are included.

## Translation scope

The pinned script revision is `0c8eee1e6c2446ac3da949c890214668fe32d085`.
Its 185 messages and eight additional lines are mapped to the 193 original
message records and reflowed to sixteen columns. Unsupported player-name
references are removed; Japanese rank references use “un nouveau titre” while
keeping the original menu's rank labels. Prices and quest instructions follow
each clean base's mechanics. This is not a newly researched Japanese translation.

Experimental version 0.1. See the per-build JSON manifests for ROM and patch
hashes. Hardware compatibility is not guaranteed.

Credits: UnsavoryMaggot (Translation
Table and Retranslation foundation), and chipx86 (Faxanadu reverse-engineering
reference). Unofficial fan patches; not endorsed by the original rights holders.
