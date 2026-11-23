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
  'The First Avenger: Captain America','Captain Marvel','Iron Man','Iron Man 2','Der unglaubliche Hulk','Thor','Marvel’s The Avengers','Thor – The Dark Kingdom','Iron Man 3','The Return of the First Avenger','Guardians of the Galaxy','Guardians of the Galaxy Vol. 2','Avengers: Age of Ultron','Ant-Man','The First Avenger: Civil War','Black Widow','Black Panther','Spider-Man: Homecoming','Doctor Strange','Thor: Tag der Entscheidung','Ant-Man and the Wasp','Avengers: Infinity War','Avengers: Endgame','Loki','WandaVision','The Falcon and the Winter Soldier','Shang-Chi and the Legend of the Ten Rings','Spider-Man: Far From Home','Eternals','Spider-Man: No Way Home','Doctor Strange im Multiversum des Wahnsinns','Hawkeye','Moon Knight','Black Panther: Wakanda Forever','She-Hulk: Die Anwältin','Ms. Marvel','Thor: Love and Thunder','Werewolf by Night','The Guardians of the Galaxy Holiday Special','Ant-Man and the Wasp: Quantumania','Guardians of the Galaxy Vol. 3','Secret Invasion','The Marvels','Agatha All Along',
]
const marvelSeries = new Set(['Loki','WandaVision','The Falcon and the Winter Soldier','Hawkeye','Moon Knight','She-Hulk: Die Anwältin','Ms. Marvel','Secret Invasion','Agatha All Along'])
export const genres = ['Fantasy','Mystery','Krimi','Thriller','Magie','Übernatürliches','Action','Sci-Fi','Humor','Intrigen','Abenteuer','Märchen','Mythologie','Drama','Historie','Horror','Romanze','Dokumentation','Animation','Musik','Western','Krieg']
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
