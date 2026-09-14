Faxanadu Vanilla SpeedRunner Training
=====================================
Version française : README.fr.txt

The original game, unchanged, with speedrun practice tools in the pause menu.
With the default settings it plays exactly like the original: same game state,
same lag frames.

Patches
-------
  USA, USA Rev 1 (NTSC timer) and Europe (PAL timer), IPS or BPS. Use a clean dump
  and an emulator that keeps battery saves. No Japan version.

Timer
-----
  Starts        at character control: the first moment you can move after
                START, CONTINUE, a warp or a checkpoint
  Stops         at the music change after the Evil One is defeated (the
                official end of a run); the SPLITS page then says FINISHED
  Counts        every frame: pauses and loading are included (real time)
  Lag           frames where the game did not read the controller
  Splits        each time you enter a new area; buildings don't split unless
                SPLIT ON is set to ALL; SCREENS splits on every screen and
                compares each one with your last attempt from that screen
  Time format   MM:SS:CC, using the console's real frame rate
                (NTSC 60.0988 Hz, PAL 50.007 Hz)

Pause menu
----------
  Start, then Select   the SPLITS page (live, the timer keeps running)
  Select               the option rows
  Select or B          close
  Start                apply the rows and close

SPLITS page
-----------
  TOTAL          total time, with hours
  SEGMENT        time since the last split
  LAG TOTAL      lag frames since the start
  LAG SEGMENT    lag frames since the last split
  6 lines        the last splits, newest first: area, screen, segment time,
                 and F (faster) or S (slower) than your last attempt from
                 the same screen (or your best, see COMPARE), by how much
  FRAMES         frames since the start, with NEXT nn or SKIP READY (below)

Quick restart
-------------
  While paused, press A and B together: your last WARP GO or CHECKPOINT GO
  runs again with the current rows, and the game unpauses by itself.

Pause trick
-----------
  Item timers count down once every 64 frames. The game doesn't check them
  while paused, but its frame counter keeps going, so pausing across that
  frame skips a step. NEXT on the ITEMS HUD counts the frames to it; while
  paused it turns into SK (and the SPLITS page says SKIP READY) once the
  frame has passed: unpause and the step is skipped. The count restarts on
  every screen.

Rows
----
  HUD            OFF / POS / MOVE / RNG / TIMER / ITEMS / SPEED. A readout on the blank
                 line above the status bar. Default OFF.
                   POS    A area, S screen, X (3 bytes), Y (2 bytes), in hex
                   MOVE   V = horizontal change per frame (L or R, then hex in
                          1/256 px), A action flags, S status flags, Y
                   RNG    RNG index, L total lag, SL segment lag (hex)
                   TIMER  SEG split count, segment time, total time, and the
                          last split's F/S difference
                   ITEMS  W Wing Boots, O Ointment, G Glove, H Hour Glass (the
                          effect timers, -- when off), and NEXT: frames until
                          they next count down. While paused NEXT shows SK once
                          you have paused across that frame (see below).
                   SPEED  SPD walking speed in 1/256 px per frame (192 at the
                          start, up to 384; knockback shows 999), INV
                          invincibility frames left after a hit, R the RNG
                          index with T frames since it last changed (only
                          monsters that turn at random use it, and the held
                          buttons change what they get), and D the visit
                          counter: 0-3. A few items placed on screens show up
                          on only one visit in four: enter with D at 3 and
                          the item is there.
                          N is the next random turn a monster will make:
                          R right (or up), L left (or down). Hold A on the
                          frame it turns and it goes the other way; no other
                          button matters.
                 Emulators that crop 8 lines at the top still show it; ones
                 that crop more hide it.
                 The HUD uses a little CPU time every frame. On very busy
                 frames it can add a lag frame the original wouldn't have,
                 so turn it off for timing practice. With the HUD off the
                 game runs exactly like the original, splits included.
  SPLIT ON       AREAS (default): buildings don't split. ALL: every area
                 change splits. SCREENS: every screen splits and is compared
                 with your last attempt from that screen (kept in battery
                 RAM, so it survives power off).
  COMPARE        what SCREENS splits compare with: LAST (default) your last
                 attempt from that screen, or BEST your fastest one. Both
                 are kept in battery RAM.
  WARP AREA      Eolis, Trunk, Mist, the towns, Branch, Dartmoor, Zenith.
                 Default Trunk.
  WARP SCREEN    screen number in that area. Default 0. Past the area's last
                 screen it uses the last one.
  WARP X         landing column, 0-15. Default 2.
  WARP Y         landing row, 0-12. Default 10.
  LOADOUT        one of the 8 checkpoint mantras: Eolis, Apolune, Forepaw,
                 Mascon, Victim, Conflate, Daybreak, Dartmoor. Default Eolis.
  RANK           PRESET keeps the mantra's rank, or pick one of the 16.
  WEAPON         PRESET, or pick one.
  ARMOR          PRESET, or pick one.
  SHIELD         PRESET, NONE, or pick one.
  MAGIC          PRESET, NONE, or pick one.
  ITEM           PRESET, NONE, or pick one.
  GOLD           PRESET (from the rank), or 0 to 50000.
  EXP            PRESET (from the rank), or 0 to 30000.
  RESET TIMER    restart the timer at zero, right away.
  WARP GO        warp when you unpause, keeping what you carry. The timer
                 restarts. You can land inside a wall: just warp again.
  CHECKPOINT GO  when you unpause, restart in that town's church with the
                 loadout, exactly like entering the mantra on the title
                 screen. The timer restarts.
  RANK NOW       when you unpause, your title becomes the RANK row's choice
                 (PRESET: no change). Titles set how long Wing Boots last:
                 Novice to Fighter 40 steps, Adept to Warrior 30, Swordman to
                 Myrmidon 20, Champion to Lord 10. The timer keeps running.
  DEFAULTS       put every row back to its default.

Always on
---------
  The timer and the lag counter. They only read the game; with the HUD off
  the game runs exactly as the original.

Not included
------------
  Save states, gameplay hacks, warps into buildings.

Settings are kept in battery RAM and come back after a reset or power off.
