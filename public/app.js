const $ = id => document.getElementById(id)
const headings = {
  open: ['Offene Empfehlungen', 'Empfehlungen', 'Deine nächsten 15 Titel. Marvel läuft separat.'],
  watching: ['Am schauen', 'Am schauen', 'Hier findest du alle Titel, die du begonnen hast.'],
  seen: ['Gesehenes Archiv', 'Gesehen', 'Deine abgeschlossenen Titel und Bewertungen.'],
  reserve: ['Merkliste', 'Merkliste', 'Diese Titel können als Nächstes nachrücken.'],
  excluded: ['Dauerhaft ausgeschlossen', 'Ausgeschlossen', 'Diese Titel werden dir nicht wieder vorgeschlagen.'],
  universes: ['Universen', 'Universen', ''],
  extras: ['Extras', 'Extras', 'Saisonale Empfehlungen und Favoriten zum Wiedersehen.'],
}
const ratingClasses = { Schlecht: 'bad', Okay: 'ok', Gut: 'good', 'Sehr gut': 'great', Lieblingsserie: 'series', Lieblingsfilm: 'movie', 'Nicht ansehbar': 'excluded' }
const stillTitles = ['Chilling Adventures of Sabrina', 'Lockwood & Co.', 'Lucifer', 'Dark', 'The Umbrella Academy', 'Once Upon a Time – Es war einmal …']
const universeGroups = [
  ['Science-Fiction und Superhelden', [
    { name: 'Marvel (MCU)', curated: 'marvel' },
    { name: 'Star Wars', curated: 'star-wars', collections: [10], queries: ['Star Wars'] },
    { name: 'DC', queries: ['Batman', 'Superman', 'Justice League', 'Wonder Woman', 'Suicide Squad', 'Aquaman', 'Peacemaker', 'The Flash', 'Green Lantern', 'Shazam', 'Blue Beetle', 'Titans', 'Doom Patrol'] },
    { name: 'Spider-Man und Spider-Verse', queries: ['Spider-Man', 'Venom'] },
    { name: 'X-Men', collections: [748], queries: ['X-Men', 'Wolverine', 'Deadpool', 'The New Mutants', 'Legion'] },
    { name: 'Star Trek', queries: ['Star Trek'] },
    { name: 'Doctor Who', queries: ['Doctor Who', 'Torchwood', 'The Sarah Jane Adventures'] },
    { name: 'Stargate', queries: ['Stargate'] },
    { name: 'Transformers', queries: ['Transformers'] },
    { name: 'Alien und Predator', collections: [8091, 399], queries: ['Alien vs. Predator', 'Alien: Earth', 'Prey', 'Predator: Badlands', 'Predator: Killer of Killers'] },
    { name: 'Jurassic Park und World', collections: [328], queries: ['Jurassic World', 'Jurassic Park'] },
    { name: 'Matrix', collections: [2344], queries: ['The Animatrix'] },
    { name: 'Dune', queries: ['Dune'] },
    { name: 'Terminator', queries: ['Terminator'] },
    { name: 'Planet der Affen', queries: ['Planet of the Apes'] },
    { name: 'MonsterVerse', queries: ['Godzilla', 'Kong: Skull Island', 'Monarch: Legacy of Monsters', 'Skull Island'] },
  ]],
  ['Disney', [
    { name: 'Die Eiskönigin', collections: [386382], queries: ['Frozen', 'Olaf'] },
    { name: 'Fluch der Karibik', collections: [295] },
    { name: 'Der König der Löwen', queries: ['The Lion King', 'The Lion Guard', 'Timon & Pumbaa', 'Mufasa'] },
    { name: 'Aladdin', queries: ['Aladdin', 'The Return of Jafar'] },
    { name: 'Arielle', queries: ['The Little Mermaid'] },
    { name: 'Die Schöne und das Biest', queries: ['Beauty and the Beast'] },
    { name: 'Cinderella', queries: ['Cinderella'] },
    { name: 'Das Dschungelbuch', queries: ['The Jungle Book', 'Jungle Cubs'] },
    { name: '101 Dalmatiner', queries: ['Dalmatians', 'Cruella'] },
    { name: 'Lilo & Stitch', queries: ['Lilo & Stitch', 'Stitch!', 'Leroy & Stitch', 'Stitch Has a Glitch'] },
    { name: 'Vaiana', queries: ['Moana'] },
    { name: 'Zoomania', queries: ['Zootopia'] },
    { name: 'Baymax', queries: ['Big Hero 6', 'Baymax'] },
    { name: 'Rapunzel', queries: ['Tangled', 'Rapunzel’s Tangled Adventure'] },
    { name: 'Ralph reichts', queries: ['Wreck-It Ralph', 'Ralph Breaks the Internet'] },
    { name: 'Tron', queries: ['Tron'] },
    { name: 'Micky Maus', queries: ['Mickey Mouse', 'Mickey and Friends'] },
    { name: 'Entenhausen', queries: ['DuckTales', 'Darkwing Duck', 'Quack Pack'] },
    { name: 'Winnie Puuh', queries: ['Winnie the Pooh', 'Tigger', 'Piglet'] },
    { name: 'Peter Pan und Tinker Bell', queries: ['Peter Pan', 'Tinker Bell'] },
    { name: 'Bambi', queries: ['Bambi'] },
    { name: 'Bärenbrüder', queries: ['Brother Bear'] },
    { name: 'Pocahontas', queries: ['Pocahontas'] },
    { name: 'Mulan', queries: ['Mulan'] },
    { name: 'Hercules', queries: ['Hercules'] },
    { name: 'Atlantis', queries: ['Atlantis: The Lost Empire', 'Atlantis: Milo’s Return'] },
    { name: 'Ein Königreich für ein Lama', queries: ['The Emperor’s New Groove', 'Kronk’s New Groove', 'The Emperor’s New School'] },
    { name: 'Phineas und Ferb', queries: ['Phineas and Ferb'] },
    { name: 'High School Musical', queries: ['High School Musical', 'Sharpay’s Fabulous Adventure'] },
    { name: 'Descendants', queries: ['Descendants', 'Descendants: Wicked World'] },
    { name: 'Zombies', queries: ['Disney Zombies', 'Zombies: The Re-Animated Series'] },
    { name: 'Chip und Chap', queries: ['Chip ’n Dale', 'Rescue Rangers'] },
    { name: 'Kim Possible', queries: ['Kim Possible'] },
    { name: 'Proud Family', queries: ['The Proud Family'] },
    { name: 'Santa Clause', queries: ['The Santa Clause', 'The Santa Clauses'] },
    { name: 'Hocus Pocus', queries: ['Hocus Pocus'] },
    { name: 'Narnia', queries: ['The Chronicles of Narnia'] },
    { name: 'Disney Fairies', queries: ['Tinker Bell', 'Secret of the Wings', 'The Pirate Fairy'] },
    { name: 'Die Zauberer vom Waverly Place', queries: ['Wizards of Waverly Place', 'Wizards Beyond Waverly Place'] },
    { name: 'Raven', queries: ['That’s So Raven', 'Raven’s Home', 'Cory in the House'] },
    { name: 'Hotel Zack & Cody', queries: ['The Suite Life of Zack & Cody', 'The Suite Life on Deck', 'The Suite Life Movie'] },
    { name: 'Hannah Montana', queries: ['Hannah Montana'] },
    { name: 'Camp Rock', queries: ['Camp Rock'] },
    { name: 'Gravity Falls', queries: ['Gravity Falls'] },
    { name: 'Das Haus der Eulen', queries: ['The Owl House'] },
    { name: 'Amphibia', queries: ['Amphibia'] },
    { name: 'Sofia und Elena', queries: ['Sofia the First', 'Elena of Avalor'] },
    { name: 'Disney Muppets', queries: ['The Muppets', 'Muppet Babies', 'Muppets Haunted Mansion'] },
  ]],
  ['Pixar', [
    { name: 'Toy Story', collections: [10194], queries: ['Toy Story', 'Lightyear', 'Forky Asks a Question', 'Buzz Lightyear of Star Command'] },
    { name: 'Cars und Planes', queries: ['Cars on the Road', 'Cars Toons', 'Cars 2', 'Cars 3', 'Disney Planes'], collections: [87118] },
    { name: 'Findet Nemo', collections: [137697] },
    { name: 'Die Unglaublichen', collections: [468222], queries: ['The Incredibles', 'Incredibles 2', 'Jack-Jack Attack'] },
    { name: 'Die Monster AG', queries: ['Monsters, Inc.', 'Monsters University', 'Monsters at Work'] },
    { name: 'Alles steht Kopf', queries: ['Inside Out', 'Dream Productions', 'Riley’s First Date'] },
    { name: 'Oben', queries: ['Dug Days', 'Carl’s Date', 'Pixar Up'] },
  ]],
  ['Weitere Film- und Serienreihen', [
    { name: 'Wizarding World', collections: [1241, 435259], queries: ['Harry Potter', 'Fantastic Beasts'] },
    { name: 'Mittelerde', collections: [119, 121755], queries: ['The Lord of the Rings', 'The Hobbit', 'The Rings of Power'] },
    { name: 'Avatar', collections: [87096] },
    { name: 'Fast & Furious', collections: [9485], queries: ['Fast & Furious'] },
    { name: 'James Bond', collections: [645] },
    { name: 'Mission: Impossible', collections: [87359], queries: ['Mission: Impossible'] },
    { name: 'Shrek und der gestiefelte Kater', collections: [2150], queries: ['Shrek', 'Puss in Boots'] },
    { name: 'Drachenzähmen leicht gemacht', queries: ['How to Train Your Dragon', 'DreamWorks Dragons', 'Dragons: The Nine Realms'] },
    { name: 'Kung Fu Panda', queries: ['Kung Fu Panda'] },
    { name: 'Ich – Einfach unverbesserlich', queries: ['Despicable Me', 'Minions'] },
    { name: 'Ice Age', queries: ['Ice Age'] },
    { name: 'Madagascar', queries: ['Madagascar', 'All Hail King Julien'] },
    { name: 'Zurück in die Zukunft', collections: [264], queries: ['Back to the Future'] },
    { name: 'Ghostbusters', queries: ['Ghostbusters'] },
    { name: 'Indiana Jones', queries: ['Indiana Jones'] },
    { name: 'Die Tribute von Panem', queries: ['The Hunger Games'] },
    { name: 'John Wick', queries: ['John Wick', 'Ballerina', 'The Continental'] },
    { name: 'The Walking Dead', queries: ['The Walking Dead', 'Fear the Walking Dead', 'Daryl Dixon'] },
    { name: 'Game of Thrones', queries: ['Game of Thrones', 'House of the Dragon', 'A Knight of the Seven Kingdoms'] },
    { name: 'Pokémon', queries: ['Pokémon'] },
    { name: 'Dragon Ball', queries: ['Dragon Ball'] },
    { name: 'One Piece', queries: ['One Piece'] },
  ]],
]
const state = { tab: 'open', type: 'all', universe: null, data: null }

