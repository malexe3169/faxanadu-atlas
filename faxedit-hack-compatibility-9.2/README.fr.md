# Compatibilité des hacks de FaxEdit 9.2 9.2-1

*[English version](README.md)*

Quels hacks généraux de FaxEdit bêta 9.2 « Crowning Achievement » fonctionnent
ensemble. Chaque paire a été bâtie avec l'outil en ligne de commande de FaxEdit, dans
les deux ordres, puis vérifiée pour trouver les builds qui réussissent mais perdent une
partie d'un hack.

La plupart des paires marchent : 371 des 378 se bâtissent ensemble. Celles qui ne
marchent pas sont listées sous le tableau.

## Le tableau

- `·` se bâtissent ensemble, dans les deux ordres
- `↔` se bâtissent dans un seul ordre (voir Ordre)
- `S` refusé : pas assez de place dans la banque 15
- `C` refusé : les deux modifient le même code
- `!` se bâtit, mais une partie d'un des hacks est perdue
- `=` deux modes du même hack
- `—` le hack lui-même

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

## Les paires qui ne marchent pas

- **Combat Feel + Poison Pickup** `!` : FaxEdit refuse Poison Pickup puis Combat Feel.
  L'autre ordre se bâtit, mais quand Combat Feel change le temps d'invincibilité
  (`iframes`, 90 testé), Poison Pickup écrase un octet de ce changement à $C84A.
  N'utilisez pas le réglage `iframes` de Combat Feel avec Poison Pickup.
- **Combat Feel + Run Control** `C` : avec `profile=zelda2`, les deux modifient la
  vérification de la vitesse de marche à $E2A6, et FaxEdit refuse la paire dans les
  deux ordres.
- **Ladder Crown + Jump Control** `S` : Crown ajoute du code pour les échelles quand
  Jump Control est là, donc la paire a besoin de 785 octets de la banque 15. Il y en
  a 780.
- **Ladder Crown + Smart Mattock** `S` : 605 + 178 octets, plus que la banque 15 n'en
  contient.
- **Day/Night Cycle + Infected Tint** et **Day/Night Cycle + Time of Day** `↔` :
  mettez Day/Night Cycle en premier (voir Ordre).
- **Ladder Crown + Ladder Crown mode=floor** `=` : le même hack. Choisissez un mode.

## Ordre

Day/Night Cycle a besoin de la banque 9 à $8000. Mettez-le avant Infected Tint et Time
of Day, qui prennent la première place libre dans la banque 9. Frame Scheduler passe
avant les trois.

## Place

Le code que le jeu peut appeler à tout moment va dans la banque 15, dans une zone de
780 octets partagée par tous les hacks. D'autres hacks mettent leur code dans une
banque que le jeu charge au besoin : la banque 14 (une zone de
587 octets), la banque 12 ou la banque 9.

