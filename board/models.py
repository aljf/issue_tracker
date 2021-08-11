from django.db import models
from django.conf import settings
from django.contrib.auth.models import Group
from .user_models import User
from ordered_model.models import OrderedModel

import textwrap
import datetime

Model = models.Model

TO_DO = 0
IN_PROGRESS = 1
COMPLETED = 2
STATUS_CHOICES = {
    (TO_DO, 'TO DO'),
    (IN_PROGRESS, 'In Progress'),
    (COMPLETED, 'Completed')
}


class Board(Model):
    users = models.ManyToManyField(User, null=True, blank=True)
    name = models.CharField(max_length=140, null=True, blank=True)
    archived = models.BooleanField(null=True, blank=True)

    objects = models.Manager()

    def serialize(self, user):
        columns = []
        for c in self.column_set.all():
            col_data = {"id": c.id, 'column_name': c.column_name, "tasks": []}
            for t in c.task_set.all().order_by('order'):
                col_data['tasks'].append({"id": t.id,
                                          "title": t.title})
            columns.append(col_data)
        return {'response': [{"id": self.id, "board_name": self.name, "columns": columns, "username": user.username}]}


class Column(Model):
    column_name = models.CharField(max_length=140, null=True, blank=True)
    board = models.ForeignKey(Board, on_delete=models.CASCADE, null=True)

    objects = models.Manager()


class Task(OrderedModel):
    title = models.CharField(max_length=140)
    column = models.ForeignKey(Column, on_delete=models.CASCADE, null=True)
    created_date = models.DateField(blank=True, null=True, auto_now_add=True)
    due_date = models.DateField(blank=True, null=True)
    status = models.IntegerField(choices=STATUS_CHOICES, default=TO_DO)
    completed_date = models.DateField(blank=True, null=True)
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        null=True,
        blank=True,
        related_name="todo_created_by",
        on_delete=models.CASCADE,
    )
    assigned_to = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        blank=True,
        null=True,
        related_name="todo_assigned_to",
        on_delete=models.CASCADE,
    )
    note = models.TextField(blank=True, null=True)
    priority = models.PositiveIntegerField(blank=True, null=True)
    order_with_respect_to = 'column'

    class Meta(OrderedModel.Meta):
        pass

    objects = models.Manager()

    def save(self, **kwargs):
        # When a task is created the created_date is set to now
        if not self.pk:
            self.created_date = datetime.datetime.now()
        # If Task is being marked complete, set the completed_date
        if self.status == COMPLETED:
            self.completed_date = datetime.datetime.now()
        super(Task, self).save()


class Comment(Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, blank=True, null=True)
    task = models.ForeignKey(Task, on_delete=models.CASCADE)
    date = models.DateTimeField(default=datetime.datetime.now)

    body = models.TextField(blank=True)

    objects = models.Manager()

    @property
    def author_text(self):
        if self.author is not None:
            return str(self.author)

    @property
    def snippet(self):
        body_snippet = textwrap.shorten(self.body, width=35, placeholder="...")
        # Define here rather than in __str__ so we can use it in the admin list_display
        return "{author} - {snippet}...".format(author=self.author_text, snippet=body_snippet)

    def __str__(self):
        return self.snippet

