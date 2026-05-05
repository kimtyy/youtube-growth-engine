# YouTube Growth Engine

A simple web app to analyze YouTube videos and generate optimized content for growth.

## Features

- Input a YouTube video URL
- Analyze video title and content
- Generate:
  - 3 high-CTR titles (emotional, curiosity, search styles)
  - 3 thumbnail text ideas
  - Optimized SEO description
  - Relevant hashtags
  - Short hook script for video opening

Each suggestion includes an explanation of why it works, focusing on increasing Click-Through Rate (CTR) and viewer retention.

## Tech Stack

- Next.js 16
- TypeScript
- Tailwind CSS
- App Router

## Getting Started

First, install dependencies:

```bash
npm install
```

Then, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Environment Variables

Create a `.env.local` file at the project root and add your YouTube Data API key:

```env
YOUTUBE_API_KEY=your_api_key_here
```

The app uses this key to fetch video view count, publish date, category, and duration from the YouTube Data API.

## Usage

1. Enter a YouTube video URL in the input field
2. Click "Generate" to analyze and get suggestions
3. Review the generated titles, thumbnails, description, hashtags, and hook script
4. Use the copy buttons to copy suggestions to your clipboard

## Build

To build the project for production:

```bash
npm run build
```

## Deploy

Deploy on Vercel or any platform supporting Next.js.
