# Van Bellen Wijn, staging-rebuild

Vernieuwde, statische versie van [vanbellenwijn.nl](https://vanbellenwijn.nl), gebouwd als voorbeeld/staging.
Geen WordPress, geen database: pure HTML/CSS/JS. Snel, mobielvriendelijk en eenvoudig te hosten.

**Live (staging):** https://vanbellenwijn.github.io/

> Let op: dit is een **voorbeeldversie**, geen productiesite. Alle pagina's staan op `noindex` en `robots.txt` blokkeert zoekmachines. De URL is openbaar bereikbaar, maar niet vindbaar via Google.

## Inhoud
| Pagina | Bestand |
|---|---|
| Home | `index.html` |
| Over ons | `over-ons.html` |
| Proeverijen & Cursussen | `proeverijen-cursussen.html` |
| Wijnadvies & Italiaanse wijnen | `wijnadvies.html` |
| Relatiegeschenken | `relatiegeschenken.html` |
| Contact | `contact.html` |

Assets staan in `assets/` (css, js, img). Afbeeldingen en teksten komen van de bestaande site (eigendom van Van Bellen Wijn).

## Lokaal bekijken
Open `index.html` in de browser, of start een lokale server:
```
python -m http.server 8000
```

## Hosting & deployen
De site staat live op **GitHub Pages**.

- **Repository:** `vanbellenwijn/vanbellenwijn.github.io` (organisatie `vanbellenwijn`, openbaar)
- **Pages-bron:** branch `main`, map `/` (root)
- **URL:** https://vanbellenwijn.github.io/ (root, geen subpad, geen custom domain)

Wijzigen en publiceren gaat via een gewone push naar `main`:
```
git add -A
git commit -m "Wijziging X"
git push
```
GitHub Pages bouwt automatisch opnieuw; binnen ~1 minuut staat de wijziging live.

`.nojekyll` staat in de repo zodat GitHub Pages de bestanden ongericht serveert.

## Aandachtspunten voor productie
- Het **contactformulier** is nu een demo (geen backend). Koppelen kan via bijvoorbeeld Formspree of een kleine Azure Function.
- **Echte webverkoop** (wijn online bestellen) vereist een betaaloplossing (Snipcart/Shopify) of een backend. Een statische site toont alleen de etalage.
- Teksten en foto's eventueel laten aanvullen door Van Bellen Wijn.

## Toestemming
Inhoud en merk zijn eigendom van Van Bellen Wijn. Alleen gebruiken met toestemming van de eigenaar. Houd de staging-versie afgeschermd (niet breed delen, niet indexeren) tot er akkoord is.
