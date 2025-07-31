import numpy as np
import openai
from django.core.management.base import BaseCommand
from . import models

class Command(BaseCommand):
    help = 'Generate and store embeddings for all profiles'

    def handle(self, *args, **kwargs):
        members = models.NetworkMember.objects.all()

        for member in members:
            content = f"{member.skills} {member.additional_info}"
            response = openai.embeddings.create(
                model="text-embedding-3-small",
                input=content
            )
            embedding = response.data[0].embedding
            member.embedding = embedding
            member.save()