const standaloneMode = window.matchMedia?.('(display-mode: standalone)')
let installPrompt
function canShowInstall() {
  return window.isSecureContext && !standaloneMode?.matches && !navigator.standalone
}
function showInstallButton() {
  $('install-access').hidden = !canShowInstall()
}
window.addEventListener('beforeinstallprompt', event => {
  event.preventDefault()
  installPrompt = event
  showInstallButton()
})
window.addEventListener('appinstalled', () => {
  installPrompt = null
  showInstallButton()
  if ($('install-dialog').open) $('install-dialog').close()
})
standaloneMode?.addEventListener('change', showInstallButton)
async function installApp() {
  if ($('modal').open) $('modal').close()
  if (installPrompt) {
    const prompt = installPrompt
    installPrompt = null
    try {
      await prompt.prompt()
      return
    } catch {
      // Browser installation can fall back to the platform menu.
    }
  }
  $('install-dialog').showModal()
}
let toastTimer
function make(tag, className, content) {
  const element = document.createElement(tag)
  if (className) element.className = className
  if (content) element.textContent = content
  return element
}
function button(label, callback, className = 'button') {
  const element = make('button', className, label)
  element.type = 'button'
  element.addEventListener('click', callback)
  return element
}
async function api(path, input) {
  const response = await fetch(`/api/${path}`, input ? {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(input),
  } : undefined)
  const result = await response.json()
  if (!response.ok) throw Object.assign(new Error(result.error), { status: response.status })
  return result
}
function toast(message) {
  $('toast').textContent = message
  $('toast').hidden = false
  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => { $('toast').hidden = true }, 4800)
}
function badge(rating) {
  return make('span', `rating ${ratingClasses[rating]}`, rating)
}
function card(entry, repeat = false, shared = false, universe = false) {
  const control = button('', () => titleDialog(entry, repeat, shared, universe), 'card')
  const title = make('strong', 'card-title', entry.title)
  control.setAttribute('aria-label', `Details zu ${entry.title}`)
  const index = stillTitles.indexOf(entry.title)
  const art = make('span', index >= 0 ? `art still a${index}` : 'art')
  if (entry.poster) art.append(posterImage(entry, 'card-poster'))
  else if (state.data.user && state.data.onlineSearch) watchArtwork(art, entry)
  art.append(make('span', entry.pool === 'marvel' ? 'pill marvel' : 'pill',
    entry.pool === 'marvel' ? `MARVEL · ${entry.type === 'serie' ? 'SERIE' : 'FILM'}` : (entry.type === 'serie' ? 'SERIE' : 'FILM')))
  const details = make('span', 'card-body')
  details.append(title)
  if (entry.genres.length) {
    const tags = make('span', 'tags')
    for (const genre of entry.genres) tags.append(make('span', '', genre))
    details.append(tags)
  }
  if (entry.reason) details.append(make('span', 'reason', entry.reason))
  if (universe && entry.next) details.append(make('span', 'meta', 'Als Nächstes in der Chronologie'))
  if (universe && entry.status === 'seen') details.append(make('span', 'meta', 'Gesehen'))
  if (universe && entry.status === 'reserve') details.append(make('span', 'meta', 'Auf der Merkliste'))
  if (entry.status === 'excluded') details.append(badge('Nicht ansehbar'))
  else if (entry.rating) details.append(badge(entry.rating))
  if (entry.seasons?.length && Array.isArray(entry.watchedSeasons)) {
    const count = entry.seasons.filter(season => entry.watchedSeasons.includes(season.number)).length
    details.append(make('span', 'meta', `${count} von ${entry.seasons.length} Staffeln gesehen`))
  }
  if (repeat) details.append(make('span', 'rating series', '❤️ Erneut ansehen'))
  if (entry.pool === 'marvel' && entry.status === 'watching') details.append(make('span', 'pill', 'Am schauen'))
  if (!['seen','excluded'].includes(entry.status)) {
    const service = entry.verifiedProvider ? `${entry.verifiedProvider} · DE` : entry.provider ? `${entry.provider} · Anbieter prüfen (DE)` : 'Anbieter prüfen (DE)'
    details.append(make('span', 'meta', [entry.type === 'serie' ? entry.extent || 'Staffeln noch zu prüfen' : 'Spielfilm', service].join(' · ')))
  }
  control.append(art, details)
  return control
}
function render() {
  const data = state.data
  if (!data) return
  const shared = state.tab === 'household'
  const universes = state.tab === 'universes'
  $('hero').hidden = shared || universes
  $('personal-collection').hidden = shared || universes
  $('universe-page').hidden = !universes
  $('refresh-recommendations').hidden = state.tab !== 'open'
  $('household-page').hidden = !shared
  const { titles, marvel, seasonal, favorites } = data
  const openCount = titles.filter(entry => entry.status === 'open').length
  $('open-count').textContent = openCount
  $('nav-count').textContent = openCount
  $('seen-count').textContent = titles.filter(entry => entry.status === 'seen').length
  $('watch-count').textContent = titles.filter(entry => entry.status === 'watching').length + Number(marvel?.status === 'watching')
  $('preferences').hidden = !data.user
  $('account').textContent = data.user ? 'Mein Konto' : 'Anmelden'
  $('extras-tab').hidden = !seasonal.length && !favorites.length && state.tab !== 'extras'
  const [heading, crumb, note] = shared ? ['Haushalt', 'Haushalt', ''] : headings[state.tab]
  $('heading').textContent = heading
  $('crumb').textContent = crumb
  $('section-note').textContent = state.tab === 'open' && openCount < 15
    ? `${openCount} von 15 Plätzen belegt. Merke weitere Titel, wenn der Vorrat aufgebraucht ist.` : note
  for (const nav of document.querySelectorAll('[data-tab]')) {
    nav.classList.toggle('nav-active', nav.dataset.tab === state.tab)
    if (nav.dataset.tab === state.tab) nav.setAttribute('aria-current', 'page')
    else nav.removeAttribute('aria-current')
  }
  let mobileActive = false
  for (const nav of document.querySelectorAll('[data-mobile-tab]')) {
    const current = nav.dataset.mobileTab === state.tab
    if (current) {
      nav.setAttribute('aria-current', 'page')
      mobileActive = true
    } else nav.removeAttribute('aria-current')
  }
  if (mobileActive) $('mobile-more').removeAttribute('aria-current')
  else $('mobile-more').setAttribute('aria-current', 'page')
  if (shared) return
  if (universes) return renderUniverse()
  for (const type of document.querySelectorAll('[data-type]')) {
    type.classList.toggle('selected', type.dataset.type === state.type)
    type.setAttribute('aria-pressed', String(type.dataset.type === state.type))
  }
  let shown
  if (state.tab === 'extras') shown = [...seasonal, ...favorites]
  else {
    shown = titles.filter(entry => entry.status === state.tab)
    if (state.tab === 'watching' && marvel?.status === 'watching') shown.push(marvel)
  }
  const genre = $('genre').value
  const query = $('search').value.trim().toLocaleLowerCase('de')
  const matches = entry => (state.type === 'all' || entry.type === state.type) &&
    (!genre || entry.genres.includes(genre)) && entry.title.toLocaleLowerCase('de').includes(query)
  shown = shown.filter(matches)
  $('cards').replaceChildren(...shown.map(entry => card(entry, state.tab === 'extras' && favorites.includes(entry))))
  if (!shown.length) $('cards').append(make('p', 'empty', 'Keine passenden Titel in diesem Bereich.'))
  $('marvel-preview').replaceChildren()
  if (state.tab === 'open' && marvel && marvel.status !== 'watching' && matches(marvel)) {
    $('marvel-preview').append(make('h2', '', 'Als Nächstes bei Marvel'), card(marvel))
  }
}
function field(label, name, options = {}) {
  const wrapper = make('label', '', label)
  const input = make(options.values ? 'select' : 'input')
  input.name = name
  if (options.values) for (const [value, text] of options.values) input.add(new Option(text, value))
  else Object.assign(input, options)
  wrapper.append(input)
  return wrapper
}
function dialog(title, fields, actions) {
  $('modal-title').textContent = title
  $('modal-fields').replaceChildren(...fields)
  $('modal-actions').replaceChildren(...actions)
  $('form-status').textContent = ''
  if (state.data?.user && !$('modal').open) $('modal').showModal()
}
const textOf = (name) => $('modal-form').elements.namedItem(name)?.value || ''
let busy = false
function submit(label, handle, className = 'button primary') {
  return button(label, async () => {
    if (busy || !$('modal-form').reportValidity()) return
    busy = true
    $('form-status').textContent = 'Wird verarbeitet …'
    for (const control of $('modal-actions').querySelectorAll('button')) control.disabled = true
    try { await handle() } catch (error) {
      $('form-status').textContent = error.message || 'Die Anfrage konnte nicht verarbeitet werden.'
    } finally {
      busy = false
      for (const control of $('modal-actions').querySelectorAll('button')) control.disabled = false
    }
  }, className)
}
function auth(mode = 'login', importProfile = false) {
  $('library').hidden = true
  $('access').hidden = false
  $('close').hidden = true
  $('auth-form-slot').append($('modal-form'))
  const login = mode === 'login'
  const register = mode === 'register'
  const fields = [field('E-Mail', 'email', { type: 'email', required: true, autocomplete: 'email', maxLength: 254 })]
  if (login || register) fields.push(field('Passwort', 'password', { type: 'password', required: true, minLength: register ? 10 : 1, maxLength: 128, autocomplete: login ? 'current-password' : 'new-password' }))
  if (register) {
    const option = make('label', 'checkbox')
    const checkbox = make('input')
    Object.assign(checkbox, { type: 'checkbox', name: 'profile', checked: importProfile })
    option.append(checkbox, 'Vorgegebene Watchlist mit Archiv und Bewertungen übernehmen')
    fields.push(option)
  }
  const title = login ? 'Anmelden' : register ? 'Konto erstellen' : 'Bestätigungslink erneut senden'
  const actions = [submit(title, async () => {
    const result = await api(mode, { email: textOf('email'), password: textOf('password'),
      profile: $('modal-form').elements.namedItem('profile')?.checked ? 'watchlist' : 'new' })
    if (login) {
      showLibrary(await api('list'))
      toast('Du bist angemeldet.')
    } else $('form-status').textContent = result.message
  })]
  if (login) actions.push(button('Neues Konto erstellen', () => auth('register')), button('Bestätigungslink erneut senden', () => auth('resend')))
  else actions.push(button('Zur Anmeldung', () => auth()))
  dialog(title, fields, actions)
}
function account() {
  if (!state.data?.user) return auth()
  const actions = [submit('Abmelden', async () => {
    await api('logout', {})
    state.data = null
    mediaMatches.clear()
    $('cards').replaceChildren()
    $('marvel-preview').replaceChildren()
    $('household-page').replaceChildren()
    $('universe-page').replaceChildren()
    state.universe = null
    $('modal').close()
    auth()
  })]
  if (canShowInstall()) actions.unshift(button('Als App installieren', installApp))
  dialog('Mein Konto', [make('p', '', state.data.user.email)], actions)
}
async function update(input) {
  state.data = await api('list', input)
  $('modal').close()
  render()
  toast(state.data.searchWarning || (state.data.promoted.length && input.action !== 'preferences'
    ? `Nachgerückt: ${state.data.promoted.join(', ')}` : input.action === 'remove' ? 'Titel entfernt.' : 'Gespeichert.'))
}
function ratingFields(entry) {
  const group = make('fieldset', 'rating-choices')
  group.append(make('legend', '', 'Deine Bewertung'))
  for (const rating of state.data.ratings) {
    if ((rating === 'Lieblingsserie' && entry.type !== 'serie') ||
        (rating === 'Lieblingsfilm' && entry.type !== 'film')) continue
    const label = make('label', 'checkbox')
    const input = make('input')
    Object.assign(input, { type: 'radio', name: 'rating', value: rating, checked: entry.rating === rating })
    label.append(input, badge(rating))
    group.append(label)
  }
  return group
}
function posterImage(entry, className) {
  const image = make('img', className)
  image.src = `https://image.tmdb.org/t/p/w342${entry.poster}`
  image.alt = ''
  image.loading = 'lazy'
  return image
}
function seasonFields(entry, checked) {
  const group = make('fieldset', 'season-list')
  group.append(make('legend', '', `${entry.seasons.length} veröffentlichte ${entry.seasons.length === 1 ? 'Staffel' : 'Staffeln'}`))
  for (const season of entry.seasons) {
    const label = make('label', 'checkbox')
    const checkbox = make('input')
    Object.assign(checkbox, { type: 'checkbox', value: season.number, checked: checked.has(season.number) })
    checkbox.addEventListener('change', () => {
      if (checkbox.checked) checked.add(season.number)
      else checked.delete(season.number)
    })
    label.append(checkbox, season.name)
    group.append(label)
  }
  if (entry.seasons.length > 1) {
    group.querySelector('legend').after(button('Alle Staffeln abhaken', () => {
      for (const input of group.querySelectorAll('input')) {
        if (!input.checked) input.click()
      }
    }, 'button compact'))
  }
  return group
}
function streamingPanel(entry) {
  const section = make('section', 'streaming-offers')
  section.append(make('h3', '', 'Streaming in Deutschland'))
  const offers = entry.offers || []
  if (!offers.length) {
    section.append(make('p', 'meta', entry.offers
      ? 'Keine Angebote bei Netflix, Disney+ oder Amazon gefunden.'
      : 'Verfügbarkeit noch nicht geprüft.'))
    return section
  }
  const list = make('ul', 'offer-list')
  for (const offer of offers) {
    const label = {
      subscription: offer.service === 'Amazon Prime Video' ? 'Im Prime-Abo enthalten' : 'Im Abo enthalten',
      addon: `Zusatzabo${offer.channel ? ' · ' + offer.channel : ''}`,
      rent: 'Leihen', buy: 'Kaufen',
    }[offer.type]
    const row = make('li')
    row.append(make('strong', '', offer.service))
    const price = offer.price || (['rent','buy','addon'].includes(offer.type) ? 'Preis beim Anbieter prüfen' : '')
    row.append(make('span', 'meta', [label, offer.quality, price].filter(Boolean).join(' · ')))
    if (offer.link && offer.link !== entry.availabilityLink) {
      const link = make('a', 'meta', 'Zum Angebot')
      Object.assign(link, { href: offer.link, target: '_blank', rel: 'noopener noreferrer' })
      row.append(link)
    }
    list.append(row)
  }
  section.append(list)
  if (entry.availabilityLink) {
    const link = make('a', 'meta', 'Angebote bei JustWatch / TMDB prüfen')
    Object.assign(link, { href: entry.availabilityLink, target: '_blank', rel: 'noopener noreferrer' })
    section.append(link)
  }
  return section
}
function descriptionPanel(entry) {
  const detail = make('div', 'media-detail')
  if (entry.poster) detail.append(posterImage(entry, 'detail-poster'))
  const copy = make('div')
  copy.append(make('p', 'meta', [entry.type === 'serie' ? 'Serie' : 'Film', entry.year, entry.extent].filter(Boolean).join(' · ')))
  copy.append(make('p', '', entry.description || 'Keine Inhaltsbeschreibung verfügbar.'))
  if (!entry.description && entry.reason) copy.append(make('p', 'meta', entry.reason))
  detail.append(copy)
  return detail
}
const mediaMatches = new Map()
async function resolveMedia(entry) {
  if (entry.tmdb && entry.poster) return entry
  if (!mediaMatches.has(entry.id)) {
    const request = entry.tmdb ? api(`media/details?id=${encodeURIComponent(entry.tmdb)}`) :
      api(`media/search?q=${encodeURIComponent(entry.title)}`).then(data => {
        const normalize = title => title.normalize('NFKC').replace(/[^\p{L}\p{N}]/gu, '').toLowerCase()
        return data.results.find(candidate => candidate.type === entry.type &&
          [candidate.title, candidate.original].some(title => title && normalize(title) === normalize(entry.title)))
      })
    const lookup = request.catch(error => {
      mediaMatches.delete(entry.id)
      throw error
    })
    mediaMatches.set(entry.id, lookup)
  }
  return mediaMatches.get(entry.id)
}
const observedArt = new WeakMap()
const artworkObserver = typeof IntersectionObserver === 'undefined' ? null : new IntersectionObserver(changes => {
  for (const change of changes) {
    if (!change.isIntersecting) continue
    const artwork = change.target
    artworkObserver.unobserve(artwork)
    if (!artwork.isConnected) continue
    resolveMedia(observedArt.get(artwork)).then(media => {
      if (media?.poster && artwork.isConnected) artwork.append(posterImage(media, 'card-poster'))
    }).catch(() => {})
  }
})
function watchArtwork(artwork, entry) {
  observedArt.set(artwork, entry)
  artworkObserver?.observe(artwork)
}
async function titleDialog(entry, repeat = false, shared = false, universe = false) {
  const panel = descriptionPanel(entry)
  const progress = make('div')
  const streaming = streamingPanel(entry)
  const fields = [panel, streaming]
  const actions = []
  function saveUniverse(status) {
    const rating = status === 'seen' ? textOf('rating') : ''
    if (entry.curated) return update({ id: entry.id, action: 'universe-title', status, rating })
    return update({ action: status === 'seen' ? 'log-selection' : 'remember-selection', universe: true,
      items: [{ tmdb: entry.tmdb, watched: [], completeSeries: status === 'seen', rating }] })
  }
  if (universe && entry.status !== 'excluded') {
    fields.push(ratingFields(entry), progress)
    actions.push(submit(entry.status === 'seen' ? 'Bewertung speichern' : 'Als gesehen speichern', () => saveUniverse('seen')))
    if (!['seen','reserve'].includes(entry.status)) {
      actions.push(submit('Auf die Merkliste', () => saveUniverse('reserve'), 'button'))
    }
  }
  if (!shared && !universe) {
    if (entry.status === 'excluded') {
      fields.push(badge('Nicht ansehbar'))
    } else {
      fields.push(ratingFields(entry), progress)
      actions.push(submit(entry.status === 'seen' ? 'Bewertung speichern' : 'Als gesehen speichern', () =>
        update({ id: entry.id, action: 'seen', rating: textOf('rating') })))
      if (!['seen','watching'].includes(entry.status)) actions.push(submit('Am schauen', () => update({ id: entry.id, action: 'watching' }), 'button'))
      if (entry.status === 'open' || (entry.pool === 'seasonal' && !entry.status)) actions.push(submit('Auf die Merkliste', () => update({ id: entry.id, action: 'reserve' }), 'button'))
      if (['watching', 'reserve'].includes(entry.status)) actions.push(submit(
        entry.status === 'watching' ? 'Aus „Am schauen“ entfernen' : 'Aus Merkliste entfernen',
        () => update({ id: entry.id, action: 'remove' }), 'button'))
      if (entry.status !== 'seen') actions.push(button('Nicht ansehbar …', () => dialog(entry.title,
        [make('p', '', 'Diesen Titel dauerhaft ausschließen?')], [
          submit('Dauerhaft ausschließen', () => update({ id: entry.id, action: 'excluded' })),
          button('Zurück', () => titleDialog(entry, repeat)),
        ])))
    }
    if (repeat) actions.push(submit('Vorschlag schließen', () => update({ id: entry.id, action: 'rewatch' }), 'button'))
  }
  dialog(entry.title, fields, actions)
  function showSeasons(details) {
    if (!progress.isConnected || details.type !== 'serie' || !details.seasons?.length) return
    const selected = new Set(details.watchedSeasons)
    progress.replaceChildren(seasonFields(details, selected), submit('Staffelstand speichern', () => {
      const finished = entry.status === 'seen' || details.seasons.every(season => selected.has(season.number))
      return update({ action: 'log-selection', universe, items: [{
        tmdb: details.tmdb, watched: [...selected], rating: finished ? textOf('rating') : '',
      }] })
    }, 'button compact'))
  }
  if (!state.data.onlineSearch) return
  const status = make('p', 'meta', 'Titeldaten werden geladen …')
  panel.after(status)
  try {
    const match = await resolveMedia(entry)
    if (!match) { status.remove(); return }
    const details = await api(`media/details?id=${encodeURIComponent(match.tmdb)}`)
    if (!panel.isConnected || !$('modal').open) return
    panel.replaceWith(descriptionPanel({ ...entry, ...details }))
    streaming.replaceWith(streamingPanel(details))
    status.remove()
    showSeasons(details)
  } catch {
    status.remove()
    showSeasons(entry)
  }
}
function titleSearch(log, initialQuery = '') {
  if (!state.data?.user) return auth()
  const queryField = field('Film, Serie oder Reihe suchen', 'media-query', { type: 'search', placeholder: 'z. B. Star Wars', minLength: 2, maxLength: 120 })
  const query = queryField.querySelector('input')
  const results = make('div', 'lookup-results')
  const searchStatus = make('p', 'meta')
  searchStatus.setAttribute('role', 'status')
  if (!state.data.onlineSearch) {
    query.disabled = true
    searchStatus.textContent = 'Die Titelsuche braucht den TMDB-Schlüssel in den Arcane-Projektvariablen.'
  }
  const selected = new Map()
  const seenResults = new Set()
  let generation = 0
  let page = 1
  let timer

  function resultCard(entry) {
    const row = make('article', 'lookup-card')
    const artwork = button(entry.poster ? '' : 'Info', () => {
      const expanded = !details.hidden
      details.hidden = expanded
      artwork.setAttribute('aria-expanded', String(!expanded))
      if (!expanded && log && entry.type === 'serie') loadSeasons()
    }, 'lookup-art')
    artwork.setAttribute('aria-label', `Beschreibung zu ${entry.title}`)
    artwork.setAttribute('aria-expanded', 'false')
    if (entry.poster) artwork.append(posterImage(entry, 'lookup-poster'))
    const copy = make('div', 'lookup-copy')
    copy.append(make('strong', '', entry.title), make('p', 'meta', [entry.type === 'serie' ? 'Serie' : 'Film', entry.year].filter(Boolean).join(' · ')))
    if (entry.genres?.length) copy.append(make('p', 'meta', entry.genres.join(' · ')))
    const details = make('div', 'lookup-detail')
    details.hidden = true
    details.append(make('p', '', entry.description || 'Keine Inhaltsbeschreibung verfügbar.'))
    let loaded = false
    async function loadSeasons() {
      if (loaded || entry.status === 'excluded') return
      loaded = true
      const message = make('p', 'meta', 'Staffeln werden geladen …')
      details.append(message)
      try {
        const info = await api(`media/details?id=${encodeURIComponent(entry.tmdb)}`)
        message.remove()
        if (!info.seasons.length) {
          details.append(make('p', 'meta', 'Keine veröffentlichten Staffeln gefunden.'))
          return
        }
        const existing = selected.get(entry.tmdb)
        const checked = existing || new Set(info.watchedSeasons)
        const fields = seasonFields(info, checked)
        fields.addEventListener('change', () => selected.set(entry.tmdb, checked))
        details.append(fields)
      } catch (error) {
        loaded = false
        message.textContent = error.message
        details.append(button('Erneut laden', event => {
          message.remove()
          event.currentTarget.remove()
          loadSeasons()
        }))
      }
    }

    if (entry.status === 'excluded') copy.append(badge('Nicht ansehbar'))
    else if (!log) {
      if (entry.status) copy.append(make('p', 'meta', 'Bereits in deiner Watchlist'))
      else copy.append(submit('Titel merken', () => update({
        action: 'remember-selection', items: [{ tmdb: entry.tmdb, watched: [] }],
      }), 'button compact'))
    } else if (entry.type === 'film') {
      const label = make('label', 'checkbox')
      const checkbox = make('input')
      Object.assign(checkbox, { type: 'checkbox', checked: entry.status === 'seen' || selected.has(entry.tmdb), disabled: entry.status === 'seen' })
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) selected.set(entry.tmdb, new Set())
        else selected.delete(entry.tmdb)
      })
      label.append(checkbox, entry.status === 'seen' ? 'Bereits gesehen' : 'Gesehen')
      copy.append(label)
    } else {
      copy.append(button('Staffeln auswählen', () => {
        details.hidden = false
        artwork.setAttribute('aria-expanded', 'true')
        loadSeasons()
      }, 'button compact'))
    }
    row.append(artwork, copy, details)
    return row
  }

  async function search(append = false) {
    const current = ++generation
    const value = query.value.trim()
    if (!append) { page = 1; seenResults.clear(); results.replaceChildren() }
    if (value.length < 2) { searchStatus.textContent = ''; return }
    searchStatus.textContent = 'Suche läuft …'
    try {
      const data = await api(`media/search?q=${encodeURIComponent(value)}&page=${page}`)
      if (current !== generation || !results.isConnected) return
      results.querySelector('.lookup-more')?.remove()
      for (const entry of data.results) {
        if (seenResults.has(entry.tmdb)) continue
        seenResults.add(entry.tmdb)
        results.append(resultCard(entry))
      }
      if (data.more) results.append(button('Weitere Ergebnisse', event => {
        event.currentTarget.disabled = true
        page++
        search(true)
      }, 'button lookup-more'))
      searchStatus.textContent = results.childElementCount ? '' : 'Keine passenden Filme oder Serien gefunden.'
    } catch (error) {
      if (current === generation) {
        if (append) {
          page--
          const more = results.querySelector('.lookup-more')
          if (more) more.disabled = false
        }
        searchStatus.textContent = error.message
      }
    }
  }
  query.addEventListener('input', () => {
    generation++
    clearTimeout(timer)
    timer = setTimeout(search, 300)
  })
  query.addEventListener('keydown', event => {
    if (event.key !== 'Enter') return
    event.preventDefault()
    clearTimeout(timer)
    search()
  })
  const actions = []
  if (log && state.data.onlineSearch) actions.push(submit('Auswahl speichern', async () => {
    if (!selected.size) throw new Error('Wähle einen Film oder mindestens eine Staffel aus.')
    await update({ action: 'log-selection', items: [...selected].map(([tmdb, watched]) => ({ tmdb, watched: [...watched] })) })
  }))
  actions.push(button('Ohne TMDB-Treffer manuell erfassen', () => addTitle(log)))
  dialog(log ? 'Gesehen eintragen' : 'Titel merken', [queryField, searchStatus, results], actions)
  if (initialQuery && state.data.onlineSearch) {
    query.value = initialQuery
    search()
  }
  query.focus()
}

