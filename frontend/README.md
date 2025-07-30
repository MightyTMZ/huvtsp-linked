# HUVTSP Alumni Network - Frontend

A modern, semantic search interface for the HUVTSP alumni network built with Next.js, TypeScript, and Tailwind CSS.

## Features

- **Semantic Search**: Natural language queries to find alumni, organizations, and projects
- **Smart Filtering**: Filter by region, session, pod, and more
- **Beautiful UI**: Modern, responsive design with dark mode support
- **Real-time Results**: Instant search results with loading states
- **Example Queries**: Pre-built example queries for inspiration

## Example Queries

The app is designed to handle queries like:

- "do you know any people who are really good with graphic design?"
- "I've been thinking about a startup idea and want to see if anyone here might be interested in joining!"
- "Anyone in Boston rn?"
- "Does anyone know of a software engineer familiar with mobile apps for a startup?"
- "Who would likely be interested in a marketing gig for a startup?"
- "who is interning at Rove?"
- "Is anyone in FinTech Nexus?"

## Getting Started

1. Install dependencies:
   ```bash
   npm install
   ```

2. Install Lucide React icons:
   ```bash
   npm install lucide-react
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Backend Integration

The frontend is designed to work with the Django backend API. The main endpoints are:

- `GET /api/search?q={query}` - Search for members, organizations, and projects
- `GET /api/stats/overview/` - Get network statistics
- `GET /api/django/members/` - Get all members (proxied to Django)
- `GET /api/django/organizations/` - Get all organizations (proxied to Django)
- `GET /api/django/projects/` - Get all projects (proxied to Django)

## Architecture

- **Next.js 15** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **Lucide React** for icons
- **API Routes** for backend communication

## Components

- **Search Interface**: Main search bar with filters
- **Results Display**: Cards showing members, organizations, and projects
- **Stats Header**: Network statistics in the header
- **Example Queries**: Clickable example queries for inspiration

## Development

The app uses mock data for demonstration. To connect to the real Django backend:

1. Ensure your Django backend is running on `http://localhost:8000`
2. Update the API calls in `app/page.tsx` to use the Django endpoints
3. The proxy configuration in `next.config.ts` will handle the routing

## Deployment

The app can be deployed to Vercel, Netlify, or any other Next.js-compatible platform.

```bash
npm run build
npm start
```
