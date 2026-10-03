# Atlas French Dialogue 0.1

*[Version française](README.fr.md)*

French dialogue for the original game, in two variants: France French (`fr`)
and spoken Québec French / joual (`qc`). The Western builds translate **dialogue
only**. The Japanese builds also adapt name entry to the existing PR's Latin
character set. Menus, item names, title, and password alphabet stay original.

Based on the FR/QC scripts in
[UnsavoryMaggot's Faxanadu Translation Table, PR 2](https://github.com/UnsavoryMaggot/Faxanadu-Translation-Table/pull/2).
The Translation Table and [Faxanadu Retranslation](https://github.com/UnsavoryMaggot/Faxanadu-Retranslation)
are the foundation of this adaptation, not competing projects.

Unlike the earlier FR/QC patches over Retranslation, these patches start from
clean retail ROMs. Each base keeps its original gameplay, music, art outside
text glyphs, password saving, mapper, and ROM size. No SRAM saves, QoL features,
gameplay fixes, or Retranslation ROM expansion are included. The Japanese base
needs a small Latin-dialogue renderer and compatible name-entry adapter; its
Japanese headings and Delete/Finish labels remain. This is not a full menu translation.

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
references are removed on Western bases; Japan preserves name substitution.
Japanese rank references use “un nouveau titre” while
keeping the original menu's rank labels. Prices and quest instructions follow
each clean base's mechanics. This is not a newly researched Japanese translation.

Experimental version 0.1. See the per-build JSON manifests for ROM and patch
hashes. Hardware compatibility is not guaranteed.

## Japanese name entry

Use the D-pad and A to select characters. The bottom-row button marked `a`, `é`,
or `A` cycles between uppercase, lowercase, and accents. Digits, punctuation,
and space are available on every page. Names retain the original four-character
limit; B moves the editing cursor back. Delete and Finish keep their Japanese
labels. The ten accents are `éèêàâîôûùç`, reused from the PR; uppercase accented
letters are not included in that source set.

Credits: UnsavoryMaggot (Translation
Table and Retranslation foundation), and chipx86 (Faxanadu reverse-engineering
reference). Unofficial fan patches; not endorsed by the original rights holders.

## Québec wording

QC now applies 325 editable row overrides to the pinned contribution; it is no
longer the earlier fourteen-line formal wording variant. Townspeople and merchants
use spoken Québec expressions and contractions, while the king and priests keep
a more solemn register. Examples: “Qu'est-ce que j'te sers?”, “Ma job? Ginji!
J'vide les poches!”, and “La magie d'attaque fait rien pantoute”. Quest facts,
prices, item names, mechanics and FR dialogue remain unchanged.

The authored override source is included as [qc-joual.tsv](qc-joual.tsv); its hash
and count are recorded in each QC manifest.