function addTitle(log = false) {
  if (!state.data?.user) return auth()
  const fields = [
    field('Titel', 'title', { required: true, maxLength: 140 }),
    field('Art', 'type', { values: [['serie', 'Serie'], ['film', 'Film']] }),
    field('Genre', 'genre', { values: [['', 'Genre auswählen'], ...state.data.genres.map(genre => [genre, genre])] }),
  ]
  if (log) fields.push(field('Bewertung', 'rating', { values: [['', 'Ohne Bewertung'], ...state.data.ratings.map(value => [value, value])] }))
  else fields.push(field('Warum passt der Titel?', 'reason', { maxLength: 400 }),
    field('Vorheriger Film einer Reihe (optional)', 'predecessor', { maxLength: 140 }))
  dialog(log ? 'Gesehenen Titel eintragen' : 'Titel merken', fields, [submit('Titel speichern', () => update({
    action: log ? 'log' : 'add', title: textOf('title'), type: textOf('type'), genre: textOf('genre'),
    reason: textOf('reason'), predecessor: textOf('predecessor'), rating: textOf('rating'),
  }))])
  if (log) {
    const type = $('modal-form').elements.namedItem('type')
    const rating = $('modal-form').elements.namedItem('rating')
    const filterRatings = () => {
      const oldValue = rating.value
      const restricted = type.value === 'serie' ? 'Lieblingsfilm' : 'Lieblingsserie'
      rating.replaceChildren(new Option('Ohne Bewertung', ''), ...state.data.ratings
        .filter(value => value !== restricted).map(value => new Option(value)))
      rating.value = oldValue === restricted ? '' : oldValue
    }
    type.addEventListener('change', filterRatings)
    filterRatings()
  }
}
function preferences() {
  if (!state.data?.user) return auth()
  const fields = make('div', 'genre-list')
  for (const genre of state.data.genres) {
    const label = make('label', 'checkbox')
    const checkbox = make('input')
    Object.assign(checkbox, { type: 'checkbox', name: 'interest', value: genre, checked: state.data.interests.includes(genre) })
    label.append(checkbox, genre)
    fields.append(label)
  }
  const note = state.data.onlineSearch
    ? 'Deine Genres beeinflussen die Vorschläge. Die Suche berücksichtigt Netflix, Disney+ und Prime Video in Deutschland.'
    : 'Deine Genres bestimmen die Reihenfolge der Empfehlungen aus dem lokalen Katalog.'
  dialog('Genre-Interessen', [make('p', 'meta', note), fields], [
    submit('Speichern und Vorschläge suchen', async () => {
      const interests = new FormData($('modal-form')).getAll('interest')
      await update({ action: 'preferences', interests })
      setTab('open')
    }),
  ])
}
async function renderUniverse() {
  const page = $('universe-page')
  const selected = state.universe
  const heading = make('h2', '', selected?.name || 'Universen')
  heading.id = 'universe-heading'
  page.replaceChildren(heading)
  if (!selected) {
    for (const [name, universes] of universeGroups) {
      const tiles = make('div', 'universe-tiles')
      for (const item of universes) tiles.append(button(item.name, () => {
        state.universe = item
        renderUniverse()
      }, 'universe-tile'))
      page.append(make('h3', '', name), tiles)
    }
    return
  }
  const back = button('‹ Alle Universen', () => {
    state.universe = null
    renderUniverse()
  })
  page.prepend(back)
  const status = make('p', 'meta', 'Titel werden geladen …')
  status.setAttribute('role', 'status')
  const results = make('div', 'cards')
  page.append(status, results)
  const keys = new Set()
  const samePage = () => state.tab === 'universes' && results.isConnected
  function add(entries) {
    if (!samePage()) return
    for (const entry of entries) {
      if (entry.year && Number(entry.year) > new Date().getFullYear()) continue
      const titleKey = `${entry.type}:${entry.title.normalize('NFKD').toLowerCase().replace(/[^\p{L}\p{N}]/gu, '')}`
      if (keys.has(titleKey) || (entry.tmdb && keys.has(entry.tmdb))) continue
      keys.add(titleKey)
      if (entry.tmdb) keys.add(entry.tmdb)
      results.append(card({ ...entry, id: entry.id || entry.tmdb }, false, false, true))
    }
  }
  async function searchAll(query) {
    for (let current = 1; samePage(); current++) {
      const data = await api(`media/search?q=${encodeURIComponent(query)}&page=${current}`)
      add(data.results)
      if (!data.more) break
    }
  }
  try {
    if (selected.curated) add((await api(`universe?name=${selected.curated}`)).results)
    if (state.data?.onlineSearch && samePage()) {
      const collections = await Promise.allSettled((selected.collections || []).map(async id => {
        add((await api(`media/collection?id=${id}`)).results)
      }))
      const searches = await Promise.allSettled((selected.queries || []).map(searchAll))
      if ([...collections, ...searches].some(result => result.status === 'rejected')) {
        status.textContent = results.childElementCount ? 'Ein Teil des TMDB-Katalogs konnte nicht geladen werden.'
          : 'Der TMDB-Katalog konnte gerade nicht geladen werden.'
        return
      }
    }
    status.textContent = results.childElementCount ? `${results.childElementCount} Titel`
      : state.data?.onlineSearch ? 'Keine passenden Filme oder Serien gefunden.'
        : 'Für dieses Universum braucht die App den TMDB-Schlüssel.'
  } catch (error) {
    if (samePage()) status.textContent = error.message
  }
}
function showLibrary(data) {
  state.data = data
  $('modal').append($('modal-form'))
  $('close').hidden = false
  $('access').hidden = true
  $('library').hidden = false
  $('genre').replaceChildren(new Option('Alle Genres', ''), ...data.genres.map(genre => new Option(genre)))
  $('legend').replaceChildren(...[...data.ratings, 'Nicht ansehbar'].map(badge))
  const url = new URL(location.href)
  const joined = url.searchParams.has('household')
  if (joined) {
    url.searchParams.delete('household')
    history.replaceState(null, '', url)
  }
  setTab(joined ? 'household' : 'open')
}
function householdDialog(action) {
  if (action === 'leave') {
    dialog('Haushalt verlassen', [make('p', '', 'Möchtest du diesen Haushalt verlassen?')], [
      submit('Haushalt verlassen', () => changeHousehold({ action })),
    ])
    return
  }
  const invite = action === 'invite'
  const fields = invite
    ? [field('E-Mail-Adresse der anderen Person', 'household-email', { type: 'email', required: true, maxLength: 254 })]
    : [field('Name des Haushalts', 'household-name', { required: true, minLength: 2, maxLength: 60 })]
  const title = invite ? 'Person einladen' : 'Haushalt erstellen'
  dialog(title, fields, [submit(invite ? 'Einladung senden' : title, () => changeHousehold({
    action, email: textOf('household-email'), name: textOf('household-name'),
  }))])
}
async function changeHousehold(input) {
  const data = await api('household', input)
  if ($('modal').open) $('modal').close()
  if (state.tab === 'household') renderHousehold(data)
  if (data.notice) toast(data.notice)
}
function renderHousehold(data) {
  const page = $('household-page')
  const title = make('h2', '', data.household?.name || 'Haushalt')
  title.id = 'household-heading'
  const toolbar = make('div', 'household-toolbar')
  toolbar.append(title)
  page.replaceChildren(toolbar)
  if (!data.household) {
    toolbar.append(button('Haushalt erstellen', () => householdDialog('create'), 'button primary'))
    if (!data.invitations.length) {
      page.append(make('p', 'meta', 'Erstelle einen Haushalt, um gemeinsam Empfehlungen zu bekommen.'))
      return
    }
    for (const invite of data.invitations) {
      const row = make('div', 'household-invite')
      const status = make('p', 'meta')
      const controls = ['accept', 'decline'].map(action => button(action === 'accept' ? 'Annehmen' : 'Ablehnen', async () => {
        for (const control of controls) control.disabled = true
        try { await changeHousehold({ action, id: invite.id }) } catch (error) {
          status.textContent = error.message
          for (const control of controls) control.disabled = false
        }
      }))
      row.append(make('strong', '', `Einladung zu „${invite.name}“`), ...controls, status)
      page.append(row)
    }
    return
  }
  toolbar.append(button('Person einladen', () => householdDialog('invite'), 'button primary'),
    button('Haushalt verlassen', () => householdDialog('leave')))
  const members = make('div', 'household-members')
  members.append(make('h3', '', 'Mitglieder'))
  for (const email of data.household.members) members.append(make('span', 'pill', email))
  page.append(members, make('h3', '', 'Gemeinsam schauen'))
  if (data.household.members.length < 2) {
    page.append(make('p', 'meta', 'Sobald eine zweite Person beitritt, erscheinen hier gemeinsame Vorschläge.'))
  } else if (!data.recommendations.length) {
    page.append(make('p', 'meta', 'Aktuell gibt es keine gemeinsamen Vorschläge.'))
  } else {
    const cards = make('div', 'cards')
    cards.append(...data.recommendations.map(entry => card(entry, false, true)))
    page.append(cards)
  }
}
async function loadHousehold() {
  const page = $('household-page')
  const user = state.data.user.email
  page.replaceChildren(make('p', 'meta', 'Haushalt wird geladen …'))
  try {
    const data = await api('household')
    if (state.tab === 'household' && state.data?.user.email === user) renderHousehold(data)
  } catch (error) {
    if (state.tab === 'household' && state.data?.user.email === user) page.replaceChildren(make('p', 'meta', error.message))
  }
}
function mobileMore() {
  const actions = [
    ['Gesehenes Archiv', 'seen'], ['Dauerhaft ausgeschlossen', 'excluded'], ['Haushalt', 'household'],
  ]
  if (!$('extras-tab').hidden) actions.push(['Extras', 'extras'])
  const controls = actions.map(([label, tab]) => button(label, () => {
    $('modal').close()
    setTab(tab, true)
  }))
  controls.push(button('Genre-Interessen', preferences), button('Mein Konto', account))
  if (canShowInstall()) controls.push(button('Als App installieren', installApp))
  dialog('Weitere Bereiche', [], controls)
}
function setTab(tab, scroll = false) {
  state.tab = tab
  state.type = 'all'
  $('genre').value = ''
  $('search').value = ''
  render()
  if (tab === 'household') loadHousehold()
  if (scroll) window.scrollTo(0, 0)
}
$('refresh-recommendations').addEventListener('click', async event => {
  const control = event.currentTarget
  control.disabled = true
  control.textContent = 'Suche läuft …'
  try {
    const user = state.data.user.email
    const data = await api('list', { action: 'refresh-recommendations' })
    if (state.data?.user.email !== user) return
    state.data = data
    if (state.tab === 'open') {
      state.type = 'all'
      $('genre').value = ''
      $('search').value = ''
    }
    render()
    toast(data.notice)
  } catch (error) {
    toast(error.message)
  } finally {
    control.disabled = false
    control.textContent = '↻ Neue Vorschläge'
  }
})
$('account').addEventListener('click', account)
$('hero-action').addEventListener('click', () => titleSearch(false))
$('log-title').addEventListener('click', () => titleSearch(true))
$('preferences').addEventListener('click', preferences)
$('close').addEventListener('click', () => { if (!busy) $('modal').close() })
$('modal').addEventListener('cancel', event => { if (busy) event.preventDefault() })
$('modal-form').addEventListener('submit', event => {
  event.preventDefault()
  $('modal-actions').querySelector('.primary')?.click()
})
for (const nav of document.querySelectorAll('[data-tab]')) nav.addEventListener('click', () => {
  if (nav.dataset.tab === 'universes') state.universe = null
  setTab(nav.dataset.tab)
})
for (const type of document.querySelectorAll('[data-type]')) type.addEventListener('click', () => {
  state.type = type.dataset.type
  render()
})
$('genre').addEventListener('change', render)
$('search').addEventListener('input', render)
$('mobile-more').addEventListener('click', mobileMore)
$('mobile-more').setAttribute('aria-haspopup', 'dialog')
for (const destination of document.querySelectorAll('[data-mobile-tab]')) {
  destination.addEventListener('click', () => {
    const tab = destination.dataset.mobileTab
    if (tab === 'universes') state.universe = null
    setTab(tab, true)
  })
}
$('install-access').addEventListener('click', installApp)
showInstallButton()
if (window.isSecureContext && 'serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(error => console.warn('Service Worker:', error.message))
}
const verified = new URLSearchParams(location.search).get('verified')
if (verified !== null) {
  const url = new URL(location.href)
  url.searchParams.delete('verified')
  history.replaceState(null, '', url)
}
try {
  showLibrary(await api('list'))
} catch (error) {
  auth(verified === '0' ? 'resend' : 'login')
  if (verified !== null) $('form-status').textContent = verified === '1'
    ? 'E-Mail bestätigt. Du kannst dich jetzt anmelden.' : 'Der Link ist ungültig oder abgelaufen.'
  else if (error.status !== 401) $('form-status').textContent = 'Die Verbindung zur Watchlist ist fehlgeschlagen.'
}
