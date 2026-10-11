# Faxanadu Titan 1.0

*[English version](README.md)*

Un patch à une seule vie pour le jeu NES *Faxanadu* (version USA). Toute
l'aventure originale, avec des ennemis plus durs, des compteurs d'objets
honnêtes, et une règle au-dessus des autres : la mort est définitive.

Titan existe en deux patchs aux mêmes règles :

| patch | base | pour |
| --- | --- | --- |
| `faxanadu-titan-vanilla-1.0` | le jeu original intact | ceux qui veulent l'original et rien d'autre |
| `faxanadu-titan-qol-1.0` | la [QoL Edition 1.3](../qol-edition) : barres de vie ennemies, transitions plus rapides, menu d'options, sauvegarde sur batterie, clés et pioche automatiques | ceux qui veulent le confort avec les règles |

Les deux s'appliquent sur une ROM propre de la version USA ; vous n'avez pas
à patcher par-dessus la QoL Edition vous-même.

## Les règles

- **Une seule vie.** Quand votre vie tombe à zéro, la fenêtre de texte du jeu
  s'ouvre et affiche **DEATH IS FINAL.** Appuyez sur A et la console
  redémarre sur l'écran titre. Pas de retour à la dernière église avec votre
  or et vos objets, rien à continuer. Mourir n'est plus un voyage gratuit vers
  la ville.
- **Pas de retour.** L'écran titre n'a plus de CONTINUE, donc plus de saisie
  de mot de passe : les gourous récitent toujours leurs mantras, mais rien ne
  les accepte. Dans le patch Vanilla, une partie se joue d'une traite. Dans le
  patch QoL, CONTINUE reste pour une partie en vie : le gourou écrit la
  sauvegarde sur batterie et vous pouvez vous arrêter là et reprendre plus
  tard. À l'instant où un coup vous tue, cette sauvegarde est effacée, avant
  même que la fenêtre de mort s'ouvre : après une mort, CONTINUE est grisé.
- **Des ennemis plus durs.** Chaque ennemi a 125 % de sa vie d'origine et
  inflige 150 % de ses dégâts d'origine, et un ennemi touché se remet en
  6 images au lieu de 8, donc il revient plus vite sur vous. L'expérience et
  l'or lâchés ne changent pas. Votre vitesse, votre saut, votre épée et votre
  temps d'invulnérabilité après un coup ne changent pas.
- **Des compteurs d'objets honnêtes.** Les Wing Boots, le Hour Glass, le Glove
  et l'Ointment fonctionnent sur un compte à rebours. Dans l'original, mettre
  en pause ou ouvrir le menu des objets au bon moment saute des coups de ce
  compteur et allonge l'objet gratuitement. Ici la phase du compteur est
  conservée à chaque pause et à chaque menu : les objets durent exactement ce
  qu'ils doivent durer.
- **L'Elixir ne vous ranime pas.** Dans l'original, porter un Elixir change
  un coup fatal en pleine guérison. Ici un coup fatal est fatal, Elixir ou
  pas. L'Elixir est toujours vendu en magasin dans cette version ; ne
  l'achetez pas.

## Ce que cette version ne fait pas

- **Pas de sauvegarde en cours d'écran.** Vanilla : aucune. QoL : seulement la
  sauvegarde chez le gourou, et seulement tant que vous êtes en vie.
- **Les boss ne gagnent presque pas de vie.** La vie des boss est déjà
  stockée près du plafond du jeu, donc les 125 % deviennent 102 % pour les
  deux boss stockés à 250. Ils frappent bien à 150 %.
- **Les savestates vous appartiennent.** Un patch ne peut pas empêcher un
  émulateur de sauvegarder et charger des états, de rembobiner ou de copier
  un fichier `.sav`. La règle de la vie unique est appliquée par le jeu, pas
  contre votre émulateur.
- **Les compteurs pendant les dialogues et les ralentissements.** Les boîtes
  de texte laissent tourner les compteurs, comme dans l'original. Sur une
  image de ralentissement, un objet peut encore compter une image trop tôt ou
  trop tard ; c'est borné et la pause ne permet pas d'en abuser.
- **Le menu d'options QoL ne peut pas assouplir les règles.** Il règle
  toujours la vitesse du texte, les corrections de bogues et la sensation de
  la chute, du saut et des échelles, comme dans la QoL Edition 1.3. Rien n'y
  touche aux statistiques ennemies, aux compteurs, à la sauvegarde ni à la
  règle de la mort.

## Utilisation

Appliquez le `.ips` ou le `.bps` du patch voulu sur une ROM propre de la
version USA. Le patch QoL garde ses réglages et sa sauvegarde en mémoire sur
batterie : utilisez un émulateur qui conserve les sauvegardes sur batterie.

Votre ROM est la bonne si l'une des deux sommes correspond :

| somme | valeur | vérification |
| --- | --- | --- |
| SHA-1 du fichier | `2e2b95db2be615cf588f0d758e0f7b1ccd81590a` | `sha1sum votre.nes` |
| SHA-1 du corps | `5b05c8859f356013d37f0545f5de5fa1693da5da` | `tail -c +17 votre.nes \| sha1sum` |

La somme du fichier couvre tout le `.nes`; celle du corps couvre le même fichier
sans son entête de 16 octets, et c'est elle qui identifie le jeu peu importe
l'entête de votre copie.

Le jeu patché est le bon si l'une des deux sommes correspond :

| patch | SHA-1 du fichier | SHA-1 du corps |
| --- | --- | --- |
| `faxanadu-titan-vanilla-1.0` | `07be5344b7b41ea6358df7a674e80b00ba448a20` | `6dd16c647d7057ab1b747aa40a62262267dbc25a` |
| `faxanadu-titan-qol-1.0` | `bfea207508838a3f0e6d436efdf84fc4b92f1422` | `357ef78bf13e6d24861bc9fc7b91eb51e171ad7a` |

## Crédits

La règle de la vie unique, la mise à l'échelle des ennemis (AtlasDevEnemyStats)
et la correction des compteurs d'objets (AtlasDevFairPlayTimers) sont nos
propres hacks. Le patch QoL reprend tout ce que porte la
[QoL Edition 1.3](../qol-edition), avec ses crédits : les sauvegardes sur
batterie et la correction de l'onguent sont des hacks généraux de
[FaxEdit](https://github.com/kaimitai/faxedit) de Kai E. Frøland. L'essentiel
de ce que nous savons du fonctionnement du jeu vient du
[désassemblage de Faxanadu](https://github.com/chipx86/faxanadu) de chipx86.

## Versions

- **1.0** : une seule vie avec la fenêtre de mort, pas de saisie de mot de
  passe, 125 % de vie ennemie, 150 % de dégâts ennemis, récupération ennemie
  en 6 images, compteurs d'objets que la pause ne peut plus allonger. Deux
  patchs : Vanilla, et QoL (sur la QoL Edition 1.3) où mourir efface la
  sauvegarde.
