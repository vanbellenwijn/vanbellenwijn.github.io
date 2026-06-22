# Van Bellen Wijn, staging-rebuild

Vernieuwde, statische versie van [vanbellenwijn.nl](https://vanbellenwijn.nl), gebouwd als voorbeeld/staging.
Geen WordPress, geen database: pure HTML/CSS/JS. Snel, mobielvriendelijk en eenvoudig te hosten.

> Let op: dit is een **voorbeeldversie**, geen productiesite. Alle pagina's staan op `noindex` en `robots.txt` blokkeert zoekmachines.

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

## Hosten op GitHub Pages
1. Push deze map (`site/`) naar een GitHub-repository.
2. **Settings, Pages, Source:** branch `main`, map `/ (root)` of `/docs`, afhankelijk van waar je dit plaatst.
3. De site komt online op `https://<gebruiker>.github.io/<repo>/`.

`.nojekyll` staat erin zodat GitHub Pages de bestanden ongericht serveert.

## Aandachtspunten voor productie
- Het **contactformulier** is nu een demo (geen backend). Koppelen kan via bijvoorbeeld Formspree of een kleine Azure Function.
- **Echte webverkoop** (wijn online bestellen) vereist een betaaloplossing (Snipcart/Shopify) of een backend. Een statische site toont alleen de etalage.
- Teksten en foto's eventueel laten aanvullen door Van Bellen Wijn.

## Toestemming
Inhoud en merk zijn eigendom van Van Bellen Wijn. Alleen gebruiken met toestemming van de eigenaar. Houd de staging-versie afgeschermd (niet publiek delen, niet indexeren) tot akkoord.
