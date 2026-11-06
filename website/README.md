# 🏐 Just Volleyball Polska — strona ligi

Strona Next.js połączona z botem Discord. Pokazuje dane z jednej ligi
(Just Volleyball Polska — gildia Discord ID `1567132715550249020`).

## Strony

| URL | Co tam jest |
|---|---|
| `/` | Strona główna — banner, statystyki, tabela, podium, terminarz, wyniki, drużyny |
| `/druzyny` | Lista wszystkich drużyn z kartami |
| `/druzyny/[id]` | Karta jednej drużyny — statystyki, ostatnie i nadchodzące mecze |
| `/terminarz` | Wszystkie nadchodzące mecze, pogrupowane po dniach |
| `/wyniki` | Wszystkie zakończone mecze, pogrupowane po dniach |

## Zmienne środowiskowe (Vercel)

| Name | Value |
|---|---|
| `NEXT_PUBLIC_API_URL` | `http://fi14.bot-hosting.cloud:26226` |
| `NEXT_PUBLIC_API_TOKEN` | Twój token API |
| `NEXT_PUBLIC_GUILD_ID` | `1567132715550249020` (Just Volleyball Polska) |

## Jak zmienić ligę?

Jeśli kiedykolwiek będziesz chciał zmienić ligę na inny serwer Discord:

1. Wpisz `/lista_serwerow` na Discordzie (jako właściciel bota)
2. Skopiuj ID innej gildii
3. W Vercel: Settings → Environment Variables → zmień `NEXT_PUBLIC_GUILD_ID`
4. Redeploy

## Zmiana domeny

Patrz sekcja "Jak podpiąć własną domenę" w `DEPLOYMENT.md`.

## Zmiana logo / bannera

Pliki w folderze `public/`:
- `logo.jpg` — logo małe (nagłówek, hero, footer) — 400×400, max ~50 KB
- `hero.jpg` — duży banner tła hero — 1600×1600, max ~200 KB

Po podmianie pliku: `git push` → Vercel auto-redeploy.
