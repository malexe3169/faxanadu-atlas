# Builds sur mesure de Faxanadu 9.2-4

*[English version](README.md)*

Demandez un patch de Faxanadu avec les hacks généraux de FaxEdit de votre choix :
[la page de demande](https://malexe3169.github.io/faxanadu-atlas/custom-build/).

1. Choisissez des hacks et réglez-les. La page les vérifie avec le
   [tableau de compatibilité des hacks](../faxedit-hack-compatibility-9.2) et met les lignes
   dans l'ordre qui se bâtit.
2. Choisissez les versions du jeu : USA, USA Rev 1 ou Europe.
3. Appuyez sur Demander cette build. Ça ouvre une issue GitHub avec vos lignes déjà
   remplies. Cochez les régions et envoyez-la.

Chaque demande est bâtie et vérifiée, puis les patches sont joints à l'issue dans un zip :
IPS et BPS pour chaque version, et un README en anglais et en français. Chaque build
garde aussi un dossier dans [requests](requests), pour y revenir plus tard.

Les hacks marqués 🟠 ne sont pas encore dans FaxEdit. Ils sont bâtis avec FaxEdit 9.2 et
leurs changements ajoutés.

Une build peut venir avec le menu FaxOptions : les hacks roulent depuis la RAM de
sauvegarde et un menu de pause les active et change leurs réglages pendant que vous
jouez, comme dans FaxOptions Showcase 9.2. Il faut un émulateur ou une cartouche
flash qui garde les sauvegardes. La page grise les hacks qui ne peuvent pas encore
y aller.

## Non inclus

Branches in Motion, Dynamic Tilesets, Item Scripts, AtlasDevStatusWard, AtlasDevLandingTuck, la version japonaise.

## Versions

- 9.2-1 : la première version, avec les hacks du tableau de compatibilité 9.2-3.
- 9.2-2 : ajoute Screen Blink et Fast Blink, du tableau de compatibilité 9.2-4.
- 9.2-3 : Screen Blink devient Screen Transition, avec un style par direction, du tableau de compatibilité 9.2-5.
- 9.2-4 : les builds avec le menu FaxOptions.
