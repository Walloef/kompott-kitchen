# Contentful + Next.js Cache Revalidation Testing

This guide explains how to locally test our Next.js App Router cache revalidation using Contentful webhooks and ngrok.

Because Next.js heavily caches GraphQL fetches in production mode, we use an API route (`/api/revalidate`) to listen for Contentful publish events and clear the cache instantly.

## Prerequisites

- A free [ngrok](https://ngrok.com/) account and your auth token.
- A Next.js project with the `/api/revalidate/route.ts` endpoint configured.
- Admin access to your Contentful Space.

## ⚙️ Environment Setup

Make sure your `.env.local` (and production environment) includes your secret token. This prevents unauthorized requests from purging your cache.

```env
CONTENTFUL_REVALIDATE_SECRET=your-super-secret-token-123
```

## 🚀 Step-by-Step Local Testing Guide

### 1. Authenticate ngrok (First time only)

If you haven't linked ngrok to your account on your current machine, run this in your terminal:

```bash
npx ngrok config add-authtoken <YOUR_NGROK_TOKEN>
```

### 2. Run Next.js in Production Mode

Next.js handles caching differently in development (`npm run dev`). To test actual cache invalidation, you must build and run the production server locally:

```bash
npm run build
npm run start
```

_Your app is now running at `http://localhost:3000` with full caching enabled._

### 3. Start the ngrok Tunnel

Open a **new terminal window** (leave the Next.js server running) and start ngrok:

```bash
npx ngrok http 3000
```

- **Forwarding URL:** Copy the secure `https://...ngrok-free.app` URL from the terminal.
- **Local Inspector:** Open `http://localhost:4040` in your browser. This dashboard will show you all incoming webhook traffic.

### 4. Configure the Contentful Webhook

1. In Contentful, navigate to **Settings > Webhooks**.
2. Click **Add Webhook** (or edit your existing local testing webhook).
3. Set the **URL** to: `POST` `https://<YOUR_NGROK_URL>/api/revalidate`
4. Set the **Triggers** to **Specific triggering events** -> check **Publish** and **Unpublish** for Entries.
5. Add a hidden **Custom Header**:
   - **Key:** `x-contentful-webhook-secret`
   - **Value:** `your-super-secret-token-123` _(Must match your `.env.local`)_
6. Save the webhook.

### 5. Verify the Revalidation

1. Load your local site (`http://localhost:3000`) in your browser to cache the current content.
2. Go to Contentful, edit an entry, and hit **Publish**.
3. Check your ngrok inspector (`http://localhost:4040`). You should see a `POST /api/revalidate` request with a `200 OK` status.
4. Refresh your local site. The new content should appear instantly!
