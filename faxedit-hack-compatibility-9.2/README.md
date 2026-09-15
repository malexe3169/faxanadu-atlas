# FaxEdit 9.2 hack compatibility 9.2-1

*[Version française](README.fr.md)*

Which FaxEdit beta-9.2 "Crowning Achievement" general hacks work together. Every
pair was built with FaxEdit's command-line tool in both orders, then checked for
builds that succeed but lose part of a hack.

Most pairs are fine: 371 of the 378 build together. The ones that don't are
listed under the table.

## The table

- `·` builds together, in both orders
- `↔` builds in one order only (see Order)
- `S` refused: not enough room in bank 15
- `C` refused: both change the same code
- `!` builds, but part of one hack is lost
- `=` two modes of the same hack
- `—` the hack itself

| # | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 `KillSwitch` | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
| 2 `SameWorldTransPal2Mus` | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
| 3 `FastStart` | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
| 4 `QuestFlagItemDrops` | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
| 5 `BossLockedItems` | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
| 6 `FlexibleItems` | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
| 7 `FogRules` | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
| 8 `PoisonPickup` | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | **!** | · | · | · |
| 9 `SRAM` | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
| 10 `TextSpeed` | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
| 11 `BugFixes` | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
| 12 `ConditionalScript` | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
| 13 `AtlasDevFrameScheduler` | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
| 14 `AtlasDevDayNightCycle` | · | · | · | · | · | · | · | · | · | · | · | · | · | — | ↔ | ↔ | · | · | · | · | · | · | · | · | · | · | · | · |
| 15 `AtlasDevInfectedTint` | · | · | · | · | · | · | · | · | · | · | · | · | · | ↔ | — | · | · | · | · | · | · | · | · | · | · | · | · | · |
| 16 `AtlasDevTimeOfDay` | · | · | · | · | · | · | · | · | · | · | · | · | · | ↔ | · | — | · | · | · | · | · | · | · | · | · | · | · | · |
| 17 `AtlasDevJumpControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | **S** | · | · | · | · | · | · | · | · |
| 18 `AtlasDevFallControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · |
| 19 `AtlasDevLadderControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · |
| 20 `AtlasDevLadderCrown` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | **S** | · | · | — | = | · | **S** | · | · | · | · | · |
| 21 `AtlasDevLadderCrown mode=floor` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | = | — | · | · | · | · | · | · | · |
| 22 `AtlasDevRunControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | **C** | · | · | · |
| 23 `AtlasDevSmartMattock` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | **S** | · | · | — | · | · | · | · | · |
| 24 `AtlasDevSmartKeys` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · |
| 25 `AtlasDevCombatFeel` | · | · | · | · | · | · | · | **!** | · | · | · | · | · | · | · | · | · | · | · | · | · | **C** | · | · | — | · | · | · |
| 26 `AtlasDevEnemyStats` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · |
| 27 `AtlasDevSirGawaineControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · |
| 28 `AtlasDevWolfmanControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — |

## Pairs that don't work

- **Combat Feel + Poison Pickup** `!`: FaxEdit refuses Poison Pickup then Combat Feel.
  The other order builds, but when Combat Feel changes the invincibility time
  (`iframes`, 90 tested), Poison Pickup overwrites one byte of that change at $C84A.
  Don't use Combat Feel's `iframes` setting with Poison Pickup.
- **Combat Feel + Run Control** `C`: with `profile=zelda2`, both change the walking
  speed check at $E2A6, and FaxEdit refuses the pair in both orders.
- **Ladder Crown + Jump Control** `S`: Crown adds ladder handling when Jump Control is
  there, so the pair needs 785 bytes of bank 15. There are 780.
- **Ladder Crown + Smart Mattock** `S`: 605 + 178 bytes, more than bank 15 holds.
- **Day/Night Cycle + Infected Tint** and **Day/Night Cycle + Time of Day** `↔`: list
  Day/Night Cycle first (see Order).
- **Ladder Crown + Ladder Crown mode=floor** `=`: the same hack. Pick one mode.

## Order

Day/Night Cycle needs bank 9 at $8000. List it before Infected Tint and Time of Day,
which take the first free spot in bank 9. Frame Scheduler comes before all three.

## Space

Code the game can call at any moment goes in bank 15, in one 780-byte area shared by
every hack. Other hacks put their code in a bank the game switches in: bank 14 (a
587-byte area), bank 12 or bank 9.

