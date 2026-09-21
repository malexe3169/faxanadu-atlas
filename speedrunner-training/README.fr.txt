Faxanadu Vanilla SpeedRunner Training 5.1
=========================================
English version: README.txt

Le jeu original, sans modification, avec des outils d'entraînement au speedrun dans
le menu de pause. Avec les réglages par défaut, il se joue exactement comme
l'original : même état du jeu, mêmes images de lag.

Patchs
------
  USA, USA Rev 1 (chrono NTSC) et Europe (chrono PAL), en IPS ou BPS. Utilisez une
  ROM propre et un émulateur qui conserve les sauvegardes sur batterie. Pas de
  version japonaise.

  Votre ROM est la bonne si l'une des deux sommes correspond. La somme du fichier
  couvre tout le .nes; celle du corps couvre le même fichier sans son entête de
  16 octets, et c'est elle qui identifie le jeu peu importe l'entête de votre copie.

    version      SHA-1 du fichier                          SHA-1 du corps
    USA          2e2b95db2be615cf588f0d758e0f7b1ccd81590a  5b05c8859f356013d37f0545f5de5fa1693da5da
    USA Rev 1    bfb085472127eecbe5d89cd8f35bfdda2b4153be  d0c6af83c44f2dc90bcb0792a69c93f8d167f988
    Europe       9c178d2247045f0569bb7a86ddd2600a55d25f12  0711bc8d0bf42a0829391c2320393a0d3df2dd1f

  Somme du fichier : sha1sum votre.nes
  Somme du corps   : tail -c +17 votre.nes | sha1sum

Chronomètre
-----------
  Départ        au contrôle du personnage : le premier moment où vous pouvez
                bouger après START, CONTINUE, une téléportation ou un point de départ
  Arrêt         au changement de musique après la défaite de l'Evil One (la fin
                officielle d'un run); la page SPLITS affiche alors FINISHED
  Compte        chaque image : les pauses et les chargements sont inclus (temps réel)
  Lag           les images où le jeu n'a pas lu la manette
  Splits        chaque fois que vous entrez dans une nouvelle zone; les bâtiments
                ne comptent pas, sauf si SPLIT ON est à ALL; SCREENS fait un split
                à chaque écran et le compare avec votre dernier essai depuis cet écran
  Format        MM:SS:CC, selon la vraie fréquence d'images de la console
                (NTSC 60,0988 Hz, PAL 50,007 Hz)

Menu de pause
-------------
  Start, puis Select   la page SPLITS (en direct, le chrono continue)
  Select               les lignes d'options
  Select ou B          fermer
  Start                appliquer les lignes et fermer

Page SPLITS
-----------
  TOTAL          temps total, avec les heures
  SEGMENT        temps depuis le dernier split
  LAG TOTAL      images de lag depuis le départ
  LAG SEGMENT    images de lag depuis le dernier split
  6 lignes       les derniers splits, le plus récent en premier : zone, écran,
                 temps du segment, et F (plus rapide) ou S (plus lent) que votre
                 dernier essai depuis le même écran (ou votre meilleur, voir
                 COMPARE), avec l'écart
  FRAMES         images depuis le départ, avec NEXT nn ou SKIP READY (plus bas)

Redémarrage rapide
------------------
  En pause, appuyez sur A et B ensemble : votre dernier WARP GO ou CHECKPOINT GO
  est relancé avec les lignes actuelles, et le jeu reprend tout seul.

Truc de la pause
----------------
  Les minuteries des objets baissent d'un cran toutes les 64 images. Le jeu ne les
  vérifie pas pendant la pause, mais son compteur d'images continue : une pause qui
  chevauche cette image fait sauter un cran. NEXT, dans le HUD ITEMS, compte les
  images jusqu'à ce moment; en pause, il devient SK (et la page SPLITS affiche
  SKIP READY) une fois l'image passée : reprenez et le cran est sauté. Le compte
  recommence à chaque écran.

