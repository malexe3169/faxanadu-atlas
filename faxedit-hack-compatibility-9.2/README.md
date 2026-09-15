# FaxEdit 9.2 hack compatibility 9.2-2

*[Version française](README.fr.md)*

Which FaxEdit beta-9.2 "Crowning Achievement" general hacks work together, and how the
hacks that are not in FaxEdit yet fit with them. Every pair was built with FaxEdit's
command-line tool in both orders, then checked for builds that succeed but lose part
of a hack.

- 🟠 **not in FaxEdit yet**: Vertical Scroll and 20 monster controls, tested on
  FaxEdit 9.2 with their changes added.
- 🔵 **not a FaxEdit hack**: Branches in Motion.

Among the FaxEdit 9.2 hacks, 371 of the 378 pairs build together. With the 🟠 hacks,
794 of 798 more pairs do. The ones that don't are listed under the tables.

## How to read the tables

- `·` builds together, in both orders
- `↔` builds in one order only (see Order)
- `S` refused: not enough room in bank 15
- `C` refused: both change the same code
- `R` refused: both keep state in the same RAM
- `!` builds, but part of one hack is lost
- `=` two modes of the same hack
- `—` the hack itself

The numbers are the rows of the key table under Space.

## FaxEdit 9.2 hacks

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

## 🟠 Hacks not in FaxEdit yet

Each row is a hack that is not in FaxEdit yet, against every hack in the key table.

| # | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14 | 15 | 16 | 17 | 18 | 19 | 20 | 21 | 22 | 23 | 24 | 25 | 26 | 27 | 28 | 29 | 30 | 31 | 32 | 33 | 34 | 35 | 36 | 37 | 38 | 39 | 40 | 41 | 42 | 43 | 44 | 45 | 46 | 47 | 48 | 49 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 29 🟠 `AtlasDevMaskmanControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
| 30 🟠 `AtlasDevHornetControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
| 31 🟠 `AtlasDevYuinaruControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
| 32 🟠 `AtlasDevBihorudaControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
| 33 🟠 `AtlasDevYareekaControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
| 34 🟠 `AtlasDevRipasheikuControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
| 35 🟠 `AtlasDevNagaControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · | · |
| 36 🟠 `AtlasDevPakukameControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · | · |
| 37 🟠 `AtlasDevSugataControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · | · |
| 38 🟠 `AtlasDevGiantBeesControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · | · |
| 39 🟠 `AtlasDevZorugeriruControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · | · |
| 40 🟠 `AtlasDevNecronAidesControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · | · |
| 41 🟠 `AtlasDevIshiisuControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · | · |
| 42 🟠 `AtlasDevTamazutsuControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · | · |
| 43 🟠 `AtlasDevBorabohraControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · | · |
| 44 🟠 `AtlasDevMagmanControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · | · |
| 45 🟠 `AtlasDevKingGrieveControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · | · |
| 46 🟠 `AtlasDevNashControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · | · |
| 47 🟠 `AtlasDevExecutionHoodControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · | · |
| 48 🟠 `AtlasDevShadowEuraControl` | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — | · |
| 49 🟠 `AtlasDevVerticalScroll` | · | · | · | · | · | · | · | · | · | · | · | · | · | **R** | **R** | **R** | · | · | · | **S** | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | · | — |

## Pairs that don't work

### FaxEdit 9.2 hacks

- **Combat Feel + Poison Pickup** `!`: FaxEdit refuses Poison Pickup then Combat Feel. The other order builds, but when Combat Feel changes the invincibility time (`iframes`, 90 tested), Poison Pickup overwrites one byte of that change at $C84A. Don't use Combat Feel's `iframes` setting with Poison Pickup.
- **Combat Feel + Run Control** `C`: with `profile=zelda2`, both change the walking speed check at $E2A6, and FaxEdit refuses the pair in both orders.
- **Ladder Crown + Jump Control** `S`: Crown adds ladder handling when Jump Control is there, so the pair needs 785 bytes of bank 15. There are 780.
- **Ladder Crown + Smart Mattock** `S`: 605 + 178 bytes, more than bank 15 holds.
- **Day/Night Cycle + Infected Tint** `↔`: list Day/Night Cycle first (see Order).
- **Day/Night Cycle + Time of Day** `↔`: list Day/Night Cycle first (see Order).
- **Ladder Crown + Ladder Crown mode=floor** `=`: the same hack. Pick one mode.

### With 🟠 hacks

- 🟠 **Vertical Scroll + Day/Night Cycle** `R`: both keep state in $04E2–$04E6. Each refuses the other.
- 🟠 **Vertical Scroll + Infected Tint** `R`: both keep state in $04E7–$04E8. Each refuses the other.
- 🟠 **Vertical Scroll + Time of Day** `R`: both keep state in $04E9–$04EC. Each refuses the other.
- 🟠 **Vertical Scroll + Ladder Crown** `S`: 391 + 605 bytes, more than bank 15 holds. Crown's floor mode fits.

## Order

Day/Night Cycle needs bank 9 at $8000. List it before Infected Tint and Time of Day,
which take the first free spot in bank 9. Frame Scheduler comes before all three.

