# Architecture

> Last updated: 2026-06-05

## Monorepo Layout (Turborepo)

```
tarot-ai/                            ← single repository (frontend + backend)
├── docs/                            ← these docs
├── apps/
│   ├── web/                         # Next.js (latest)
│   │   └── src/
│   │       ├── app/
│   │       │   └── [locale]/        # locale-segmented routes (en | ua)
│   │       ├── components/
│   │       │   ├── scene/           # React Three Fiber 3D scene
│   │       │   │   ├── TarotScene.tsx
│   │       │   │   ├── TarotCard.tsx        # 3D card mesh
│   │       │   │   ├── TableSurface.tsx
│   │       │   │   ├── ShuffleAnimation.tsx
│   │       │   │   └── DealAnimation.tsx
│   │       │   └── ui/              # fantasy input, buttons, AI answer panel
│   │       ├── i18n/                # locale config, request helpers
│   │       ├── messages/            # translation catalogs (en.json, ua.json)
│   │       └── lib/                 # api client, hooks, utils
│   └── api/                         # NestJS (latest)
│       └── src/
│           ├── modules/
│           │   ├── auth/            # Passport, Google strategy, JWT
│           │   ├── users/
│           │   ├── readings/        # create/get/list readings
│           │   ├── cards/           # read-only, GET only
│           │   └── ai/              # Claude integration, prompt building
│           └── prisma/
│               ├── schema.prisma
│               └── seed.ts          # seed 78 tarot cards once
├── packages/
│   └── types/                       # shared TS interfaces (Card, Reading, User, Locale)
├── turbo.json
└── package.json
```

## Localization (i18n)

Frontend-side. Supported locales from day one: **`en`** (default) and **`ua`**.
Built so adding a locale = one new catalog file + one enum entry.

- **Library:** `next-intl` (latest) — fits Next.js App Router, locale-segmented routes.
- **Routing:** `app/[locale]/...` — every page lives under a locale segment.
- **Catalogs:** `messages/en.json`, `messages/ua.json` — all UI strings, no hardcoded text.
- **Locale detection:** middleware picks from URL → cookie → `Accept-Language` → default `en`.
- **Switcher:** language toggle in header, persists choice in a cookie.
- **Fonts:** ensure chosen fantasy fonts include Cyrillic glyphs (for `ua`). Verify each
  font's charset before committing to it; pick a Cyrillic-capable fallback if not.

### Localization touching the AI
The reading's language is part of the request. Frontend sends the active `locale` with
`POST /readings`; the AI system prompt instructs Claude to answer in that language. So a
`ua` user gets a Ukrainian interpretation, `en` user gets English — same cards, localized
voice of the fortune teller.

### Tarot card data and locale
Card `name` / `description` / `meanings` are reference content. Options (see DECISIONS #6):
either store per-locale card text in the DB, or keep canonical English in DB and let the
AI translate card meaning into the user's locale at interpretation time. Leaning toward the
latter for MVP (less seed data to maintain), revisit if we ever show raw card text in UI.

## Data Model

### `cards` — immutable reference table (seeded once, never changes)
```
cards
├── id              int (1-78), PK
├── name            varchar          -- "The Fool", "Ace of Cups"
├── arcana          enum             -- major | minor
├── suit            enum nullable    -- wands | cups | swords | pentacles (null for major)
├── number          int              -- 0-21 major, 1-14 minor
├── description     text
├── upright_meaning text
├── reversed_meaning text
├── keywords        text[]
└── image_url       varchar
```

### `users`
```
users
├── id          uuid, PK
├── email       varchar unique
├── name        varchar
├── avatar_url  varchar
├── locale      varchar          -- last used locale (en | ua)
└── created_at  timestamp
```

### `accounts` — OAuth links, separate table for provider extensibility
```
accounts
├── id                  uuid, PK
├── user_id             uuid -> users.id
├── provider            enum     -- google | apple | email ...
├── provider_account_id varchar  -- id from the provider
└── created_at          timestamp
   UNIQUE(provider, provider_account_id)
```

### `readings`
```
readings
├── id           uuid, PK
├── user_id      uuid -> users.id (nullable — allow anonymous readings?)
├── question     text
├── spread_type  enum         -- three_card | single | celtic_cross
├── locale       varchar      -- language the reading was given in (en | ua)
├── ai_response  text
└── created_at   timestamp
```

### `reading_cards` — which card landed on which position
```
reading_cards
├── id            uuid, PK
├── reading_id    uuid -> readings.id
├── card_id       int  -> cards.id
├── position      int          -- 0,1,2...
├── position_name varchar      -- "past" | "present" | "future"
└── is_reversed   boolean
```

## 3D Scene Stack
- `@react-three/fiber` — React renderer for Three.js
- `@react-three/drei` — helpers (useTexture, cameras, controls)
- `@react-spring/three` — spring animations for shuffle / deal / flip
- Optional later: `@react-three/rapier` for physics-based shuffle

What gets rendered:
- **Table:** PlaneGeometry with dark cloth texture
- **Cards:** thin BoxGeometry — face texture (card art) + back texture (card back)
- **Camera:** top-down with slight tilt — feels like looking down at the table
- **Animations:** shuffle (scatter + reassemble) → deal (slide to positions) → flip

## Reading Flow
```
1. User opens site → sees fortune teller on mystical background + single fantasy input
2. User types question → submits
3. POST /readings { question, locale } (backend picks N random cards,
   assigns reversed flags, calls Claude with locale-aware prompt)
4. While waiting: 3D shuffle animation plays
5. Response arrives → deal animation → cards flip one by one
6a. GUEST → cards deal, but interpretation is hidden; a login/register modal
    (Radix Dialog) pops up. The spectacle is the hook; the answer is the gated reward.
    The in-progress reading is preserved so it reveals right after login.
6b. AUTHED → AI interpretation streams in (in user's locale) with reveal effect
7. Logged-in user can save; everyone can "ask another question"
```

## UI Primitives
Radix UI for accessible primitives (Dialog for the auth-gate modal, DropdownMenu for the
language switcher / user menu, etc.), styled to the fantasy theme via Tailwind. Radix gives
us focus trapping, keyboard nav, and a11y for free — important for the login modal.

## Auth Extensibility
Passport strategies are isolated. Adding Apple / GitHub / Email = new `Strategy` class +
a row in the `provider` enum, no changes to the rest of the auth flow. The `accounts`
table being separate from `users` means one user can link multiple providers later.
