FaxOptions Debug 9.2
====================
English version: README.txt

Crown Jewels plus un SCRIPT RUNNER : lancez n'importe quel opcode de script de la
ROM depuis le menu de pause, avec vos propres paramètres. Conçu pour les tests, pas
pour jouer.

Patchs
------
  USA (166 opcodes), USA Rev 1 et Europe (165, sans Switch), en IPS ou BPS.
  Mêmes exigences que Crown Jewels : une ROM propre avec en-tête NES 2.0 et un
  émulateur qui conserve les sauvegardes sur batterie.

Tout ce qui est dans Crown Jewels est ici aussi (hacks, lignes FaxOptions, PASSWORD
à l'écran de départ), sauf la ligne SELL PRICE.

Script runner
-------------
  Start, puis Select       ouvre FaxOptions
  dernière ligne           SCRIPT RUNNER, appuyez sur A
  Haut / Bas               choisir un champ : OP, ARG1 à ARG5, RUN
  Gauche / Droite          OP : opcode précédent / suivant (tenir pour défiler)
                           ARG : changer la valeur (hexa; seulement celles que
                           l'opcode prend)
  Start, ou A sur RUN      met le script en file et ferme le menu
  B                        retour à la liste FaxOptions
Reprenez : le script s'exécute à l'image suivante.

La ligne d'aide montre l'octet de l'opcode, combien d'octets d'argument il prend et
s'il fait un saut. Les valeurs sur deux octets (montants) s'entrent octet bas
d'abord : GetGold $10 $01 = 272. Le jeu ajoute l'or par tranches de 10, donc 272
donne 280. If... et les autres opcodes de saut terminent le script, qu'ils soient
vrais ou faux. Les opcodes prévus pour un magasin, une porte ou un PNJ agissent sur
ce qui est actif, ou ne font rien.

Pas dans le runner
------------------
  End, OpenShopBuy/Sell, AtlasDevIfItemCount, FadeIn, EntitySayMessage,
  DamageEntity, SetAttrRect, FadeOut, SetPlayerPosition, ShowNumberInMessage,
  ArmRole, SpawnMagicAt, WarpAreaScreenPos, CastSpellFromEntity,
  GetPlayerPositionToVars, ShakeScreen, DissolveEntity

Opcodes (USA; Rev 1 et Europe ont la même liste sans Switch)
------------------------------------------------------------
  $01  MsgNoskip              1 octet d'argument
  $02  MsgPrompt              1 octet d'argument
  $03  Msg                    1 octet d'argument
  $04  IfTitleChange          0 octet d'argument  saut
  $05  LoseGold               2 octets d'argument
  $06  SetSpawn               1 octet d'argument
  $07  GetItem                1 octet d'argument
  $09  GetGold                2 octets d'argument
  $0A  GetMana                1 octet d'argument
  $0B  IfQuest                1 octet d'argument  saut
  $0C  IfRank                 1 octet d'argument  saut
  $0D  IfGold                 0 octet d'argument  saut
  $0E  SetQuest               1 octet d'argument
  $0F  IfBuy                  0 octet d'argument  saut
  $10  LoseItem               1 octet d'argument
  $12  IfItem                 1 octet d'argument  saut
  $13  GetHealth              1 octet d'argument
  $14  ShowMantra             0 octet d'argument
  $15  EndGame                0 octet d'argument
  $16  IfMsgPrompt            1 octet d'argument  saut
  $17  Jump                   0 octet d'argument  saut
  $18  ClearPortrait          0 octet d'argument
  $19  HideTextbox            0 octet d'argument
  $1A  OpenTextbox            0 octet d'argument
  $1B  CloseWindow            0 octet d'argument
  $1C  Die                    0 octet d'argument
  $1D  ForceDoor              0 octet d'argument
  $1E  FreezeEntities         0 octet d'argument
  $1F  ResumeEntities         0 octet d'argument
  $20  SetInvincibilityFrames 1 octet d'argument
  $21  FullMana               0 octet d'argument
  $22  ClearVisibleMagic      0 octet d'argument
  $23  SetMana                1 octet d'argument
  $24  QueuePaletteFlush      0 octet d'argument
  $25  IfPlayerAttacking      0 octet d'argument  saut
  $26  IfPlayerInvincible     0 octet d'argument  saut
  $27  RunScreenHandler       0 octet d'argument
  $28  IfPlayerClimbing       0 octet d'argument  saut
  $29  IfMagicActive          0 octet d'argument  saut
  $2A  SetMusic               1 octet d'argument
  $2B  IfPlayerGrounded       0 octet d'argument  saut
  $2C  PlaySFX                1 octet d'argument
  $2D  IfPlayerDead           0 octet d'argument  saut
  $2E  SetPlayerVelocity      2 octets d'argument
  $2F  IfButtonHeld           1 octet d'argument  saut
  $30  IfButtonPressed        1 octet d'argument  saut
  $31  FullHeal               0 octet d'argument
  $32  DespawnAllEntities     0 octet d'argument
  $33  CloseDialogue          0 octet d'argument
  $34  IfSelectedWeapon       1 octet d'argument  saut
  $35  IfSelectedMagic        1 octet d'argument  saut
  $36  SetColorEmphasis       1 octet d'argument
  $37  Attack                 0 octet d'argument
  $38  WaitFrames             1 octet d'argument
  $39  RestorePalette         0 octet d'argument
  $3A  GetXP                  2 octets d'argument
  $3B  ForceJump              1 octet d'argument
  $3C  LayTextAt              2 octets d'argument
  $3D  SetHealth              1 octet d'argument
  $3E  IfHealthBelow          1 octet d'argument  saut
  $3F  IfHealthAtLeast        1 octet d'argument  saut
  $40  IfManaAtLeast          1 octet d'argument  saut
  $41  DespawnEntity          1 octet d'argument
  $43  LoadSpritePalette      1 octet d'argument
  $44  SetScreenEvent         1 octet d'argument
  $45  IfEffectActive         1 octet d'argument  saut
  $46  IfEntitySlotActive     1 octet d'argument  saut
  $47  IfInventoryFull        0 octet d'argument  saut
  $48  ClearCarriedInventory  0 octet d'argument
  $49  IfEntityHidden         1 octet d'argument  saut
  $4A  LoadBgPalette          1 octet d'argument
  $4B  IfWorld                1 octet d'argument  saut
  $4C  IfScreen               1 octet d'argument  saut
  $4D  IfDoorYX               1 octet d'argument  saut
  $4E  FaceEntityToPlayer     1 octet d'argument
  $4F  LayText                0 octet d'argument
  $50  IfStage                1 octet d'argument  saut
  $51  IfMusic                1 octet d'argument  saut
  $52  IfEntityTypePresent    1 octet d'argument  saut
  $53  SetEntityHealth        2 octets d'argument
  $54  SetEntityInvincible    2 octets d'argument
  $55  LayTextLine            3 octets d'argument
  $56  SetAddr                3 octets d'argument
  $57  IfSelectedItem         1 octet d'argument  saut
  $58  SetGold                3 octets d'argument
  $59  IfEntityCountAtLeast   1 octet d'argument  saut
  $5A  SetFacing              1 octet d'argument
  $5B  FlashScreen            1 octet d'argument
  $5C  SetEntityScript        2 octets d'argument
  $5D  RemoveAllItems         1 octet d'argument
  $5E  WaitForButtonPress     1 octet d'argument
  $5F  IfPlayerFacing         1 octet d'argument  saut
  $60  IfEquippedItem         1 octet d'argument  saut
  $61  SetQuestFlag           1 octet d'argument
  $62  SelectFlag             1 octet d'argument
  $63  IfBossPresent          0 octet d'argument  saut
  $64  ApplyEffect            2 octets d'argument
  $65  IfQuestFlag            1 octet d'argument  saut
  $66  SetEntitySpeed         3 octets d'argument
  $67  UseSelectedItem        0 octet d'argument
  $68  IfXPAtLeast            2 octets d'argument  saut
  $69  WipeScreenStep         3 octets d'argument
  $6A  SetEntityPosition      3 octets d'argument
  $6B  ShowItemName           3 octets d'argument
  $6C  IfRandomChance         1 octet d'argument  saut
  $6D  SetFlag                1 octet d'argument
  $6E  ClearQuestFlag         1 octet d'argument
  $6F  JSR                    0 octet d'argument  saut
  $70  HealEntity             2 octets d'argument
  $71  SetEntityBehavior      2 octets d'argument
  $72  SetExperience          2 octets d'argument
  $73  SetMagicFacing         1 octet d'argument
  $74  IfFlag                 1 octet d'argument  saut
  $75  IfAddrEquals           3 octets d'argument  saut
  $76  RestoreRect            4 octets d'argument
  $77  WarpToDoor             1 octet d'argument
  $78  FrameCountToVar        1 octet d'argument
  $79  IfYX                   1 octet d'argument  saut
  $7A  PlaceChrTile           3 octets d'argument
  $7B  ClearFlag              1 octet d'argument
  $7C  SetEntityHidden        2 octets d'argument
  $7D  SetMetatile            2 octets d'argument
  $7E  ShowIcon               3 octets d'argument
  $7F  SetTextColor           1 octet d'argument
  $80  ClearTimedEffects      0 octet d'argument
  $81  EquipItem              1 octet d'argument
  $82  KnockbackPlayer        2 octets d'argument
  $83  ClearTextLine          1 octet d'argument
  $84  SetPalette             5 octets d'argument
  $85  SetVar                 2 octets d'argument
  $86  SetEntityFacing        2 octets d'argument
  $87  SetMagicPosition       1 octet d'argument
  $88  SetSelectedFlag        0 octet d'argument
  $89  IfAddrBetween          4 octets d'argument  saut
  $8A  ShowSequentialMessages 4 octets d'argument
  $8B  PeekToVar              3 octets d'argument
  $8C  IfSelectedFlag         0 octet d'argument  saut
  $8D  DamagePlayer           1 octet d'argument
  $8E  ClearTimedEffect       1 octet d'argument
  $8F  AddVar                 2 octets d'argument
  $90  IfVarEqual             2 octets d'argument  saut
  $91  ClearText              0 octet d'argument
  $92  SetEntityBScript       3 octets d'argument
  $93  SubVar                 2 octets d'argument
  $94  OpenWindow             4 octets d'argument
  $95  GetEffectTime          2 octets d'argument
  $96  ClearSelectedFlag      0 octet d'argument
  $97  IfVarLess              2 octets d'argument  saut
  $98  IfVarGreaterEqual      2 octets d'argument  saut
  $99  ShowIconEx             4 octets d'argument
  $9A  IfGoldAtLeast          3 octets d'argument  saut
  $9B  CopyVar                2 octets d'argument
  $9C  CountActiveEntities    1 octet d'argument
  $9D  FindEntity             2 octets d'argument
  $9E  AnimateTiles           2 octets d'argument
  $9F  ShowMessageFromVar     1 octet d'argument
  $A0  SwapVar                2 octets d'argument
  $A1  WriteVarToMetatile     2 octets d'argument
  $A2  IfVarMask              3 octets d'argument  saut
  $A3  DrawVarNumber          4 octets d'argument
  $A4  Repeat                 2 octets d'argument
  $A5  ShowChoiceToVar        2 octets d'argument
  $A6  GetLocationToVars      2 octets d'argument
  $A7  SpawnEntity            2 octets d'argument
  $A8  CastSpell              1 octet d'argument
  $A9  Switch                 2 octets d'argument
