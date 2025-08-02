from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

# Create a router and register our viewsets with it
router = DefaultRouter()
router.register(r'members', views.NetworkMemberViewSet)
router.register(r'organizations', views.OrganizationViewSet)
router.register(r'experiences', views.ExperienceViewSet)
router.register(r'social-links', views.SocialLinkViewSet)
router.register(r'projects', views.ProjectViewSet)
router.register(r'project-links', views.ProjectLinkViewSet)
router.register(r'resources', views.ResourcesViewSet)
router.register(r'stats', views.NetworkStatsViewSet, basename='stats')
router.register(r'search', views.IntelligentSearchViewSet, basename='search')
router.register(r'search-tracking', views.SearchTrackingViewSet)

# The API URLs are now determined automatically by the router
urlpatterns = [
    path('api/', include(router.urls)),
    path('api/validate-password/', views.validate_password, name='validate_password'),
] 