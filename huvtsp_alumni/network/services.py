from typing import List, Dict, Any, Tuple
from django.db.models import Q
from .models import NetworkMember, Organization, Project, Experience
import re


class IntelligentMatchingService:
    """Service for intelligent matching of search queries to network members, organizations, and projects"""
    
    # Define skill categories and their keywords
    SKILL_CATEGORIES = {
        'design': [
            'graphic design', 'design', 'logo', 'branding', 'visual design', 'ui/ux', 
            'social media graphics', 'marketing materials', 'brand identity', 'graphic',
        ],
        'marketing': [
            'marketing', 'social media', 'content creation', 'brand strategy', 
            'growth marketing', 'digital marketing', 'customer acquisition', 'cmo'
        ],
        'development': [
            'software engineer', 'developer', 'mobile', 'react native', 'ios', 'android',
            'full stack', 'web dev', 'web development', 'react', 'node.js', 'python',
            'postgresql', 'javascript', 'database design'
        ],
        'startup': [
            'startup', 'founder', 'mvp', 'dashboard', 'pitch', 'business strategy',
            'product management', 'user research', 'growth hacking'
        ],
        'fintech': [
            'fintech', 'blockchain', 'financial services', 'venture capital',
            'financial modeling', 'data analysis'
        ],
        'education': [
            'teaching', 'mentoring', 'essay review', 'education', 'content creation'
        ],
        'creative': [
            'video editing', 'music', 'presentations', 'soft skills', 'illustration'
        ],
        'technical': [
            'engineering', 'math', 'cad', 'data analysis', 'market research'
        ],
        'languages': [
            'foreign languages', 'networking', 'communication'
        ],
        'transferable': [
            'critical', 'thinking', 'hustler', 'hacker', 'hipster', 
        ]
    }
    
    # Location patterns
    LOCATIONS = [
        'boston', 
        'toronto',
        'canada', 
        'san francisco', 
        'bay area',
        'new york', 
        'new york city',
        'nyc',
        'seattle', 
        'houston',
        'austin', 
        'ghana',
        'africa',
        'south america',
        'north america',
        'asia',
        'australia',
        'oceania',
        'europe',
        'los angeles', 
        'chicago', 
        'denver', 
        'california', 
        'texas', 
        'massachusetts',
        'united states',
        'usa',
        'türkiye',
        'turkiye',
        'turkey',
        'israel',
        'south korea',
        'korea',
        'singapore',
        'silicon valley',
        'hong kong',
        'dubai',
        'finland',
        'arizona',
        'tucson',
        'india',
        'mumbai',
        'lexington',
        'kentucky',
        'hollywood',
        'california',
        'dallas',
        'brooklyn',
        'los angeles',
        'calgary',
        'alberta',
        'colorado',
        'georgia',
        'portland',
        'united kingdom',
        'qatar',
        'philadelphia',
        'honduras',
        'florida',
        'washington',
        'poland',
        'nepal',
        'san jose',
        'colombia',
        'azerbaijan',
        'maryland',
        'ontario',
        'instanbul',
        'spain',
        'chicago',
        'illinois',
        'france',
        'nigeria',
        'united arab emirates',
        'uae',
        'germany',
        'bangladesh',
        'pakistan',
        'vancouver',
    ]
    
    # Company/Organization patterns
    COMPANIES = [
        'amplify',
        'amplify institute',
        'internship',
        'rove', 
        'rove miles',
        'nyx ventures', 
        'touchpoint legal',
        'touchpoint',
        'touch point'
        'docubridge',
        'docu bridge',
        'edubeyond',
        'salespatriot',
        'sales patriot',
        'sale patriot',
        'scout',
        'scoutout',
        'scout out',
        'teachshare',
        'teach share',
        'exeter',
        'exeter22',
        'vanguard defense',
        'vanguard',
        'rayfield',
        'rayfield systems',
        'reachfaster ai',
        'reachfaster',
        'reach faster ai'
        'reach faster',
    ]
    
    # Project/Startup patterns
    PROJECT_KEYWORDS = [
        'startup', 
        'project', 
        'nonprofit', 
        'dashboard', 
        'platform', 
        'app', 
        'website',
        'proposal',
    ]

    POD_KEYWORDS = [
        'pod',
        'pod of',
        'in the pod',
        'reddit',
        'spacex',
        'canva',
        'zoom',
        'netflix',
        'stripe',
        'asana',
        'airbnb',
        'cloudflare',
        'openai',
        'snapchat',
        'doordash',
        'duolingo',
        'uber',
        'twilio',
        'nvidia',
        'zillow',
        'square',
        'okta',
        'databricks',
        'shopify',
        'robinhood',
    ]
    
    def process_query(self, query: str) -> Dict[str, Any]:
        """Process natural language query to extract intent and keywords"""
        lower_query = query.lower()
        
        # Extract skills
        found_skills = []
        for category, patterns in self.SKILL_CATEGORIES.items():
            for pattern in patterns:
                if pattern in lower_query:
                    found_skills.extend(patterns)
                    break
        
        # Extract locations
        found_locations = [loc for loc in self.LOCATIONS if loc in lower_query]
        
        # Extract companies
        found_companies = [comp for comp in self.COMPANIES if comp in lower_query]
        
        # Extract project keywords
        found_projects = [proj for proj in self.PROJECT_KEYWORDS if proj in lower_query]

        # Extract pod keywords
        found_pods = [pod for pod in self.POD_KEYWORDS if pod in lower_query]
        
        # Determine intent
        intent = self._determine_intent(lower_query, found_skills, found_locations, found_companies, found_projects, found_pods)
        
        return {
            'original': query,
            'processed': lower_query,
            'intent': intent,
            'skills': list(set(found_skills)),
            'locations': found_locations,
            'companies': found_companies,
            'projects': found_projects,
            'pods': found_pods,
        }
    
    def _determine_intent(self, query: str, skills: List[str], locations: List[str], 
                         companies: List[str], projects: List[str], pods: List[str]) -> str:
        """Determine the intent of the search query"""
        
        # Person-finding patterns
        person_patterns = [
            'who', 'anyone', 'people', 'person', 'someone', 'know anyone',
            'find someone', 'looking for someone', 'need someone', 'partner',
            'co-founder', 'cofounder', 'co founder', 'someone else', 'cracked',
            'mate'
        ]
        
        # Project-finding patterns
        project_patterns = [
            'startup', 'project', 'nonprofit', 'looking to join', 'best startups',
            'best nonprofits', 'interested in joining', 'company', ''
        ]
        
        # Organization-finding patterns
        org_patterns = [
            'company', 'organization', 'pod', 'intern at', 'working at'
        ]
        
        # Location-based patterns
        location_patterns = [
            'in [location]', 'based in', 'located in', 'anyone in'
        ]

        pod_patterns = [
            'in', 'anyone in [pod]', 'in pod', 'pod of'
        ]
        
        # Check for person-finding intent
        if any(pattern in query for pattern in person_patterns):
            return 'find_person'
        
        # Check for project-finding intent
        if any(pattern in query for pattern in project_patterns) or projects:
            return 'find_project'
        
        # Check for organization-finding intent
        if any(pattern in query for pattern in org_patterns) or companies:
            return 'find_organization'
        
        # Check for location-based intent
        if locations or any(pattern in query for pattern in location_patterns):
            return 'location_based'
        
        if any(pattern in query for pattern in pod_patterns):
            return 'pod_based'
        
        # Check for skill-based intent
        if skills:
            return 'skill_based'
        
        return 'general'
    
    def search_members(self, processed_query: Dict, filters: Dict = None) -> List[Dict]:
        """Search for network members based on processed query"""
        queryset = NetworkMember.objects.all()
        
        # Apply filters
        if filters:
            if filters.get('region'):
                queryset = queryset.filter(region=filters['region'])
            if filters.get('session'):
                queryset = queryset.filter(session=filters['session'])
            if filters.get('pod'):
                queryset = queryset.filter(pod=filters['pod'])
        
        results = []
        
        for member in queryset:
            score, reasons = self._score_member(member, processed_query)
            
            if score > 0:
                results.append({
                    'type': 'member',
                    'data': {
                        'id': member.id,
                        'first_name': member.first_name,
                        'last_name': member.last_name,
                        'skills': member.skills,
                        'location': member.location,
                        'region': member.region,
                        'pod': member.pod,
                        'session': member.session,
                        'email': member.email,
                        'additional_info': member.additional_info,
                        'slug': member.slug
                    },
                    'relevance_score': score,
                    'match_reason': ', '.join(reasons)
                })
        
        # Sort by relevance score
        results.sort(key=lambda x: x['relevance_score'], reverse=True)
        return results
    
    def _score_member(self, member: NetworkMember, processed_query: Dict) -> Tuple[float, List[str]]:
        """Score a member based on how well they match the query"""
        score = 0
        reasons = []
        
        # Score based on skills match
        if processed_query.get('skills'):
            member_skills = member.skills.lower() if member.skills else ''
            for skill in processed_query['skills']:
                if skill.lower() in member_skills:
                    score += 0.3
                    reasons.append(f"Has {skill} skills")
        
        # Score based on location match
        if processed_query.get('locations'):
            member_location = member.location.lower() if member.location else ''
            for location in processed_query['locations']:
                if location.lower() in member_location:
                    score += 0.4
                    reasons.append(f"Located in {location}")
        
        # Score based on company/pod match
        if processed_query.get('companies'):
            member_pod = member.pod.lower() if member.pod else ''
            member_info = member.additional_info.lower() if member.additional_info else ''
            for company in processed_query['companies']:
                if company.lower() in member_pod or company.lower() in member_info:
                    score += 0.5
                    reasons.append(f"Connected to {company}")
        
        # Score based on general text search
        search_text = f"{member.first_name} {member.last_name} {member.skills or ''} {member.additional_info or ''}".lower()
        if processed_query['processed'] in search_text:
            score += 0.2
            reasons.append("Text match")
        
        # Score based on specific query patterns
        score += self._score_specific_patterns(member, processed_query, reasons)
        
        return score, reasons
    
    def _score_specific_patterns(self, member: NetworkMember, processed_query: Dict, reasons: List[str]) -> float:
        """Score based on specific query patterns from the provided examples"""
        query = processed_query['processed']
        score = 0
        
        # Pattern: "do you know any people who are really good with graphic design?"
        if 'graphic design' in query or 'design' in query:
            if member.skills and any(skill in member.skills.lower() for skill in ['design', 'graphic', 'logo', 'branding']):
                score += 0.4
                reasons.append("Expert in graphic design")
        
        # Pattern: "Anyone in [city] rn?"
        if any(location in query for location in ['boston', 'toronto', 'san francisco', 'new york']):
            if member.location and any(location in member.location.lower() for location in ['boston', 'toronto', 'san francisco', 'new york']):
                score += 0.5
                reasons.append(f"Located in {member.location}")
        
        # Pattern: "Does anyone know of a software engineer familiar with mobile apps for a startup?"
        if 'software engineer' in query or 'mobile' in query:
            if member.skills and any(skill in member.skills.lower() for skill in ['mobile', 'ios', 'android', 'react native']):
                score += 0.4
                reasons.append("Mobile development expert")
        
        # Pattern: "Who would likely be interested in a marketing gig for a startup?"
        if 'marketing' in query:
            if member.skills and any(skill in member.skills.lower() for skill in ['marketing', 'social media', 'content creation']):
                score += 0.4
                reasons.append("Marketing specialist")
        
        # Pattern: "who is interning at [company]?"
        if 'interning' in query or 'intern' in query:
            if member.additional_info and 'intern' in member.additional_info.lower():
                score += 0.3
                reasons.append("Currently interning")
        
        # Pattern: "who is in the [pod] pod?"
        if 'pod' in query:
            for company in ['stripe', 'zoom', 'google', 'microsoft']:
                if company in query and company.lower() in member.pod.lower():
                    score += 0.6
                    reasons.append(f"Member of {member.pod} pod")
        
        return score
    
    def search_projects(self, processed_query: Dict) -> List[Dict]:
        """Search for projects based on processed query"""
        queryset = Project.objects.all()
        results = []
        
        for project in queryset:
            score, reasons = self._score_project(project, processed_query)
            
            if score > 0:
                results.append({
                    'type': 'project',
                    'data': {
                        'id': project.id,
                        'title': project.title,
                        'type': project.type,
                        'stage': project.stage,
                        'what_are_they_looking_for': project.what_are_they_looking_for,
                        'additional_info': project.additional_info,
                        'slug': project.slug,
                        'founders': [{'first_name': f.first_name, 'last_name': f.last_name} for f in project.founders.all()]
                    },
                    'relevance_score': score,
                    'match_reason': ', '.join(reasons)
                })
        
        # Sort by relevance score
        results.sort(key=lambda x: x['relevance_score'], reverse=True)
        return results
    
    def _score_project(self, project: Project, processed_query: Dict) -> Tuple[float, List[str]]:
        """Score a project based on how well it matches the query"""
        score = 0
        reasons = []
        
        # Score based on skills needed
        if processed_query.get('skills'):
            project_description = f"{project.what_are_they_looking_for or ''} {project.additional_info or ''}".lower()
            for skill in processed_query['skills']:
                if skill.lower() in project_description:
                    score += 0.3
                    reasons.append(f"Looking for {skill} skills")
        
        # Score based on project type
        if 'startup' in processed_query['processed'] and project.type == 'ST':
            score += 0.3
            reasons.append("Startup project")
        
        if 'nonprofit' in processed_query['processed'] and project.type == 'NP':
            score += 0.3
            reasons.append("Nonprofit project")
        
        # Score based on text search
        search_text = f"{project.title} {project.what_are_they_looking_for or ''} {project.additional_info or ''}".lower()
        if processed_query['processed'] in search_text:
            score += 0.2
            reasons.append("Text match")
        
        return score, reasons
    
    def search_organizations(self, processed_query: Dict) -> List[Dict]:
        """Search for organizations based on processed query"""
        queryset = Organization.objects.all()
        results = []
        
        for org in queryset:
            score, reasons = self._score_organization(org, processed_query)
            
            if score > 0:
                results.append({
                    'type': 'organization',
                    'data': {
                        'id': org.id,
                        'name': org.name,
                        'type': org.type,
                        'description': org.description,
                        'website': org.website,
                        'slug': org.slug
                    },
                    'relevance_score': score,
                    'match_reason': ', '.join(reasons)
                })
        
        # Sort by relevance score
        results.sort(key=lambda x: x['relevance_score'], reverse=True)
        return results
    
    def _score_organization(self, org: Organization, processed_query: Dict) -> Tuple[float, List[str]]:
        """Score an organization based on how well it matches the query"""
        score = 0
        reasons = []
        
        # Score based on company match
        if processed_query.get('companies'):
            org_name = org.name.lower()
            org_description = org.description.lower() if org.description else ''
            for company in processed_query['companies']:
                if company.lower() in org_name or company.lower() in org_description:
                    score += 0.8
                    reasons.append(f"Matches {company}")
        
        # Score based on text search
        search_text = f"{org.name} {org.description or ''}".lower()
        if processed_query['processed'] in search_text:
            score += 0.2
            reasons.append("Text match")
        
        return score, reasons
    
    def get_matching_suggestions(self, query: str) -> List[str]:
        """Get suggested search queries based on the input"""
        suggestions = []
        
        if 'design' in query.lower():
            suggestions.extend([
                "do you know any people who are really good with graphic design?",
                "looking for designers for logo and social media work",
                "need someone with UI/UX design skills"
            ])
        
        if 'startup' in query.lower():
            suggestions.extend([
                "I've been thinking about a startup idea and want to see if anyone here might be interested in joining!",
                "looking for startup founders to collaborate with",
                "need developers for my startup project"
            ])
        
        if 'location' in query.lower() or any(loc in query.lower() for loc in ['boston', 'toronto', 'new york']):
            suggestions.extend([
                "Anyone in Boston rn?",
                "looking for people in Toronto for coffee meetings",
                "need local collaborators in New York"
            ])
        
        if 'developer' in query.lower() or 'engineer' in query.lower():
            suggestions.extend([
                "Does anyone know of a software engineer familiar with mobile apps for a startup?",
                "looking for full stack developers",
                "need React developers for a project"
            ])
        
        if 'marketing' in query.lower():
            suggestions.extend([
                "Who would likely be interested in a marketing gig for a startup?",
                "looking for CMO for our startup",
                "need content creators and social media experts"
            ])
        
        return suggestions[:5]  # Return top 5 suggestions 