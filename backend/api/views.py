from .models import Task
from rest_framework import viewsets
from .serializers import TaskSerializer

# Create your views here.
class TaskViewSet(viewsets.ModelViewSet):
  queryset = Task.objects.all()
  serializer_class = TaskSerializer

  def get_queryset(self):
    queryset = Task.objects.all()
    removed = self.request.query_params.get('removed', None)
    checked = self.request.query_params.get('checked', None)

    if removed is not None:
        queryset = queryset.filter(removed=removed.lower() == 'true')
    if checked is not None:
        queryset = queryset.filter(checked=checked.lower() == 'true')

    return queryset