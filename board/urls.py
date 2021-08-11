from django.urls import path
from . import views

urlpatterns = [
    # path('<int:task_id>/', views.task_detail, name='task_detail'),
    path('', views.LastUsedBoardView.as_view(), name='last_used_board_view'),
    path('<int:pk>/', views.BoardView.as_view(), name='board_detail_view'),
    path('api/<int:pk>/edit_board_name', views.EditBoardNameView.as_view(), name="edit_board_name"),
    path('api/<int:pk>/', views.BoardAPIView.as_view(), name='board_detail_api_view'),
    path('api/add_task/<int:column_id>/', views.AddTaskAPIView.as_view(), name="add_task"),
    path('api/change_task_title/', views.ChangeTaskTitleView.as_view(), name="change_task_title"),
    path('api/delete_task/', views.RemoveTaskView.as_view(), name="delete_task"),
    path('api/delete_column/', views.RemoveColumnView.as_view(), name="delete_column"),
    path('api/change_column_name/', views.ChangeColumnTitleView.as_view(), name="change_column_name"),
    path('api/select_board/', views.SelectBoardAPIView.as_view(), name="select_board"),
    path('api/change_last_used_board/<int:board_id>/', views.ChangeLastUsedBoardView.as_view(), name="change_last_used_board"),
    path('api/add_column/<int:board_id>/', views.AddColumnAPIView.as_view(), name="add_column"),
    path('api/change_task_column/<int:task_id>/', views.ChangeTaskColumnAPIView.as_view(), name="change_task_column"),
]
