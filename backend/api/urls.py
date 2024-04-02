from django.urls import path, include
from django.conf.urls import include
from rest_framework import routers
from api.views import TaskViewSet

router = routers.DefaultRouter()
router.register('tasks', TaskViewSet)

urlpatterns = [
  path('', include(router.urls)),
]