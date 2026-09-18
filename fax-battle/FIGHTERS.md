# Faxanadu Battle 1.5 — the fighters

*[Version française](FIGHTERS.fr.md)* · *[Back to Faxanadu Battle](README.md)*

Six fighters, and a seventh you have to find. They are not reskins of each
other: each one has its own speed, jump, reach, damage and timing, and a
special move that costs a full power meter.

## How to read the numbers

**Speed** is how far a fighter moves each update, and **jump** is how hard it
leaves the ground, so a bigger jump number means a higher jump. **Reach** is
how far in front the swing connects, in pixels.

**Timing** is the part that decides trades. A swing has three parts: the
**startup** before it can hit, the five updates it is **active**, and the
**recovery** you are stuck in afterwards. Short startup wins races. Long
recovery is what gets you punished when you miss.

Everything here is tuning written for this game. None of it is how these
monsters behave in Faxanadu.

## The roster at a glance

| Fighter | Speed | Jump | Damage | Reach | Startup / active / recovery |
| --- | ---: | ---: | ---: | ---: | --- |
| Hero | 1 | 6 | 12 | 29 | 3 / 5 / 7 |
| Sword Dwarf | 2 | 5 | 12 | 29 | 5 / 5 / 10 |
| Skeleton Knight | 1 | 6 | 16 | 37 | 7 / 5 / 11 |
| Wolfman | 2 | 7 | 8 | 25 | 2 / 5 / 7 |
| Giant Strider | 1 | 4 | 20 | 33 | 10 / 5 / 12 |
| Grimlock | 3 | 5 | 10 | 27 | 4 / 5 / 9 |

| Fighter | Special | Damage | What it does |
| --- | --- | ---: | --- |
| Hero | Blade Beam | 24 | a fast projectile, six pixels an update |
| Sword Dwarf | Shoulder Rush | 24 | a forward charge that hits while it travels |
| Skeleton Knight | Skewer | 28 | a committed thrust reaching 53 pixels |
| Wolfman | Pounce | 22 | a forward leap that connects downward |
| Giant Strider | Ground Slam | 32 | a hop and a fast drop, hitting all round the landing |
| Grimlock | Retreat Shot | 20 | steps back while firing a slower shot |

---

## Hero

> A traveler comes home to Eolis. Steel and magic answer its call.

![Hero's card from the opening.](img/hero.png)

The one everybody already knows how to use. Nothing about the Hero is
extreme: middling damage, middling reach, and the second fastest swing in the
game at three updates of startup with only seven of recovery. That short
recovery is the real quality. You can press a button, be wrong, and still be
standing when it matters.

**Blade Beam** is the only special that threatens across the whole arena. Six
pixels an update is fast enough that a distant opponent has to respect it, so
the Hero can force someone to move rather than wait.

Pick the Hero to learn the game. Nothing you learn on it is wasted on the
others.

## Sword Dwarf

> Once a guardian, now without a lord. His sword keeps his honor.

![Sword Dwarf's card from the opening.](img/sword-dwarf.png)

The Hero's damage and reach, but it walks twice as fast and jumps a little
lower. The cost is in the swing: five updates of startup and ten of
recovery, so it loses straight races against the quick fighters and stays put
longer when it whiffs.

**Shoulder Rush** hits while it travels, which makes it a way to close
distance and a punish at the same time. It is the special that most changes
where the fight is happening.

Play it as pressure. Walk someone into a corner and make them jump.

## Skeleton Knight

> His vow outlived his flesh. Bone and rust still keep watch.

![Skeleton Knight's card from the opening.](img/skeleton-knight.png)

The longest ordinary reach in the game at 37 pixels, and 16 damage behind it.
It is slow on its feet and slow to swing, seven updates of startup and
eleven of recovery, which is the price of standing outside everyone else's
range.

**Skewer** reaches 53 pixels, further than any other move. It is committed,
so a whiff is a real handover, but it covers ground nothing else does.

Hold a space and make people come to you. The Skeleton loses the fights it
chases.

## Wolfman

> Deep in the tree he hunts. Only the quick escape his hungry leap.

![Wolfman's card from the opening.](img/wolfman.png)

The fastest hands in the game: two updates of startup, seven of recovery, and
the highest jump. It also does the least damage, eight a hit, and has the
shortest reach at 25, so it has to get inside and stay there.

It is also the one that gets thrown furthest when hit, three pixels an update
of recoil against one or two for everyone else, so a single mistake costs it
the position it worked for.

**Pounce** leaps forward and connects downward, which is how it gets in
against someone who is holding a line.

The most demanding fighter here, and the most rewarding when it works.

## Giant Strider

> His steps shake the roots. This giant has never learned to bow.

![Giant Strider's card from the opening.](img/giant-strider.png)

Twenty damage a hit, the hardest normal in the game, with 33 reach behind it.
Everything else is a concession: slow, the weakest jump at four, ten updates
of startup and twelve of recovery. When it misses, everyone in the arena
knows.

**Ground Slam** is the one move with no facing at all. It hops, drops fast,
and hits all around where it lands, 46 pixels in every direction, but only
once it has landed. Eight active updates, then twenty-three of recovery, so it
is either a round-winner or the worst thing you have ever done.

Three clean hits is a Duel. Getting three clean hits is the whole problem.

## Grimlock

> From dark halls comes a mage. He hides his plans behind his fire.

![Grimlock's card from the opening.](img/grimlock.png)

The fastest walker at three pixels an update, half again quicker than anyone
else, with a quick swing at four updates of startup. Damage is low at ten and
reach is short at 27, so it wins by being where the other fighter is not.

**Retreat Shot** is the only special that moves you away from danger while it
attacks. The shot itself is slow, three pixels an update, which makes it
something to hide behind rather than a finisher.

Kiting is not a dirty word. Grimlock is built for it.

## The seventh

There is one more. It is not on the select screen when you start, and finding
it is part of the game, so this guide is not going to tell you.

---

## Moves every fighter has

**Charged attack.** Hold B and let go. Double damage, four more pixels of
reach, and it goes through a guard. It also costs four more updates of
startup and three more of recovery, so it is a read, not a habit.

**Rising attack.** Up and B. It lifts a grounded opponent and can catch
someone coming down on you. Reach is 22 for everyone, timing is four updates
of startup, seven active and nine of recovery, and the damage runs 14, 16, 16,
12, 22 and 12 down the roster in the order above.

**Aerial attack.** B while airborne. Two less damage than the ground swing
with a floor of eight, two more reach, and much shorter timing at two updates
of startup, seven active and six of recovery.

**Guard.** Hold Down on the ground to block an attack from the front. It
spends power, and a charged attack goes through it.

## Power

The meter fills from fighting, not from waiting: sixteen for a hit you land,
eight for a hit you take that does not finish you. A special cannot refund
its own meter. Everyone starts a round with one cast already available, so
the first special can arrive at any moment.

## Small things worth knowing

A swing can only damage its opponent once, so you cannot run an active move
through someone for extra hits. Projectiles disappear after 48 updates.
Contact freezes both fighters for two updates, which is what makes a hit
read as a hit; attack timers do not advance during it and your inputs are not
thrown away.

Recoil depends on who got hit, not who hit them. Sword Dwarf and Giant
Strider are moved one pixel an update, Hero, Skeleton Knight and Grimlock
two, and Wolfman three.
