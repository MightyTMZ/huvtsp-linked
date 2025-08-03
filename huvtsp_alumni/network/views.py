from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from django.views.decorators.cache import cache_page
from django.utils.decorators import method_decorator
from .models import (
    NetworkMember, Organization, Experience, SocialLink, 
    Project, ProjectLink, Resources, SearchTracking
)
from .serializers import (
    NetworkMemberSerializer, NetworkMemberDetailSerializer, NetworkMemberListSerializer,
    OrganizationSerializer, OrganizationDetailSerializer, OrganizationListSerializer,
    ExperienceSerializer, SocialLinkSerializer, ProjectSerializer, 
    ProjectDetailSerializer, ProjectListSerializer, ProjectLinkSerializer,
    ResourcesSerializer, SearchTrackingSerializer
)
from .services import IntelligentMatchingService

import openai
import re
from typing import List, Dict, Any


def track_search(search_type: str, query: str = "", filters: dict = None, results_count: int = 0):
    """Utility function to track search analytics"""
    try:
        SearchTracking.objects.create(
            search_type=search_type,
            query=query,
            filters=filters or {},
            results_count=results_count
        )
    except Exception as e:
        # Log error but don't break the search functionality
        print(f"Error tracking search: {e}")


class NetworkMemberViewSet(viewsets.ModelViewSet):
    queryset = NetworkMember.objects.all()
    serializer_class = NetworkMemberSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['region', 'session', 'pod', 'internship']
    search_fields = ['first_name', 'last_name', 'email', 'skills', 'location']
    ordering_fields = ['first_name', 'last_name', 'region', 'session']
    ordering = ['first_name', 'last_name']

    def get_serializer_class(self):
        if self.action == 'list':
            return NetworkMemberListSerializer
        elif self.action == 'retrieve':
            return NetworkMemberDetailSerializer
        return NetworkMemberSerializer

    @method_decorator(cache_page(60 * 10))
    def list(self, request, *args, **kwargs):
        """Override list to track filter searches"""
        response = super().list(request, *args, **kwargs)
        
        # Track the search
        query = request.query_params.get('search', '')
        filters = {
            'region': request.query_params.get('region', ''),
            'session': request.query_params.get('session', ''),
            'pod': request.query_params.get('pod', ''),
            'internship': request.query_params.get('internship', ''),
            'ordering': request.query_params.get('ordering', ''),
        }
        results_count = response.data.get('count', 0) if hasattr(response.data, 'get') else len(response.data)
        
        track_search(
            search_type=SearchTracking.SEARCH_TYPE_FILTER,
            query=query,
            filters=filters,
            results_count=results_count
        )
        
        return response
    
    @method_decorator(cache_page(60 * 10))
    @action(detail=False, methods=['get'])
    def by_region(self, request):
        """Get members grouped by region"""
        regions = NetworkMember.objects.values('region').annotate(
            count=Count('id')
        ).order_by('region')
        return Response(regions)

    @method_decorator(cache_page(60 * 10))
    @action(detail=False, methods=['get'])
    def by_session(self, request):
        """Get members grouped by session"""
        sessions = NetworkMember.objects.values('session').annotate(
            count=Count('id')
        ).order_by('session')
        return Response(sessions)

    @method_decorator(cache_page(60 * 10))
    @action(detail=True, methods=['get'])
    def experiences(self, request, pk=None):
        """Get all experiences for a specific member"""
        member = self.get_object()
        experiences = member.experiences.all()
        serializer = ExperienceSerializer(experiences, many=True)
        return Response(serializer.data)

    @method_decorator(cache_page(60 * 10))
    @action(detail=True, methods=['get'])
    def social_links(self, request, pk=None):
        """Get all social links for a specific member"""
        member = self.get_object()
        social_links = member.social_links.all()
        serializer = SocialLinkSerializer(social_links, many=True)
        return Response(serializer.data)


