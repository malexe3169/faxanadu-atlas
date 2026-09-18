# Faxanadu Battle 1.1

*[English version](README.md)*

Un jeu de combat bâti sur le jeu NES *Faxanadu* : choisissez un combattant,
choisissez une arène et affrontez un ami ou le CPU. Expérimental; l'équilibre est
encore en ajustement.

## Utilisation

Appliquez le patch `fax-battle-1.1.ips` ou `.bps` sur une ROM propre de la version USA
(SHA-1 du fichier `.nes` complet : `2e2b95db2be615cf588f0d758e0f7b1ccd81590a`). Jouez
dans un émulateur comme Mesen : le jeu a besoin de 8 Ko de mémoire de travail
supplémentaire, il ne fonctionne donc pas sur une cartouche originale.

## Lancer une partie

Allumez, appuyez sur Start et choisissez un mode. À l'écran des modes, vous pouvez
aussi régler qui joue chaque côté : Haut et Bas passent entre Joueur 1, Joueur 2 et
Difficulté, et Gauche et Droite changent la valeur. Un côté peut être une personne
ou un CPU, alors vous pouvez jouer en un contre un, affronter un CPU, ou regarder
deux CPU se battre. Le Joueur 2 commence comme un CPU avec une personnalité au
hasard.

Ensuite chaque joueur choisit un combattant et appuie sur A pour être prêt (B
annule), puis vous choisissez une arène avec Gauche/Droite : vous voyez le vrai
écran avant de confirmer avec A. Select revient au choix du mode.

## Adversaires CPU

Un CPU joue avec l'une de cinq personnalités, et ce ne sont pas des niveaux de
difficulté : ce sont des adversaires différents.

| Personnalité | Sa façon de se battre |
| --- | --- |
| Brawler | colle à vous et frappe sans arrêt |
| Counter | attend, garde, et punit ce que vous ratez |
| Hunter | fonce sur la couronne et les objets |
| Trickster | recule pour appâter une attaque, puis revient aussitôt |
| Survivor | prend ce dont il a besoin, recule quand il est blessé, protège son avance |

Il y a aussi Random, qui tire une nouvelle personnalité à chaque manche. La
difficulté est Easy, Normal ou Hard, et elle se règle séparément.

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
| Haut + B | Attaque montante : soulève un combattant au sol et peut contrer un sauteur |
| B en l'air | Attaque aérienne |
| Bas + B | Coup spécial, utilise une jauge de puissance pleine |
| Bas en tombant | Tomber plus vite |
| Tenir Bas au sol | Se garder contre une attaque de face (coûte de la puissance) |
| Select | Retour au choix du mode |

Les coups que vous donnez et ceux que vous recevez remplissent votre jauge de
puissance.

## Combattants

Six au départ, et ils se jouent différemment : vitesse, saut, portée, dégâts et
timing sont propres à chacun.

| Combattant | En une ligne | Coup spécial |
| --- | --- | --- |
| Hero | équilibré, récupère vite | Blade Beam, un projectile rapide |
| Sword Dwarf | rapide à pied, lent à frapper | Shoulder Rush, une charge vers l'avant |
| Skeleton Knight | la plus longue portée, les mains les plus lentes | Skewer, un long estoc |
| Wolfman | l'attaque la plus rapide, les dégâts les plus faibles | Pounce, un bond vers l'avant |
| Giant Strider | frappe le plus fort, rate le plus mal | Ground Slam, frappe tout autour de là où il atterrit |
| Grimlock | le marcheur le plus rapide, se bat à distance | Retreat Shot, recule et tire |

Il y a aussi un septième combattant secret. À vous de le trouver.

**[Guide complet des combattants](FIGHTERS.fr.md)** — les chiffres de chacun, ce
que fait vraiment son coup spécial, et comment marchent les coups communs.

## Objets

Une jarre cassable apparaît au sol dix secondes après le début du combat, et une
autre suit un moment après que chacune a été ramassée ou a disparu. N'importe
lequel des deux combattants peut la casser, au corps à corps ou avec un
projectile, et n'importe lequel peut ramasser ce qui en sort.

Les trois objets vous soignent, remplissent votre jauge de pouvoir, ou vous
donnent un saut aérien supplémentaire pendant huit secondes. Un objet laissé au
sol disparaît tout seul.

De temps en temps un oiseau traverse l'arène et laisse tomber du pain.

## Mort subite

Si une partie s'éternise, un boss arrive après 60 secondes (avec un avertissement à
55) et lance des boules de feu qu'on ne peut pas bloquer. À 135 secondes, une partie
non terminée prend fin : en Duel, le joueur qui a subi le moins de dégâts gagne; en
Crown Scramble, celui qui a le plus de temps avec la couronne. Une égalité s'affiche
comme un match nul.

## Arènes

Neuf arènes : Courtyard, Ruins, High Bridge et Watchtower (Eolis), Mist Clearing
(Mist), Trunk Hollow (Trunk), Zenith Loop, Dartmoor Hall et Branch Link. On peut
sauter sur les plateformes par en dessous, et Zenith Loop est en boucle — sortez
d'un côté et revenez de l'autre. Passer à une autre région prend environ deux
secondes de chargement.

## Résultats

Après une partie, un panneau montre le gagnant (ou un match nul), le nom des deux
combattants et leur temps de couronne ou leurs PV, et permet de rejouer ou de
revenir modifier la configuration.

## Versions

- **1.1** : jouer contre le CPU, présentations des combattants, plus d'arènes, un écran d'objets et de résultats.
- **1.0** : première version publique.
