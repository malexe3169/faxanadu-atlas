# Faxanadu QoL Edition 1.1

*[English version](README.md)*

Un patch de confort pour le jeu NES *Faxanadu* (version USA). Il ne change rien au
contenu, à la difficulté ni à l'histoire du jeu, seulement la façon dont il se joue.

## Ce qu'il change

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
  mémoire sur batterie, au lieu du système de mots de passe (ou en plus de celui-ci).
- **Clés automatiques.** Avoir la bonne clé sur soi ouvre une porte verrouillée
  automatiquement, sans passer par le menu des objets pour la choisir. Les clés
  s'usent toujours à raison d'une par porte, sont toujours comptées et s'achètent
  toujours en magasin; seul le détour par le menu disparaît.

## Utilisation

Appliquez le patch `faxanadu-qol-edition-1.1.ips` ou `.bps` sur une ROM propre de la
version USA (SHA-1 du fichier `.nes` complet :
`2e2b95db2be615cf588f0d758e0f7b1ccd81590a`). Utilisez un émulateur qui conserve les
sauvegardes sur batterie.

## Crédits

Ce patch s'appuie sur [FaxEdit](https://github.com/kaimitai/faxedit) (« Echoes of
Eolis ») de Kai E. Frøland : ses hacks généraux (les sauvegardes sur batterie et
les clés automatiques) et sa connaissance du jeu.

## Versions

- **1.1** : clés automatiques.
- **1.0** : transitions d'écran plus rapides, le menu d'options et les sauvegardes sur batterie.