## Space

Code the game can call at any moment goes in bank 15, in one 780-byte area shared by
every hack. Other hacks put their code in a bank the game switches in: bank 14 (a
587-byte area), bank 12 or bank 9.

| # | Hack | Status | Tested with | Bank 15 | Other bank | RAM |
|---|---|---|---|---:|---|---|
| 1 | `KillSwitch` | FaxEdit 9.2 | defaults | 15 | — | — |
| 2 | `SameWorldTransPal2Mus` | FaxEdit 9.2 | defaults | 0 | — | — |
| 3 | `FastStart` | FaxEdit 9.2 | defaults | 0 | bank 14: 18 | — |
| 4 | `QuestFlagItemDrops` | FaxEdit 9.2 | defaults | 0 | bank 14: 34 | — |
| 5 | `BossLockedItems` | FaxEdit 9.2 | defaults | 0 | bank 14: 34 | — |
| 6 | `FlexibleItems` | FaxEdit 9.2 | defaults | 0 | bank 12: 27 | — |
| 7 | `FogRules` | FaxEdit 9.2 | `FogRules rules=0:1+0:3+7` | 29 | — | — |
| 8 | `PoisonPickup` | FaxEdit 9.2 | defaults | 0 | — | — |
| 9 | `SRAM` | FaxEdit 9.2 | defaults | 0 | — | — |
| 10 | `TextSpeed` | FaxEdit 9.2 | defaults | 12 | — | — |
| 11 | `BugFixes` | FaxEdit 9.2 | defaults | 0 | — | — |
| 12 | `ConditionalScript` | FaxEdit 9.2 | defaults | 0 | bank 14: 29 | — |
| 13 | `AtlasDevFrameScheduler` | FaxEdit 9.2 | defaults | 156 | — | $04D8–$04DE |
| 14 | `AtlasDevDayNightCycle` | FaxEdit 9.2 | defaults | 0 | bank 9 | $04E2–$04E6 |
| 15 | `AtlasDevInfectedTint` | FaxEdit 9.2 | defaults | 0 | bank 9 | $04E7–$04E8 |
| 16 | `AtlasDevTimeOfDay` | FaxEdit 9.2 | defaults | 0 | bank 9 | $04E9–$04EC |
| 17 | `AtlasDevJumpControl` | FaxEdit 9.2 | defaults | 152 | — | $04DF |
| 18 | `AtlasDevFallControl` | FaxEdit 9.2 | defaults | 85 | — | — |
| 19 | `AtlasDevLadderControl` | FaxEdit 9.2 | `AtlasDevLadderControl up=256 down=256` | 0 | — | — |
| 20 | `AtlasDevLadderCrown` | FaxEdit 9.2 | defaults | 605 | — | $04E0–$04E1 |
| 21 | `AtlasDevLadderCrown mode=floor` | FaxEdit 9.2 | defaults | 315 | — | — |
| 22 | `AtlasDevRunControl` | FaxEdit 9.2 | defaults | 164 | — | — |
| 23 | `AtlasDevSmartMattock` | FaxEdit 9.2 | defaults | 178 | — | — |
| 24 | `AtlasDevSmartKeys` | FaxEdit 9.2 | defaults | 0 | — | — |
| 25 | `AtlasDevCombatFeel` | FaxEdit 9.2 | `AtlasDevCombatFeel profile=zelda2` | 0 | — | — |
| 26 | `AtlasDevEnemyStats` | FaxEdit 9.2 | `AtlasDevEnemyStats profile=hard` | 0 | — | — |
| 27 | `AtlasDevSirGawaineControl` | FaxEdit 9.2 | defaults | 0 | bank 14: 360 | — |
| 28 | `AtlasDevWolfmanControl` | FaxEdit 9.2 | defaults | 0 | bank 14: 360 | — |
| 29 | `AtlasDevMaskmanControl` | 🟠 not in FaxEdit yet | `AtlasDevMaskmanControl spear=24` | 0 | bank 14: 34 | — |
| 30 | `AtlasDevHornetControl` | 🟠 not in FaxEdit yet | `AtlasDevHornetControl speed=8` | 0 | — | — |
| 31 | `AtlasDevYuinaruControl` | 🟠 not in FaxEdit yet | `AtlasDevYuinaruControl xspeed=16` | 0 | — | — |
| 32 | `AtlasDevBihorudaControl` | 🟠 not in FaxEdit yet | `AtlasDevBihorudaControl xspeed=32` | 0 | — | — |
| 33 | `AtlasDevYareekaControl` | 🟠 not in FaxEdit yet | `AtlasDevYareekaControl dash=32` | 0 | — | — |
| 34 | `AtlasDevRipasheikuControl` | 🟠 not in FaxEdit yet | `AtlasDevRipasheikuControl drift=16` | 0 | — | — |
| 35 | `AtlasDevNagaControl` | 🟠 not in FaxEdit yet | `AtlasDevNagaControl chase=16` | 0 | — | — |
| 36 | `AtlasDevPakukameControl` | 🟠 not in FaxEdit yet | `AtlasDevPakukameControl delay=32` | 0 | — | — |
| 37 | `AtlasDevSugataControl` | 🟠 not in FaxEdit yet | `AtlasDevSugataControl damage=4` | 0 | — | — |
| 38 | `AtlasDevGiantBeesControl` | 🟠 not in FaxEdit yet | `AtlasDevGiantBeesControl rise=8` | 0 | — | — |
| 39 | `AtlasDevZorugeriruControl` | 🟠 not in FaxEdit yet | `AtlasDevZorugeriruControl rest=4 windup=16` | 0 | — | — |
| 40 | `AtlasDevNecronAidesControl` | 🟠 not in FaxEdit yet | `AtlasDevNecronAidesControl climb=4` | 19 | — | — |
| 41 | `AtlasDevIshiisuControl` | 🟠 not in FaxEdit yet | `AtlasDevIshiisuControl walk=6` | 0 | — | — |
| 42 | `AtlasDevTamazutsuControl` | 🟠 not in FaxEdit yet | `AtlasDevTamazutsuControl hide=30` | 0 | — | — |
| 43 | `AtlasDevBorabohraControl` | 🟠 not in FaxEdit yet | `AtlasDevBorabohraControl speed=16` | 0 | — | — |
| 44 | `AtlasDevMagmanControl` | 🟠 not in FaxEdit yet | `AtlasDevMagmanControl hide=30` | 0 | — | — |
| 45 | `AtlasDevKingGrieveControl` | 🟠 not in FaxEdit yet | `AtlasDevKingGrieveControl shots=8` | 0 | — | — |
| 46 | `AtlasDevNashControl` | 🟠 not in FaxEdit yet | `AtlasDevNashControl hide=60` | 0 | — | — |
| 47 | `AtlasDevExecutionHoodControl` | 🟠 not in FaxEdit yet | `AtlasDevExecutionHoodControl walk=8` | 0 | — | — |
| 48 | `AtlasDevShadowEuraControl` | 🟠 not in FaxEdit yet | `AtlasDevShadowEuraControl walk=10 pause=60` | 0 | — | — |
| 49 | `AtlasDevVerticalScroll` | 🟠 not in FaxEdit yet | defaults | 391 | bank 9: 532 | $04E2–$04EC, $9C |
| 50 | `Branches in Motion` | 🔵 not a FaxEdit hack | its own installer | 425 | bank 9, bank 5 | $04D8–$04DF, $04EF–$04F7 |

