from django.db import models
from project.models import Project

# Create your models here.

def user_directory_path(instance, filename):
    # file will be uploaded to MEDIA_ROOT/user_<id>/<filename>
    return 'project_{0}/{1}'.format(instance.project_id, filename)


class Image(models.Model):
    project = models.ForeignKey(Project, on_delete = models.CASCADE)
    filename = models.FileField(max_length=128, upload_to = user_directory_path)
    image_info = models.JSONField(null=True)
    data = models.JSONField(null=True)
    def __str__(self):
        return self.filename
