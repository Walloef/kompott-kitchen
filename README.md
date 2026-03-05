# Kompott Kitchen

---

## Getting Started

### Prerequisites

Make sure you have a `.env.local` file at the root of your project with your Contentful credentials:

```env
CONTENTFUL_SPACE_ID=your_space_id
CONTENTFUL_ACCESS_TOKEN=your_delivery_token
CONTENTFUL_PREVIEW_ACCESS_TOKEN=your_preview_token
# (Optional) A secret token for securing your Draft Mode API route
CONTENTFUL_PREVIEW_SECRET=your_super_secret_string
```

### Run Locally

1. Fetch the latest Contentful schema and generate TypeScript types:

```bash
npm run codegen
```

2. Start the Next.js development server:

```bash
npm run dev
```

---

### Draft Mode (Content Preview)

This project uses Next.js Draft Mode to allow content editors to view unpublished drafts directly from Contentful securely.

When Draft Mode is enabled, Next.js bypasses the cache and fetches data using the `CONTENTFUL_PREVIEW_ACCESS_TOKEN`.

- **To Enable:** Navigate to your preview API route in the browser (e.g., `http://localhost:3000/api/draft?secret=your_super_secret_string&slug=/`). This sets a temporary cookie in your browser.
- **To Disable:** Close the browser session, or navigate to your disable API route (e.g., `http://localhost:3000/api/disable-draft`).

### Cache Revalidation (Local Testing)

Next.js aggressively caches Contentful data. To test on-demand cache revalidation locally when you publish content, you can use Contentful Webhooks and `ngrok`.

1. Build and start the production server locally:

```bash
npm run build && npm run start
```

2. In a new terminal tab, expose your local port using ngrok:

```bash
ngrok http 3000
```

3. Copy the secure forwarding URL that ngrok generates (e.g., `https://1234-abcd.ngrok-free.app`).
4. In your Contentful dashboard, go to **Settings > Webhooks**.
5. Navigate to `http://localhost:4040` to see trafick passed through the tunnel
6. Temporarily update your webhook URL to match today's fresh ngrok URL (e.g., `https://1234-abcd.ngrok-free.app/api/revalidate`).
7. Navigate to http://localhost:4040 in your browser to access the ngrok dashboard. Here you can monitor all traffic and JSON payloads passing through the tunnel.
8. Publish a post in Contentful. You should see the webhook hit your local terminal and clear the Next.js cache!