Two hacks can each fit alone and still not fit together. Add up the Bank 15 column:
more than 780 won't build. The palette roles also need Frame Scheduler's 156.

## Bank switching

The hacks that keep their code in a switched bank (14, 12 or 9) never ran out of room
here. Ladder Crown, Jump Control and Smart Mattock put all of their code in bank 15,
which is why they are the ones that don't fit together. 🟠 Vertical Scroll already
keeps 532 of its bytes in bank 9. What stays in bank 15 includes the part that runs
during the screen interrupt, which can't switch banks.

## RAM

The hacks that keep state in RAM: Frame Scheduler $04D8–$04DE, Jump Control $04DF,
Ladder Crown $04E0–$04E1 (crown mode), Day/Night Cycle $04E2–$04E6, Infected Tint
$04E7–$04E8, Time of Day $04E9–$04EC. 🟠 Vertical Scroll uses $04E2–$04EC and $9C,
so it and the three palette roles refuse each other.

## 🔵 Branches in Motion

The reactive music engine. It is not a FaxEdit hack: its own installer puts it on a
clean ROM, and it can't be combined with any FaxEdit hack yet. It uses 425 bytes of
the same bank 15 area and most of bank 9.

## How it was tested

Each pair was built from a clean USA ROM with FaxEdit beta-9.2's command-line tool, in
both orders. Then the bytes each hack changes on its own were compared with every
other hack's, outside the areas where FaxEdit places hack code, to catch a build that
succeeds but loses a change. That is how the Combat Feel and Poison Pickup case was
found.

The 🟠 hacks were tested with one FaxEdit build that has the 9.2 hacks, the monster
controls and Vertical Scroll together. It gives the same result as FaxEdit 9.2 for
every pair of 9.2 hacks.

Most hacks were tested with their default settings, and the Tested with column shows
the exact line. Combat Feel's defaults change nothing, so it was tested with
`profile=zelda2`, and with `iframes=90` against Poison Pickup. Enemy Stats was tested
with `profile=hard`. The monster controls change nothing at their defaults either, so
each one was tested with the example setting from its documentation. Other settings
can change more code.

## Not tested

Dynamic Tilesets, Item Scripts.

## Versions

The table's versions follow FaxEdit's: 9.2 is the FaxEdit version, -1 and -2 the
versions of the table.

- 9.2-1: the FaxEdit beta-9.2 "Crowning Achievement" general hacks, tested on the USA ROM.
- 9.2-2: adds the 🟠 hacks that are not in FaxEdit yet and 🔵 Branches in Motion.

## Credits

The general hacks are part of Kai E. Frøland's [FaxEdit](https://github.com/kaimitai/faxedit).
