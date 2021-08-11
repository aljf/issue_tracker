from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    last_used_board = models.IntegerField(blank=True, null=True)