FaxOptions Debug 9.2
====================
Crown Jewels plus a SCRIPT RUNNER: run any of the ROM's script opcodes from the
pause menu, with your own parameters. Built for testing, not for play.

Patches
-------
  USA (166 opcodes), USA Rev 1 and Europe (165, without Switch), IPS or BPS.
  Same requirements as Crown Jewels: a clean NES 2.0 dump and an emulator that keeps
  battery saves.

Everything in Crown Jewels is here too (hacks, FaxOptions rows, PASSWORD on the
start screen), except the SELL PRICE row.

Script runner
-------------
  Start, then Select   open FaxOptions
  go to the last row   SCRIPT RUNNER, press A
  Up / Down            pick a field: OP, ARG1 to ARG5, RUN
  Left / Right         OP: previous / next opcode (hold to scroll)
                       ARG: change the value (hex; only the ones the opcode takes)
  Start, or A on RUN   queue the script and close the menu
  B                    back to the FaxOptions list
Unpause: the script runs on the next frame.

The help line shows the opcode's byte, how many argument bytes it takes and
whether it jumps. Two-byte values (amounts) are entered low byte first:
GetGold $10 $01 = 272. The game adds gold in steps of 10, so 272 gives 280.
If... and other jump opcodes end the script whether they are true or false.
Opcodes meant for a shop, a door or an NPC act on whatever is current, or do
nothing.

Not in the runner
-----------------
  End                    nothing to run
  OpenShopBuy/Sell       they need a shop table
  15 large FaxEdit opcodes do not fit beside the others: AtlasDevIfItemCount,
  FadeIn, EntitySayMessage, DamageEntity, SetAttrRect, FadeOut, SetPlayerPosition,
  ShowNumberInMessage, ArmRole, SpawnMagicAt, WarpAreaScreenPos,
  CastSpellFromEntity, GetPlayerPositionToVars, ShakeScreen, DissolveEntity

