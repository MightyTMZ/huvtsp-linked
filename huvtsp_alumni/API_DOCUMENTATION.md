# HUVTSP Alumni Network API Documentation

## Overview
This API provides comprehensive access to the HUVTSP Alumni Network data, including members, organizations, experiences, projects, and resources.

## Base URL
```
http://localhost:8000/api/
```

## Authentication
The API supports session authentication and basic authentication. Most endpoints are read-only for anonymous users, but authenticated users can perform full CRUD operations.

## Endpoints

### 1. Network Members

#### List Members
```
GET /api/members/
```

**Query Parameters:**
- `region`: Filter by region (NA, SA, EU, AS, AF, OC, AN)
- `session`: Filter by session
- `pod`: Filter by pod
- `internship`: Filter by internship
- `search`: Search in first_name, last_name, email, skills, location
- `ordering`: Order by first_name, last_name, region, session
- `page`: Page number for pagination

**Example:**
```
GET /api/members/?region=NA&search=john&ordering=first_name
```

#### Get Member Details
```
GET /api/members/{id}/
```

#### Get Members by Region
```
GET /api/members/by_region/
```

#### Get Members by Session
```
GET /api/members/by_session/
```

#### Get Member Experiences
```
GET /api/members/{id}/experiences/
```

#### Get Member Social Links
```
GET /api/members/{id}/social_links/
```

### 2. Organizations

#### List Organizations
```
GET /api/organizations/
```

**Query Parameters:**
- `type`: Filter by organization type
- `search`: Search in name, description
- `ordering`: Order by name, type

#### Get Organization Details
```
GET /api/organizations/{id}/
```

#### Get Organizations by Type
```
GET /api/organizations/by_type/
```

#### Get Organization Members
```
GET /api/organizations/{id}/members/
```

### 3. Experiences

#### List Experiences
```
GET /api/experiences/
```

**Query Parameters:**
- `experience_type`: Filter by experience type
- `is_current`: Filter current experiences (true/false)
- `organization`: Filter by organization ID
- `network_member`: Filter by member ID
- `search`: Search in title, description, member names, organization names
- `ordering`: Order by start_date, end_date, title

#### Get Current Experiences
```
GET /api/experiences/current/
```

#### Get Experiences by Type
```
GET /api/experiences/by_type/
```

### 4. Social Links

#### List Social Links
```
GET /api/social_links/
```

**Query Parameters:**
- `platform`: Filter by platform
- `network_member`: Filter by member ID
- `search`: Search in title, description, member names
- `ordering`: Order by title, platform

#### Get Social Links by Platform
```
GET /api/social_links/by_platform/
```

### 5. Projects

#### List Projects
```
GET /api/projects/
```

**Query Parameters:**
- `type`: Filter by project type (ST, NP)
- `stage`: Filter by project stage (J, MVP, L)
- `search`: Search in title, what_are_they_looking_for, additional_info
- `ordering`: Order by title, type, stage

#### Get Project Details
```
GET /api/projects/{id}/
```

#### Get Projects by Type
```
GET /api/projects/by_type/
```

#### Get Projects by Stage
```
GET /api/projects/by_stage/
```

#### Get Project Founders
```
GET /api/projects/{id}/founders/
```

#### Get Project Links
```
GET /api/projects/{id}/links/
```

### 6. Project Links

#### List Project Links
```
GET /api/project_links/
```

**Query Parameters:**
- `platform`: Filter by platform
- `project`: Filter by project ID
- `search`: Search in title, project title
- `ordering`: Order by title, platform

#### Get Project Links by Platform
```
GET /api/project_links/by_platform/
```

### 7. Resources

#### List Resources
```
GET /api/resources/
```

**Query Parameters:**
- `platform`: Filter by platform
- `search`: Search in title, description
- `ordering`: Order by title, platform

#### Get Resources by Platform
```
GET /api/resources/by_platform/
```

### 8. Statistics and Analytics

