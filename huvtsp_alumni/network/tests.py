from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import NetworkMember, Organization, Project
from .services import IntelligentMatchingService


class IntelligentMatchingServiceTest(TestCase):
    """Test cases for the IntelligentMatchingService"""
    
    def setUp(self):
        """Set up test data"""
        # Create test network members
        self.designer = NetworkMember.objects.create(
            first_name="Alex",
            last_name="Chen",
            skills="Graphic Design, UI/UX, Social Media Marketing, Brand Identity, Logo Design",
            location="San Francisco, CA",
            region="NA",
            pod="Stripe",
            session="S1",
            email="alex.chen@example.com",
            additional_info="Experienced in creating brand identities and marketing materials for startups."
        )
        
        self.developer = NetworkMember.objects.create(
            first_name="James",
            last_name="Wilson",
            skills="Mobile Development, React Native, iOS, Android, Full Stack Development",
            location="Seattle, WA",
            region="NA",
            pod="Microsoft",
            session="S1",
            email="james.wilson@example.com",
            additional_info="Experienced mobile developer with 3+ years building iOS and Android apps."
        )
        
        self.marketer = NetworkMember.objects.create(
            first_name="Rachel",
            last_name="Thompson",
            skills="Digital Marketing, Growth Marketing, Brand Strategy, Customer Acquisition",
            location="Los Angeles, CA",
            region="NA",
            pod="Google",
            session="S1",
            email="rachel.thompson@example.com",
            additional_info="Marketing specialist with experience in B2B and B2C campaigns."
        )
        
        self.boston_member = NetworkMember.objects.create(
            first_name="Sarah",
            last_name="Johnson",
            skills="Marketing, Content Creation, Brand Strategy, Event Planning",
            location="Boston, MA",
            region="NA",
            pod="Zoom",
            session="S1",
            email="sarah.johnson@example.com",
            additional_info="Based in Boston and available for local collaborations."
        )
        
        # Create test organizations
        self.fintech_org = Organization.objects.create(
            name="FinTech Nexus",
            type="CM",
            description="A community of fintech professionals and enthusiasts.",
            website="https://fintechnexus.com"
        )
        
        # Create test projects
        self.startup_project = Project.objects.create(
            title="Founder Dashboard",
            type="ST",
            stage="MVP",
            what_are_they_looking_for="Looking for marketing and design talent to help with branding and user acquisition.",
            additional_info="A comprehensive dashboard for young founders to track projects and goals."
        )
        
        self.matching_service = IntelligentMatchingService()
    
    def test_process_query_design(self):
        """Test processing a design-related query"""
        query = "do you know any people who are really good with graphic design?"
        result = self.matching_service.process_query(query)
        
        self.assertEqual(result['intent'], 'find_person')
        self.assertIn('graphic design', result['skills'])
        self.assertIn('design', result['skills'])
    
    def test_process_query_location(self):
        """Test processing a location-based query"""
        query = "Anyone in Boston rn?"
        result = self.matching_service.process_query(query)
        
        self.assertEqual(result['intent'], 'location_based')
        self.assertIn('boston', result['locations'])
    
    def test_process_query_company(self):
        """Test processing a company-based query"""
        query = "who is in the Stripe pod?"
        result = self.matching_service.process_query(query)
        
        self.assertEqual(result['intent'], 'find_organization')
        self.assertIn('stripe', result['companies'])
    
    def test_search_members_design(self):
        """Test searching for members with design skills"""
        query = "do you know any people who are really good with graphic design?"
        processed_query = self.matching_service.process_query(query)
        results = self.matching_service.search_members(processed_query)
        
        # Should find the designer
        self.assertGreater(len(results), 0)
        designer_result = next((r for r in results if r['data']['first_name'] == 'Alex'), None)
        self.assertIsNotNone(designer_result)
        self.assertGreater(designer_result['relevance_score'], 0)
    
    def test_search_members_location(self):
        """Test searching for members by location"""
        query = "Anyone in Boston rn?"
        processed_query = self.matching_service.process_query(query)
        results = self.matching_service.search_members(processed_query)
        
        # Should find the Boston member
        self.assertGreater(len(results), 0)
        boston_result = next((r for r in results if r['data']['first_name'] == 'Sarah'), None)
        self.assertIsNotNone(boston_result)
        self.assertGreater(boston_result['relevance_score'], 0)
    
    def test_search_members_development(self):
        """Test searching for members with development skills"""
        query = "Does anyone know of a software engineer familiar with mobile apps for a startup?"
        processed_query = self.matching_service.process_query(query)
        results = self.matching_service.search_members(processed_query)
        
        # Should find the developer
        self.assertGreater(len(results), 0)
        developer_result = next((r for r in results if r['data']['first_name'] == 'James'), None)
        self.assertIsNotNone(developer_result)
        self.assertGreater(developer_result['relevance_score'], 0)
    
    def test_search_projects_startup(self):
        """Test searching for startup projects"""
        query = "I've been thinking about a startup idea and want to see if anyone here might be interested in joining!"
        processed_query = self.matching_service.process_query(query)
        results = self.matching_service.search_projects(processed_query)
        
        # Should find the startup project
        self.assertGreater(len(results), 0)
        startup_result = next((r for r in results if r['data']['title'] == 'Founder Dashboard'), None)
        self.assertIsNotNone(startup_result)
        self.assertGreater(startup_result['relevance_score'], 0)
    
    def test_search_organizations_fintech(self):
        """Test searching for fintech organizations"""
        query = "Is anyone in FinTech Nexus?"
        processed_query = self.matching_service.process_query(query)
        results = self.matching_service.search_organizations(processed_query)
        
        # Should find the fintech organization
        self.assertGreater(len(results), 0)
        fintech_result = next((r for r in results if r['data']['name'] == 'FinTech Nexus'), None)
        self.assertIsNotNone(fintech_result)
        self.assertGreater(fintech_result['relevance_score'], 0)
    
    def test_get_suggestions(self):
        """Test getting search suggestions"""
        query = "design"
        suggestions = self.matching_service.get_matching_suggestions(query)
        
        self.assertGreater(len(suggestions), 0)
        self.assertTrue(any('graphic design' in suggestion.lower() for suggestion in suggestions))


class IntelligentSearchAPITest(APITestCase):
    """Test cases for the intelligent search API endpoints"""
    
    def setUp(self):
        """Set up test data"""
        # Create test network member
        self.member = NetworkMember.objects.create(
            first_name="Test",
            last_name="User",
            skills="Graphic Design, Marketing",
            location="San Francisco, CA",
            region="NA",
            pod="Stripe",
            session="S1",
            email="test@example.com",
            additional_info="Test user for API testing."
        )
    
    def test_search_endpoint(self):
        """Test the search API endpoint"""
        url = '/api/search/search/'
        response = self.client.get(url, {'q': 'graphic design'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)
        self.assertIn('query', response.data)
        self.assertIn('processed_query', response.data)
    
    def test_search_endpoint_no_query(self):
        """Test the search API endpoint without query parameter"""
        url = '/api/search/search/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('error', response.data)
    
    def test_suggestions_endpoint(self):
        """Test the suggestions API endpoint"""
        url = '/api/search/suggestions/'
        response = self.client.get(url, {'q': 'design'})
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('suggestions', response.data)
    
    def test_suggestions_endpoint_no_query(self):
        """Test the suggestions API endpoint without query parameter"""
        url = '/api/search/suggestions/'
        response = self.client.get(url)
        
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['suggestions'], [])
