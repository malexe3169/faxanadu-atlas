# Compatibilité des hacks de FaxEdit 9.2 9.2-2

*[English version](README.md)*

Quels hacks généraux de FaxEdit bêta 9.2 « Crowning Achievement » fonctionnent
ensemble, et comment les hacks qui ne sont pas encore dans FaxEdit s'y ajoutent.
Chaque paire a été bâtie avec l'outil en ligne de commande de FaxEdit, dans les deux
ordres, puis vérifiée pour trouver les builds qui réussissent mais perdent une partie
d'un hack.

- 🟠 **pas encore dans FaxEdit** : Vertical Scroll et 20 contrôles de monstres,
  testés sur FaxEdit 9.2 avec leurs changements ajoutés.
- 🔵 **pas un hack de FaxEdit** : Branches in Motion.

Parmi les hacks de FaxEdit 9.2, 371 des 378 paires se bâtissent ensemble. Avec les
hacks 🟠, 794 des 798 paires de plus aussi. Celles qui ne marchent pas sont listées
sous les tableaux.

## Comment lire les tableaux

- `·` se bâtissent ensemble, dans les deux ordres
- `↔` se bâtissent dans un seul ordre (voir Ordre)
- `S` refusé : pas assez de place dans la banque 15
- `C` refusé : les deux modifient le même code
- `R` refusé : les deux gardent un état dans la même RAM
- `!` se bâtit, mais une partie d'un des hacks est perdue
- `=` deux modes du même hack
- `—` le hack lui-même

Les numéros sont les lignes du tableau de la section Place.

## Hacks de FaxEdit 9.2

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

## 🟠 Hacks pas encore dans FaxEdit

Chaque ligne est un hack qui n'est pas encore dans FaxEdit, contre chaque hack du
tableau de la section Place.

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

## Les paires qui ne marchent pas

### Hacks de FaxEdit 9.2

- **Combat Feel + Poison Pickup** `!` : FaxEdit refuse Poison Pickup puis Combat Feel. L'autre ordre se bâtit, mais quand Combat Feel change le temps d'invincibilité (`iframes`, 90 testé), Poison Pickup écrase un octet de ce changement à $C84A. N'utilisez pas le réglage `iframes` de Combat Feel avec Poison Pickup.
- **Combat Feel + Run Control** `C` : avec `profile=zelda2`, les deux modifient la vérification de la vitesse de marche à $E2A6, et FaxEdit refuse la paire dans les deux ordres.
- **Ladder Crown + Jump Control** `S` : Crown ajoute du code pour les échelles quand Jump Control est là, donc la paire a besoin de 785 octets de la banque 15. Il y en a 780.
- **Ladder Crown + Smart Mattock** `S` : 605 + 178 octets, plus que la banque 15 n'en contient.
- **Day/Night Cycle + Infected Tint** `↔` : mettez Day/Night Cycle en premier (voir Ordre).
- **Day/Night Cycle + Time of Day** `↔` : mettez Day/Night Cycle en premier (voir Ordre).
- **Ladder Crown + Ladder Crown mode=floor** `=` : le même hack. Choisissez un mode.

### Avec les hacks 🟠

- 🟠 **Vertical Scroll + Day/Night Cycle** `R` : les deux gardent un état à $04E2–$04E6. Chacun refuse l'autre.
- 🟠 **Vertical Scroll + Infected Tint** `R` : les deux gardent un état à $04E7–$04E8. Chacun refuse l'autre.
- 🟠 **Vertical Scroll + Time of Day** `R` : les deux gardent un état à $04E9–$04EC. Chacun refuse l'autre.
- 🟠 **Vertical Scroll + Ladder Crown** `S` : 391 + 605 octets, plus que la banque 15 n'en contient. Le mode floor de Crown entre.

## Ordre

Day/Night Cycle a besoin de la banque 9 à $8000. Mettez-le avant Infected Tint et Time
of Day, qui prennent la première place libre dans la banque 9. Frame Scheduler passe
avant les trois.

## Place

Le code que le jeu peut appeler à tout moment va dans la banque 15, dans une zone de
780 octets partagée par tous les hacks. D'autres hacks mettent leur code dans une
banque que le jeu charge au besoin : la banque 14 (une zone de 587 octets), la
banque 12 ou la banque 9.

