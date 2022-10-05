from django.db import models

# Create your models here.
class Project(models.Model):
    projecName = models.CharField(verbose_name="Project name", max_length=30)
    labelType_choices = (
        (1, "Video"),
        (2, "Image"),
    )
    labelType = models.SmallIntegerField(verbose_name="Label Type", choices=labelType_choices)
    def __str__(self):
        return self.projecName
