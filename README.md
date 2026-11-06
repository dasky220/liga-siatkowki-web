# 🏐 Liga Siatkówki — strona WWW

Strona Next.js łącząca się z botem Discord przez REST API (`bot_api.py`).
Wyświetla tabele ligowe, terminarze, drużyny i wyniki wszystkich serwerów
obsługiwanych przez bota — każda gildia = osobna liga.

Pełna instrukcja konfiguracji w pliku `../DEPLOYMENT.md`.

## Szybki start (lokalnie)

```bash
cp .env.example .env.local
# Uzupełnij NEXT_PUBLIC_API_URL i NEXT_PUBLIC_API_TOKEN w .env.local
npm install
npm run dev
```

Strona: http://localhost:3000

## Struktura

```
website/
├── app/
│   ├── layout.tsx          # Główny layout (header, footer)
│   ├── page.tsx            # Homepage: lista lig (gildii)
│   ├── globals.css         # Style Tailwind + globalne
│   └── league/[guildId]/
│       ├── page.tsx        # Strona ligi: tabela + terminarz + drużyny + wyniki
│       └── team/[teamId]/
│           └── page.tsx    # Karta drużyny: ostatnie + nadchodzące mecze
├── lib/
│   └── api.ts              # Klient API (fetch + typy + helpery)
├── next.config.js
├── tailwind.config.js      # Paleta ciemna + akcent pomarańczowy
├── tsconfig.json
└── package.json
```

## Architektura

```
Discord Bot (bot.py)  ←─  SQLite per gildia  ─→  bot_api.py (REST API)
                                                          ↑
                                                  Cloudflare Tunnel (darmowy)
                                                          ↑
                                                  Vercel (Next.js strona)
                                                          ↑
                                                       Użytkownik
```

- Bot pisze do SQLite zwykłymi transakcjami.
- `bot_api.py` czyta bazy w trybie **read-only** (`?mode=ro&immutable=1`), więc
  NIE blokuje bota.
- Next.js korzysta z ISR (odświeżanie co 30 s), więc na Vercelu nie ma dodatkowych opłat.
- Strona jest publiczna (token API jest read-only, można go ujawnić w przeglądarce).
