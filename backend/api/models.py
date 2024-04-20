from django.db import models

# Create your models here.
class Task(models.Model):
  value = models.CharField(max_length=50)
  checked = models.BooleanField(default=False)
  removed = models.BooleanField(default=False)

  def __str__(self):
    return self.value