Lignes
------
  HUD            OFF / POS / MOVE / RNG / TIMER / ITEMS / SPEED. Un affichage sur la
                 ligne vide au-dessus de la barre d'état. OFF par défaut.
                   POS    A zone, S écran, X (3 octets), Y (2 octets), en hexa
                   MOVE   V = déplacement horizontal par image (L ou R, puis en
                          hexa, en 1/256 px), A drapeaux d'action, S drapeaux
                          d'état, Y
                   RNG    indice du RNG, L lag total, SL lag du segment (hexa)
                   TIMER  SEG nombre de splits, temps du segment, temps total, et
                          l'écart F/S du dernier split
                   ITEMS  W Wing Boots, O Ointment, G Glove, H Hour Glass (les
                          minuteries d'effet, -- si inactives), et NEXT : les
                          images avant leur prochain cran. En pause, NEXT affiche
                          SK une fois que la pause a chevauché cette image (voir
                          plus bas).
                   SPEED  SPD vitesse de marche en 1/256 px par image (192 au
                          départ, jusqu'à 384; un recul affiche 999), INV images
                          d'invincibilité restantes après un coup, R l'indice du
                          RNG avec T les images depuis son dernier changement
                          (seuls les monstres qui tournent au hasard l'utilisent,
                          et les boutons tenus changent le résultat), et D le
                          compteur de visites : 0 à 3. Quelques objets placés sur
                          les écrans n'apparaissent qu'une visite sur quatre :
                          entrez avec D à 3 et l'objet est là.
                          N est le prochain virage au hasard d'un monstre :
                          R à droite (ou vers le haut), L à gauche (ou vers le
                          bas). Tenez A à l'image du virage et il part de l'autre
                          côté; aucun autre bouton ne compte.
                 Les émulateurs qui coupent 8 lignes en haut l'affichent quand
                 même; ceux qui en coupent plus le cachent.
                 Le HUD utilise un peu de temps processeur à chaque image. Sur les
                 images très chargées, il peut ajouter une image de lag que
                 l'original n'aurait pas : désactivez-le pour vous entraîner au
                 chrono. Sans HUD, le jeu tourne exactement comme l'original,
                 splits compris.
  SPLIT ON       AREAS (par défaut) : les bâtiments ne comptent pas. ALL : chaque
                 changement de zone fait un split. SCREENS : chaque écran fait un
                 split et est comparé avec votre dernier essai depuis cet écran
                 (gardé en mémoire sur batterie, donc conservé à l'arrêt).
  COMPARE        à quoi les splits SCREENS sont comparés : LAST (par défaut) votre
                 dernier essai depuis cet écran, ou BEST votre plus rapide. Les deux
                 sont gardés en mémoire sur batterie.
  WARP AREA      Eolis, Trunk, Mist, les villes, Branch, Dartmoor, Zenith.
                 Trunk par défaut.
  WARP SCREEN    numéro d'écran dans cette zone. 0 par défaut. Au-delà du dernier
                 écran de la zone, c'est le dernier qui est utilisé.
  WARP X         colonne d'arrivée, 0 à 15. 2 par défaut.
  WARP Y         rangée d'arrivée, 0 à 12. 10 par défaut.
  LOADOUT        l'un des 8 mantras de départ : Eolis, Apolune, Forepaw, Mascon,
                 Victim, Conflate, Daybreak, Dartmoor. Eolis par défaut.
  RANK           PRESET garde le rang du mantra, ou choisissez l'un des 16.
  WEAPON         PRESET, ou choisissez-en une.
  ARMOR          PRESET, ou choisissez-en une.
  SHIELD         PRESET, NONE, ou choisissez-en un.
  MAGIC          PRESET, NONE, ou choisissez-en une.
  ITEM           PRESET, NONE, ou choisissez-en un.
  GOLD           PRESET (selon le rang), ou de 0 à 50000.
  EXP            PRESET (selon le rang), ou de 0 à 30000.
  RESET TIMER    remet le chrono à zéro, tout de suite.
  WARP GO        téléporte à la reprise, en gardant ce que vous transportez. Le
                 chrono repart. Vous pouvez arriver dans un mur : téléportez-vous de
                 nouveau.
  CHECKPOINT GO  à la reprise, recommence dans l'église de cette ville avec
                 l'équipement choisi, exactement comme en entrant le mantra à
                 l'écran titre. Le chrono repart.
  RANK NOW       à la reprise, votre titre devient le choix de la ligne RANK
                 (PRESET : aucun changement). Les titres fixent la durée des Wing
                 Boots : de Novice à Fighter 40 crans, d'Adept à Warrior 30, de
                 Swordman à Myrmidon 20, de Champion à Lord 10. Le chrono continue.
  DEFAULTS       remet chaque ligne à sa valeur par défaut.

Toujours actifs
---------------
  Le chrono et le compteur de lag. Ils ne font que lire le jeu; sans HUD, le jeu
  tourne exactement comme l'original.

Non inclus
----------
  Sauvegardes d'état, hacks de jeu, téléportation dans les bâtiments.

Les réglages sont gardés en mémoire sur batterie et reviennent après un reset ou un
arrêt.

Versions
--------
  5.1   le HUD saute son travail sur les images déjà en retard : il n'ajoute presque plus de lag
  5     N dans le HUD SPEED : le prochain virage au hasard
  4     le HUD SPEED (vitesse, invincibilité, âge du RNG, compteur de visites) et COMPARE
  3     splits SCREENS, redémarrage rapide A+B, chronométrage officiel
  2     le HUD ITEMS, l'indicateur du truc de la pause (SK) et RANK NOW
  1     chrono, compteur de lag, splits automatiques, page SPLITS, téléportation, points
        de départ, HUD
