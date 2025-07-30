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
        (REGION_EUROPE, "Europe"),
        (REGION_NORTH_AMERICA, "North America"),
        (REGION_SOUTH_AMERICA, "South America"),
        (REGION_OCEANIA, "Oceania"),
        (REGION_ANTARCTICA, "Antarctica"),
    ]

    first_name = models.CharField(max_length=100)
    last_name = models.CharField(max_length=100)
    region = models.CharField(max_length=200, choices=REGIONS)
    location = models.CharField(max_length=255, blank=True, null=True) # exact city/country
    session = models.CharField(max_length=200)
    pod = models.CharField(max_length=200)
    internship = models.CharField(max_length=200)
    email = models.EmailField(unique=True)
    skills = models.TextField()
    additional_info = models.TextField()
    avatar = models.ImageField(upload_to="avatars", null=True, blank=True)
    slug = models.SlugField(unique=True)


# this helps in queries like "Is anyone in FinTech Nexus"
class Organization(models.Model):    
    ORGANIZATION_TYPE_COMPANY = "CO"
    ORGANIZATION_TYPE_EVENT = "EV"
    ORGANIZATION_TYPE_COMMUNITY = "CM"
    ORGANIZATION_TYPE_ACCELERATOR = "AC"
    ORGANIZATION_TYPE_NONPROFIT = "NP"
    ORGANIZATION_TYPE_UNIVERSITY = "UN"
    # ... add more types as needed

    ORGANIZATION_TYPES = [
        (ORGANIZATION_TYPE_COMPANY, "Company"),
        (ORGANIZATION_TYPE_EVENT, "Event/Conference"),
        (ORGANIZATION_TYPE_COMMUNITY, "Professional Community"),
        (ORGANIZATION_TYPE_ACCELERATOR, "Accelerator/Incubator"),
        (ORGANIZATION_TYPE_NONPROFIT, "Non-Profit Organization"),
        (ORGANIZATION_TYPE_UNIVERSITY, "University/Academic Institution"),
    ]

    name = models.CharField(max_length=255, unique=True, help_text="Official name of the organization (e.g., FinTech Nexus, Google, Y Combinator)")
    slug = models.SlugField(unique=True)
    type = models.CharField(max_length=2, choices=ORGANIZATION_TYPES, null=True, blank=True)
    description = models.TextField(blank=True, null=True, help_text="Brief description of the organization, its mission, or purpose.")
    website = models.URLField(max_length=2083, blank=True, null=True)

    def __str__(self):
        return self.name
    
    class Meta:
        ordering = ['name']


class Experience(models.Model):    
    network_member = models.ForeignKey(NetworkMember, on_delete=models.CASCADE, related_name="experiences")
    organization = models.ForeignKey(Organization, on_delete=models.CASCADE, related_name="affiliated-people")

    title = models.CharField(max_length=255, blank=True, null=True, help_text="Your role or title (e.g., Software Engineer, Attendee, Cohort Member)")
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
    is_current = models.BooleanField(default=False)
    description = models.TextField(blank=True, null=True, help_text="Describe your responsibilities, achievements, or what you learned/contributed.")

    def __str__(self):
        return f"{self.network_member.first_name} {self.network_member.last_name}'s experience at {self.organization.name} as {self.title or 'N/A'}"
    
    class Meta:
        ordering = ['-start_date', '-id'] # Order by newest experience first


class SocialLink(models.Model):
    title = models.CharField(max_length=100, null=True, blank=True)
    link = models.URLField(max_length=2083)
    description = models.TextField()
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
    slug = models.SlugField(unique=True)

    

class ProjectLink(models.Model):
    title = models.CharField(max_length=100, null=True, blank=True)
    link = models.URLField(max_length=2083)
    platform = models.CharField(max_length=200, null=True, blank=True) # indicate if it's LinkedIn, website, etc.
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name="project-links")


class Resources(models.Model):
    title = models.CharField(max_length=100, null=True, blank=True)
    slug = models.SlugField(unique=True)
    link = models.URLField(max_length=2083)
    platform = models.CharField(max_length=200, null=True, blank=True) # indicate if it's YC, blog, etc.
    description = models.TextField()