| # | Hack | Testé avec | Banque 15 | Autre banque | RAM |
|---|---|---|---:|---|---|
| 1 | `KillSwitch` | réglages par défaut | 15 | — | — |
| 2 | `SameWorldTransPal2Mus` | réglages par défaut | 0 | — | — |
| 3 | `FastStart` | réglages par défaut | 0 | banque 14 : 18 | — |
| 4 | `QuestFlagItemDrops` | réglages par défaut | 0 | banque 14 : 34 | — |
| 5 | `BossLockedItems` | réglages par défaut | 0 | banque 14 : 34 | — |
| 6 | `FlexibleItems` | réglages par défaut | 0 | banque 12 : 27 | — |
| 7 | `FogRules` | `FogRules rules=0:1+0:3+7` | 29 | — | — |
| 8 | `PoisonPickup` | réglages par défaut | 0 | — | — |
| 9 | `SRAM` | réglages par défaut | 0 | — | — |
| 10 | `TextSpeed` | réglages par défaut | 12 | — | — |
| 11 | `BugFixes` | réglages par défaut | 0 | — | — |
| 12 | `ConditionalScript` | réglages par défaut | 0 | banque 14 : 29 | — |
| 13 | `AtlasDevFrameScheduler` | réglages par défaut | 156 | — | $04D8–$04DE |
| 14 | `AtlasDevDayNightCycle` | réglages par défaut | 0 | banque 9 | $04E2–$04E6 |
| 15 | `AtlasDevInfectedTint` | réglages par défaut | 0 | banque 9 | $04E7–$04E8 |
| 16 | `AtlasDevTimeOfDay` | réglages par défaut | 0 | banque 9 | $04E9–$04EC |
| 17 | `AtlasDevJumpControl` | réglages par défaut | 152 | — | $04DF |
| 18 | `AtlasDevFallControl` | réglages par défaut | 85 | — | — |
| 19 | `AtlasDevLadderControl` | `AtlasDevLadderControl up=256 down=256` | 0 | — | — |
| 20 | `AtlasDevLadderCrown` | réglages par défaut | 605 | — | $04E0–$04E1 |
| 21 | `AtlasDevLadderCrown mode=floor` | réglages par défaut | 315 | — | — |
| 22 | `AtlasDevRunControl` | réglages par défaut | 164 | — | — |
| 23 | `AtlasDevSmartMattock` | réglages par défaut | 178 | — | — |
| 24 | `AtlasDevSmartKeys` | réglages par défaut | 0 | — | — |
| 25 | `AtlasDevCombatFeel` | `AtlasDevCombatFeel profile=zelda2` | 0 | — | — |
| 26 | `AtlasDevEnemyStats` | `AtlasDevEnemyStats profile=hard` | 0 | — | — |
| 27 | `AtlasDevSirGawaineControl` | réglages par défaut | 0 | banque 14 : 360 | — |
| 28 | `AtlasDevWolfmanControl` | réglages par défaut | 0 | banque 14 : 360 | — |

Deux hacks qui entrent chacun seul peuvent ne pas entrer ensemble. Additionnez la
colonne Banque 15 : au-delà de 780, ça ne se bâtit pas. Les rôles de palette ont aussi
besoin des 156 octets de Frame Scheduler.

## Changement de banque

Les hacks qui gardent leur code dans une banque chargée au besoin (14, 12 ou 9) n'ont
jamais manqué de place ici. Ladder Crown, Jump Control et Smart Mattock mettent tout
leur code dans la banque 15 : c'est pour ça que ce sont eux qui n'entrent pas ensemble.

## RAM

Les hacks qui gardent un état en RAM utilisent des octets séparés : Frame Scheduler
$04D8–$04DE, Jump Control $04DF, Ladder Crown $04E0–$04E1 (mode crown), Day/Night
Cycle $04E2–$04E6, Infected Tint $04E7–$04E8, Time of Day $04E9–$04EC.

## Comment c'est testé

Chaque paire a été bâtie à partir d'une ROM USA propre avec l'outil en ligne de
commande de FaxEdit bêta 9.2, dans les deux ordres : 756 builds. Ensuite, les octets
que chaque hack change seul ont été comparés avec ceux de tous les autres, hors des
zones où FaxEdit place le code des hacks, pour trouver une build qui réussit mais perd
un changement. C'est comme ça que le cas Combat Feel et Poison Pickup a été trouvé.

La plupart des hacks ont été testés avec leurs réglages par défaut, et la colonne Testé
avec montre la ligne exacte. Les réglages par défaut de Combat Feel ne changent rien,
alors il a été testé avec `profile=zelda2`, et avec `iframes=90` contre Poison Pickup.
Enemy Stats a été testé avec `profile=hard`. D'autres réglages peuvent changer plus de
code.

## Non testés

Dynamic Tilesets, Item Scripts.

## Versions

Les versions du tableau suivent celles de FaxEdit : 9.2 est la version de FaxEdit, -1 la
version du tableau.

- 9.2-1 : les hacks généraux de FaxEdit bêta 9.2 « Crowning Achievement », testés sur
  la ROM USA.

## Crédits

Les hacks généraux font partie de [FaxEdit](https://github.com/kaimitai/faxedit), de
Kai E. Frøland.
