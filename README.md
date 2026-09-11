# Neighborhood Signal

Neighborhood conversation intelligence for home-service contractors.

The MVP detects service-buying intent from neighborhood conversations, scores each lead, matches the conversation to a territory, identifies legitimate past customers in the same area, drafts a business response, and prepares compliant customer-outreach workflows.

## MVP capabilities

- Responsive lead-intelligence dashboard
- 0–100 intent score and urgency classification
- Recommendation-request detection
- Service + neighborhood classification
- Live lead feed backed by Supabase when server credentials are configured
- Past-customer matching concept
- Territory and keyword configuration views
- Connector-neutral `POST /api/ingest` endpoint
- Protected production ingestion with `INGEST_API_KEY`
- Database health endpoint at `GET /api/health`
- Nextdoor/Facebook connector boundaries without brittle scraping
- Production Supabase schema with RLS, indexes, default-deny browser access, and audit events
- Seeded Jacksonville / Nocatee / Ponte Vedra / Yulee configuration data

## Production database

Supabase project: `eynkqsxxwudsbskewahj` (`us-east-1`).

The repository schema is in `supabase/schema.sql`. Browser roles currently have no direct access to the business tables. Server-side calls use `SUPABASE_SECRET_KEY` and the `service_role` database role. Authenticated tenant policies will be added when the multi-user dashboard is introduced.

Required production variables:

```bash
SUPABASE_URL=https://eynkqsxxwudsbskewahj.supabase.co
SUPABASE_SECRET_KEY=sb_secret_...
INGEST_API_KEY=<strong-random-secret>
NEIGHBORHOOD_SIGNAL_ORG_NAME=HydroSeal Demo
```

Never expose `SUPABASE_SECRET_KEY` in a `NEXT_PUBLIC_` variable or commit it to Git.

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

Without a Supabase secret key the UI falls back to seeded demo leads. On Vercel, ingestion is intentionally disabled until both the database secret and `INGEST_API_KEY` are configured.

## Ingestion contract

```bash
curl -X POST http://localhost:3000/api/ingest \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer <INGEST_API_KEY>' \
  -d '{
    "source": "nextdoor",
    "externalId": "post_123",
    "text": "Can anyone recommend someone to seal our pavers in Nocatee?",
    "neighborhood": "Nocatee",
    "city": "Ponte Vedra"
  }'
```

A successful production request classifies the conversation, persists the lead, writes an audit event, and returns the stored record.

## Health check

```bash
curl http://localhost:3000/api/health
```

The response reports only whether persistence is configured and reachable. It never returns keys or connection strings.

## Trust rule

Neighborhood Signal does not fabricate neighbor endorsements. Customer recommendation outreach is intended only for genuine past customers who may voluntarily share their real experience.
