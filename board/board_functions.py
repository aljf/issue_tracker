from .models import Board


def updateLastUsedForCurrentBoard(board):
    boards = Board.objects.filter()