#### Network Overview
```
GET /api/stats/overview/
```

Returns:
```json
{
    "total_members": 150,
    "total_organizations": 45,
    "total_projects": 25,
    "total_experiences": 300,
    "total_resources": 15,
    "members_by_region": [...],
    "organizations_by_type": [...],
    "projects_by_stage": [...]
}
```

#### Global Search
```
GET /api/stats/search/?q=search_term
```

Returns search results across members, organizations, and projects.

## Data Models

### NetworkMember
```json
{
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "region": "NA",
    "region_display": "North America",
    "location": "New York, USA",
    "session": "Spring 2023",
    "pod": "FinTech",
    "internship": "Google",
    "email": "john.doe@example.com",
    "skills": "Python, Django, React",
    "additional_info": "Passionate about fintech...",
    "avatar": "avatars/john_doe.jpg",
    "slug": "john-doe",
    "experiences": [...],
    "social_links": [...]
}
```

### Organization
```json
{
    "id": 1,
    "name": "Google",
    "slug": "google",
    "type": "CO",
    "type_display": "Company",
    "description": "Technology company...",
    "website": "https://google.com",
    "affiliated_people_count": 5
}
```

### Experience
```json
{
    "id": 1,
    "organization": 1,
    "organization_name": "Google",
    "organization_type": "CO",
    "title": "Software Engineer",
    "experience_type": "EM",
    "start_date": "2023-06-01",
    "end_date": null,
    "is_current": true,
    "description": "Working on Google Cloud..."
}
```

### Project
```json
{
    "id": 1,
    "title": "FinTech Startup",
    "logo": "logo/fintech_startup.jpg",
    "type": "ST",
    "type_display": "Startup",
    "stage": "MVP",
    "stage_display": "Research/MVP/Early Development",
    "founders": [...],
    "founders_count": 3,
    "what_are_they_looking_for": "Technical co-founder...",
    "additional_info": "Building the future of finance...",
    "slug": "fintech-startup",
    "project_links": [...]
}
```

## Error Responses

### 400 Bad Request
```json
{
    "error": "Query parameter 'q' is required"
}
```

### 404 Not Found
```json
{
    "detail": "Not found."
}
```

### 401 Unauthorized
```json
{
    "detail": "Authentication credentials were not provided."
}
```

## Pagination

All list endpoints support pagination with the following response format:

```json
{
    "count": 150,
    "next": "http://localhost:8000/api/members/?page=2",
    "previous": null,
    "results": [...]
}
```

## Filtering Examples

### Filter members by region and search
```
GET /api/members/?region=NA&search=python
```

### Get current experiences
```
GET /api/experiences/?is_current=true
```

### Get projects by stage
```
GET /api/projects/?stage=MVP
```

### Search organizations
```
GET /api/organizations/?search=fintech
```

## Usage Examples

### Python Requests
```python
import requests

# Get all members
response = requests.get('http://localhost:8000/api/members/')
members = response.json()

# Search for members with Python skills
response = requests.get('http://localhost:8000/api/members/?search=python')
python_members = response.json()

# Get network statistics
response = requests.get('http://localhost:8000/api/stats/overview/')
stats = response.json()
```

### JavaScript Fetch
```javascript
// Get all organizations
fetch('http://localhost:8000/api/organizations/')
  .then(response => response.json())
  .then(data => console.log(data));

// Search for projects
fetch('http://localhost:8000/api/projects/?search=fintech')
  .then(response => response.json())
  .then(data => console.log(data));
```

## Development Setup

1. Install dependencies:
```bash
pipenv install
```

2. Run migrations:
```bash
python manage.py migrate
```

3. Create a superuser:
```bash
python manage.py createsuperuser
```

4. Run the development server:
```bash
python manage.py runserver
```

5. Access the API at `http://localhost:8000/api/`

## Admin Interface

Access the Django admin interface at `http://localhost:8000/admin/` to manage data through the web interface. 