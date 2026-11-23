const open = [
  ['Chilling Adventures of Sabrina', '4 Teile', 'Fantasy, Mystery, Magie, Übernatürliches', 'Düstere Hexenmagie, Familiengeheimnisse und moralische Entscheidungen.'],
  ['Lockwood & Co.', '1 Staffel', 'Mystery, Übernatürliches, Fantasy', 'Ein schlagfertiges Ermittlerteam jagt Geister und stößt auf größere Geheimnisse.'],
  ['Lucifer', '6 Staffeln', 'Krimi, Fantasy, Humor', 'Mordermittlungen mit übernatürlichem Twist und viel Schlagabtausch.'],
  ['Dark', '3 Staffeln', 'Mystery, Sci-Fi, Thriller', 'Familiengeheimnisse, Zeitreisen und ein Rätsel, das sich über Generationen entfaltet.'],
  ['The Umbrella Academy', '4 Staffeln', 'Fantasy, Mystery, Action, Humor', 'Eine chaotische Familie mit Superkräften, schwarzen Pointen und überraschenden Wendungen.'],
  ['Once Upon a Time – Es war einmal …', '7 Staffeln', 'Fantasy, Märchen, Mystery, Magie', 'Märchenfiguren, Flüche und verflochtene Geschichten in einer Kleinstadt.'],
  ['Dead Boy Detectives', '1 Staffel', 'Mystery, Übernatürliches, Fantasy', 'Ein eingespieltes Geisterduo löst Fälle zwischen schwarzem Humor und düsterer Magie.'],
  ['Lupin', '3 Teile', 'Krimi, Mystery, Intrigen', 'Clever inszenierte Täuschungen und eine persönliche Rachegeschichte.'],
  ['The Gentlemen', '1 Staffel · übernommener Stand', 'Krimi, Humor, Intrigen', 'Verbrecherfamilien und Machtspiele mit trockenem britischem Humor.'],
  ['White Collar', '6 Staffeln', 'Krimi, Humor, Mystery', 'Charmante Betrugsfälle und eine ungewöhnliche Partnerschaft mit dem FBI.'],
  ['Sandman', '2 Staffeln', 'Fantasy, Mystery, Magie', 'Eine düstere Traumwelt mit mythologischen Figuren und verbundenen Geschichten.'],
  ['The Witcher', '4 Staffeln · übernommener Stand', 'Fantasy, Magie, Abenteuer, Action', 'Magie, Monster und politische Intrigen mit ambivalenten Figuren.'],
  ['Shadow and Bone – Legenden der Grisha', '2 Staffeln', 'Fantasy, Magie, Abenteuer', 'Magische Machtkämpfe und eine Crew, die sich aufeinander verlassen muss.'],
  ['KAOS', '1 Staffel', 'Fantasy, Mythologie, Humor', 'Griechische Götter, bissiger Humor und eine Prophezeiung, die alles durcheinanderbringt.'],
  ['Eine Geistergeschichte in Venedig', '', 'Mystery, Krimi, Thriller', 'Poirot ermittelt in einem düsteren Palazzo, in dem jeder etwas verbirgt.', 'film'],
]
const reserve = [
  ['Desperate Housewives','Intrigen, Mystery, Humor','Geheimnisse hinter Vorstadtfassaden und bitterböser Humor.'],
  ['The Bear – King of the Kitchen','Drama, Humor','Intensive Figurenentwicklung und Teamdynamik unter Druck.'],
  ['Blood & Water','Mystery, Intrigen','Eine Suche nach der Wahrheit legt Familiengeheimnisse offen.'],
  ['Control Z','Mystery, Thriller','Eine aufmerksame Schülerin ermittelt in einem Fall um verratene Geheimnisse.'],
  ['Elementary','Krimi, Mystery','Eine moderne Holmes-Adaption mit ungewöhnlicher Ermittlerpartnerschaft.'],
  ['The Order','Fantasy, Magie, Übernatürliches','Geheimgesellschaften, Werwölfe und magische Machtkämpfe.'],
  ['Half Bad: Der Bastardsohn und der Teufel selbst','Fantasy, Magie','Verfeindete Hexenclans und eine Geschichte über Zugehörigkeit.'],
  ['Vampire Diaries','Fantasy, Übernatürliches','Übernatürliche Familienkonflikte und Geheimnisse einer Kleinstadt.'],
  ['Van Helsing','Fantasy, Action','Düstere Vampirgeschichte mit einer eigenwilligen Heldin.'],
  ['Free Guy','Action, Sci-Fi, Humor','Ein selbstbewusster Nebencharakter stellt seine Spielwelt auf den Kopf.','film'],
  ['The Adam Project','Sci-Fi, Abenteuer, Action','Zeitreisen und ein schlagfertiges Team im Wettlauf gegen die Zeit.','film'],
  ['They See You','Mystery, Thriller, Übernatürliches','Eine düstere Waldgeschichte, in der die Figuren beobachtet werden.','film'],
  ['Bright','Fantasy, Magie, Action','Streifenpolizei und Magie treffen in einem angespannten Ermittlerduo aufeinander.','film'],
  ['Underworld','Fantasy, Action, Übernatürliches','Ein Vampir-Werwolf-Konflikt mit Geheimnissen auf beiden Seiten.','film'],
  ['Der Sternwanderer','Fantasy, Magie, Abenteuer','Ein magisches Abenteuer mit ungewöhnlichen Figuren und trockenem Humor.','film'],
]
const discovery = [
  ['Jonathan Strange & Mr Norrell','Fantasy, Magie, Intrigen','Zwei rivalisierende Magier geraten in politische Machtspiele.'],
  ['A Discovery of Witches','Fantasy, Magie, Mystery','Ein Manuskript zieht rivalisierende übernatürliche Gruppen an.'],
  ['The Magicians','Fantasy, Magie, Übernatürliches','Erwachsene Magiestudierende entdecken den gefährlichen Kern ihrer Fantasiewelt.'],
  ['Penny Dreadful','Fantasy, Mystery, Übernatürliches','Viktorianischer Gothic-Horror mit komplexen Figuren und verwobenen Geheimnissen.'],
  ['His Dark Materials','Fantasy, Abenteuer, Intrigen','Parallelwelten und Machtkämpfe um ein mysteriöses Phänomen.'],
  ['Fringe','Mystery, Sci-Fi, Krimi','Ein Ermittlerteam verfolgt bizarre Fälle, die ein größeres Muster ergeben.'],
  ['Counterpart','Sci-Fi, Thriller, Intrigen','Spionage und Identitätsfragen zwischen zwei Parallelwelten.'],
  ['Severance','Mystery, Sci-Fi, Thriller','Kollegen ermitteln in einer abgesperrten Arbeitswelt voller Geheimnisse.'],
  ['The Fall','Krimi, Thriller','Eine präzise Ermittlerin und ein psychologisches Katz-und-Maus-Spiel.'],
  ['The Dresden Files','Fantasy, Magie, Krimi','Ein Magier ermittelt in übernatürlichen Fällen.'],
  ['Archive 81','Mystery, Übernatürliches','Ein Restaurator entdeckt in alten Aufnahmen ein okkultes Rätsel.'],
  ['The Prestige','Mystery, Thriller, Intrigen','Rivalisierende Bühnenmagier liefern sich ein Duell voller Wendungen.','film'],
  ['Crimson Peak','Fantasy, Mystery, Übernatürliches','Eine Gothic-Geistergeschichte um ein Herrenhaus und seine Geheimnisse.','film'],
  ['Sleepy Hollow','Krimi, Übernatürliches, Mystery','Ein Ermittler stößt bei einer Mordserie auf eine düstere Legende.','film'],
  ['The Illusionist','Mystery, Intrigen','Ein Illusionist und ein Polizeiinspektor geraten in höfische Machtspiele.','film'],
  ['Arrival','Sci-Fi, Mystery','Ein Erstkontakt entfaltet sich als menschliches Rätsel mit überraschender Auflösung.','film'],
  ['Ready or Not','Thriller, Humor, Mystery','Eine schlagfertige Hauptfigur entdeckt die mörderischen Regeln einer reichen Familie.','film'],
  ['Prisoners','Krimi, Mystery, Thriller','Eine Entführung bringt einen Ermittler und verzweifelte Angehörige an ihre Grenzen.','film'],
  ['Stirb langsam','Action, Thriller','Weihnachtskulisse, trockener Humor und ein cleverer Gegenspieler.','film','seasonal'],
  ['Krampus','Fantasy, Übernatürliches, Humor','Düstere Weihnachtsmythologie mit schwarzem Humor.','film','seasonal'],
  ['Violent Night','Action, Humor','Weihnachtsaction mit schwarzem Humor und einem ungewöhnlichen Helden.','film','seasonal'],
]
const archive = [
  ['Lieblingsserie','serie','Pretty Little Liars','Wednesday'],
  ['Sehr gut','serie','Get Even','Bones','Castle','Sherlock'],
  ['Sehr gut','film','Knives Out 1 und 2','Der Herr der Ringe – Trilogie','Es 1 und 2'],
  ['Lieblingsfilm','film','Enola Holmes','Damsel','Kingsman 1 und 2','Wicked 1 und 2','Elvis','Beide Grinch-Filme','Fluch der Karibik – Filmreihe'],
  ['Gut','film','The Menu','The Pale Blue Eye','Harry Potter – Filmreihe'],
  ['Gut','serie','Gossip Girl','Cruel Summer'],
  ['Schlecht','film','Avatar 1 und 2'],
]
const marvel = [
  'The First Avenger: Captain America','Captain Marvel','Iron Man','Iron Man 2','Der unglaubliche Hulk','Thor','Marvel’s The Avengers','Thor – The Dark Kingdom','Iron Man 3','The Return of the First Avenger','Guardians of the Galaxy','Guardians of the Galaxy Vol. 2','Avengers: Age of Ultron','Ant-Man','The First Avenger: Civil War','Black Widow','Black Panther','Spider-Man: Homecoming','Doctor Strange','Thor: Tag der Entscheidung','Ant-Man and the Wasp','Avengers: Infinity War','Avengers: Endgame','Loki','WandaVision','The Falcon and the Winter Soldier','Shang-Chi and the Legend of the Ten Rings','Spider-Man: Far From Home','Eternals','Spider-Man: No Way Home','Doctor Strange im Multiversum des Wahnsinns','Hawkeye','Moon Knight','Black Panther: Wakanda Forever','She-Hulk: Die Anwältin','Ms. Marvel','Thor: Love and Thunder','Werewolf by Night','The Guardians of the Galaxy Holiday Special','Ant-Man and the Wasp: Quantumania','Guardians of the Galaxy Vol. 3','Secret Invasion','The Marvels','Agatha All Along','Echo','Daredevil: Born Again','Captain America: Brave New World','Ironheart','Thunderbolts*','The Fantastic Four: First Steps','Wonder Man',
]
const marvelSeries = new Set(['Loki','WandaVision','The Falcon and the Winter Soldier','Hawkeye','Moon Knight','She-Hulk: Die Anwältin','Ms. Marvel','Secret Invasion','Agatha All Along','Echo','Daredevil: Born Again','Ironheart','Wonder Man'])
export const genres = ['Fantasy','Mystery','Krimi','Thriller','Magie','Übernatürliches','Action','Sci-Fi','Humor','Intrigen','Abenteuer','Märchen','Mythologie','Drama','Historie','Horror','Romanze','Dokumentation','Animation','Musik','Western','Krieg','Familie','Kinder','Reality','Talkshow','Nachrichten','Seifenoper','TV-Film']
export const ratings = ['Schlecht','Okay','Gut','Sehr gut','Lieblingsserie','Lieblingsfilm']
export const slug = title => title.normalize('NFKC').toLocaleLowerCase('de').replace(/[’']/g, '').replace(/[^\p{L}\p{N}]+/gu, '-').replace(/^-|-$/g, '')
export const item = (title, type, genre = '', reason = '', extent = '', pool = '') => ({
  id: slug(title), title, type, genres: genre ? genre.split(', ') : [], reason, extent, pool,
})
export const catalog = new Map()
function add(title, type, genre, reason, extent, pool) {
  const entry = item(title, type, genre, reason, extent, pool)
  catalog.set(entry.id, entry)
  return entry.id
}
const initial = {}
function seed(title, type, status, rating = '', genre = '', reason = '', extent = '') {
  const id = add(title, type, genre, reason, extent)
  initial[id] = { status, rating }
}
for (const [title, extent, genre, reason, type = 'serie'] of open) seed(title, type, 'open', '', genre, reason, extent)
for (const [title, genre, reason, type = 'serie'] of reserve) seed(title, type, 'reserve', '', genre, reason)
for (const [title, genre, reason, type = 'serie', pool = 'discovery'] of discovery) {
  if (reason) add(title, type, genre, reason, '', pool)
}
for (const title of ['The Mentalist','NCIS','Criminal Minds']) seed(title, 'serie', 'watching', '', 'Krimi, Mystery')
for (const [rating, type, ...titles] of archive) for (const title of titles) seed(title, type, 'seen', rating)
for (const title of ['A Good Girl’s Guide to Murder','Veronica Mars','The Lying Game','iZombie','Psych','Riverdale','The Summer I Turned Pretty','Only Murders in the Building','Élite']) seed(title, 'serie', 'excluded')
export const marvelOrder = marvel.map(title => add(title, marvelSeries.has(title) ? 'serie' : 'film', 'Action, Abenteuer', 'Der nächste Titel in deiner chronologischen Marvel-Reihenfolge.', '', 'marvel'))
const evolution = [
  ['Underworld: Evolution','Underworld'],
  ['Underworld: Awakening','Underworld: Evolution'],
  ['Underworld: Blood Wars','Underworld: Awakening'],
]
for (const [title, predecessor] of evolution) {
  const id = add(title, 'film', 'Fantasy, Action, Übernatürliches', 'Die Fortsetzung des übernatürlichen Konflikts zwischen Vampiren und Werwölfen.', '', 'discovery')
  catalog.get(id).predecessor = slug(predecessor)
}
// The prequel takes place before the first film.
const prequel = add('Underworld: Aufstand der Lykaner', 'film', 'Fantasy, Action, Übernatürliches', 'Der Ursprung des Vampir-Werwolf-Konflikts.', '', 'discovery')
catalog.get(slug('Underworld')).predecessor = prequel
initial[prequel] = { status: 'reserve', rating: '' }
export function newList(profile) {
  const entries = profile === 'watchlist' ? structuredClone(initial) : {}
  for (const entry of Object.values(entries)) if (entry.rating.startsWith('Lieblings')) entry.seenAt = Date.now()
  return { entries, custom: {}, rewatch: {}, interests: profile === 'watchlist' ? ['Fantasy','Magie','Mystery','Krimi','Thriller'] : [] }
}

// Originating services are hints. The current German catalogue is not verified.
for (const [provider, titles] of [
  ['Netflix', ['Chilling Adventures of Sabrina','Lockwood & Co.','Lucifer','Dark','The Umbrella Academy','Dead Boy Detectives','Lupin','The Gentlemen','Sandman','The Witcher','Shadow and Bone – Legenden der Grisha','KAOS','The Order','Half Bad: Der Bastardsohn und der Teufel selbst','Control Z','Blood & Water','The Adam Project','Bright','Archive 81']],
  ['Disney+', ['Eine Geistergeschichte in Venedig','The Bear – King of the Kitchen','Free Guy', ...marvel]],
  ['Prime Video', ['They See You']],
]) {
  for (const title of titles) catalog.get(slug(title)).provider = provider
}

for (const [title, tags] of [
  ['Pretty Little Liars','Mystery, Thriller, Intrigen'],
  ['Wednesday','Fantasy, Mystery, Übernatürliches, Humor'],
  ['Enola Holmes','Mystery, Krimi, Abenteuer'],
  ['Damsel','Fantasy, Magie, Abenteuer'],
  ['Kingsman 1 und 2','Action, Abenteuer, Humor'],
  ['Wicked 1 und 2','Fantasy, Magie, Musik'],
  ['Elvis','Drama, Musik'],
  ['Beide Grinch-Filme','Fantasy, Humor'],
  ['Fluch der Karibik – Filmreihe','Fantasy, Abenteuer, Action, Humor'],
]) {
  catalog.get(slug(title)).genres = tags.split(', ')
}

// Released Star Wars films and series with titles independent of TMDB search naming.
const starWars = [
  ['film','Star Wars: Episode I – Die dunkle Bedrohung',1893],
  ['film','Star Wars: Episode II – Angriff der Klonkrieger',1894],
  ['film','Star Wars: Episode III – Die Rache der Sith',1895],
  ['film','Krieg der Sterne',11], ['film','Das Imperium schlägt zurück',1891],
  ['film','Die Rückkehr der Jedi-Ritter',1892], ['film','Star Wars: Das Erwachen der Macht',140607],
  ['film','Star Wars: Die letzten Jedi',181808], ['film','Star Wars: Der Aufstieg Skywalkers',181812],
  ['film','Rogue One: A Star Wars Story',330459], ['film','Solo: A Star Wars Story',348350],
  ['film','Star Wars: The Clone Wars',12180], ['film','Ewoks – Karawane der Tapferen'],
  ['film','Ewoks – Kampf um Endor'], ['film','The Star Wars Holiday Special'],
  ['serie','Star Wars: Droids'], ['serie','Star Wars: Ewoks'], ['serie','Star Wars: Clone Wars'],
  ['serie','Star Wars: The Clone Wars',4194], ['serie','Star Wars Rebels',60554],
  ['serie','Star Wars Resistance'], ['serie','The Mandalorian',82856], ['serie','Star Wars: The Bad Batch'],
  ['serie','Das Buch von Boba Fett',115036], ['serie','Obi-Wan Kenobi',92830], ['serie','Andor',83867],
  ['serie','Ahsoka',114461], ['serie','The Acolyte',202879], ['serie','Star Wars: Skeleton Crew'],
  ['serie','Star Wars: Visionen'], ['serie','Star Wars: Geschichten der Jedi'],
  ['serie','Star Wars: Geschichten des Imperiums'], ['serie','Star Wars: Geschichten der Unterwelt'],
  ['serie','Star Wars: Die Abenteuer der jungen Jedi'], ['serie','Star Wars: Kräfte des Schicksals'],
  ['serie','Star Wars: Galaxie der Abenteuer'], ['serie','Star Wars: Roll Out'], ['serie','Maul – Shadow Lord'],
  ['film','The Mandalorian and Grogu'],
]
export const starWarsIds = starWars.map(([type, title, tmdbId]) => {
  const entry = item(title, type, 'Sci-Fi, Abenteuer, Action', '', '', 'universe')
  if (catalog.has(entry.id)) entry.id += `-${type}`
  if (tmdbId) entry.tmdb = `${type === 'film' ? 'movie' : 'tv'}:${tmdbId}`
  catalog.set(entry.id, entry)
  return entry.id
})

const marvelMovieIds = {
  'The First Avenger: Captain America': 1771, 'Captain Marvel': 299537, 'Iron Man': 1726, 'Iron Man 2': 10138,
  'Der unglaubliche Hulk': 1724, 'Thor': 10195, 'Marvel’s The Avengers': 24428, 'Thor – The Dark Kingdom': 76338,
  'Iron Man 3': 68721, 'The Return of the First Avenger': 100402, 'Guardians of the Galaxy': 118340,
  'Guardians of the Galaxy Vol. 2': 283995, 'Avengers: Age of Ultron': 99861, 'Ant-Man': 102899,
  'The First Avenger: Civil War': 271110, 'Black Widow': 497698, 'Black Panther': 284054,
  'Spider-Man: Homecoming': 315635, 'Doctor Strange': 284052, 'Thor: Tag der Entscheidung': 284053,
  'Ant-Man and the Wasp': 363088, 'Avengers: Infinity War': 299536, 'Avengers: Endgame': 299534,
}
for (const [title, id] of Object.entries(marvelMovieIds)) catalog.get(slug(title)).tmdb = `movie:${id}`

const marvelExtra = [
  ['serie','What If…?'], ['serie','Ich bin Groot'], ['serie','X-Men ’97'],
  ['serie','Your Friendly Neighborhood Spider-Man'], ['serie','Eyes of Wakanda'], ['serie','Marvel Zombies'],
  ['serie','Marvel’s Daredevil'], ['serie','Marvel’s Jessica Jones'], ['serie','Marvel’s Luke Cage'],
  ['serie','Marvel’s Iron Fist'], ['serie','Marvel’s The Defenders'], ['serie','Marvel’s The Punisher'],
  ['serie','Marvel’s Agents of S.H.I.E.L.D.'], ['serie','Marvel’s Agent Carter'],
]
export const marvelUniverseIds = [...marvelOrder, ...marvelExtra.map(([type, title]) =>
  add(title, type, 'Action, Abenteuer', '', '', 'universe'))]

// Local core titles keep each franchise browseable when a remote source fails.
const franchiseTitles = `
DC|Superman;Superman II;Batman;Batmans Rückkehr;Batman Begins;The Dark Knight;The Dark Knight Rises;Man of Steel;Wonder Woman;Wonder Woman 1984;Aquaman;Aquaman: Lost Kingdom;Justice League;The Suicide Squad;~Peacemaker;~The Flash;~Titans;~Doom Patrol;~Superman & Lois
Spider-Man und Spider-Verse|Spider-Man;Spider-Man 2;Spider-Man 3;The Amazing Spider-Man;The Amazing Spider-Man 2: Rise of Electro;Spider-Man: Homecoming;Spider-Man: Far From Home;Spider-Man: No Way Home;Spider-Man: A New Universe;Spider-Man: Across the Spider-Verse;Venom;Venom: Let There Be Carnage;Venom: The Last Dance;~The Spectacular Spider-Man
X-Men|X-Men;X-Men 2;X-Men: Der letzte Widerstand;X-Men Origins: Wolverine;X-Men: Erste Entscheidung;Wolverine: Weg des Kriegers;X-Men: Zukunft ist Vergangenheit;X-Men: Apocalypse;X-Men: Dark Phoenix;Logan: The Wolverine;Deadpool;Deadpool 2;Deadpool & Wolverine;The New Mutants;~Legion;~The Gifted
Star Trek|Star Trek: Der Film;Star Trek II: Der Zorn des Khan;Star Trek III: Auf der Suche nach Mr. Spock;Star Trek IV: Zurück in die Gegenwart;Star Trek V: Am Rande des Universums;Star Trek VI: Das unentdeckte Land;Star Trek: Treffen der Generationen;Star Trek: Der erste Kontakt;Star Trek: Der Aufstand;Star Trek: Nemesis;Star Trek;Star Trek Into Darkness;Star Trek Beyond;~Raumschiff Enterprise;~Raumschiff Enterprise – Das nächste Jahrhundert;~Star Trek: Deep Space Nine;~Star Trek: Raumschiff Voyager;~Star Trek: Enterprise;~Star Trek: Discovery;~Star Trek: Picard;~Star Trek: Lower Decks;~Star Trek: Prodigy;~Star Trek: Strange New Worlds;Star Trek: Section 31
Doctor Who|~Doctor Who;Doctor Who – Der Film;~Torchwood;~The Sarah Jane Adventures;~Class;~Tales of the TARDIS
Stargate|Stargate;Stargate: The Ark of Truth;Stargate: Continuum;~Stargate SG-1;~Stargate Atlantis;~Stargate Universe;~Stargate Origins
Transformers|Transformers;Transformers – Die Rache;Transformers 3;Transformers: Ära des Untergangs;Transformers: The Last Knight;Bumblebee;Transformers: Aufstieg der Bestien;Transformers One;~Transformers: Prime;~Transformers: EarthSpark
Alien und Predator|Alien – Das unheimliche Wesen aus einer fremden Welt;Aliens – Die Rückkehr;Alien 3;Alien – Die Wiedergeburt;Prometheus – Dunkle Zeichen;Alien: Covenant;Alien: Romulus;Predator;Predator 2;Predators;Predator – Upgrade;Prey;Predator: Badlands;Predator: Killer of Killers;Alien vs. Predator;Aliens vs. Predator 2;~Alien: Earth
Jurassic Park und World|Jurassic Park;Vergessene Welt: Jurassic Park;Jurassic Park III;Jurassic World;Jurassic World: Das gefallene Königreich;Jurassic World: Ein neues Zeitalter;Jurassic World: Die Wiedergeburt;~Jurassic World: Neue Abenteuer;~Jurassic World: Die Chaostheorie
Matrix|Matrix;Matrix Reloaded;Matrix Revolutions;Matrix Resurrections;Animatrix
Dune|Der Wüstenplanet;Dune;Dune: Part Two;~Frank Herbert’s Dune;~Children of Dune;~Dune: Prophecy
Terminator|Terminator;Terminator 2 – Tag der Abrechnung;Terminator 3 – Rebellion der Maschinen;Terminator: Die Erlösung;Terminator: Genisys;Terminator: Dark Fate;~Terminator: The Sarah Connor Chronicles;~Terminator Zero
Planet der Affen|Planet der Affen;Rückkehr zum Planet der Affen;Flucht vom Planet der Affen;Eroberung vom Planet der Affen;Die Schlacht um den Planet der Affen;Planet der Affen: Prevolution;Planet der Affen: Revolution;Planet der Affen: Survival;Planet der Affen: New Kingdom;~Planet der Affen
MonsterVerse|Godzilla;Kong: Skull Island;Godzilla II: King of the Monsters;Godzilla vs. Kong;Godzilla x Kong: The New Empire;~Monarch: Legacy of Monsters;~Skull Island
Die Eiskönigin|Die Eiskönigin – Völlig unverfroren#109445;Die Eiskönigin II#330457;Die Eiskönigin: Party-Fieber;Die Eiskönigin: Olaf taut auf;Es war einmal ein Schneemann;~Olaf präsentiert
Fluch der Karibik|Fluch der Karibik#22;Pirates of the Caribbean – Fluch der Karibik 2#58;Pirates of the Caribbean – Am Ende der Welt#285;Pirates of the Caribbean – Fremde Gezeiten#1865;Pirates of the Caribbean: Salazars Rache#166426;Tales of the Code: Wedlocked
Der König der Löwen|Der König der Löwen;Der König der Löwen 2: Simbas Königreich;Der König der Löwen 3: Hakuna Matata;Der König der Löwen#420818;Mufasa: Der König der Löwen;~Timon & Pumbaa;~Die Garde der Löwen
Aladdin|Aladdin#812;Dschafars Rückkehr;Aladdin und der König der Diebe;Aladdin#420817;~Aladdin
Arielle|Arielle, die Meerjungfrau#10144;Arielle, die Meerjungfrau 2 – Sehnsucht nach dem Meer;Arielle, die Meerjungfrau – Wie alles begann;Arielle, die Meerjungfrau#447277;~Arielle, die Meerjungfrau;~Disney Junior Arielle
Die Schöne und das Biest|Die Schöne und das Biest#10020;Die Schöne und das Biest: Weihnachtszauber;Belles zauberhafte Welt;Die Schöne und das Biest#321612
Cinderella|Cinderella#11224;Cinderella 2 – Träume werden wahr;Cinderella – Wahre Liebe siegt;Cinderella#150689
Das Dschungelbuch|Das Dschungelbuch#9325;Das Dschungelbuch 2;The Jungle Book#278927;~Die Dschungelbuch-Kids;~Käpt’n Balu und seine tollkühne Crew
101 Dalmatiner|101 Dalmatiner#12230;101 Dalmatiner – Teil 2: Auf kleinen Pfoten zum großen Star!;101 Dalmatiner#11674;102 Dalmatiner;Cruella;~101 Dalmatiner;~Das Haus der 101 Dalmatiner
Lilo & Stitch|Lilo & Stitch#11544;Stitch und Co. – Der Film;Lilo & Stitch 2 – Stitch völlig abgedreht;Leroy & Stitch;Lilo & Stitch#552524;~Lilo & Stitch;~Stitch!
Vaiana|Vaiana#277834;Vaiana 2#1241982
Zoomania|Zoomania#269149;Zoomania 2#1084242;~Zoomania+
Baymax|Baymax – Riesiges Robowabohu#177572;~Baymax – Robowabohu in Serie;~Baymax!
Rapunzel|Rapunzel – Neu verföhnt#38757;Rapunzel – Verföhnt, verlobt, verheiratet;Rapunzel – Für immer verföhnt;~Rapunzel – Die Serie
Ralph reichts|Ralph reichts#82690;Chaos im Netz#404368
Tron|Tron#97;Tron: Legacy#20526;Tron: Ares;~Tron: Der Aufstand
Micky Maus|Steamboat Willie;Mickys fröhliche Weihnachten;Mickys turbulente Weihnachtszeit;~Micky Maus;~Micky Maus Wunderhaus;~Micky Maus: Spielhaus;~Die wunderbare Welt von Micky Maus
Entenhausen|DuckTales: Der Film – Jäger der verlorenen Lampe;~DuckTales – Neues aus Entenhausen;~DuckTales#72350;~Darkwing Duck;~Quack Pack
Winnie Puuh|Die vielen Abenteuer von Winnie Puuh;Tiggers großes Abenteuer;Ferkels großes Abenteuer;Heffalump – Ein neuer Freund für Winnie Puuh;Winnie Puuh#51162;~Neue Abenteuer mit Winnie Puuh;~Meine Freunde Tigger und Puuh
Peter Pan und Tinker Bell|Peter Pan#10693;Peter Pan: Neue Abenteuer in Nimmerland;Peter Pan & Wendy;TinkerBell;TinkerBell – Die Suche nach dem verlorenen Schatz;TinkerBell – Ein Sommer voller Abenteuer;Das Geheimnis der Feenflügel;TinkerBell und die Piratenfee;TinkerBell und die Legende vom Nimmerbiest;~Jake und die Nimmerland Piraten
Bambi|Bambi#3170;Bambi 2 – Der Herr der Wälder
Bärenbrüder|Bärenbrüder#10009;Bärenbrüder 2
Pocahontas|Pocahontas#10530;Pocahontas 2 – Die Reise in eine neue Welt
Mulan|Mulan#10674;Mulan 2;Mulan#337401
Hercules|Hercules#11970;Hercules: Zero to Hero;~Hercules
Atlantis|Atlantis – Das Geheimnis der verlorenen Stadt;Atlantis – Die Rückkehr
Ein Königreich für ein Lama|Ein Königreich für ein Lama;Ein Königreich für ein Lama 2 – Kronks großes Abenteuer;~Kuzco’s Königsklasse
Phineas und Ferb|Phineas und Ferb – Der Film: Quer durch die 2. Dimension;Phineas und Ferb: Candace gegen das Universum;~Phineas und Ferb
High School Musical|High School Musical;High School Musical 2;High School Musical 3: Senior Year;Sharpay’s fabelhafte Welt;~High School Musical: Das Musical: Die Serie
Descendants|Descendants – Die Nachkommen;Descendants 2;Descendants 3;Descendants: The Rise of Red;~Descendants – Verhexte Welt
Zombies|Zombies – Das Musical;Zombies 2;Zombies 3;Zombies 4: Dawn of the Vampires;~Zombies: The Re-Animated Series
Chip und Chap|Chip und Chap: Die Ritter des Rechts#420821;~Chip und Chap – Die Ritter des Rechts;~Chip und Chap: Das Leben im Park
Kim Possible|Kim Possible: Mission zwischen den Zeiten;Kim Possible – Der Film: Invasion der Roboter;Kim Possible#520720;~Kim Possible
Proud Family|Die Prouds – Der Film;~Die Prouds;~Die Prouds: Lauter und trauter
Santa Clause|Santa Clause – Eine schöne Bescherung;Santa Clause 2 – Eine noch schönere Bescherung;Santa Clause 3 – Eine frostige Bescherung;~Santa Clause: Die Serie
Hocus Pocus|Hocus Pocus#10439;Hocus Pocus 2#642885
Narnia|Die Chroniken von Narnia: Der König von Narnia;Die Chroniken von Narnia: Prinz Kaspian von Narnia;Die Chroniken von Narnia: Die Reise auf der Morgenröte;~Die Chroniken von Narnia
Disney Fairies|TinkerBell;TinkerBell – Die Suche nach dem verlorenen Schatz;TinkerBell – Ein Sommer voller Abenteuer;Das Geheimnis der Feenflügel;TinkerBell und die Piratenfee;TinkerBell und die Legende vom Nimmerbiest
Die Zauberer vom Waverly Place|Die Zauberer vom Waverly Place – Der Film;Die Rückkehr der Zauberer vom Waverly Place;~Die Zauberer vom Waverly Place;~Wizards Beyond Waverly Place
Raven|~Raven blickt durch;~Raven’s Home;~Cory im Weißen Haus
Hotel Zack & Cody|Zack & Cody – Der Film;~Hotel Zack & Cody;~Zack & Cody an Bord
Hannah Montana|Hannah Montana – Der Film;~Hannah Montana
Camp Rock|Camp Rock;Camp Rock 2: The Final Jam
Gravity Falls|~Willkommen in Gravity Falls;~Gravity Falls Shorts
Das Haus der Eulen|~Das Haus der Eulen
Amphibia|~Amphibia;~Amphibia: Chibi Tiny Tales
Sofia und Elena|Sofia die Erste – Auf einmal Prinzessin;Elena und das Geheimnis von Avalor;~Sofia die Erste;~Elena von Avalor
Disney Muppets|Die Muppets#64328;Muppets Most Wanted;Muppets Haunted Mansion;Die Muppets Weihnachtsgeschichte;Muppets – Die Schatzinsel;~Die Muppet Show;~Muppet Babies;~The Muppets Mayhem
Toy Story|Toy Story#862;Toy Story 2#863;Toy Story 3#10193;A Toy Story: Alles hört auf kein Kommando#301528;Lightyear#718789;~Forky hat eine Frage;~Captain Buzz Lightyear – Star Command
Cars und Planes|Cars#920;Cars 2#49013;Cars 3: Evolution#260514;Planes;Planes 2 – Immer im Einsatz;~Cars on the Road;~Cars Toons
Findet Nemo|Findet Nemo#12;Findet Dorie#127380
Die Unglaublichen|Die Unglaublichen – The Incredibles#9806;Die Unglaublichen 2#260513;Jack-Jack Superbaby;Tante Edna
Die Monster AG|Die Monster AG#585;Die Monster Uni#62211;~Monster bei der Arbeit
Alles steht Kopf|Alles steht Kopf#150540;Alles steht Kopf 2#1022789;Rileys erstes Date;~Traum Studios
Oben|Oben#14160;Carls Date;~Dugs Tage
Wizarding World|Harry Potter und der Stein der Weisen#671;Harry Potter und die Kammer des Schreckens#672;Harry Potter und der Gefangene von Askaban#673;Harry Potter und der Feuerkelch#674;Harry Potter und der Orden des Phönix#675;Harry Potter und der Halbblutprinz#767;Harry Potter und die Heiligtümer des Todes – Teil 1#12444;Harry Potter und die Heiligtümer des Todes – Teil 2#12445;Phantastische Tierwesen und wo sie zu finden sind#259316;Phantastische Tierwesen: Grindelwalds Verbrechen;Phantastische Tierwesen: Dumbledores Geheimnisse
Mittelerde|Der Herr der Ringe: Die Gefährten#120;Der Herr der Ringe: Die zwei Türme#121;Der Herr der Ringe: Die Rückkehr des Königs#122;Der Hobbit: Eine unerwartete Reise;Der Hobbit: Smaugs Einöde;Der Hobbit: Die Schlacht der Fünf Heere;Der Herr der Ringe: Die Schlacht der Rohirrim;~Der Herr der Ringe: Die Ringe der Macht
Avatar|Avatar – Aufbruch nach Pandora#19995;Avatar: The Way of Water#76600;Avatar: Fire and Ash
Fast & Furious|The Fast and the Furious;2 Fast 2 Furious;The Fast and the Furious: Tokyo Drift;Fast & Furious – Neues Modell. Originalteile.;Fast & Furious Five;Fast & Furious 6;Fast & Furious 7;Fast & Furious 8;Fast & Furious 9;Fast & Furious 10;Fast & Furious: Hobbs & Shaw;~Fast & Furious Spy Racers
James Bond|James Bond 007 jagt Dr. No;Liebesgrüße aus Moskau;Goldfinger;Feuerball;Man lebt nur zweimal;Im Geheimdienst Ihrer Majestät;Diamantenfieber;Leben und sterben lassen;Der Mann mit dem goldenen Colt;Der Spion, der mich liebte;Moonraker – Streng geheim;In tödlicher Mission;Octopussy;Im Angesicht des Todes;Der Hauch des Todes;Lizenz zum Töten;GoldenEye;Der Morgen stirbt nie;Die Welt ist nicht genug;Stirb an einem anderen Tag;Casino Royale#36557;Ein Quantum Trost;Skyfall;Spectre;Keine Zeit zu sterben
Mission: Impossible|Mission: Impossible;Mission: Impossible II;Mission: Impossible III;Mission: Impossible – Phantom Protokoll;Mission: Impossible – Rogue Nation;Mission: Impossible – Fallout;Mission: Impossible – Dead Reckoning;Mission: Impossible – The Final Reckoning;~Kobra, übernehmen Sie;~In geheimer Mission
Shrek und der gestiefelte Kater|Shrek – Der tollkühne Held;Shrek 2 – Der tollkühne Held kehrt zurück;Shrek der Dritte;Für immer Shrek;Der gestiefelte Kater;Der gestiefelte Kater: Der letzte Wunsch;~Der gestiefelte Kater – Abenteuer in San Lorenzo
Drachenzähmen leicht gemacht|Drachenzähmen leicht gemacht#10191;Drachenzähmen leicht gemacht 2;Drachenzähmen leicht gemacht 3: Die geheime Welt;Drachenzähmen leicht gemacht#1087192;~Dragons – Die Reiter von Berk;~Dragons – Auf zu neuen Ufern;~Dragons: Die 9 Welten
Kung Fu Panda|Kung Fu Panda;Kung Fu Panda 2;Kung Fu Panda 3;Kung Fu Panda 4;~Kung Fu Panda: Legenden mit Fell und Fu;~Kung Fu Panda: Die Tatzen des Schicksals;~Kung Fu Panda: Der Drachenritter
Ich – Einfach unverbesserlich|Ich – Einfach unverbesserlich;Ich – Einfach unverbesserlich 2;Ich – Einfach unverbesserlich 3;Ich – Einfach unverbesserlich 4;Minions;Minions – Auf der Suche nach dem Mini-Boss
Ice Age|Ice Age;Ice Age 2 – Jetzt taut’s;Ice Age 3 – Die Dinosaurier sind los;Ice Age 4 – Voll verschoben;Ice Age – Kollision voraus!;Ice Age: Die Abenteuer von Buck Wild;~Ice Age: Scrats Abenteuer
Madagascar|Madagascar;Madagascar 2;Madagascar 3: Flucht durch Europa;Die Pinguine aus Madagascar;~Die Pinguine aus Madagascar;~King Julien
Zurück in die Zukunft|Zurück in die Zukunft#105;Zurück in die Zukunft II#165;Zurück in die Zukunft III#196;~Zurück in die Zukunft
Ghostbusters|Ghostbusters – Die Geisterjäger;Ghostbusters II;Ghostbusters: Answer the Call;Ghostbusters: Legacy;Ghostbusters: Frozen Empire;~The Real Ghostbusters;~Extreme Ghostbusters
Indiana Jones|Jäger des verlorenen Schatzes;Indiana Jones und der Tempel des Todes;Indiana Jones und der letzte Kreuzzug;Indiana Jones und das Königreich des Kristallschädels;Indiana Jones und das Rad des Schicksals;~Die Abenteuer des jungen Indiana Jones
Die Tribute von Panem|Die Tribute von Panem – The Hunger Games;Die Tribute von Panem – Catching Fire;Die Tribute von Panem – Mockingjay Teil 1;Die Tribute von Panem – Mockingjay Teil 2;Die Tribute von Panem – The Ballad of Songbirds & Snakes
John Wick|John Wick;John Wick: Kapitel 2;John Wick: Kapitel 3;John Wick: Kapitel 4;From the World of John Wick: Ballerina;~The Continental
The Walking Dead|~The Walking Dead;~Fear the Walking Dead;~The Walking Dead: World Beyond;~Tales of the Walking Dead;~The Walking Dead: Dead City;~The Walking Dead: Daryl Dixon;~The Walking Dead: The Ones Who Live
Game of Thrones|~Game of Thrones;~House of the Dragon;~A Knight of the Seven Kingdoms
Pokémon|Pokémon – Der Film;Pokémon 2 – Die Macht des Einzelnen;Pokémon 3 – Im Bann der Icognito;Pokémon: Meisterdetektiv Pikachu;~Pokémon;~Pokémon Horizonte;~Pokémon: Die Pfadabenteurer
Dragon Ball|Dragon Ball Super: Broly;Dragon Ball Super: Super Hero;~Dragon Ball;~Dragon Ball Z;~Dragon Ball GT;~Dragon Ball Z Kai;~Dragon Ball Super;~Dragon Ball Daima
One Piece|One Piece: Der Film;One Piece: Strong World;One Piece Film: Z;One Piece Film: Gold;One Piece: Stampede;One Piece Film: Red;~One Piece#37854;~One Piece#111110
`
export const universeCatalog = new Map([
  ['marvel', marvelUniverseIds],
  ['star-wars', starWarsIds],
])
for (const row of franchiseTitles.trim().split('\n')) {
  const [name, titles] = row.split('|')
  const ids = titles.split(';').map(raw => {
    const [label, tmdbId] = raw.split('#')
    const type = label.startsWith('~') ? 'serie' : 'film'
    const title = type === 'serie' ? label.slice(1) : label
    const tmdb = tmdbId ? `${type === 'serie' ? 'tv' : 'movie'}:${tmdbId}` : ''
    const entry = item(title, type, '', '', '', 'universe')
    const existing = catalog.get(entry.id)
    if (existing && existing.type === type && (!tmdb || !existing.tmdb || existing.tmdb === tmdb)) {
      if (tmdb && !existing.tmdb) existing.tmdb = tmdb
      return existing.id
    }
    if (existing) entry.id += tmdb ? `-${tmdbId}` : `-${type}`
    if (tmdb) entry.tmdb = tmdb
    if (!catalog.has(entry.id)) catalog.set(entry.id, entry)
    return entry.id
  })
  universeCatalog.set(name, [...new Set(ids)])
}
export const universeTitleIds = new Set([...universeCatalog.values()].flat())
