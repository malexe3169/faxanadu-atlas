FaxOptions Showcase 9.2 — Crown Jewels
======================================
A showcase for FaxEdit beta-9.2 "Crowning Achievement"

One ROM with the FaxEdit 9.2 general hacks built in together, and a
pause-menu panel (FaxOptions) that switches them and changes their settings
while you play. No FaxEdit install and no ROM building: apply the IPS and play.

Patches
-------
  faxoptions-showcase-9.2-usa.ips       Faxanadu (USA)          PRG SHA-1 5b05c8859f356013d37f0545f5de5fa1693da5da
  faxoptions-showcase-9.2-usa-rev1.ips  Faxanadu (USA) Rev 1    PRG SHA-1 d0c6af83c44f2dc90bcb0792a69c93f8d167f988
  faxoptions-showcase-9.2-europe.ips    Faxanadu (Europe)       PRG SHA-1 0711bc8d0bf42a0829391c2320393a0d3df2dd1f
  (PRG SHA-1 = the ROM without its 16-byte header)

Each patch also sets two header bytes: byte 6 turns on the battery, and
NES 2.0 byte 10 declares 8 KiB of save RAM (Mesen needs it). Use a dump
with an NES 2.0 header; on an old iNES 1.0 header byte 10 means something
else.

Use an emulator that keeps battery saves (Mesen, FCEUX, RetroArch cores).
The hack code runs from that save RAM and your settings are kept there, so
they survive power cycles.

Start screen
------------
  START            -                        a new game
  CONTINUE         -                        load the battery save (grey when there is none)
  PASSWORD         -                        enter a mantra, as in the original game: a quick way
                                            to jump to a later point without a save
  Select moves between them (CONTINUE is skipped when there is no save).

Controls
--------
  Start, then Select   open FaxOptions (one scrolling list)
  Up / Down            pick a row; the list scrolls
  Left / Right         change the value
  Start                apply and close
  B                    close without applying
  A                    run KILL HERO or DEFAULTS (the last two rows)

Rows (the first value listed is the default)
--------------------------------------------
  FALL CONTROL     ON, OFF                  AtlasDevFallControl: curved fall and air steering
  FALL             ARC, ZELDA2, FLOATY,     the fall curve; steering while a direction is held
                   MOON, FAST
  JUMP ASSIST      FULL, LIGHT, WIDE,       AtlasDevJumpControl: coyote time, jump buffer,
                   MINIMAL                  short hop
  RUN              NORMAL, FAST, FASTER,    AtlasDevRunControl: double-tap run, its speed cap
                   SUBTLE, SNAPPY           and ramp
  LADDER SPEED     ON, OFF                  AtlasDevLadderControl: faster climbing
  CLIMB SPEED      NORMAL, QUICK, RAPID     climbing speeds up and down
  LADDER ATTACK    OFF, ON                  attack while on a ladder
  SMART MATTOCK    ON, OFF                  AtlasDevSmartMattock
  DAY NIGHT        OFF, ON                  AtlasDevDayNightCycle: the palette dims and returns
  DAY LENGTH       NORMAL, SHORT, LONG      34 s, 17 s or 2 min per day
  TINT             OFF, ON                  AtlasDevInfectedTint: tinted sprite colours
  TINT STYLE       PULSE, STEADY            the tint pulses or stays steady
  CLOCK            OFF, ON                  AtlasDevTimeOfDay: an hour readout on the HUD
  CLOCK SPEED      NORMAL, FAST, SLOW       5 s, 1 s or 10 s per in-game hour
  GAWAINE AI       ON, OFF                  AtlasDevSirGawaineControl: Sir Gawaine fights smart
  GAWAINE WINDUP   NORMAL, SHORT, LONG      guard time before his thrust
  GAWAINE LUNGE    NORMAL, STILL, FAST      how far he lunges during the thrust
  GAWAINE SWORD    NORMAL, SHORT, WIDE      how far his thrust reaches
  GAWAINE CHASE    NORMAL, NEVER, FAST      whether he rushes you while you swing
  GAWAINE RANGE    NORMAL, CLOSE, FAR       the distance he stops and fights at
  WOLFMAN AI       ON, OFF                  AtlasDevWolfmanControl: the Wolfman fights smart
  WOLFMAN WINDUP / LUNGE / SWORD / CHASE / RANGE    the same five settings for the Wolfman
  START GOLD       1500, NONE, 5000         FastStart: gold for a new game
  SELL PRICE       100, 250, 500            FlexibleItems: sell price of unlisted items
  KILL HERO        -                        the hero dies when you unpause
  DEFAULTS         -                        every row back to its default

Always on (built in at their FaxEdit defaults, not in the menu)
---------------------------------------------------------------
  LADDER CROWN     -                        AtlasDevLadderCrown: stand on ladder tops
  TEXT SPEED       -                        TextSpeed: text draws at full speed
  FOG RULES        -                        FogRules: fog only where the rules say
  SAVE RAM         -                        SRAM: the game saves to battery
  BUG FIXES        -                        BugFixes: Pendant and pickup-count fixes
  POISON PICKUP    -                        PoisonPickup: poison becomes an inventory item
  SMART KEYS       -                        AtlasDevSmartKeys: smarter key doors
  ENEMY STATS      -                        AtlasDevEnemyStats: normal profile (stock stats)
  START RING       -                        FastStart: a new game starts with the Ring of Elf
  QUEST DROPS      -                        QuestFlagItemDrops: mattock and wing boots drops
  BOSS ITEMS       -                        BossLockedItems: items appear once a room is clear
  ITEM RULES       -                        FlexibleItems: items indoors, shops buy anything
  COND SCRIPTS     -                        ConditionalScript: one-time events for scripts
  SAME WORLD MUSIC -                        SameWorldTransPal2Mus: palette-to-music fix
  SCHEDULER        -                        AtlasDevFrameScheduler: runs day/night, tint, clock

Not included
------------
  COMBAT FEEL      -                        FaxEdit refuses it together with RunControl
  KILL SWITCH      -                        replaced by the KILL HERO row
  DYNAMIC TILESETS -                        needs your own project graphics
  ITEM SCRIPTS     -                        needs your own project scripts
  JAPAN VERSION    -                        its free space is too small for Ladder Crown

Settings that change the size of a hack's code (jump air-jumps, run
"instant", mattock push mode, fall steer mode 2, the monsters' guard time)
and settings stored in patched ROM code (text speed, enemy stats profiles,
the item-hack switches) are not in the menu yet: the showcase only offers
settings it can switch live.
