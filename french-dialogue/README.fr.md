# Atlas — Dialogues français 0.1

*[English version](README.md)*

Les dialogues du jeu original en français de France (`fr`) ou en français
canadien / Québec (`qc`). Les versions occidentales traduisent **uniquement les
dialogues**. Les versions japonaises adaptent aussi la saisie du nom au jeu de
caractères latins de la PR. Menus, noms d'objets, écran titre et alphabet des
mots de passe restent d'origine.

Adaptation des scripts FR/QC de la
[PR 2 de la Faxanadu Translation Table d'UnsavoryMaggot](https://github.com/UnsavoryMaggot/Faxanadu-Translation-Table/pull/2).
La Translation Table et [Faxanadu Retranslation](https://github.com/UnsavoryMaggot/Faxanadu-Retranslation)
sont les fondations de ce travail, pas des projets concurrents.

Ces nouveaux patchs s'appliquent directement aux ROMs originales propres :
USA, USA Rev 1, Europe et Japon. Chaque base conserve sa jouabilité, sa musique,
ses graphismes hors glyphes de texte, ses mots de passe, son mapper et sa taille.
Pas de sauvegarde SRAM, d'améliorations QoL, de corrections de jouabilité ni
d'extension de ROM héritée de Retranslation. La version japonaise utilise un
petit adaptateur d'affichage des dialogues latins et de saisie du nom compatible.
Les titres et libellés japonais Supprimer/Terminer restent d'origine : ce n'est
pas une traduction complète des menus.

## Appliquer un patch

Choisissez `faxanadu-atlas-LOCALE-dialogue-0.1-BASE.ips` ou `.bps`, avec
`LOCALE` = `fr` ou `qc`, et `BASE` = `usa`, `usa-rev1`, `europe` ou `japan`.

1. Partez d'une ROM propre de la bonne base; consultez les [sommes de contrôle](../README.fr.md#quelle-rom-il-vous-faut).
2. Appliquez le patch avec [Floating IPS](https://github.com/Alcaro/Flips)
   ou [Rom Patcher JS](https://www.marcrobledo.com/RomPatcher.js/).
3. Enregistrez sous un nouveau nom. Ne l'appliquez pas sur Retranslation, QoL Edition ou un autre hack.

Le BPS vérifie le fichier complet, entête comprise. L'IPS accepte aussi une
autre entête de 16 octets si le corps de la ROM correspond à la somme indiquée.
Aucune ROM n'est fournie.

## Portée de la traduction

Scripts épinglés à `0c8eee1e6c2446ac3da949c890214668fe32d085`, réorganisés en
193 messages natifs et lignes de seize caractères. Les références au nom
non prises en charge sont retirées des bases occidentales; le Japon conserve
la substitution du nom. Les rangs japonais deviennent « un nouveau
titre » dans le dialogue, sans modifier les rangs du menu. Prix et indications
de quête respectent les mécanismes de chaque base originale.

Version expérimentale 0.1. Les manifestes JSON donnent les sommes de contrôle
des ROMs et des patchs. La compatibilité sur matériel réel n'est pas garantie.

## Saisie du nom au Japon

Sélectionnez avec la croix directionnelle et A. Le bouton de la dernière ligne
marqué `a`, `é` ou `A` alterne entre majuscules, minuscules et accents. Chiffres,
ponctuation et espace sont disponibles sur chaque page. Le nom reste limité à
quatre caractères; B recule le curseur d'édition. Supprimer et Terminer gardent
leurs libellés japonais. Les dix accents `éèêàâîôûùç` proviennent de la PR;
son jeu de caractères ne contient pas de majuscules accentuées.

Crédits : UnsavoryMaggot
pour la Translation Table et Retranslation, chipx86 pour la référence de
rétro-ingénierie. Patchs amateurs non officiels, sans affiliation aux ayants droit.
