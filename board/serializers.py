from rest_framework import serializers
from .models import Task, Board, Column
from django.contrib.auth import get_user_model

User = get_user_model()

MAX_TITLE_LENGTH = 150


class BoardSerializer(serializers.ModelSerializer):
    class Meta:
        model = Board
        fields = '__all__'

    columns = serializers.SerializerMethodField(read_only=True)

    # def get_columns(self, obj):
    #     return obj.column_set.all()

    def create(self, validated_data):
        column_names = ['Todo', 'In Progress', 'Done']
        board = Board.objects.create(name=validated_data.get('name'))
        board.users.add(User.objects.get(id=validated_data.get('user')))
        for column_name in column_names:
            # column_serializer = ColumnSerializer(data={'column_name': column_name, 'board_id': board.id})
            # if column_serializer.is_valid():
            #     column_serializer.save()
            Column.objects.create(column_name=column_name, board=board)
        return board


class TaskSerializer(serializers.ModelSerializer):
    class Meta:
        model = Task
        exclude = ['note']

    def validate_title(self, value):
        if len(value) > MAX_TITLE_LENGTH:
            raise serializers.ValidationError("This Title is too long")
        return value

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        return instance


class ColumnSerializer(serializers.ModelSerializer):
    class Meta:
        model = Column
        fields = '__all__'

    def validate_column_name(self, value):
        if len(value) > MAX_TITLE_LENGTH:
            raise serializers.ValidationError("This Title is too long")
        return value