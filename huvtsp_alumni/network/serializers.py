from rest_framework import serializers
from .models import (
    NetworkMember, Organization, Experience, SocialLink, 
    Project, ProjectLink, Resources
)


class SocialLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = SocialLink
        fields = ['id', 'title', 'link', 'description', 'platform']


class ExperienceSerializer(serializers.ModelSerializer):
    organization_name = serializers.CharField(source='organization.name', read_only=True)
    organization_type = serializers.CharField(source='organization.type', read_only=True)
    
    class Meta:
        model = Experience
        fields = [
            'id', 'organization', 'organization_name', 'organization_type',
            'title', 'experience_type', 'start_date', 'end_date', 
            'is_current', 'description'
        ]


class NetworkMemberSerializer(serializers.ModelSerializer):
    experiences = ExperienceSerializer(many=True, read_only=True)
    social_links = SocialLinkSerializer(many=True, read_only=True)
    region_display = serializers.CharField(source='get_region_display', read_only=True)
    
    class Meta:
        model = NetworkMember
        fields = [
            'id', 'first_name', 'last_name', 'region', 'region_display',
            'location', 'session', 'pod', 'internship', 'email', 'skills',
            'additional_info', 'avatar', 'slug', 'experiences', 'social_links'
        ]
        read_only_fields = ['slug']


class OrganizationSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    affiliated_people_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Organization
        fields = [
            'id', 'name', 'slug', 'type', 'type_display', 'description',
            'website', 'affiliated_people_count'
        ]
        read_only_fields = ['slug']
    
    def get_affiliated_people_count(self, obj):
        return obj.affiliated_people.count()


class ProjectLinkSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProjectLink
        fields = ['id', 'title', 'link', 'platform']


class ProjectSerializer(serializers.ModelSerializer):
    project_links = ProjectLinkSerializer(many=True, read_only=True)
    founders = NetworkMemberSerializer(many=True, read_only=True)
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    stage_display = serializers.CharField(source='get_stage_display', read_only=True)
    founders_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'logo', 'type', 'type_display', 'stage', 
            'stage_display', 'founders', 'founders_count',
            'what_are_they_looking_for', 'additional_info', 'slug',
            'project_links'
        ]
        read_only_fields = ['slug']
    
    def get_founders_count(self, obj):
        return obj.founders.count()


class ResourcesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resources
        fields = ['id', 'title', 'slug', 'link', 'platform', 'description']
        read_only_fields = ['slug']


# Detailed serializers for nested views
class NetworkMemberDetailSerializer(NetworkMemberSerializer):
    experiences = ExperienceSerializer(many=True, read_only=True)
    social_links = SocialLinkSerializer(many=True, read_only=True)
    
    class Meta(NetworkMemberSerializer.Meta):
        fields = NetworkMemberSerializer.Meta.fields


class OrganizationDetailSerializer(OrganizationSerializer):
    affiliated_people = NetworkMemberSerializer(many=True, read_only=True)
    
    class Meta(OrganizationSerializer.Meta):
        fields = OrganizationSerializer.Meta.fields + ['affiliated_people']


class ProjectDetailSerializer(ProjectSerializer):
    project_links = ProjectLinkSerializer(many=True, read_only=True)
    founders = NetworkMemberSerializer(many=True, read_only=True)
    
    class Meta(ProjectSerializer.Meta):
        fields = ProjectSerializer.Meta.fields


# List serializers for performance
class NetworkMemberListSerializer(serializers.ModelSerializer):
    region_display = serializers.CharField(source='get_region_display', read_only=True)
    experiences_count = serializers.SerializerMethodField()
    
    class Meta:
        model = NetworkMember
        fields = [
            'id', 'first_name', 'last_name', 'region', 'region_display',
            'location', 'session', 'pod', 'internship', 'email', 'slug', 'experiences_count'
        ]
        read_only_fields = ['slug']
    
    def get_experiences_count(self, obj):
        return obj.experiences.count()


class OrganizationListSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    affiliated_people_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Organization
        fields = [
            'id', 'name', 'slug', 'type', 'type_display', 
            'affiliated_people_count'
        ]
        read_only_fields = ['slug']
    
    def get_affiliated_people_count(self, obj):
        return obj.affiliated_people.count()


class ProjectListSerializer(serializers.ModelSerializer):
    type_display = serializers.CharField(source='get_type_display', read_only=True)
    stage_display = serializers.CharField(source='get_stage_display', read_only=True)
    founders_count = serializers.SerializerMethodField()
    
    class Meta:
        model = Project
        fields = [
            'id', 'title', 'logo', 'type', 'type_display', 'stage', 
            'stage_display', 'slug', 'founders_count'
        ]
        read_only_fields = ['slug']
    
    def get_founders_count(self, obj):
        return obj.founders.count() 