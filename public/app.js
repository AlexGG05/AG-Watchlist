const $ = id => document.getElementById(id)
const headings = {
  open: ['Offene Empfehlungen', 'Empfehlungen', 'Deine nächsten 15 Titel. Marvel läuft separat.'],
  watching: ['Am schauen', 'Am schauen', 'Hier findest du alle Titel, die du begonnen hast.'],
  seen: ['Gesehenes Archiv', 'Gesehen', 'Deine abgeschlossenen Titel und Bewertungen.'],
  reserve: ['Merkliste', 'Merkliste', 'Diese Titel können als Nächstes nachrücken.'],
  excluded: ['Dauerhaft ausgeschlossen', 'Ausgeschlossen', 'Diese Titel werden dir nicht wieder vorgeschlagen.'],
  marvel: ['Marvel-Reihenfolge', 'Marvel', 'Dein nächster Titel in der zeitlichen Reihenfolge der Handlung.'],
  extras: ['Extras', 'Extras', 'Saisonale Empfehlungen und Favoriten zum Wiedersehen.'],
}
const ratingClasses = { Schlecht: 'bad', Okay: 'ok', Gut: 'good', 'Sehr gut': 'great', Lieblingsserie: 'series', Lieblingsfilm: 'movie', 'Nicht ansehbar': 'excluded' }
const stillTitles = ['Chilling Adventures of Sabrina', 'Lockwood & Co.', 'Lucifer', 'Dark', 'The Umbrella Academy', 'Once Upon a Time – Es war einmal …']
const state = { tab: 'open', type: 'all', data: null }
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
  if (!response.ok) throw new Error(result.error)
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
function card(entry, repeat = false) {
  const article = make('article', 'card')
  const index = stillTitles.indexOf(entry.title)
  const art = make('div', index >= 0 ? `art still a${index}` : 'art')
  const menu = button('⋯', () => titleDialog(entry, repeat), 'icon-button')
  menu.setAttribute('aria-label', `Optionen für ${entry.title}`)
  art.append(make('span', entry.pool === 'marvel' ? 'pill marvel' : 'pill',
    entry.pool === 'marvel' ? `MARVEL · ${entry.type === 'serie' ? 'SERIE' : 'FILM'}` : (entry.type === 'serie' ? 'SERIE' : 'FILM')), menu)
  const details = make('div', 'card-body')
  details.append(make('h3', '', entry.title))
  if (entry.genres.length) {
    const tags = make('div', 'tags')
    for (const genre of entry.genres) tags.append(make('span', '', genre))
    details.append(tags)
  }
  if (entry.reason) details.append(make('p', 'reason', entry.reason))
  if (entry.status === 'excluded') details.append(badge('Nicht ansehbar'))
  else if (entry.rating) details.append(badge(entry.rating))
  if (repeat) details.append(make('span', 'rating series', '❤️ Erneut ansehen'))
  if (entry.pool === 'marvel' && entry.status === 'watching') details.append(make('span', 'pill', 'Am schauen'))
  if (!['seen','excluded'].includes(entry.status)) {
    const service = entry.verifiedProvider ? `${entry.verifiedProvider} · DE` : entry.provider ? `${entry.provider} · Anbieter prüfen (DE)` : 'Anbieter prüfen (DE)'
    details.append(make('p', 'meta', [entry.type === 'serie' ? entry.extent || 'Staffeln noch zu prüfen' : 'Spielfilm', service].join(' · ')))
  }
  article.append(art, details)
  return article
}
function render() {
  const data = state.data
  if (!data) return
  const { titles, marvel, seasonal, favorites } = data
  const openCount = titles.filter(entry => entry.status === 'open').length
  $('open-count').textContent = openCount
  $('nav-count').textContent = openCount
  $('seen-count').textContent = titles.filter(entry => entry.status === 'seen').length
  $('watch-count').textContent = titles.filter(entry => entry.status === 'watching').length + Number(marvel?.status === 'watching')
  $('preferences').hidden = !data.user
  $('account').textContent = data.user ? 'Mein Konto' : 'Anmelden'
  $('extras-tab').hidden = !seasonal.length && !favorites.length && state.tab !== 'extras'
  const [heading, crumb, note] = headings[state.tab]
  $('heading').textContent = heading
  $('crumb').textContent = crumb
  $('section-note').textContent = state.tab === 'open' && openCount < 15
    ? `${openCount} von 15 Plätzen belegt. Merke weitere Titel, wenn der Vorrat aufgebraucht ist.` : note
  for (const nav of document.querySelectorAll('[data-tab]')) {
    nav.classList.toggle('nav-active', nav.dataset.tab === state.tab)
    if (nav.dataset.tab === state.tab) nav.setAttribute('aria-current', 'page')
    else nav.removeAttribute('aria-current')
  }
  for (const type of document.querySelectorAll('[data-type]')) {
    type.classList.toggle('selected', type.dataset.type === state.type)
    type.setAttribute('aria-pressed', String(type.dataset.type === state.type))
  }
  let shown
  if (state.tab === 'marvel') shown = marvel ? [marvel] : []
  else if (state.tab === 'extras') shown = [...seasonal, ...favorites]
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
  if (!$('modal').open) $('modal').showModal()
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
      state.data = await api('list')
      setTab('open')
      $('modal').close()
      toast('Du bist angemeldet.')
    } else $('form-status').textContent = result.message
  })]
  if (login) actions.push(button('Neues Konto erstellen', () => auth('register')), button('Bestätigungslink erneut senden', () => auth('resend')))
  else actions.push(button('Zur Anmeldung', () => auth()))
  dialog(title, fields, actions)
}
function account() {
  if (!state.data?.user) return auth()
  dialog('Mein Konto', [make('p', '', state.data.user.email)], [submit('Abmelden', async () => {
    await api('logout', {})
    state.data = await api('list')
    setTab('open')
    $('modal').close()
  })])
}
async function update(input) {
  state.data = await api('list', input)
  $('modal').close()
  render()
  toast(state.data.searchWarning || (state.data.promoted.length && input.action !== 'preferences'
    ? `Nachgerückt: ${state.data.promoted.join(', ')}` : 'Gespeichert.'))
}
function titleDialog(entry, repeat) {
  if (!state.data.user) return auth()
  const actions = []
  const fields = []
  if (repeat) {
    actions.push(submit('Vorschlag schließen', () => update({ id: entry.id, action: 'rewatch' })))
  } else if (entry.status === 'excluded') {
    fields.push(badge('Nicht ansehbar'))
  } else {
    const options = state.data.ratings.filter(rating => (rating !== 'Lieblingsserie' || entry.type === 'serie') &&
      (rating !== 'Lieblingsfilm' || entry.type === 'film'))
    const rating = field('Bewertung', 'rating', { values: [['', 'Ohne neue Bewertung'], ...options.map(value => [value, value])] })
    rating.querySelector('select').value = entry.rating || ''
    fields.push(rating)
    actions.push(submit(entry.status === 'seen' ? 'Bewertung speichern' : 'Als gesehen speichern', () =>
      update({ id: entry.id, action: 'seen', rating: textOf('rating') })))
    if (!['seen','watching'].includes(entry.status)) actions.push(submit('Am schauen', () => update({ id: entry.id, action: 'watching' }), 'button'))
    if (entry.pool === 'seasonal' && !entry.status) actions.push(submit('Auf die Merkliste', () => update({ id: entry.id, action: 'reserve' }), 'button'))
    if (entry.status !== 'seen') actions.push(button('Nicht ansehbar …', () => dialog(entry.title,
      [make('p', '', 'Diesen Titel dauerhaft ausschließen?')], [
        submit('Dauerhaft ausschließen', () => update({ id: entry.id, action: 'excluded' })),
        button('Zurück', () => titleDialog(entry, repeat)),
      ])))
  }
  dialog(entry.title, fields, actions)
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
function setTab(tab) {
  state.tab = tab
  state.type = 'all'
  $('genre').value = ''
  $('search').value = ''
  render()
}
$('account').addEventListener('click', account)
$('hero-action').addEventListener('click', () => addTitle())
$('log-title').addEventListener('click', () => addTitle(true))
$('preferences').addEventListener('click', preferences)
$('close').addEventListener('click', () => { if (!busy) $('modal').close() })
$('modal').addEventListener('cancel', event => { if (busy) event.preventDefault() })
$('modal-form').addEventListener('submit', event => {
  event.preventDefault()
  $('modal-actions').querySelector('.primary')?.click()
})
for (const nav of document.querySelectorAll('[data-tab]')) nav.addEventListener('click', () => setTab(nav.dataset.tab))
for (const type of document.querySelectorAll('[data-type]')) type.addEventListener('click', () => {
  state.type = type.dataset.type
  render()
})
$('genre').addEventListener('change', render)
$('search').addEventListener('input', render)
try {
  state.data = await api('list')
  for (const genre of state.data.genres) $('genre').add(new Option(genre))
  $('legend').append(...[...state.data.ratings, 'Nicht ansehbar'].map(badge))
  render()
  const verified = new URLSearchParams(location.search).get('verified')
  if (verified !== null) {
    history.replaceState(null, '', location.pathname)
    auth(verified === '1' ? 'login' : 'resend')
    $('form-status').textContent = verified === '1' ? 'E-Mail bestätigt. Du kannst dich jetzt anmelden.' : 'Der Link ist ungültig oder abgelaufen.'
  }
} catch {
  $('cards').replaceChildren(make('p', 'empty', 'Die Watchlist konnte nicht geladen werden. Lade die Seite erneut.'))
}