| # | Hack | Tested with | Bank 15 | Other bank | RAM |
|---|---|---|---:|---|---|
| 1 | `KillSwitch` | defaults | 15 | — | — |
| 2 | `SameWorldTransPal2Mus` | defaults | 0 | — | — |
| 3 | `FastStart` | defaults | 0 | bank 14: 18 | — |
| 4 | `QuestFlagItemDrops` | defaults | 0 | bank 14: 34 | — |
| 5 | `BossLockedItems` | defaults | 0 | bank 14: 34 | — |
| 6 | `FlexibleItems` | defaults | 0 | bank 12: 27 | — |
| 7 | `FogRules` | `FogRules rules=0:1+0:3+7` | 29 | — | — |
| 8 | `PoisonPickup` | defaults | 0 | — | — |
| 9 | `SRAM` | defaults | 0 | — | — |
| 10 | `TextSpeed` | defaults | 12 | — | — |
| 11 | `BugFixes` | defaults | 0 | — | — |
| 12 | `ConditionalScript` | defaults | 0 | bank 14: 29 | — |
| 13 | `AtlasDevFrameScheduler` | defaults | 156 | — | $04D8–$04DE |
| 14 | `AtlasDevDayNightCycle` | defaults | 0 | bank 9 | $04E2–$04E6 |
| 15 | `AtlasDevInfectedTint` | defaults | 0 | bank 9 | $04E7–$04E8 |
| 16 | `AtlasDevTimeOfDay` | defaults | 0 | bank 9 | $04E9–$04EC |
| 17 | `AtlasDevJumpControl` | defaults | 152 | — | $04DF |
| 18 | `AtlasDevFallControl` | defaults | 85 | — | — |
| 19 | `AtlasDevLadderControl` | `AtlasDevLadderControl up=256 down=256` | 0 | — | — |
| 20 | `AtlasDevLadderCrown` | defaults | 605 | — | $04E0–$04E1 |
| 21 | `AtlasDevLadderCrown mode=floor` | defaults | 315 | — | — |
| 22 | `AtlasDevRunControl` | defaults | 164 | — | — |
| 23 | `AtlasDevSmartMattock` | defaults | 178 | — | — |
| 24 | `AtlasDevSmartKeys` | defaults | 0 | — | — |
| 25 | `AtlasDevCombatFeel` | `AtlasDevCombatFeel profile=zelda2` | 0 | — | — |
| 26 | `AtlasDevEnemyStats` | `AtlasDevEnemyStats profile=hard` | 0 | — | — |
| 27 | `AtlasDevSirGawaineControl` | defaults | 0 | bank 14: 360 | — |
| 28 | `AtlasDevWolfmanControl` | defaults | 0 | bank 14: 360 | — |

Two hacks can each fit alone and still not fit together. Add up the Bank 15 column:
more than 780 won't build. The palette roles also need Frame Scheduler's 156.

## Bank switching

The hacks that keep their code in a switched bank (14, 12 or 9) never ran out of room
here. Ladder Crown, Jump Control and Smart Mattock put all of their code in bank 15,
which is why they are the ones that don't fit together.

## RAM

The hacks that keep state in RAM use separate bytes: Frame Scheduler $04D8–$04DE,
Jump Control $04DF, Ladder Crown $04E0–$04E1 (crown mode), Day/Night Cycle
$04E2–$04E6, Infected Tint $04E7–$04E8, Time of Day $04E9–$04EC.

## How it was tested

Each pair was built from a clean USA ROM with FaxEdit beta-9.2's command-line tool, in
both orders: 756 builds. Then the bytes each hack changes on its own were compared
with every other hack's, outside the areas where FaxEdit places hack code, to catch a
build that succeeds but loses a change. That is how the Combat Feel and Poison Pickup
case was found.

Most hacks were tested with their default settings, and the Tested with column shows
the exact line. Combat Feel's defaults change nothing, so it was tested with
`profile=zelda2`, and with `iframes=90` against Poison Pickup. Enemy Stats was tested
with `profile=hard`. Other settings can change more code.

## Not tested

Dynamic Tilesets, Item Scripts.

## Versions

The table's versions follow FaxEdit's: 9.2 is the FaxEdit version, -1 the version of
the table.

- 9.2-1: the FaxEdit beta-9.2 "Crowning Achievement" general hacks, tested on the USA ROM.

## Credits

The general hacks are part of Kai E. Frøland's [FaxEdit](https://github.com/kaimitai/faxedit).
