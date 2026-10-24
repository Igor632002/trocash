# Architecture Diagram

troCASH is a Next.js web application prepared for Vercel hosting and Supabase-backed authentication and data. The diagrams show the integrations present in the code; the checked-in SQL currently defines only part of the schema used by the application.

## Application Architecture

<!-- mermaid-checked: no \n, no em-dash/en-dash, no {} in labels, subgraphs are id["label"], arrows are -->|"label"|, all subgraphs closed by end, ids unique -->
```mermaid
flowchart TD
    subgraph ClientLayer["Client Layer"]
        Browser["Web Browser"]
    end
    subgraph ApplicationLayer["Application Layer - Next.js 16"]
        Hosting["Vercel Hosting"]
        Middleware["Locale Middleware"]
        AppRouter["Next.js App Router"]
        ReactUI["React UI and client hooks"]
        ApiRoutes["Next.js API routes"]
    end
    subgraph SupabaseLayer["Data and Identity - Supabase"]
        SupabaseSDK["Supabase JavaScript SDK"]
        SupabaseAuth["Supabase Auth"]
        Postgres[("Supabase Postgres")]
        PhotoStorage[("Supabase Storage photos bucket")]
    end
    subgraph ExternalLayer["External Services"]
        Brevo["Brevo SMTP Relay"]
    end

    Browser -->|"HTTPS requests"| Hosting
    Hosting --> Middleware
    Middleware -->|"locale routing"| AppRouter
    AppRouter -->|"renders pages"| ReactUI
    AppRouter -->|"serves endpoints"| ApiRoutes
    ReactUI -->|"browser data access"| SupabaseSDK
    SupabaseSDK -->|"sign in and session"| SupabaseAuth
    SupabaseSDK -->|"queries and mutations"| Postgres
    SupabaseSDK -->|"photo upload and URLs"| PhotoStorage
    ReactUI -->|"offer actions and interest"| ApiRoutes
    ApiRoutes -->|"authorized data access"| Postgres
    ApiRoutes -->|"interest notification email"| Brevo
```

### Technology Stack Summary

| Layer | Technology | Version | Purpose |
|---|---|---|---|
| Web application | Next.js | 16.3.0 | App Router pages, locale middleware, and API routes |
| User interface | React | 19.2.8 | Interactive client and server-rendered UI |
| Application code | JavaScript and TypeScript | TypeScript 7.0.2 | Application modules and typed page/layout files |
| Data and identity | Supabase JavaScript SDK | ^2.112.2 | Auth, Postgres data access, and object storage |
| Email | Nodemailer | ^10.0.1 | Sends interest notifications through Brevo SMTP |
| Hosting | Vercel | Target in README | Intended deployment platform |

### Data Storage & External Services

Supabase provides authentication, Postgres data access, and a `photos` Storage bucket used for offer images. The checked-in `supabase/schema.sql` defines profiles, offers, wishes, exchange requests, and reports with row-level security policies. Application code also accesses `category`, `location`, `conversations`, and `messages`; their table definitions are not present in the checked-in SQL files. The interest API route sends email through Brevo's SMTP relay. No payment provider is wired into the current code.

### Key Architectural Decisions

- Client-side features use the Supabase JavaScript SDK directly; API routes handle selected server-side offer actions and email notifications.
- Locale selection is handled by Next.js middleware using hostname-to-path rewrites for Portuguese, English, and Ukrainian.
- Supabase row-level security is used for ownership and participant access to the core tables defined in the SQL schema.

## Component Relationships

<!-- mermaid-checked: no \n, no em-dash/en-dash, no {} in labels, subgraphs are id["label"], arrows are -->|"label"|, all subgraphs closed by end, ids unique -->
```mermaid
flowchart LR
    subgraph PresentationLayer["Presentation"]
        cAppPages["App Router pages"]
        cHomeLanding["HomeLanding and landing sections"]
        cExchangeUI["Exchange and offer UI"]
        cChatUI["Chat UI"]
        cAuthProfileUI["Authentication and profile UI"]
    end
    subgraph LogicLayer["Client Logic and Data Access"]
        cAuthHook["useAuth hook"]
        cOfferHooks["Offer and lookup hooks"]
        cOfferDAL["Offer and wish data access"]
        cChatDAL["Conversation data access"]
    end
    subgraph InfrastructureLayer["Application Infrastructure"]
        cLocaleMiddleware["Locale middleware"]
        cApiRoutes["Offer action API"]
        cInterestRoute["Interest email API"]
        cSupabaseClient["Supabase client"]
        cSupabaseBackend["Supabase Auth, Postgres, Storage"]
        cBrevoSMTP["Brevo SMTP"]
    end

    cAppPages -->|"selects page components"| cHomeLanding
    cAppPages -->|"renders feature pages"| cExchangeUI
    cAppPages -->|"renders feature pages"| cChatUI
    cAppPages -->|"renders account pages"| cAuthProfileUI
    cLocaleMiddleware -.->|"rewrites locale paths"| cAppPages
    cExchangeUI -->|"loads and creates offers"| cOfferHooks
    cAuthProfileUI -->|"checks session"| cAuthHook
    cAuthProfileUI -->|"loads profile offers"| cOfferHooks
    cOfferHooks -->|"uses data operations"| cOfferDAL
    cChatUI -->|"loads conversations"| cChatDAL
    cAuthHook -->|"reads auth session"| cSupabaseClient
    cOfferDAL -->|"queries and uploads"| cSupabaseClient
    cChatDAL -->|"reads and writes chat data"| cSupabaseClient
    cSupabaseClient -->|"auth, data, and storage"| cSupabaseBackend
    cExchangeUI -->|"calls offer actions"| cApiRoutes
    cExchangeUI -->|"requests interest email"| cInterestRoute
    cApiRoutes -->|"validates and updates offers"| cSupabaseBackend
    cInterestRoute -->|"fetches offer owner"| cSupabaseBackend
    cInterestRoute -->|"sends notification"| cBrevoSMTP
```

### Component Inventory

| Component | Layer | Type | Responsibility |
|---|---|---|---|
| App Router pages | Presentation | Next.js routes | Composes landing, exchange, offers, chat, auth, and profile pages |
| HomeLanding and landing sections | Presentation | React component | Composes the landing-page header, hero, catalog, sections, and footer |
| Exchange and offer UI | Presentation | React pages and client components | Browses offers, submits offers, and triggers offer actions |
| Chat UI | Presentation | React client component | Loads and displays conversations and messages |
| Authentication and profile UI | Presentation | React pages and client components | Handles sign-in state and profile views |
| Locale middleware | Infrastructure | Next.js middleware | Rewrites hostnames to locale paths |
| useAuth hook | Client Logic | React hook | Tracks Supabase auth state and mirrors a limited session summary into a cookie |
| Offer and lookup hooks | Client Logic | React hooks | Coordinates offer workflows and category/location lookups |
| Offer and wish data access | Data Access | Data access modules | Reads and writes offers and wishes; uploads offer photos through the storage module |
| Conversation data access | Data Access | Data access module | Finds or creates conversations and retrieves messages |
| Supabase client | Infrastructure | JavaScript SDK client | Connects browser-facing code to Supabase Auth, Postgres, and Storage |
| Offer action API | Infrastructure | Next.js API route | Authenticates offer owners and performs supported offer status changes |
| Interest email API | Infrastructure | Next.js API route | Looks up offer owner details and sends an interest notification |
| Supabase Auth, Postgres, Storage | Infrastructure | Managed backend services | Provides identity, relational data, and offer-photo storage |
| Brevo SMTP | External Service | SMTP relay | Delivers interest notification emails |
