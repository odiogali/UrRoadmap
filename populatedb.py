import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "UrRoadmap.settings")
django.setup()

from api.models import *

# 1. Department
dept = Department(dno=1, dname="Computer Science", manager_id=None)
dept.save()

# 2. Degree Program
prog = DegreeProgram(prog_name="Data Science", specialization="AI")
prog.save()

# 3. Textbook
textbook = Textbook(isbn="1234567890", title="Intro to ML", edition_no=1, price=79.99)
textbook.save()

# 4. Teaching Staff
teaching = TeachingStaff(teaching_id=1)
teaching.save()

# 5. Professor
prof = Professor(eid=1001, fname="Jane", lname="Doe", salary=120000, dno=dept, research_area="AI", teaching=teaching)
prof.save()

# 6. Course
course = Course(course_code="CPSC471", textbook_isbn=textbook.isbn, prof=prof, dno=dept)
course.save()

# 7. Another course for prereq/antireq
course2 = Course(course_code="CPSC219", textbook_isbn=None, prof=prof, dno=dept)
course2.save()

# 8. Student
student = Student(student_id=2001, fname="Ali", lname="Khan", major=prog, minor=prog)
student.save()

# 9. Undergraduate
ug = Undergraduate(student=student, credits_completed=30)
ug.save()

# 10. Graduate
grad = Graduate(student=student, thesis_title="AI in Medicine", research_area="AI", teaching=teaching)
grad.save()

# 11. Support Staff
support = SupportStaff(eid=3001, fname="Sara", lname="Lee", salary=55000, dno=dept.dno)
support.save()

# 12. Admin Staff
admin = AdminStaff(eid=4001, fname="Bob", lname="Smith", salary=60000, dno=dept)
admin.save()

# 13. Works For
works = WorksFor(eid=support, dno=dept)
works.save()

# 14. Section
section = Section(scourse_code=course, s_id=1, semester="Fall", instructor=teaching)
section.save()

# 15. HasTaken
taken = HasTaken(course_code=course, student=student, grade="A", course_status=True)
taken.save()

# 16. HasAsPreq
preq = HasAsPreq(prereq_code=course2, course_code=course)
preq.save()

# 17. HasAsAntireq
anti = HasAsAntireq(antireq_code=course2, course_code=course)
anti.save()

# 18. Requires
req = Requires(course_code=course, isbn=textbook)
req.save()

print("Database successfully populated with one row per table.")

