from django.contrib import admin
from .models import NetworkMember, Organization, Experience, SocialLink, Project, ProjectLink, Resources

# Inline classes for related models
class ExperienceInline(admin.TabularInline):
    model = Experience
    extra = 1
    fields = ('organization', 'title', 'experience_type', 'start_date', 'end_date', 'is_current')

class SocialLinkInline(admin.TabularInline):
    model = SocialLink
    extra = 1
    fields = ('title', 'link', 'description', 'platform')

class ProjectLinkInline(admin.TabularInline):
    model = ProjectLink
    extra = 1
    fields = ('title', 'link', 'platform')

# Admin classes
@admin.register(NetworkMember)
class NetworkMemberAdmin(admin.ModelAdmin):
    list_display = ('first_name', 'last_name', 'region', 'session', 'pod', 'email')
    list_filter = ('region', 'session', 'pod')
    search_fields = ('first_name', 'last_name', 'email', 'skills')
    # readonly_fields = ('slug',)
    inlines = [ExperienceInline, SocialLinkInline]
    fieldsets = (
        ('Personal Information', {
            'fields': ('first_name', 'last_name', 'email', 'avatar', 'slug')
        }),
        ('Location & Background', {
            'fields': ('region', 'location', 'session', 'pod', 'internship')
        }),
        ('Professional Details', {
            'fields': ('skills', 'additional_info')
        }),
    )

@admin.register(Organization)
class OrganizationAdmin(admin.ModelAdmin):
    list_display = ('name', 'type', 'website')
    list_filter = ('type',)
    search_fields = ('name', 'description')
    # readonly_fields = ('slug',)
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'slug', 'type')
        }),
        ('Details', {
            'fields': ('description', 'website')
        }),
    )

@admin.register(Experience)
class ExperienceAdmin(admin.ModelAdmin):
    list_display = ('network_member', 'organization', 'title', 'experience_type', 'start_date', 'end_date', 'is_current')
    list_filter = ('experience_type', 'is_current', 'start_date', 'organization')
    search_fields = ('network_member__first_name', 'network_member__last_name', 'organization__name', 'title')
    date_hierarchy = 'start_date'
    fieldsets = (
        ('Relationship', {
            'fields': ('network_member', 'organization')
        }),
        ('Role Details', {
            'fields': ('title', 'experience_type', 'description')
        }),
        ('Timeline', {
            'fields': ('start_date', 'end_date', 'is_current')
        }),
    )

@admin.register(SocialLink)
class SocialLinkAdmin(admin.ModelAdmin):
    list_display = ('network_member', 'title', 'platform', 'link')
    list_filter = ('platform',)
    search_fields = ('network_member__first_name', 'network_member__last_name', 'title', 'description')
    fieldsets = (
        ('Link Information', {
            'fields': ('network_member', 'title', 'link', 'platform')
        }),
        ('Description', {
            'fields': ('description',)
        }),
    )

@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'type', 'stage', 'get_founders_count')
    list_filter = ('type', 'stage')
    search_fields = ('title', 'what_are_they_looking_for', 'additional_info')
    # readonly_fields = ('slug',)
    filter_horizontal = ('founders',)
    inlines = [ProjectLinkInline]
    fieldsets = (
        ('Basic Information', {
            'fields': ('title', 'slug', 'logo')
        }),
        ('Project Details', {
            'fields': ('type', 'stage', 'founders')
        }),
        ('Description', {
            'fields': ('what_are_they_looking_for', 'additional_info')
        }),
    )

    def get_founders_count(self, obj):
        return obj.founders.count()
    get_founders_count.short_description = 'Founders Count'

@admin.register(ProjectLink)
class ProjectLinkAdmin(admin.ModelAdmin):
    list_display = ('project', 'title', 'platform', 'link')
    list_filter = ('platform',)
    search_fields = ('project__title', 'title', 'description')
    fieldsets = (
        ('Link Information', {
            'fields': ('project', 'title', 'link', 'platform')
        }),
    )

@admin.register(Resources)
class ResourcesAdmin(admin.ModelAdmin):
    list_display = ('title', 'platform', 'slug')
    list_filter = ('platform',)
    search_fields = ('title', 'description')
    # readonly_fields = ('slug',)
    fieldsets = (
        ('Resource Information', {
            'fields': ('title', 'slug', 'link', 'platform')
        }),
        ('Description', {
            'fields': ('description',)
        }),
    )
