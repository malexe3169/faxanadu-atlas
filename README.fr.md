# Patchs Faxanadu

*[English version](README.md)*

Des patchs pour le jeu NES *Faxanadu*. Chaque dossier contient une version : ses
fichiers de patch et un README qui explique ce qu'elle fait et comment l'utiliser.
Un dossier est plutôt un guide : quels hacks de FaxEdit fonctionnent ensemble.

| Dossier | Version | Ce que c'est | Pour |
|---|---|---|---|
| [qol-edition](qol-edition) | 1.1 | Le jeu original, plus agréable à jouer : transitions d'écran plus rapides, un menu d'options, des sauvegardes sur batterie et des clés qui ouvrent les portes toutes seules. | USA |
| [speedrunner-training](speedrunner-training) | 5.1 | Le jeu original avec des outils d'entraînement au speedrun dans le menu de pause : chronomètre, splits, téléportation, points de départ et affichages à l'écran. Avec les réglages par défaut, il se joue exactement comme l'original. | USA, USA Rev 1, Europe |
| [faxoptions-showcase-9.2](faxoptions-showcase-9.2) | 9.2-1 | FaxOptions Showcase 9.2 (Crown Jewels) : les hacks généraux de FaxEdit 9.2 dans une seule ROM, avec un panneau dans le menu de pause qui les active et change leurs réglages pendant la partie. | USA, USA Rev 1, Europe |
| [faxoptions-debug-9.2](faxoptions-debug-9.2) | 9.2-1 | FaxOptions Debug 9.2 : Crown Jewels plus un exécuteur de scripts, pour lancer les commandes de script du jeu depuis le menu de pause. Pour les tests, pas pour jouer. | USA, USA Rev 1, Europe |
| [faxedit-hack-compatibility-9.2](faxedit-hack-compatibility-9.2) | 9.2-4 | Quels hacks généraux de FaxEdit 9.2 fonctionnent ensemble, plus les hacks pas encore dans FaxEdit, marqués : chaque paire bâtie dans les deux ordres, les paires qui ne marchent pas et pourquoi. | FaxEdit 9.2 |
| [custom-build](custom-build) | 9.2-2 | Demandez un patch avec les hacks de FaxEdit de votre choix : une page qui les vérifie, un formulaire de demande, et des patches IPS et BPS bâtis pour vous. | USA, USA Rev 1, Europe |
| [fax-battle](fax-battle) | 1.0 | Faxanadu Battle : un jeu de combat à deux joueurs bâti sur Faxanadu, avec les modes Crown Scramble et Duel, sept combattants et six arènes. Expérimental. | USA |

## Comment appliquer un patch

1. Partez d'une ROM propre et non modifiée de la bonne version, et gardez-en une copie.
2. Choisissez le patch de votre version, `.ips` ou `.bps`. Un patch BPS vérifie
   d'abord que vous avez choisi le bon fichier; un patch IPS, non.
3. Appliquez-le avec un outil de patch, par exemple [Floating IPS](https://github.com/Alcaro/Flips)
   ou [Rom Patcher JS](https://www.marcrobledo.com/RomPatcher.js/) dans votre navigateur.
4. Enregistrez le résultat dans un nouveau fichier.

La QoL Edition, SpeedRunner Training et les versions FaxOptions gardent leurs
réglages ou leurs sauvegardes en mémoire sur batterie : utilisez un émulateur qui
conserve les sauvegardes sur batterie. Faxanadu Battle a besoin de 8 Ko de mémoire
de travail supplémentaire : il se joue sur émulateur, pas sur une cartouche originale.

## Crédits

Les versions FaxOptions sont construites avec les hacks généraux de la chaîne
d'outils [FaxEdit](https://github.com/kaimitai/faxedit) de Kai E. Frøland, et les
sauvegardes sur batterie de la QoL Edition utilisent l'un d'eux. L'essentiel de ce que
nous savons du code du jeu vient du [désassemblage de Faxanadu](https://github.com/chipx86/faxanadu)
de chipx86; toutes les autres personnes sont remerciées plus bas.

## Remerciements

Merci à toutes les personnes dont le travail nous a aidés à comprendre le jeu :

- chipx86, pour le [désassemblage de Faxanadu](https://github.com/chipx86/faxanadu) et
  [faxanatools](https://github.com/chipx86/faxanatools)
- Invariel, pour le [speedrun assisté par outils](https://tasvideos.org/5338S) publié sur TASVideos
- TASVideos, pour sa [page de ressources Faxanadu](https://tasvideos.org/GameResources/NES/Faxanadu),
  un [fichier d'affichage des ennemis](https://tasvideos.org/UserFiles/Info/35925051135496342) et le
  [générateur de mots de passe](https://web.archive.org/web/20210301103116/http://tasvideos.org/PasswordGenerators.html)
- Aeon Genesis, pour le [chapitre sur Faxanadu](https://web.archive.org/web/20080305153943/http://agtp.romhack.net/docs/tnrb/1-03.html)
  de The New Romhacker's Bible
- le [guide des sauvegardes d'état RockNES](https://web.archive.org/web/20190113213948/https://gamefaqs.gamespot.com/nes/587273-faxanadu/faqs/30344) sur GameFAQs
- la page [Faxanadu additional resources](https://kb.speeddemosarchive.com/index.php?title=Faxanadu/Additional_Resources)
  de Speed Demos Archive
- le [vidage de données de Faxanadu](https://web.archive.org/web/20160506024847/http://www.the-interweb.com/bdump/faxanadu/faxdump.rar)
  de 2005 publié sur the-interweb.com
- ElectronsAndCode ([FaxanaduPW](https://github.com/ElectronsAndCode/FaxanaduPW)),
  sleepy9090 ([FaxanaduShopPriceEditor](https://github.com/sleepy9090/FaxanaduShopPriceEditor)),
  rgeraldporter ([faxanadu-patcher](https://github.com/rgeraldporter/faxanadu-patcher)) et
  mstan ([FaxanaduRecomp](https://github.com/mstan/FaxanaduRecomp))

Faxanadu est une marque de commerce de ses détenteurs de droits respectifs. Ces
patchs sont des créations de fans non officielles, sans affiliation avec eux ni
approbation de leur part.
