#this is just dummy data for now (i think). this is stored in the SQLlite database but we will need to migrate to mqsql later.
from django.contrib import admin
from .models import (
     AdminStaff, Course, DegreeProgram,
     Department, Graduate, 
     Professor, Student, 
     TeachingStaff, 
     Textbook, Undergraduate
)

admin.site.register(Department)
admin.site.register(DegreeProgram)
admin.site.register(AdminStaff)
admin.site.register(Professor)
admin.site.register(Student)
admin.site.register(Graduate)
admin.site.register(Undergraduate)
admin.site.register(TeachingStaff)
admin.site.register(Textbook)
admin.site.register(Course)
