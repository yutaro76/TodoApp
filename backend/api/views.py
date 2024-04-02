from .models import Task
from rest_framework import viewsets
from .serializers import TaskSerializer

# Create your views here.
class TaskViewSet(viewsets.ModelViewSet):
  queryset = Task.objects.all()
  serializer_class = TaskSerializer

  def get_queryset(self):
    queryset = Task.objects.all()
    deleted = self.request.query_params.get('deleted', None)
    completed = self.request.query_params.get('completed', None)

    if deleted is not None:
        queryset = queryset.filter(deleted=deleted.lower() == 'true')
    if completed is not None:
        queryset = queryset.filter(completed=completed.lower() == 'true')

    return queryset