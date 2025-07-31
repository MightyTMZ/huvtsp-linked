# HUVTSP Alumni Network Frontend

This is the frontend application for the HUVTSP Alumni Network, built with Next.js 15 and TypeScript.

## Features

### Filter Search
A comprehensive search and filter system for finding HUVTSP alumni based on various criteria:

- **Keyword Search**: Search by name, skills, location, or any keywords
- **Region Filter**: Filter by geographic regions (North America, Europe, Asia, etc.)
- **Session Filter**: Filter by HUVTSP session (S1, S2)
- **Pod Filter**: Filter by company pods (Google, Stripe, Zoom, etc.)
- **Internship Filter**: Filter by internship companies
- **Sorting**: Sort results by name, region, or session
- **Real-time Results**: Results update as you type or change filters
- **Responsive Design**: Works on desktop and mobile devices

## Getting Started

### Prerequisites
- Node.js 18+ 
- Django backend running on `http://127.0.0.1:8000`

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create a `.env.local` file in the frontend directory:
```bash
# Django Backend API URL
NEXT_PUBLIC_DJANGO_API_URL=http://127.0.0.1:8000
```

3. Start the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

### Filter Search Page
Navigate to `/filter-search` to access the alumni search interface:

1. **Search Bar**: Type keywords to search across all alumni data
2. **Filters Panel**: Click "Filters" to expand advanced filtering options
3. **Results**: View alumni cards with detailed information
4. **Clear Filters**: Use "Clear All Filters" to reset all search criteria

### API Endpoints

The frontend communicates with the Django backend through these endpoints:

- `GET /api/filter-search` - Main search endpoint with filtering
- `GET /api/search` - Intelligent search with natural language processing

## Components

### AlumniCard
A reusable component that displays individual alumni information including:
- Name and contact information
- Location and region
- Pod and session details
- Skills and additional information
- Relevance score (when available)

### LoadingSpinner
A reusable loading component with customizable size and text.

## Development

### Project Structure
```
frontend/
├── app/
│   ├── api/           # API routes
│   ├── components/    # Reusable components
│   ├── filter-search/ # Filter search page
│   └── globals.css    # Global styles
├── public/            # Static assets
└── package.json       # Dependencies
```

### Key Technologies
- **Next.js 15**: React framework with App Router
- **TypeScript**: Type-safe JavaScript
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Icon library
- **Django REST Framework**: Backend API

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `NEXT_PUBLIC_DJANGO_API_URL` | Django backend API URL | `http://127.0.0.1:8000` |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is part of the HUVTSP Alumni Network.
