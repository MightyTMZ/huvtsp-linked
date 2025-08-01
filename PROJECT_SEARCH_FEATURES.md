# Project Search Features

This document describes the new project search functionality added to the HUVTSP Alumni Network frontend.

## Overview

The project search functionality allows users to find and filter through HUVTSP alumni projects, enabling collaboration opportunities and discovery of exciting ventures.

## New Pages

### 1. Project Filter Search (`/project-filter-search`)

A dedicated page for filtering and browsing projects with the following features:

- **Search by keywords**: Search through project titles, descriptions, and content
- **Filter by project type**: Startup or Non-Profit
- **Filter by project stage**: Just an idea, Research/MVP/Early Development, or Launched Venture
- **Sort options**: By title, type, stage, or creation date
- **Project cards**: Display project information including founders, looking for requirements, and links

### 2. Project Smart Search (`/project-smart-search`)

A natural language search interface for projects with:

- **Natural language queries**: Ask questions like "Find projects looking for developers with React experience"
- **Example queries**: Pre-built examples to help users get started
- **Intelligent matching**: Uses semantic search to find relevant projects
- **Relevance scoring**: Results are ranked by relevance to the query

### 3. Project Detail Page (`/project/[slug]`)

Detailed view of individual projects showing:

- **Project information**: Title, type, stage, description
- **Founder details**: Contact information and skills
- **Project links**: External links and resources
- **Contact options**: Direct email links to founders

## API Endpoints

### Frontend API Routes

1. **`/api/project-filter-search`**: Handles project filter search requests
   - Parameters: `search`, `type`, `stage`, `ordering`
   - Returns: Filtered project results

2. **`/api/project-search`**: Handles project smart search requests
   - Parameters: `q` (query), `intent`, `projectType`, `projectStage`
   - Returns: Semantically matched project results

3. **`/api/project/[slug]`**: Fetches individual project details
   - Returns: Complete project information with founders and links

### Backend Django API

The Django backend provides the following endpoints for projects:

- **`/api/projects/`**: List and filter projects
- **`/api/projects/{slug}/`**: Get individual project by slug
- **`/api/search/search/`**: Intelligent search across all models (including projects)

## Features

### Project Filtering

- **Type filtering**: Filter by Startup or Non-Profit projects
- **Stage filtering**: Filter by project development stage
- **Keyword search**: Search through project content
- **Sorting**: Multiple sort options for results

### Smart Search

- **Natural language processing**: Understands queries like "projects needing marketing help"
- **Intent recognition**: Identifies whether user is looking for specific skills, project types, or stages
- **Relevance scoring**: Results ranked by match quality
- **Fallback data**: Mock data for demonstration purposes

### Project Display

- **Rich project cards**: Show key information at a glance
- **Founder information**: Display founder details and contact info
- **Project links**: External resources and platforms
- **Contact integration**: Direct email links to founders

## Integration

### Main Page Updates

The main page (`/`) has been updated to include:

- **New feature cards**: Project Smart Search and Project Filter Search
- **Updated statistics**: Added project count to network overview
- **Enhanced call-to-action**: Separate buttons for finding alumni and projects

### Navigation

- **Direct links**: Easy access to project search from main page
- **Consistent design**: Matches existing search page styling
- **Responsive layout**: Works on all device sizes

## Technical Implementation

### Frontend

- **Next.js pages**: React components with TypeScript
- **API routes**: Next.js API routes for backend communication
- **Tailwind CSS**: Consistent styling with existing design
- **Lucide icons**: Modern icon set for UI elements

### Backend Integration

- **Django REST Framework**: Existing API structure
- **Slug-based routing**: Projects accessible via slug URLs
- **Intelligent search**: Leverages existing search infrastructure
- **Filtering**: Uses Django filters for efficient queries

## Usage Examples

### Filter Search
1. Navigate to `/project-filter-search`
2. Use filters to narrow down projects by type and stage
3. Search for specific keywords in project content
4. Click on project cards to view details

### Smart Search
1. Navigate to `/project-smart-search`
2. Enter natural language queries like:
   - "Find projects looking for developers"
   - "Startups needing marketing help"
   - "Projects in MVP stage"
3. Review results and contact founders

### Project Details
1. Click on any project card or link
2. View comprehensive project information
3. Contact founders directly via email
4. Access project links and resources

## Future Enhancements

Potential improvements for the project search functionality:

1. **Advanced filtering**: More granular filter options
2. **Saved searches**: Allow users to save search criteria
3. **Project recommendations**: Suggest relevant projects based on user profile
4. **Collaboration requests**: Direct project collaboration requests
5. **Project updates**: Allow founders to update project status
6. **Analytics**: Track project search and interaction metrics 