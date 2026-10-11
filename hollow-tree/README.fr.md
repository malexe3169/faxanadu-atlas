# Faxanadu : Hollow Tree v49 (Ghostlight)

*[English version](README.md)*

Une refonte à la manière de Dark Souls du jeu NES *Faxanadu* (version
américaine), bâtie sur le jeu original. L'Arbre-Monde est creux : l'or, ce
sont des âmes, les gourous gardent les flammes, la mort vous coûte ce que vous
portez, et chaque monstre montre son attaque avant de frapper. Un projet en
cours, publié en préversions numérotées.

Le patch est `faxanadu-hollow-tree-v49-ghostlight.bps`. Il donne une
cartouche de 512 Ko (MMC1, carte SUROM) avec une sauvegarde sur pile.

## Ce qui change

**Nouvelle partie**
- Un court prologue, qu'on passe avec Start.
- **Le vœu :** PILGRIM (ennemis à 3/4 de leur vie et de leurs dégâts),
  UNDEAD (tel que prévu) ou HOLLOW (×1,5). Il tient pour toute la partie.
- **Une classe :** WARRIOR, KNIGHT, THIEF, SORCERER, CLERIC ou DEPRIVED,
  chacune avec son équipement, ses niveaux et ses extras. DEPRIVED part avec
  rien, sauf 4 000 âmes.
- **Une apparence :** six couleurs pour le héros.

**Âmes et mort**
- L'or, ce sont des âmes. Les monstres paient en âmes; l'expérience est
  disparue.
- Quand vous mourez, vos âmes restent là où vous êtes tombé, en tache de
  sang. Vous retournez au dernier gourou sans rien. Touchez la tache pour les
  reprendre; mourez avant et elles sont perdues.
- Les ennemis tués restent morts jusqu'à ce que vous vous reposiez ou
  mouriez. Les boss et les élites restent morts pour de bon.
- L'anneau des âmes (l'ancien Elixir) garde vos âmes à une mort, puis se
  brise.

**Gourous et feux**
- Les huit gourous sont des feux de camp. Se reposer remplit la vie, les
  fioles, l'endurance et les sorts, ramène les ennemis ordinaires et
  sauvegarde la partie.
- Chaque gourou vend des niveaux dans huit statistiques : Vitality,
  Strength, Endurance, Attunement, Dexterity, Intelligence, Faith et
  Resistance.
- Une fois que le roi a relié les gardiens, n'importe quel gourou vous mène
  à un autre déjà visité.

**Estus**
- La potion rouge devient la fiole d'Estus (la moitié de votre vie) et la
  potion noire la fiole cendrée (vos sorts). Les fioles se remplissent quand
  vous vous reposez.
- Les neuf vrais boss laissent chacun un éclat d'Estus; le forgeron d'Eolis
  change les éclats en fioles de plus.

**Combat**
- L'endurance : chaque coup, chaque parade et chaque pas de recul en coûte.
  Elle s'affiche à la place de l'expérience.
- Tenez Bas pour parer avec un bouclier. Bas et A au sol, c'est un pas de
  recul avec des images d'invincibilité.
- L'armure a un poids; un équipement lourd ralentit l'endurance et la
  marche.
- Les dégâts montent avec vos statistiques. Chaque monstre tremble avant de
  foncer, de sauter, de plonger ou de tirer, et reste ouvert après. Les
  monstres frappent plus fort plus on monte dans l'arbre.
- Les seigneurs préparent leurs attaques et deviennent plus féroces sous la
  moitié de leur vie. Un mur de brume se dresse devant eux.

**Magie**
- Les sorts ont des utilisations au lieu de MP, et seuls les sorts
  harmonisés se lancent. Reposez-vous avec un sort équipé pour l'harmoniser;
  Attunement fixe combien restent harmonisés.
- Un sort traverse un monstre qui y est immunisé.

**Équipement**
- Vingt et un nouveaux objets : huit armes, cinq armures, quatre boucliers et
  quatre sorts. Certains se vendent, les autres se trouvent dans le monde :
  des lueurs là où étaient les poisons, des butins de seigneurs, des butins
  rares et des autels d'église. Chacun se trouve une seule fois.
- Le forgeron sertit une pierre dans votre lame : feu, foudre ou magie.
- L'humanité : ramassée dans le monde et gagnée sur les boss. Elle augmente
  la chance d'objets au hasard.

**Le monde**
- Les routes sont remaniées, et la carte est nouvelle.
- Les murs brisés restent brisés.

**Menus, musique, apparence**
- STATUS montre votre niveau d'âme, les huit statistiques, l'humanité et
  votre vœu.
- Une nouvelle trame sonore. MUSIC, dans le menu Select, passe à la musique
  originale en tout temps.
- Un nouveau titre, des jambes plus fluides à la marche, et un court
  accroupissement à l'atterrissage.
- Deux fins et une Nouvelle Partie+.

## Pas inclus

- Les quêtes des trois derniers objets (Catarina Armor, Fireball, Patches)
- Un coffre de rangement chez les gourous
- Les chiffres de dégâts
- L'ensemble complet d'animations Fluid Motion
- La parade parfaite, la vitesse et la portée des armes, les faiblesses
  élémentaires

## Utilisation

Appliquez le `.bps` sur une ROM propre de la version américaine. Un patch BPS
vérifie d'abord le fichier, donc une mauvaise ROM est refusée. [Floating
IPS](https://github.com/Alcaro/Flips) et [Rom Patcher
JS](https://www.marcrobledo.com/RomPatcher.js/) l'appliquent tous les deux.
Jouez dans un émulateur qui garde les sauvegardes sur pile et qui fait rouler
les jeux MMC1 de 512 Ko; il est testé dans Mesen.

La ROM est la bonne si l'une ou l'autre empreinte correspond :

| empreinte | valeur | vérifier avec |
| --- | --- | --- |
| SHA-1 du fichier | `2e2b95db2be615cf588f0d758e0f7b1ccd81590a` | `sha1sum votre.nes` |
| SHA-1 du contenu | `5b05c8859f356013d37f0545f5de5fa1693da5da` | `tail -c +17 votre.nes \| sha1sum` |

Le jeu patché est le bon si l'une ou l'autre empreinte correspond :

| patch | SHA-1 du fichier | SHA-1 du contenu |
| --- | --- | --- |
| `faxanadu-hollow-tree-v49-ghostlight` | `94390f49feaf076af8190c5eaa36fa1529b972a1` | `9be1dc1801496e4c7b87cdd7c2a8863804320736` |

Le patch ne contient aucune donnée du jeu original; il copie ce qu'il lui faut
à partir de votre propre ROM.

## Crédits

Hollow Tree est notre propre travail. Son monde a été bâti avec les outils
[FaxEdit](https://github.com/kaimitai/faxedit) de Kai E. Frøland, et son menu
d'options vient des builds FaxOptions. La plupart de ce qu'on sait du
fonctionnement du jeu vient du
[désassemblage de Faxanadu](https://github.com/chipx86/faxanadu) de chipx86.

## Versions

- **v49 (Ghostlight)** : la première préversion publique. Les classes et les
  apparences, le nouvel équipement dans le monde, le choix de la musique, les
  sorts qui traversent les immunisés, l'accroupissement à l'atterrissage.
