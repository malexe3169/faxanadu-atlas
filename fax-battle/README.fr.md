# Faxanadu Battle 1.0

*[English version](README.md)*

Un jeu de combat à deux joueurs bâti sur le jeu NES *Faxanadu* : choisissez un
combattant, choisissez une arène et affrontez un ami. Expérimental; l'équilibre est
encore en ajustement.

## Utilisation

Appliquez le patch `fax-battle-1.0.ips` ou `.bps` sur une ROM propre de la version USA
(SHA-1 du fichier `.nes` complet : `2e2b95db2be615cf588f0d758e0f7b1ccd81590a`). Jouez
dans un émulateur comme Mesen, avec deux manettes : le jeu a besoin de 8 Ko de
mémoire de travail supplémentaire, il ne fonctionne donc pas sur une cartouche
originale.

## Lancer une partie

Allumez, appuyez sur Start, choisissez un mode, puis chaque joueur choisit un
combattant et appuie sur A pour être prêt (B annule). Choisissez ensuite une arène
avec Gauche/Droite : vous voyez le vrai écran avant de confirmer avec A. Select
revient au choix du mode.

## Modes

- **Crown Scramble :** gardez la couronne pendant 30 secondes au total. Un coup
  fait tomber la couronne de celui qui la tient, et elle ne peut pas être reprise
  tout de suite.
- **Duel :** les deux joueurs commencent à 99 PV. Mettez l'autre K.-O.

## Commandes

| Touche | Action |
| --- | --- |
| A | Sauter (relâchez tôt pour un petit saut) |
| B | Attaquer |
| Tenir B, relâcher | Attaque chargée : dégâts doublés, plus lente, perce une garde |
| Haut + B | Attaque montante |
| B en l'air | Attaque aérienne |
| Bas + B | Coup spécial, utilise une jauge de puissance pleine |
| Bas en tombant | Tomber plus vite |
| Tenir Bas au sol | Se garder contre une attaque de face (coûte de la puissance) |
| Select | Retour au choix du mode |

Les coups que vous donnez et ceux que vous recevez remplissent votre jauge de
puissance.

## Combattants

| Combattant | Coup spécial |
| --- | --- |
| Hero | Blade Beam, un projectile rapide |
| Sword Dwarf | Shoulder Rush, une charge vers l'avant |
| Skeleton Knight | Skewer, un long estoc |
| Wolfman | Pounce, un bond vers l'avant |
| Giant Strider | Ground Slam, frappe tout autour de là où il atterrit |
| Grimlock | Retreat Shot, recule et tire |

Il y a aussi un septième combattant secret. À vous de le trouver.

## Mort subite

Si une partie s'éternise, un boss arrive après 60 secondes (avec un avertissement à
55) et lance des boules de feu qu'on ne peut pas bloquer. À 135 secondes, une partie
non terminée prend fin : en Duel, le joueur qui a subi le moins de dégâts gagne; en
Crown Scramble, celui qui a le plus de temps avec la couronne.

## Arènes

Courtyard, Ruins, High Bridge et Watchtower (Eolis), Mist Clearing (Mist) et Trunk
Hollow (Trunk). On peut sauter sur les plateformes par en dessous. Passer à une
autre région prend environ deux secondes de chargement.

## Versions

- **1.0** : première version publique.
