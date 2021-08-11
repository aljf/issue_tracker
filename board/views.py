from django.shortcuts import render, redirect
from django.http import HttpResponse, JsonResponse
from django.views.generic import TemplateView, View
from board.forms import RegisterForm
from django.contrib.auth.mixins import LoginRequiredMixin
from rest_framework.response import Response
from .models import Board
from .serializers import *
import json
from .user_models import User


class BaseView(LoginRequiredMixin, View):

    def dispatch(self, request, *args, **kwargs):
        pass


class LastUsedBoardView(LoginRequiredMixin, View):

    def get(self, request):
        # last_board_id = request.user.last_used_board
        requesting_user = User.objects.get(id=request.user.id)
        last_board_id = requesting_user.last_used_board
        if last_board_id:
            return redirect('board_detail_view', pk=last_board_id)
        else:
            new_board = Board.objects.create(name="My 1st Board", archived=False)
            requesting_user.last_used_board = new_board.id
            requesting_user.save()
            new_board.users.add(requesting_user)
            new_board.save()
            return redirect('board_detail_view', pk=new_board.id)


class BoardView(LoginRequiredMixin, View):
    login_url = '/login/'
    template_name = 'board.html'

    def get(self, request, pk):
        request.user.last_used_board = Board.objects.get(id=pk).id
        request.user.save()
        return HttpResponse(render(request, self.template_name))
        # data = request.POST or None
        # serializer = BoardSerializer(data=data)
        # if serializer.is_valid():
        # return JsonResponse({}, status=400)


class BoardAPIView(LoginRequiredMixin, View):
    board = None

    def get(self, request, pk):
        self.board = Board.objects.get(id=pk)
        return JsonResponse(self.board.serialize(request.user), status=200)

    def post(self, request, pk):
        # create a board serializer which includes two columns and one card on each
        json_request = json.loads(request.body)
        json_request.update({'user': request.user.id})
        if json_request['process'] == "createBoard":
            serializer = BoardSerializer(instance=json_request['name'])
            new_board = serializer.create(validated_data=json_request)
            redirect_url = {"redirect_url": "/%s/" % new_board.id}
            return JsonResponse(redirect_url, content_type="application/json", status=200)
        else:
            return Response({}, status=400)


class EditBoardNameView(LoginRequiredMixin, View):
    instance = None
    json_data = None

    def post(self, request, pk):
        self.json_data = json.loads(request.body)
        self.instance = Board.objects.get(id=self.json_data['board_id'])
        serializer = BoardSerializer(instance=self.instance, data=self.json_data)
        if serializer.is_valid(raise_exception=True):
            serializer.save(board_name=self.json_data['name'])
            self.instance.save()
            return JsonResponse({"success": "true"}, status=200)
        else:
            return Response({}, status=400)


class AddTaskAPIView(LoginRequiredMixin, View):

    def post(self, request, column_id):
        """
        :param request:
        :param column_id:
        :return: JsonResponse with serializer data
        """

        serializer = TaskSerializer(data=json.loads(request.body) or None)
        if serializer.is_valid(raise_exception=True):
            serializer.save(column_id=column_id)
            return JsonResponse(serializer.data, content_type="application/json", status=200)
        return Response({}, status=400)


class AddColumnAPIView(LoginRequiredMixin, View):

    def post(self, request, board_id):
        """
        :param request:
        :param board_id:
        :return: JsonResponse with serializer data
        """
        serializer = ColumnSerializer(data=json.loads(request.body) or None)
        if serializer.is_valid(raise_exception=True):
            column = serializer.save(board_id=board_id)
            json_data = {}
            json_data['id'] = serializer.data['id']
            json_data['boardID'] = column.board_id
            json_data['column_name'] = serializer.data['column_name']
            json_data['tasks'] = []
            tasks = column.task_set.all()
            for t in tasks:
                json_data['tasks'].append({"id": t.id,
                                          "title": t.title})
            print(json_data)
            return JsonResponse(json_data, content_type="application/json", status=200)
        return Response({}, status=400)


class ChangeTitleAPIView(LoginRequiredMixin, View):
    title_serializer = None
    json_data = None
    instance = None

    def post(self, request):
        if self.title_serializer.is_valid(raise_exception=True):
            self.title_serializer.save()
            self.instance.save()
            return JsonResponse(self.title_serializer.data, content_type="application/json", status=200)
        else:
            return Response({}, status=400)


class ChangeTaskTitleView(ChangeTitleAPIView):

    def post(self, request):
        self.json_data = json.loads(request.body)
        if self.json_data['id']:
            self.instance = Task.objects.get(id=self.json_data['id'])
            self.title_serializer = TaskSerializer(instance=self.instance, data=self.json_data)
            return super().post(self)
        else:
            return JsonResponse({"error": "No ID"}, status=500)


class RemoveTaskView(LoginRequiredMixin, View):
    json_data = None

    def post(self, request):
        self.json_data = json.loads(request.body)
        if self.json_data['id']:
            self.instance = Task.objects.get(id=self.json_data['id'])
            self.instance.delete()
            return JsonResponse({"success": "true"}, status=200)
        else:
            return JsonResponse({"error": "No ID"}, status=500)


class RemoveColumnView(LoginRequiredMixin, View):
    json_data = None

    def post(self, request):
        self.json_data = json.loads(request.body)
        if self.json_data['id']:
            self.instance = Column.objects.get(id=self.json_data['id'])
            self.instance.delete()
            return JsonResponse({"success": "true"}, status=200)
        else:
            return JsonResponse({"error": "No ID"}, status=500)


class ChangeColumnTitleView(ChangeTitleAPIView):

    def post(self, request):
        self.json_data = json.loads(request.body)
        if self.json_data['id']:
            self.instance = Column.objects.get(id=self.json_data['id'])
            self.json_data.update({'board': self.instance.board.id})
            self.title_serializer = ColumnSerializer(instance=self.instance, data=self.json_data)
            return super().post(self)
        else:
            return JsonResponse({"error": "No ID"}, status=500)


class SelectBoardAPIView(LoginRequiredMixin, View):
    json_data = None

    def get(self, request):
        self.json_data = {'ids': [], 'names': []}
        boards = Board.objects.filter(users__in=[request.user])
        for board in boards:
            self.json_data['ids'].append(board.id)
            self.json_data['names'].append(board.name)
        return JsonResponse(self.json_data, content_type="application/json", status=200)


class ChangeLastUsedBoardView(LoginRequiredMixin, View):

    def post(self, request, board_id):
        request.user.last_used_board = board_id
        request.user.save()
        return JsonResponse({"success": "true"}, status=200)


class ChangeTaskColumnAPIView(LoginRequiredMixin, View):
    json_data = None

    def post(self, request, task_id):
        self.json_data = json.loads(request.body)
        if self.json_data:
            task = Task.objects.get(id=task_id)
            task.column = Column.objects.get(id=self.json_data['newColumnID'])
            task.save()
            self.json_data.update({'id': task.id, 'title': task.title})
            return JsonResponse(self.json_data, content_type="application/json", status=200)


def register(response):
    if response.method == "POST":
        form = RegisterForm(response.POST)
        if form.is_valid():
            form.save()
            return redirect('last_used_board_view')
    else:
        form = RegisterForm()
    return render(response, "register.html", {"form": form})