class OrganizationViewSet(viewsets.ModelViewSet):
    queryset = Organization.objects.all()
    serializer_class = OrganizationSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type']
    search_fields = ['name', 'description']
    ordering_fields = ['name', 'type']
    ordering = ['name']

    def get_serializer_class(self):
        if self.action == 'list':
            return OrganizationListSerializer
        elif self.action == 'retrieve':
            return OrganizationDetailSerializer
        return OrganizationSerializer

    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Get organizations grouped by type"""
        types = Organization.objects.values('type').annotate(
            count=Count('id')
        ).order_by('type')
        return Response(types)

    @action(detail=True, methods=['get'])
    def members(self, request, pk=None):
        """Get all members affiliated with this organization"""
        organization = self.get_object()
        members = organization.affiliated_people.all()
        serializer = NetworkMemberListSerializer(members, many=True)
        return Response(serializer.data)


class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.select_related('network_member', 'organization').all()
    serializer_class = ExperienceSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['experience_type', 'is_current', 'organization', 'network_member']
    search_fields = ['title', 'description', 'network_member__first_name', 
                    'network_member__last_name', 'organization__name']
    ordering_fields = ['start_date', 'end_date', 'title']
    ordering = ['-start_date']

    @action(detail=False, methods=['get'])
    def current(self, request):
        """Get all current experiences"""
        current_experiences = self.queryset.filter(is_current=True)
        serializer = self.get_serializer(current_experiences, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Get experiences grouped by type"""
        types = Experience.objects.values('experience_type').annotate(
            count=Count('id')
        ).order_by('experience_type')
        return Response(types)


class SocialLinkViewSet(viewsets.ModelViewSet):
    queryset = SocialLink.objects.select_related('network_member').all()
    serializer_class = SocialLinkSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['platform', 'network_member']
    search_fields = ['title', 'description', 'network_member__first_name', 
                    'network_member__last_name']
    ordering_fields = ['title', 'platform']
    ordering = ['title']

    @action(detail=False, methods=['get'])
    def by_platform(self, request):
        """Get social links grouped by platform"""
        platforms = SocialLink.objects.values('platform').annotate(
            count=Count('id')
        ).order_by('platform')
        return Response(platforms)


