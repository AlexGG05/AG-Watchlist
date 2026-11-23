# AG Watchlist

Private, deutschsprachige Film- und Serien-Watchlist mit separaten Konten, E-Mail-Bestätigung und persönlichen Genre-Interessen. Beim Registrieren kann die vorgegebene Watchlist inklusive Archiv, Bewertungen und Ausschlüssen in das eigene Konto übernommen werden. Ohne Import beginnt das Konto mit einem eigenen Archiv und einem Satz Startempfehlungen.

## Arcane

Bei einem Push auf `main` baut GitHub Actions das Image für AMD64 und ARM64 und veröffentlicht es in der GitHub Container Registry. Sobald der Workflow erfolgreich ist, erstelle in Arcane ein Projekt und füge [compose.yaml](compose.yaml) ein. Das Projekt zieht das fertige Image `ghcr.io/alexgg05/ag-watchlist:latest`. Bei einem privaten GHCR-Paket braucht Arcane Zugriff auf die Registry mit `read:packages`.

Hinterlege im Projekt diese Variablen:

| Variable | Beispiel / Bedeutung |
| --- | --- |
| `APP_URL` | `https://watchlist.example.org`; öffentliche Adresse hinter dem HTTPS-Reverse-Proxy |
| `SMTP_URL` | `smtps://benutzer:passwort@smtp.example.org:465`; Sonderzeichen in Benutzername und Passwort URL-kodieren |
| `MAIL_FROM` | Vom SMTP-Anbieter freigegebene Absenderadresse, z. B. `watchlist@example.org` |
| `TMDB_API_KEY` | TMDB-v3-API-Schlüssel für automatische Online-Vorschläge. In Arcane als Umgebungsvariable hinterlegen. |
| `WATCHLIST_PORT` | Optionaler Host-Port, Standard `3000`. Der Reverse-Proxy leitet HTTPS an diesen Port weiter. |
| `WATCHLIST_TAG` | Optionaler Image-Tag, Standard `latest`. Ein Commit-SHA erlaubt eine feste Version. |

Das benannte Volume `watchlist-data` enthält die SQLite-Datenbank mit Konten, Listen, Bewertungen und Sitzungen. Beim Aktualisieren dasselbe Volume beibehalten und für Backups die SQLite-Datenbank konsistent sichern. Ein Projekt mit einer App-Instanz betreiben.

## Anmeldung und Haushalte

Die Mediathek und die API für persönliche Listen setzen ein bestätigtes Konto voraus. In **Haushalt** kannst du einen Haushalt erstellen und weitere Personen per E-Mail einladen. Die Einladung erscheint sieben Tage lang im selben Bereich des eingeladenen Kontos und kann dort angenommen werden. Pro Konto ist ein Haushalt gleichzeitig möglich.

Ab zwei Mitgliedern zeigt **Gemeinsam schauen** Vorschläge aus den persönlichen Empfehlungen, Merklisten und dem lokalen Katalog. Die Rangfolge berücksichtigt die Genre-Interessen und den Seh- und Bewertungsverlauf aller Mitglieder. Gesehene, laufende und ausgeschlossene Titel werden bei allen Mitgliedern berücksichtigt und aus den gemeinsamen Vorschlägen entfernt. Persönliche Listen, Bewertungen und Staffelstände bleiben im jeweiligen Konto.

## Empfehlungen

- Genre-Interessen lassen sich jederzeit speichern. Bewertungen gesehener Titel mit Genre beeinflussen künftige Vorschläge ebenfalls. Das Speichern der Interessen aktualisiert automatisch entdeckte Empfehlungen, während gemerkte, laufende und bereits gesehene Titel erhalten bleiben. Unter **Titel merken** und **Gesehen eintragen** sucht TMDB nach Filmen und Serien. Die App übernimmt Titelart, Genres, Poster und Beschreibung direkt aus dem ausgewählten Treffer. Mehrere Filme und einzelne Serien-Staffeln können zusammen erfasst werden. Serien mit offenen Staffeln stehen unter **Am schauen**. Ein Klick auf das Bild öffnet die Beschreibung und bei Serien die Staffelverwaltung. Die manuelle Eingabe bleibt für Titel ohne Treffer oder ohne TMDB-Konfiguration verfügbar.
- Regulär werden bis zu 15 offene Titel geführt, mit mindestens einem Film, solange passende Filme verfügbar sind. Die Merkliste rückt zuerst nach. Danach sucht die App mit konfiguriertem TMDB-Schlüssel automatisch weitere Vorschläge. Der lokale Katalog stellt zusätzliche Vorschläge bereit, falls der Online-Dienst ausfällt oder keine passenden Treffer liefert. TMDB wird außerdem bei der Änderung der Genre-Interessen abgefragt.
- TMDB durchsucht Netflix, Disney+ und Prime Video für Deutschland. Bei bestätigten Treffern zeigt die App den gemeldeten Abo-Anbieter und bei Serien die laut TMDB bereits gestarteten Staffeln. Übernommene Anbieterhinweise erscheinen als „Anbieter prüfen“. Bloß weil ein Dienst genannt wird, kann sich die regionale Verfügbarkeit ändern.
- Marvel startet bei **The First Avenger: Captain America** und folgt einer mitgelieferten MCU-Chronologie. Zukünftige Einträge werden verborgen. Für eigene Filmreihen trägt man beim Merken den bereits erfassten vorherigen Film ein. Automatische TMDB-Empfehlungen überspringen Filmkollektionen, deren Handlungsreihenfolge unbekannt ist.
- Favoriten können nach ungefähr sechs Monaten separat vorgeschlagen werden. Weihnachtsfilme erscheinen im Dezember separat. Das Archiv behält die ursprüngliche Bewertung, bis der Kontoinhaber sie bearbeitet.
- Empfehlungen und Verfügbarkeitsdaten stammen teilweise von [TMDB](https://www.themoviedb.org/) und JustWatch. Dieses Projekt nutzt die TMDB-API und wird von TMDB weder unterstützt noch zertifiziert.

## Lokal starten

Node.js 24 verwenden.

```sh
npm ci
npm start
```

Die App startet auf Port `3000`. Für lokale Entwicklung ohne SMTP gibt der Server den Bestätigungslink in der Konsole aus. `DATA_DIR` kann optional ein separates Datenverzeichnis angeben. Setze bei einem anderen Port auch die passende `APP_URL`, falls die Links unter einer abweichenden Adresse geöffnet werden sollen. Eine lokale `.env` kann den TMDB-Schlüssel aufnehmen und wird von Git ignoriert.