Opcodes (USA; Rev 1 and Europe have the same list without Switch)
------------------------------------------------------------------
  $01  MsgNoskip              1 arg byte
  $02  MsgPrompt              1 arg byte
  $03  Msg                    1 arg byte
  $04  IfTitleChange          0 arg bytes  jump
  $05  LoseGold               2 arg bytes
  $06  SetSpawn               1 arg byte
  $07  GetItem                1 arg byte
  $09  GetGold                2 arg bytes
  $0A  GetMana                1 arg byte
  $0B  IfQuest                1 arg byte  jump
  $0C  IfRank                 1 arg byte  jump
  $0D  IfGold                 0 arg bytes  jump
  $0E  SetQuest               1 arg byte
  $0F  IfBuy                  0 arg bytes  jump
  $10  LoseItem               1 arg byte
  $12  IfItem                 1 arg byte  jump
  $13  GetHealth              1 arg byte
  $14  ShowMantra             0 arg bytes
  $15  EndGame                0 arg bytes
  $16  IfMsgPrompt            1 arg byte  jump
  $17  Jump                   0 arg bytes  jump
  $18  ClearPortrait          0 arg bytes
  $19  HideTextbox            0 arg bytes
  $1A  OpenTextbox            0 arg bytes
  $1B  CloseWindow            0 arg bytes
  $1C  Die                    0 arg bytes
  $1D  ForceDoor              0 arg bytes
  $1E  FreezeEntities         0 arg bytes
  $1F  ResumeEntities         0 arg bytes
  $20  SetInvincibilityFrames 1 arg byte
  $21  FullMana               0 arg bytes
  $22  ClearVisibleMagic      0 arg bytes
  $23  SetMana                1 arg byte
  $24  QueuePaletteFlush      0 arg bytes
  $25  IfPlayerAttacking      0 arg bytes  jump
  $26  IfPlayerInvincible     0 arg bytes  jump
  $27  RunScreenHandler       0 arg bytes
  $28  IfPlayerClimbing       0 arg bytes  jump
  $29  IfMagicActive          0 arg bytes  jump
  $2A  SetMusic               1 arg byte
  $2B  IfPlayerGrounded       0 arg bytes  jump
  $2C  PlaySFX                1 arg byte
  $2D  IfPlayerDead           0 arg bytes  jump
  $2E  SetPlayerVelocity      2 arg bytes
  $2F  IfButtonHeld           1 arg byte  jump
  $30  IfButtonPressed        1 arg byte  jump
  $31  FullHeal               0 arg bytes
  $32  DespawnAllEntities     0 arg bytes
  $33  CloseDialogue          0 arg bytes
  $34  IfSelectedWeapon       1 arg byte  jump
  $35  IfSelectedMagic        1 arg byte  jump
  $36  SetColorEmphasis       1 arg byte
  $37  Attack                 0 arg bytes
  $38  WaitFrames             1 arg byte
  $39  RestorePalette         0 arg bytes
  $3A  GetXP                  2 arg bytes
  $3B  ForceJump              1 arg byte
  $3C  LayTextAt              2 arg bytes
  $3D  SetHealth              1 arg byte
  $3E  IfHealthBelow          1 arg byte  jump
  $3F  IfHealthAtLeast        1 arg byte  jump
  $40  IfManaAtLeast          1 arg byte  jump
  $41  DespawnEntity          1 arg byte
  $43  LoadSpritePalette      1 arg byte
  $44  SetScreenEvent         1 arg byte
  $45  IfEffectActive         1 arg byte  jump
  $46  IfEntitySlotActive     1 arg byte  jump
  $47  IfInventoryFull        0 arg bytes  jump
  $48  ClearCarriedInventory  0 arg bytes
  $49  IfEntityHidden         1 arg byte  jump
  $4A  LoadBgPalette          1 arg byte
  $4B  IfWorld                1 arg byte  jump
  $4C  IfScreen               1 arg byte  jump
  $4D  IfDoorYX               1 arg byte  jump
  $4E  FaceEntityToPlayer     1 arg byte
  $4F  LayText                0 arg bytes
  $50  IfStage                1 arg byte  jump
  $51  IfMusic                1 arg byte  jump
  $52  IfEntityTypePresent    1 arg byte  jump
  $53  SetEntityHealth        2 arg bytes
  $54  SetEntityInvincible    2 arg bytes
  $55  LayTextLine            3 arg bytes
  $56  SetAddr                3 arg bytes
  $57  IfSelectedItem         1 arg byte  jump
  $58  SetGold                3 arg bytes
  $59  IfEntityCountAtLeast   1 arg byte  jump
  $5A  SetFacing              1 arg byte
  $5B  FlashScreen            1 arg byte
  $5C  SetEntityScript        2 arg bytes
  $5D  RemoveAllItems         1 arg byte
  $5E  WaitForButtonPress     1 arg byte
  $5F  IfPlayerFacing         1 arg byte  jump
  $60  IfEquippedItem         1 arg byte  jump
  $61  SetQuestFlag           1 arg byte
  $62  SelectFlag             1 arg byte
  $63  IfBossPresent          0 arg bytes  jump
  $64  ApplyEffect            2 arg bytes
  $65  IfQuestFlag            1 arg byte  jump
  $66  SetEntitySpeed         3 arg bytes
  $67  UseSelectedItem        0 arg bytes
  $68  IfXPAtLeast            2 arg bytes  jump
  $69  WipeScreenStep         3 arg bytes
  $6A  SetEntityPosition      3 arg bytes
  $6B  ShowItemName           3 arg bytes
  $6C  IfRandomChance         1 arg byte  jump
  $6D  SetFlag                1 arg byte
  $6E  ClearQuestFlag         1 arg byte
  $6F  JSR                    0 arg bytes  jump
  $70  HealEntity             2 arg bytes
  $71  SetEntityBehavior      2 arg bytes
  $72  SetExperience          2 arg bytes
  $73  SetMagicFacing         1 arg byte
  $74  IfFlag                 1 arg byte  jump
  $75  IfAddrEquals           3 arg bytes  jump
  $76  RestoreRect            4 arg bytes
  $77  WarpToDoor             1 arg byte
  $78  FrameCountToVar        1 arg byte
  $79  IfYX                   1 arg byte  jump
  $7A  PlaceChrTile           3 arg bytes
  $7B  ClearFlag              1 arg byte
  $7C  SetEntityHidden        2 arg bytes
  $7D  SetMetatile            2 arg bytes
  $7E  ShowIcon               3 arg bytes
  $7F  SetTextColor           1 arg byte
  $80  ClearTimedEffects      0 arg bytes
  $81  EquipItem              1 arg byte
  $82  KnockbackPlayer        2 arg bytes
  $83  ClearTextLine          1 arg byte
  $84  SetPalette             5 arg bytes
  $85  SetVar                 2 arg bytes
  $86  SetEntityFacing        2 arg bytes
  $87  SetMagicPosition       1 arg byte
  $88  SetSelectedFlag        0 arg bytes
  $89  IfAddrBetween          4 arg bytes  jump
  $8A  ShowSequentialMessages 4 arg bytes
  $8B  PeekToVar              3 arg bytes
  $8C  IfSelectedFlag         0 arg bytes  jump
  $8D  DamagePlayer           1 arg byte
  $8E  ClearTimedEffect       1 arg byte
  $8F  AddVar                 2 arg bytes
  $90  IfVarEqual             2 arg bytes  jump
  $91  ClearText              0 arg bytes
  $92  SetEntityBScript       3 arg bytes
  $93  SubVar                 2 arg bytes
  $94  OpenWindow             4 arg bytes
  $95  GetEffectTime          2 arg bytes
  $96  ClearSelectedFlag      0 arg bytes
  $97  IfVarLess              2 arg bytes  jump
  $98  IfVarGreaterEqual      2 arg bytes  jump
  $99  ShowIconEx             4 arg bytes
  $9A  IfGoldAtLeast          3 arg bytes  jump
  $9B  CopyVar                2 arg bytes
  $9C  CountActiveEntities    1 arg byte
  $9D  FindEntity             2 arg bytes
  $9E  AnimateTiles           2 arg bytes
  $9F  ShowMessageFromVar     1 arg byte
  $A0  SwapVar                2 arg bytes
  $A1  WriteVarToMetatile     2 arg bytes
  $A2  IfVarMask              3 arg bytes  jump
  $A3  DrawVarNumber          4 arg bytes
  $A4  Repeat                 2 arg bytes
  $A5  ShowChoiceToVar        2 arg bytes
  $A6  GetLocationToVars      2 arg bytes
  $A7  SpawnEntity            2 arg bytes
  $A8  CastSpell              1 arg byte
  $A9  Switch                 2 arg bytes
