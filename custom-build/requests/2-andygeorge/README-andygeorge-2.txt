Faxanadu custom build 2 (FaxOptions)
====================================
Version française : README-custom-2.fr.txt

Made for request #2 on faxanadu-atlas.
Hack compatibility 9.2-6. FaxEdit beta-9.2 with the hacks not in FaxEdit
yet, build 463d6a5.

Patches
-------
  USA         faxanadu-andygeorge-2-usa.ips, faxanadu-andygeorge-2-usa.bps
  USA Rev 1   faxanadu-andygeorge-2-usa-rev1.ips, faxanadu-andygeorge-2-usa-rev1.bps
  Europe      faxanadu-andygeorge-2-europe.ips, faxanadu-andygeorge-2-europe.bps
  Apply a patch to a clean dump of the same version. A BPS patch checks that
  you picked the right file first; an IPS patch doesn't.

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
  Start, then Select   open FaxOptions
  Up / Down            pick a row; Left / Right change it; Start applies; B leaves
  Settings are kept in battery RAM: use an emulator that keeps battery saves
  (Mesen, FCEUX, RetroArch cores) and a clean dump with an NES 2.0 header.

Rows (the first value listed is the default)
--------------------------------------------
  SMART MATTOCK    ON, OFF
  START GOLD       1500, NONE, 5000
  SELL PRICE       100, 250, 500
  KILL HERO        the hero dies when you unpause
  DEFAULTS         every row back to its default
