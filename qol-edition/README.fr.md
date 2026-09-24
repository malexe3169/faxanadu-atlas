# Faxanadu QoL Edition 1.3

*[English version](README.md)*

Un patch de confort pour le jeu NES *Faxanadu* (version USA). Il conserve le monde et
l'histoire d'origine tout en améliorant les commandes, la réactivité et la
lisibilité des combats.

## Ce qu'il change

- **Barre de vie ennemie.** Touchez un ennemi à l'épée ou avec un sort pour
  afficher sa vie restante. La barre reste visible jusqu'à sa mort, sa
  disparition ou un changement de salle. Sans nom d'ennemi; active par défaut.
- **Écrans noirs plus courts (FastBlink).** Les transitions avec effacement
  et redessin attendent moins longtemps. Le défilement horizontal est conservé.
- **Protection de l'onguent corrigée.** L'onguent actif bloque aussi la magie
  quand un bouclier est équipé, y compris l'éclair de Sugata sur tout l'écran.

- **Transitions d'écran plus rapides.** La pause qui survenait quand l'écran
  défilait ou que le jeu chargeait du nouveau contenu est nettement plus courte,
  surtout dans les salles intérieures chargées.
- **Un menu d'options dans le jeu.** Tenez **Select** et appuyez sur **Start** pour
  ouvrir un panneau de réglages depuis l'écran de pause. Vous pouvez y régler :
  - la vitesse du texte
  - quelques corrections de bogues de longue date (actives par défaut)
  - la sensation de la chute, du saut et des échelles
  Vos choix sont enregistrés dans la mémoire sur batterie de la cartouche : ils
  restent d'une partie à l'autre sur une vraie console ou dans un émulateur qui
  gère les sauvegardes sur batterie.
- **Sauvegardes sur batterie.** Le jeu enregistre maintenant votre progression en
  mémoire sur batterie. L'écran de départ offre **START**, **CONTINUE** et
  **PASSWORD** : les mantras d'origine fonctionnent toujours comme avant.
- **Clés automatiques.** Avoir la bonne clé sur soi ouvre une porte verrouillée
  automatiquement, sans passer par le menu des objets pour la choisir. Les clés
  s'usent toujours à raison d'une par porte, sont toujours comptées et s'achètent
  toujours en magasin; seul le détour par le menu disparaît.
- **Pioche automatique.** Un rocher que vous pouviez déjà creuser se creuse
  maintenant sans choisir la pioche d'avance : appuyez sur le bouton d'objet devant
  lui, ou entrez simplement dedans en continuant de pousser un moment. La pioche
  reste nécessaire et s'use toujours comme avant, et les rochers que le jeu
  original refusait — en plein saut, dans une échelle ou tout au bord droit d'un
  écran — refusent toujours.

## Utilisation

Appliquez le patch `faxanadu-qol-edition-1.3.ips` ou `.bps` sur une ROM propre de la
version USA. Utilisez un émulateur qui conserve les sauvegardes sur batterie.

Votre ROM est la bonne si l'une des deux sommes correspond :

| somme | valeur | vérification |
| --- | --- | --- |
| SHA-1 du fichier | `2e2b95db2be615cf588f0d758e0f7b1ccd81590a` | `sha1sum votre.nes` |
| SHA-1 du corps | `5b05c8859f356013d37f0545f5de5fa1693da5da` | `tail -c +17 votre.nes \| sha1sum` |

La somme du fichier couvre tout le `.nes`; celle du corps couvre le même fichier
sans son entête de 16 octets, et c'est elle qui identifie le jeu peu importe
l'entête de votre copie.

## Crédits

Les sauvegardes sur batterie et la correction de l'onguent sont des hacks généraux de
[FaxEdit](https://github.com/kaimitai/faxedit) (« Echoes of Eolis ») de Kai E. Frøland.
Les clés et la pioche automatiques, la barre de vie ennemie et FastBlink sont nos
propres hacks, qui font maintenant partie des hacks généraux de FaxEdit. L'essentiel de ce que nous savons du fonctionnement du
jeu vient du [désassemblage de Faxanadu](https://github.com/chipx86/faxanadu) de chipx86.

## Versions

- **1.3** : barre de vie ennemie persistante, FastBlink, OintmentFix et
  correction de CONTINUE pour charger les sauvegardes avec PASSWORD présent.

- **1.2** : la pioche automatique, et PASSWORD de retour sur l'écran de départ.
- **1.1** : clés automatiques.
- **1.0** : transitions d'écran plus rapides, le menu d'options et les sauvegardes sur batterie.