class ProjectViewSet(viewsets.ModelViewSet):
    queryset = Project.objects.prefetch_related('founders', 'project_links').all()
    serializer_class = ProjectSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['type', 'stage']
    search_fields = ['title', 'what_are_they_looking_for', 'additional_info']
    ordering_fields = ['title', 'type', 'stage']
    ordering = ['title']
    lookup_field = 'slug'

    def get_serializer_class(self):
        if self.action == 'list':
            return ProjectListSerializer
        elif self.action == 'retrieve':
            return ProjectDetailSerializer
        return ProjectSerializer

    @action(detail=False, methods=['get'])
    def by_type(self, request):
        """Get projects grouped by type"""
        types = Project.objects.values('type').annotate(
            count=Count('id')
        ).order_by('type')
        return Response(types)

    @action(detail=False, methods=['get'])
    def by_stage(self, request):
        """Get projects grouped by stage"""
        stages = Project.objects.values('stage').annotate(
            count=Count('id')
        ).order_by('stage')
        return Response(stages)

    @action(detail=True, methods=['get'])
    def founders(self, request, slug=None):
        """Get all founders for a specific project"""
        project = self.get_object()
        founders = project.founders.all()
        serializer = NetworkMemberListSerializer(founders, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def links(self, request, slug=None):
        """Get all links for a specific project"""
        project = self.get_object()
        links = project.project_links.all()
        serializer = ProjectLinkSerializer(links, many=True)
        return Response(serializer.data)


class ProjectLinkViewSet(viewsets.ModelViewSet):
    queryset = ProjectLink.objects.select_related('project').all()
    serializer_class = ProjectLinkSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['platform', 'project']
    search_fields = ['title', 'project__title']
    ordering_fields = ['title', 'platform']
    ordering = ['title']

    @action(detail=False, methods=['get'])
    def by_platform(self, request):
        """Get project links grouped by platform"""
        platforms = ProjectLink.objects.values('platform').annotate(
            count=Count('id')
        ).order_by('platform')
        return Response(platforms)


class ResourcesViewSet(viewsets.ModelViewSet):
    queryset = Resources.objects.all()
    serializer_class = ResourcesSerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['platform']
    search_fields = ['title', 'description']
    ordering_fields = ['title', 'platform']
    ordering = ['title']

    @action(detail=False, methods=['get'])
    def by_platform(self, request):
        """Get resources grouped by platform"""
        platforms = Resources.objects.values('platform').annotate(
            count=Count('id')
        ).order_by('platform')
        return Response(platforms)


# Enhanced search functionality using IntelligentMatchingService
class IntelligentSearchViewSet(viewsets.ViewSet):
    """ViewSet for intelligent search across all models"""
    
    def __init__(self, **kwargs):
        super().__init__(**kwargs)
        self.matching_service = IntelligentMatchingService()
    
    @action(detail=False, methods=['get'])
    def search(self, request):
        """Intelligent search that understands natural language queries"""
        query = request.query_params.get('q', '')
        intent = request.query_params.get('intent', 'general')
        skills = request.query_params.get('skills', '').split(',') if request.query_params.get('skills') else []
        locations = request.query_params.get('locations', '').split(',') if request.query_params.get('locations') else []
        companies = request.query_params.get('companies', '').split(',') if request.query_params.get('companies') else []
        
        # Apply filters
        region = request.query_params.get('region', '')
        session = request.query_params.get('session', '')
        pod = request.query_params.get('pod', '')
        
        if not query:
            return Response({'error': 'Query parameter "q" is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Process the query using the intelligent matching service
        processed_query = self.matching_service.process_query(query)
        
        # Override intent if provided
        if intent != 'general':
            processed_query['intent'] = intent
        
        # Add additional skills/locations/companies from query params
        if skills:
            processed_query['skills'].extend(skills)
        if locations:
            processed_query['locations'].extend(locations)
        if companies:
            processed_query['companies'].extend(companies)
        
        # Remove duplicates
        processed_query['skills'] = list(set(processed_query['skills']))
        processed_query['locations'] = list(set(processed_query['locations']))
        processed_query['companies'] = list(set(processed_query['companies']))
        
        # Get results based on intent
        results = []
        
        if intent in ['find_person', 'skill_based', 'location_based', 'company_based'] or intent == 'general':
            filters = {'region': region, 'session': session, 'pod': pod}
            member_results = self.matching_service.search_members(processed_query, filters)
            results.extend(member_results)
        
        if intent in ['find_project', 'company_based'] or intent == 'general':
            project_results = self.matching_service.search_projects(processed_query)
            results.extend(project_results)
        
        if intent in ['find_organization', 'company_based'] or intent == 'general':
            org_results = self.matching_service.search_organizations(processed_query)
            results.extend(org_results)
        
        # Get search suggestions
        suggestions = self.matching_service.get_matching_suggestions(query)
        
        # Track the smart search
        filters = {
            'region': region,
            'session': session,
            'pod': pod,
            'intent': intent,
            'skills': skills,
            'locations': locations,
            'companies': companies,
        }
        
        track_search(
            search_type=SearchTracking.SEARCH_TYPE_SMART,
            query=query,
            filters=filters,
            results_count=len(results)
        )
        
        return Response({
            'results': results[:20],  # Limit to top 20 results
            'query': query,
            'processed_query': processed_query,
            'suggestions': suggestions,
            'total': len(results)
        })
    
    @action(detail=False, methods=['get'])
    def suggestions(self, request):
        """Get search suggestions based on partial query"""
        query = request.query_params.get('q', '')
        if not query:
            return Response({'suggestions': []})
        
        suggestions = self.matching_service.get_matching_suggestions(query)
        return Response({'suggestions': suggestions})


# Additional utility views
class NetworkStatsViewSet(viewsets.ViewSet):
    """ViewSet for network statistics and analytics"""
    
    @action(detail=False, methods=['get'])
    def overview(self, request):
        """Get network overview statistics"""
        stats = {
            'total_members': NetworkMember.objects.count(),
            'total_organizations': Organization.objects.count(),
            'total_projects': Project.objects.count(),
            'total_experiences': Experience.objects.count(),
            'total_resources': Resources.objects.count(),
            'members_by_region': list(NetworkMember.objects.values('region').annotate(count=Count('id')).order_by('region')),
            'organizations_by_type': list(Organization.objects.values('type').annotate(count=Count('id')).order_by('type')),
            'projects_by_stage': list(Project.objects.values('stage').annotate(count=Count('id')).order_by('stage')),
        }
        return Response(stats)

    @action(detail=False, methods=['get'])
    def search(self, request):
        """Global search across all models"""
        query = request.query_params.get('q', '')
        if not query:
            return Response({'error': 'Query parameter "q" is required'}, 
                          status=status.HTTP_400_BAD_REQUEST)
        
        # Search across multiple models
        members = NetworkMember.objects.filter(
            Q(first_name__icontains=query) | 
            Q(last_name__icontains=query) | 
            Q(skills__icontains=query) |
            Q(email__icontains=query)
        )[:10]
        
        organizations = Organization.objects.filter(
            Q(name__icontains=query) | 
            Q(description__icontains=query)
        )[:10]
        
        projects = Project.objects.filter(
            Q(title__icontains=query) | 
            Q(what_are_they_looking_for__icontains=query)
        )[:10]
        
        results = {
            'members': NetworkMemberListSerializer(members, many=True).data,
            'organizations': OrganizationListSerializer(organizations, many=True).data,
            'projects': ProjectListSerializer(projects, many=True).data,
        }
        
        return Response(results)

    @action(detail=False, methods=['get'])
    def search_analytics(self, request):
        """Get search analytics"""
        from django.utils import timezone
        from datetime import timedelta
        
        # Get date range from query params
        days = int(request.query_params.get('days', 30))
        start_date = timezone.now() - timedelta(days=days)
        
        # Get search statistics
        total_searches = SearchTracking.objects.filter(created_at__gte=start_date).count()
        filter_searches = SearchTracking.objects.filter(
            search_type=SearchTracking.SEARCH_TYPE_FILTER,
            created_at__gte=start_date
        ).count()
        smart_searches = SearchTracking.objects.filter(
            search_type=SearchTracking.SEARCH_TYPE_SMART,
            created_at__gte=start_date
        ).count()
        
        # Get daily search counts
        daily_searches = SearchTracking.objects.filter(
            created_at__gte=start_date
        ).extra(
            select={'date': 'date(created_at)'}
        ).values('date').annotate(count=Count('id')).order_by('date')
        
        analytics = {
            'total_searches': total_searches,
            'filter_searches': filter_searches,
            'smart_searches': smart_searches,
            'daily_searches': list(daily_searches),
            'period_days': days,
        }
        
        return Response(analytics)


class SearchTrackingViewSet(viewsets.ModelViewSet):
    """ViewSet for search tracking analytics"""
    queryset = SearchTracking.objects.all()
    serializer_class = SearchTrackingSerializer
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['search_type']
    ordering_fields = ['created_at', 'results_count']
    ordering = ['-created_at']
    
    def get_queryset(self):
        """Allow filtering by date range"""
        queryset = super().get_queryset()
        
        # Filter by date range if provided
        start_date = self.request.query_params.get('start_date')
        end_date = self.request.query_params.get('end_date')
        
        if start_date:
            queryset = queryset.filter(created_at__gte=start_date)
        if end_date:
            queryset = queryset.filter(created_at__lte=end_date)
            
        return queryset


@api_view(['POST'])
def validate_password(request):
    """Validate HUVTSP alumni password"""
    import os
    
    password = request.data.get('password', '')
    
    if not password:
        return Response(
            {'error': 'Password is required'}, 
            status=status.HTTP_400_BAD_REQUEST
        )
    
    # Get the correct password from environment variable
    correct_password = os.getenv('HUVTSP_ALUMNI_PASSWORD')
    
    if not correct_password:
        return Response(
            {'error': 'Password validation not configured'}, 
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )
    
    if password == correct_password:
        return Response(
            {'success': True, 'message': 'Password validated successfully'},
            status=status.HTTP_200_OK
        )
    else:
        return Response(
            {'error': 'Incorrect password'}, 
            status=status.HTTP_401_UNAUTHORIZED
        )