| # | Hack | Statut | Testé avec | Banque 15 | Autre banque | RAM |
|---|---|---|---|---:|---|---|
| 1 | `KillSwitch` | FaxEdit 9.2 | réglages par défaut | 15 | — | — |
| 2 | `SameWorldTransPal2Mus` | FaxEdit 9.2 | réglages par défaut | 0 | — | — |
| 3 | `FastStart` | FaxEdit 9.2 | réglages par défaut | 0 | banque 14 : 18 | — |
| 4 | `QuestFlagItemDrops` | FaxEdit 9.2 | réglages par défaut | 0 | banque 14 : 34 | — |
| 5 | `BossLockedItems` | FaxEdit 9.2 | réglages par défaut | 0 | banque 14 : 34 | — |
| 6 | `FlexibleItems` | FaxEdit 9.2 | réglages par défaut | 0 | banque 12 : 27 | — |
| 7 | `FogRules` | FaxEdit 9.2 | `FogRules rules=0:1+0:3+7` | 29 | — | — |
| 8 | `PoisonPickup` | FaxEdit 9.2 | réglages par défaut | 0 | — | — |
| 9 | `SRAM` | FaxEdit 9.2 | réglages par défaut | 0 | — | — |
| 10 | `TextSpeed` | FaxEdit 9.2 | réglages par défaut | 12 | — | — |
| 11 | `BugFixes` | FaxEdit 9.2 | réglages par défaut | 0 | — | — |
| 12 | `ConditionalScript` | FaxEdit 9.2 | réglages par défaut | 0 | banque 14 : 29 | — |
| 13 | `AtlasDevFrameScheduler` | FaxEdit 9.2 | réglages par défaut | 156 | — | $04D8–$04DE |
| 14 | `AtlasDevDayNightCycle` | FaxEdit 9.2 | réglages par défaut | 0 | banque 9 | $04E2–$04E6 |
| 15 | `AtlasDevInfectedTint` | FaxEdit 9.2 | réglages par défaut | 0 | banque 9 | $04E7–$04E8 |
| 16 | `AtlasDevTimeOfDay` | FaxEdit 9.2 | réglages par défaut | 0 | banque 9 | $04E9–$04EC |
| 17 | `AtlasDevJumpControl` | FaxEdit 9.2 | réglages par défaut | 152 | — | $04DF |
| 18 | `AtlasDevFallControl` | FaxEdit 9.2 | réglages par défaut | 85 | — | — |
| 19 | `AtlasDevLadderControl` | FaxEdit 9.2 | `AtlasDevLadderControl up=256 down=256` | 0 | — | — |
| 20 | `AtlasDevLadderCrown` | FaxEdit 9.2 | réglages par défaut | 605 | — | $04E0–$04E1 |
| 21 | `AtlasDevLadderCrown mode=floor` | FaxEdit 9.2 | réglages par défaut | 315 | — | — |
| 22 | `AtlasDevRunControl` | FaxEdit 9.2 | réglages par défaut | 164 | — | — |
| 23 | `AtlasDevSmartMattock` | FaxEdit 9.2 | réglages par défaut | 178 | — | — |
| 24 | `AtlasDevSmartKeys` | FaxEdit 9.2 | réglages par défaut | 0 | — | — |
| 25 | `AtlasDevCombatFeel` | FaxEdit 9.2 | `AtlasDevCombatFeel profile=zelda2` | 0 | — | — |
| 26 | `AtlasDevEnemyStats` | FaxEdit 9.2 | `AtlasDevEnemyStats profile=hard` | 0 | — | — |
| 27 | `AtlasDevSirGawaineControl` | FaxEdit 9.2 | réglages par défaut | 0 | banque 14 : 360 | — |
| 28 | `AtlasDevWolfmanControl` | FaxEdit 9.2 | réglages par défaut | 0 | banque 14 : 360 | — |
| 29 | `AtlasDevMaskmanControl` | 🟠 pas encore dans FaxEdit | `AtlasDevMaskmanControl spear=24` | 0 | banque 14 : 34 | — |
| 30 | `AtlasDevHornetControl` | 🟠 pas encore dans FaxEdit | `AtlasDevHornetControl speed=8` | 0 | — | — |
| 31 | `AtlasDevYuinaruControl` | 🟠 pas encore dans FaxEdit | `AtlasDevYuinaruControl xspeed=16` | 0 | — | — |
| 32 | `AtlasDevBihorudaControl` | 🟠 pas encore dans FaxEdit | `AtlasDevBihorudaControl xspeed=32` | 0 | — | — |
| 33 | `AtlasDevYareekaControl` | 🟠 pas encore dans FaxEdit | `AtlasDevYareekaControl dash=32` | 0 | — | — |
| 34 | `AtlasDevRipasheikuControl` | 🟠 pas encore dans FaxEdit | `AtlasDevRipasheikuControl drift=16` | 0 | — | — |
| 35 | `AtlasDevNagaControl` | 🟠 pas encore dans FaxEdit | `AtlasDevNagaControl chase=16` | 0 | — | — |
| 36 | `AtlasDevPakukameControl` | 🟠 pas encore dans FaxEdit | `AtlasDevPakukameControl delay=32` | 0 | — | — |
| 37 | `AtlasDevSugataControl` | 🟠 pas encore dans FaxEdit | `AtlasDevSugataControl damage=4` | 0 | — | — |
| 38 | `AtlasDevGiantBeesControl` | 🟠 pas encore dans FaxEdit | `AtlasDevGiantBeesControl rise=8` | 0 | — | — |
| 39 | `AtlasDevZorugeriruControl` | 🟠 pas encore dans FaxEdit | `AtlasDevZorugeriruControl rest=4 windup=16` | 0 | — | — |
| 40 | `AtlasDevNecronAidesControl` | 🟠 pas encore dans FaxEdit | `AtlasDevNecronAidesControl climb=4` | 19 | — | — |
| 41 | `AtlasDevIshiisuControl` | 🟠 pas encore dans FaxEdit | `AtlasDevIshiisuControl walk=6` | 0 | — | — |
| 42 | `AtlasDevTamazutsuControl` | 🟠 pas encore dans FaxEdit | `AtlasDevTamazutsuControl hide=30` | 0 | — | — |
| 43 | `AtlasDevBorabohraControl` | 🟠 pas encore dans FaxEdit | `AtlasDevBorabohraControl speed=16` | 0 | — | — |
| 44 | `AtlasDevMagmanControl` | 🟠 pas encore dans FaxEdit | `AtlasDevMagmanControl hide=30` | 0 | — | — |
| 45 | `AtlasDevKingGrieveControl` | 🟠 pas encore dans FaxEdit | `AtlasDevKingGrieveControl shots=8` | 0 | — | — |
| 46 | `AtlasDevNashControl` | 🟠 pas encore dans FaxEdit | `AtlasDevNashControl hide=60` | 0 | — | — |
| 47 | `AtlasDevExecutionHoodControl` | 🟠 pas encore dans FaxEdit | `AtlasDevExecutionHoodControl walk=8` | 0 | — | — |
| 48 | `AtlasDevShadowEuraControl` | 🟠 pas encore dans FaxEdit | `AtlasDevShadowEuraControl walk=10 pause=60` | 0 | — | — |
| 49 | `AtlasDevVerticalScroll` | 🟠 pas encore dans FaxEdit | réglages par défaut | 391 | banque 9 : 532 | $04E2–$04EC, $9C |
| 50 | `Branches in Motion` | 🔵 pas un hack de FaxEdit | son propre installateur | 425 | banque 9, banque 5 | $04D8–$04DF, $04EF–$04F7 |

