Build sur mesure 2 de Faxanadu (FaxOptions)
===========================================
English version: README-custom-2.txt

Faite pour la demande #2 sur faxanadu-atlas.
Compatibilité des hacks 9.2-6. FaxEdit bêta 9.2 avec les hacks pas encore
dans FaxEdit, build 463d6a5.

Patches
-------
  USA         faxanadu-andygeorge-2-usa.ips, faxanadu-andygeorge-2-usa.bps
  USA Rev 1   faxanadu-andygeorge-2-usa-rev1.ips, faxanadu-andygeorge-2-usa-rev1.bps
  Europe      faxanadu-andygeorge-2-europe.ips, faxanadu-andygeorge-2-europe.bps
  Appliquez un patch sur une copie propre de la même version. Un patch BPS
  vérifie d'abord que vous avez choisi le bon fichier, un patch IPS non.

Hacks
-----
  SameWorldTransPal2Mus
  FastStart
  QuestFlagItemDrops
  FlexibleItems
  PoisonPickup
  SRAM
  TextSpeed
  BugFixes
  ConditionalScript
  AtlasDevSmartMattock
  AtlasDevSmartKeys

Menu
----
  Start, puis Select   ouvre FaxOptions
  Haut / Bas           choisit une rangée ; Gauche / Droite la change ; Start applique ; B quitte
  Les réglages sont gardés dans la RAM de sauvegarde : utilisez un émulateur qui
  garde les sauvegardes (Mesen, FCEUX, cores RetroArch) et une copie propre avec
  un en-tête NES 2.0.

Rangées (la première valeur est celle par défaut)
-------------------------------------------------
  SMART MATTOCK    ON, OFF
  START GOLD       1500, NONE, 5000
  SELL PRICE       100, 250, 500
  KILL HERO        le héros meurt quand vous reprenez le jeu
  DEFAULTS         chaque rangée revient à sa valeur par défaut
