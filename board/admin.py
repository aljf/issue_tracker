from django.contrib import admin
from .models import Board, Column, Task
from django.contrib.auth.admin import UserAdmin
from .user_models import User

# Register your models here.
admin.site.register(Board)
admin.site.register(Column)
admin.site.register(Task)
admin.site.register(User, UserAdmin)
