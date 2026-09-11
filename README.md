# Neighborhood Signal

Neighborhood conversation intelligence for home-service contractors.

The MVP detects service-buying intent from neighborhood conversations, scores each lead, matches the conversation to a territory, identifies legitimate past customers in the same area, drafts a business response, and prepares compliant customer-outreach workflows.

## MVP capabilities

- Responsive lead-intelligence dashboard
- 0–100 intent score and urgency classification
- Recommendation-request detection
- Service + neighborhood classification
- Past-customer matching concept
- Territory and keyword configuration views
- Connector-neutral `POST /api/ingest` endpoint
- Nextdoor/Facebook connector placeholders without brittle scraping
- Supabase-ready production schema with RLS enabled
- Seeded Jacksonville / Nocatee / Ponte Vedra / Yulee demo data

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Ingestion contract

```bash
curl -X POST http://localhost:3000/api/ingest \
  -H 'Content-Type: application/json' \
  -d '{
    "source": "nextdoor",
    "externalId": "post_123",
    "text": "Can anyone recommend someone to seal our pavers in Nocatee?",
    "neighborhood": "Nocatee",
    "city": "Ponte Vedra"
  }'
```

If `INGEST_API_KEY` is configured, include `Authorization: Bearer <key>`.

## Persistence

The first pass uses an in-memory lead store so the app can run with zero credentials. `supabase/schema.sql` contains the production data model. The next infrastructure step is to select/create a Supabase project, apply the schema, add tenant auth/RLS policies, and replace the in-memory repository with Supabase.

## Trust rule

Neighborhood Signal does not fabricate neighbor endorsements. Customer recommendation outreach is intended only for genuine past customers who may voluntarily share their real experience.