Deux hacks qui entrent chacun seul peuvent ne pas entrer ensemble. Additionnez la
colonne Banque 15 : au-delà de 780, ça ne se bâtit pas. Les rôles de palette ont aussi
besoin des 156 octets de Frame Scheduler.

## Changement de banque

Les hacks qui gardent leur code dans une banque chargée au besoin (14, 12 ou 9) n'ont
jamais manqué de place ici. Ladder Crown, Jump Control et Smart Mattock mettent tout
leur code dans la banque 15 : c'est pour ça que ce sont eux qui n'entrent pas ensemble.
🟠 Vertical Scroll garde déjà 532 de ses octets dans la banque 9. Ce qui reste dans la
banque 15 comprend la partie qui roule pendant l'interruption d'écran, qui ne peut pas
changer de banque.

## RAM

Les hacks qui gardent un état en RAM : Frame Scheduler $04D8–$04DE, Jump Control
$04DF, Ladder Crown $04E0–$04E1 (mode crown), Day/Night Cycle $04E2–$04E6, Infected
Tint $04E7–$04E8, Time of Day $04E9–$04EC. 🟠 Vertical Scroll utilise $04E2–$04EC et
$9C, donc lui et les trois rôles de palette se refusent.

## 🔵 Branches in Motion

Le moteur de musique réactive. Ce n'est pas un hack de FaxEdit : son propre
installateur le met sur une ROM propre, et il ne peut encore être combiné avec aucun
hack de FaxEdit. Il utilise 425 octets de la même zone de la banque 15 et presque
toute la banque 9.

## Comment c'est testé

Chaque paire a été bâtie à partir d'une ROM USA propre avec l'outil en ligne de
commande de FaxEdit bêta 9.2, dans les deux ordres. Ensuite, les octets que chaque hack
change seul ont été comparés avec ceux de tous les autres, hors des zones où FaxEdit
place le code des hacks, pour trouver une build qui réussit mais perd un changement.
C'est comme ça que le cas Combat Feel et Poison Pickup a été trouvé.

Les hacks 🟠 ont été testés avec une seule build de FaxEdit qui a les hacks de 9.2, les
contrôles de monstres et Vertical Scroll ensemble. Elle donne le même résultat que
FaxEdit 9.2 pour chaque paire de hacks de 9.2.

La plupart des hacks ont été testés avec leurs réglages par défaut, et la colonne Testé
avec montre la ligne exacte. Les réglages par défaut de Combat Feel ne changent rien,
alors il a été testé avec `profile=zelda2`, et avec `iframes=90` contre Poison Pickup.
Enemy Stats a été testé avec `profile=hard`. Les contrôles de monstres ne changent rien
non plus avec leurs réglages par défaut, alors chacun a été testé avec l'exemple de sa
documentation. D'autres réglages peuvent changer plus de code.

## Non testés

Dynamic Tilesets, Item Scripts.

## Versions

Les versions du tableau suivent celles de FaxEdit : 9.2 est la version de FaxEdit, -1 et
-2 les versions du tableau.

- 9.2-1 : les hacks généraux de FaxEdit bêta 9.2 « Crowning Achievement », testés sur
  la ROM USA.
- 9.2-2 : ajoute les hacks 🟠 qui ne sont pas encore dans FaxEdit et 🔵 Branches in Motion.

## Crédits

Les hacks généraux font partie de [FaxEdit](https://github.com/kaimitai/faxedit), de
Kai E. Frøland.
