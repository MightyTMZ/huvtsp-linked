from django.shortcuts import render
from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from .models import (
    NetworkMember, Organization, Experience, SocialLink, 
    Project, ProjectLink, Resources
)
from .serializers import (
    NetworkMemberSerializer, NetworkMemberDetailSerializer, NetworkMemberListSerializer,
    OrganizationSerializer, OrganizationDetailSerializer, OrganizationListSerializer,
    ExperienceSerializer, SocialLinkSerializer, ProjectSerializer, 
    ProjectDetailSerializer, ProjectListSerializer, ProjectLinkSerializer,
    ResourcesSerializer
)


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

    @action(detail=False, methods=['get'])
    def by_region(self, request):
        """Get members grouped by region"""
        regions = NetworkMember.objects.values('region').annotate(
            count=Count('id')
        ).order_by('region')
        return Response(regions)

    @action(detail=False, methods=['get'])
    def by_session(self, request):
        """Get members grouped by session"""
        sessions = NetworkMember.objects.values('session').annotate(
            count=Count('id')
        ).order_by('session')
        return Response(sessions)

    @action(detail=True, methods=['get'])
    def experiences(self, request, pk=None):
        """Get all experiences for a specific member"""
        member = self.get_object()
        experiences = member.experiences.all()
        serializer = ExperienceSerializer(experiences, many=True)
        return Response(serializer.data)

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
    def founders(self, request, pk=None):
        """Get all founders for a specific project"""
        project = self.get_object()
        founders = project.founders.all()
        serializer = NetworkMemberListSerializer(founders, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def links(self, request, pk=None):
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


# Additional utility views
class NetworkStatsViewSet(viewsets.ViewSet):
    """ViewSet for network statistics and analytics"""
    
    @action(detail=False, methods=['get'])
    def overview(self, request):
        """Get overview statistics for the network"""
        stats = {
            'total_members': NetworkMember.objects.count(),
            'total_organizations': Organization.objects.count(),
            'total_projects': Project.objects.count(),
            'total_experiences': Experience.objects.count(),
            'total_resources': Resources.objects.count(),
            'members_by_region': list(NetworkMember.objects.values('region').annotate(
                count=Count('id')).order_by('region')),
            'organizations_by_type': list(Organization.objects.values('type').annotate(
                count=Count('id')).order_by('type')),
            'projects_by_stage': list(Project.objects.values('stage').annotate(
                count=Count('id')).order_by('stage')),
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
