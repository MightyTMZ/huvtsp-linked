from django.db import models

class NetworkMember(models.Model):
    REGION_NORTH_AMERICA = "NA"
    REGION_SOUTH_AMERICA = "SA"
    REGION_EUROPE = "EU"
    REGION_ASIA = "AS"
    REGION_AFRICA = "AF"
    REGION_OCEANIA = "OC"
    REGION_ANTARCTICA = "AN"

    REGIONS = [
        (REGION_AFRICA, "Africa"),
        (REGION_ASIA, "Asia"),
        (REGION_EUROPE, "North America"),
        (REGION_NORTH_AMERICA, "North America"),
        (REGION_SOUTH_AMERICA, "South America"),
        (REGION_OCEANIA, "Oceania"),
        (REGION_ANTARCTICA, "Antarctica"),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    region = models.CharField(max_length=200, choices=REGIONS)
    session = models.CharField(max_length=200)
    pod = models.CharField(max_length=200)
    internship = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    skills = models.TextField()
    additional_info = models.TextField()
    avatar = models.ImageField(upload_to="avatars", null=True, blank=True)


class SocialLink(models.Model):
    title = models.CharField(max_length=100, null=True, blank=True)
    link = models.URLField(max_length=2083)
    platform = models.CharField(max_length=200, null=True, blank=True) # indicate if it's LinkedIn, website, etc.
    network_member = models.ForeignKey(NetworkMember, on_delete=models.CASCADE, related_name="social-links")


class Project(models.Model):
    PROJECT_STARTUP = "ST"
    PROJECT_NON_PROFIT = "NP"

    PROJECT_TYPE_CHOICES = [
        (PROJECT_STARTUP, "Startup"),
        (PROJECT_NON_PROFIT, "Non Profit"),
    ]


    STAGE_JUST_AN_IDEA = "J"
    STAGE_RESEARCH_OR_MVP = "MVP"
    STAGE_LAUNCHED_VENTURE = "L"

    STAGE_TYPE_CHOICES = [
        (STAGE_JUST_AN_IDEA, "Just an idea"),
        (STAGE_RESEARCH_OR_MVP, "Research/MVP/Early Development"),
        (STAGE_LAUNCHED_VENTURE, "Launched Venture"),

    ]

    title = models.CharField(max_length=255)
    logo = models.ImageField(upload_to="logo", null=True, blank=True)
    type = models.CharField(max_length=5, choices=PROJECT_TYPE_CHOICES)
    stage = models.CharField(max_length=5, choices=STAGE_TYPE_CHOICES)
    founders = models.ManyToManyField(NetworkMember)
    what_are_they_looking_for = models.TextField()
    additional_info = models.TextField()
    

class ProjectLink(models.Model):
    title = models.CharField(max_length=100, null=True, blank=True)
    link = models.URLField(max_length=2083)
    platform = models.CharField(max_length=200, null=True, blank=True) # indicate if it's LinkedIn, website, etc.
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="project-links")


class Resources(models.Model):
    title = models.CharField(max_length=100, null=True, blank=True)
    link = models.URLField(max_length=2083)
    platform = models.CharField(max_length=200, null=True, blank=True) # indicate if it's YC, blog, etc.
    description = models.TextField()



