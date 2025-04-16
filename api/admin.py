#this is just dummy data for now (i think). this is stored in the SQLlite database but we will need to migrate to mqsql later.
from django.contrib import admin
from .models import (
    Department, DegreeProgram, Employee, SupportStaff,
    AdminStaff, Professor, Student, Graduate, Undergraduate,
    TeachingStaff, Textbook, Course, CourseTextbook,
    Section, Enrollment
)

admin.site.register(Department)
admin.site.register(DegreeProgram)
admin.site.register(Employee)
admin.site.register(SupportStaff)
admin.site.register(AdminStaff)
admin.site.register(Professor)
admin.site.register(Student)
admin.site.register(Graduate)
admin.site.register(Undergraduate)
admin.site.register(TeachingStaff)
admin.site.register(Textbook)
admin.site.register(Course)
admin.site.register(CourseTextbook)
admin.site.register(Section)
admin.site.register(Enrollment)
