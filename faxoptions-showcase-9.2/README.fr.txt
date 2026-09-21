FaxOptions Showcase 9.2-1 — Crown Jewels
========================================
English version: README.txt

Une vitrine pour FaxEdit bêta 9.2 « Crowning Achievement »

Une seule ROM avec les hacks généraux de FaxEdit 9.2 intégrés ensemble, et un
panneau dans le menu de pause (FaxOptions) qui les active et change leurs réglages
pendant la partie. Pas besoin d'installer FaxEdit ni de construire une ROM :
appliquez le patch et jouez.

Patchs
------
  USA, USA Rev 1 et Europe, en IPS ou BPS. Utilisez une ROM propre avec un en-tête
  NES 2.0 et un émulateur qui conserve les sauvegardes sur batterie (Mesen, FCEUX,
  cœurs RetroArch). Les réglages sont gardés en mémoire sur batterie.

  Votre ROM est la bonne si l'une des deux sommes correspond. La somme du fichier
  couvre tout le .nes; celle du corps couvre le même fichier sans son entête de
  16 octets, et c'est elle qui identifie le jeu peu importe l'entête de votre copie.

    version      SHA-1 du fichier                          SHA-1 du corps
    USA          2e2b95db2be615cf588f0d758e0f7b1ccd81590a  5b05c8859f356013d37f0545f5de5fa1693da5da
    USA Rev 1    bfb085472127eecbe5d89cd8f35bfdda2b4153be  d0c6af83c44f2dc90bcb0792a69c93f8d167f988
    Europe       9c178d2247045f0569bb7a86ddd2600a55d25f12  0711bc8d0bf42a0829391c2320393a0d3df2dd1f

  Somme du fichier : sha1sum votre.nes
  Somme du corps   : tail -c +17 votre.nes | sha1sum

Écran de départ
---------------
  START        une nouvelle partie
  CONTINUE     charge la sauvegarde sur batterie (en gris s'il n'y en a pas)
  PASSWORD     entrez un mantra, comme dans le jeu original : un moyen rapide de
               sauter plus loin dans le jeu sans sauvegarde
  Select passe de l'un à l'autre (CONTINUE est sauté s'il n'y a pas de sauvegarde).

Commandes
---------
  Start, puis Select   ouvre FaxOptions (une seule liste qui défile)
  Haut / Bas           choisir une ligne; la liste défile
  Gauche / Droite      changer la valeur
  Start                appliquer et fermer
  B                    fermer sans appliquer
  A                    lancer KILL HERO ou DEFAULTS (les deux dernières lignes)

Lignes (la première valeur est la valeur par défaut)
----------------------------------------------------
  FALL CONTROL     ON, OFF                  AtlasDevFallControl : chute en courbe et contrôle en l'air
  FALL             ARC, ZELDA2, FLOATY,     la courbe de chute; contrôle quand une direction est tenue
                   MOON, FAST
  JUMP ASSIST      FULL, LIGHT, WIDE,       AtlasDevJumpControl : délai de grâce, saut mémorisé,
                   MINIMAL                  petit saut
  RUN              NORMAL, FAST, FASTER,    AtlasDevRunControl : course en double appui, sa vitesse
                   SUBTLE, SNAPPY           maximale et son accélération
  LADDER SPEED     ON, OFF                  AtlasDevLadderControl : montée plus rapide
  CLIMB SPEED      NORMAL, QUICK, RAPID     vitesses de montée et de descente
  LADDER ATTACK    OFF, ON                  attaquer sur une échelle
  SMART MATTOCK    ON, OFF                  AtlasDevSmartMattock
  DAY NIGHT        OFF, ON                  AtlasDevDayNightCycle : la palette s'assombrit puis revient
  DAY LENGTH       NORMAL, SHORT, LONG      34 s, 17 s ou 2 min par jour
  TINT             OFF, ON                  AtlasDevInfectedTint : couleurs des sprites teintées
  TINT STYLE       PULSE, STEADY            la teinte pulse ou reste fixe
  CLOCK            OFF, ON                  AtlasDevTimeOfDay : l'heure affichée dans le HUD
  CLOCK SPEED      NORMAL, FAST, SLOW       5 s, 1 s ou 10 s par heure de jeu
  GAWAINE AI       ON, OFF                  AtlasDevSirGawaineControl : Sir Gawaine se bat intelligemment
  GAWAINE WINDUP   NORMAL, SHORT, LONG      temps de garde avant son estoc
  GAWAINE LUNGE    NORMAL, STILL, FAST      jusqu'où il s'élance pendant l'estoc
  GAWAINE SWORD    NORMAL, SHORT, WIDE      la portée de son estoc
  GAWAINE CHASE    NORMAL, NEVER, FAST      s'il fonce sur vous pendant que vous frappez
  GAWAINE RANGE    NORMAL, CLOSE, FAR       la distance à laquelle il s'arrête pour se battre
  WOLFMAN AI       ON, OFF                  AtlasDevWolfmanControl : le Wolfman se bat intelligemment
  WOLFMAN WINDUP / LUNGE / SWORD / CHASE / RANGE    les mêmes cinq réglages pour le Wolfman
  START GOLD       1500, NONE, 5000         FastStart : l'or au début d'une partie
  SELL PRICE       100, 250, 500            FlexibleItems : prix de vente des objets non listés
  KILL HERO        -                        le héros meurt à la reprise
  DEFAULTS         -                        chaque ligne revient à sa valeur par défaut

Toujours actifs (intégrés avec les valeurs par défaut de FaxEdit, pas dans le menu)
-----------------------------------------------------------------------------------
  LADDER CROWN     -                        AtlasDevLadderCrown : se tenir sur le haut des échelles
  TEXT SPEED       -                        TextSpeed : le texte s'affiche à pleine vitesse
  FOG RULES        -                        FogRules : du brouillard seulement là où les règles le prévoient
  SAVE RAM         -                        SRAM : le jeu sauvegarde sur batterie
  BUG FIXES        -                        BugFixes : corrections du Pendant et du compte des objets ramassés
  POISON PICKUP    -                        PoisonPickup : le poison devient un objet d'inventaire
  SMART KEYS       -                        AtlasDevSmartKeys : portes à clé plus intelligentes
  ENEMY STATS      -                        AtlasDevEnemyStats : profil normal (statistiques d'origine)
  START RING       -                        FastStart : une nouvelle partie commence avec le Ring of Elf
  QUEST DROPS      -                        QuestFlagItemDrops : apparition du mattock et des wing boots
  BOSS ITEMS       -                        BossLockedItems : les objets apparaissent une fois la salle vidée
  ITEM RULES       -                        FlexibleItems : objets à l'intérieur, les magasins achètent tout
  COND SCRIPTS     -                        ConditionalScript : événements uniques pour les scripts
  SAME WORLD MUSIC -                        SameWorldTransPal2Mus : correction palette-musique
  SCHEDULER        -                        AtlasDevFrameScheduler : fait tourner jour/nuit, teinte et horloge

Non inclus
----------
  Combat Feel, Dynamic Tilesets, Item Scripts, la version japonaise.

Versions
--------
  Les versions de FaxOptions suivent celles de FaxEdit : 9.2 est la version de FaxEdit,
  -1 la version de la build.
  9.2-1   les hacks généraux de FaxEdit bêta 9.2 « Crowning Achievement ».
