import os
import django

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "UrRoadmap.settings")
django.setup()

from api.models import *

# --- Departments ---
cs = Department(dno=1, dname="Computer Science", manager_id=None)
ds = Department(dno=2, dname="Data Science", manager_id=None)
math = Department(dno=3, dname="Mathematics", manager_id=None)
cs.save(), ds.save(), math.save()

# --- Degree Programs ---
prog_cs = DegreeProgram(prog_name="BSc Computer Science")
prog_ds = DegreeProgram(prog_name="BSc Data Science")
prog_math = DegreeProgram(prog_name="BSc Mathematics")
prog_cs.save(), prog_ds.save(), prog_math.save()

# --- Textbooks ---
textbooks = [
    # CS
    Textbook(isbn="9780131103627", title="C Programming Language", edition_no=2, price=89.99),
    Textbook(isbn="9780134685991", title="Computer Networking", edition_no=5, price=69.99),
    Textbook(isbn="9780132350884", title="Clean Code", edition_no=1, price=39.99),
    Textbook(isbn="9780262033848", title="Introduction to Algorithms", edition_no=3, price=99.99),

    # DS
    Textbook(isbn="9781492041139", title="Hands-On Machine Learning with Scikit-Learn and TensorFlow", edition_no=2, price=89.99),
    Textbook(isbn="9780262035613", title="Deep Learning", edition_no=1, price=119.99),
    Textbook(isbn="9781119610418", title="Python for Data Analysis", edition_no=2, price=69.99),

    # Math
    Textbook(isbn="9780321781079", title="Linear Algebra and Its Applications", edition_no=4, price=89.99),
    Textbook(isbn="9781305253667", title="Calculus: Early Transcendentals", edition_no=8, price=149.99),
    Textbook(isbn="9780486650883", title="Introduction to Probability Theory", edition_no=3, price=29.99),
]
for t in textbooks:
    t.save()

# --- Teaching Staff (with Professors) ---

# Alice Nguyen (Computer Science, Systems)
e1 = Employee(eid=1001, fname="Alice", lname="Nguyen", salary=115000, dno=cs)
e1.save()
ts1 = TeachingStaff(employee=e1)
ts1.save()
p1 = Professor(teaching=ts1, research_area="Systems")
p1.save()

# David Kim (Data Science, Data Mining)
e2 = Employee(eid=1002, fname="David", lname="Kim", salary=120000, dno=ds)
e2.save()
ts2 = TeachingStaff(employee=e2)
ts2.save()
p2 = Professor(teaching=ts2, research_area="Data Mining")
p2.save()

# Emily Zhao (Mathematics, Probability)
e3 = Employee(eid=1003, fname="Emily", lname="Zhao", salary=110000, dno=math)
e3.save()
ts3 = TeachingStaff(employee=e3)
ts3.save()
p3 = Professor(teaching=ts3, research_area="Probability")
p3.save()

e7 = Employee(eid=1738, fname="Fetty", lname="Demetrius", salary=215000, dno=math)
e7.save()
ts7 = TeachingStaff(employee=e7)
ts7.save()
p4 = Professor(teaching=ts7, research_area="Probability Theory and Differentials")
p4.save()

e4 = Employee(eid=1004, fname="Pablo", lname="Hernandez", salary=69000, dno=math)
ts4 = TeachingStaff(employee=e4)
e4.save()
ts4.save()

# --- Courses ---
courses = [
    Course(course_code="CPSC471", course_title="Databases and Distributed Systems", textbook_isbn=textbooks[0], dno=cs),
    Course(course_code="CPSC441", course_title="Computer Networking", textbook_isbn=textbooks[1], dno=cs),
    Course(course_code="CPSC301", course_title="Intro to Computer Science", textbook_isbn=textbooks[2], dno=cs),
    Course(course_code="CPSC413", course_title="Algorithmic Thinking in CS", textbook_isbn=textbooks[3], dno=cs),

    Course(course_code="DATA301", course_title="Data and Statistics", textbook_isbn=textbooks[4], dno=ds),
    Course(course_code="DATA401", course_title="Identifying Manipulative Data", textbook_isbn=textbooks[5], dno=ds),
    Course(course_code="DATA211", course_title="Data and Properly Modeling It", textbook_isbn=textbooks[6], dno=ds),

    Course(course_code="MATH211", course_title="Intro to Linear Algebra", textbook_isbn=textbooks[7], dno=math),
    Course(course_code="MATH265", course_title="Intro to Calculus", textbook_isbn=textbooks[8], dno=math),
    Course(course_code="MATH381", course_title="Lambda Calculus", textbook_isbn=textbooks[9], dno=math),
]
for c in courses:
    c.save()

# --- Students ---
s1 = Student(student_id=2001, fname="Ali", lname="Khan")
s2 = Student(student_id=2002, fname="Maria", lname="Lopez")
s3 = Student(student_id=2003, fname="John", lname="Chen")
s1.save()
s2.save()
s3.save()

# --- Undergraduates ---
Undergraduate(student=s1, credits_completed=45, major=prog_cs, minor=prog_ds).save()
Undergraduate(student=s2, credits_completed=78, major=prog_ds, minor=prog_math).save()

# --- Graduates ---
Graduate(student=s3, thesis_title="Advanced Calculus in AI", research_area="Mathematics & AI", teaching=None).save()

s4 = Student(student_id=2004, fname="Pablo", lname="Hernandez")
s4.save()
Graduate(student=s4, thesis_title="Lambda Calculus Uses and Interpretations", research_area="Math and CS", teaching=ts4).save()

# --- Admin Staff ---
e5 = Employee(eid=3001, fname="Bob", lname="Smith", salary=55000, dno=cs)
e5.save()
e6 = Employee(eid=3002, fname="Sarah", lname="Lee", salary=58000, dno=ds)
e6.save()

AdminStaff(employee=e5).save()
AdminStaff(employee=e6).save()

# --- Sections ---
Section(scourse_code=courses[0], s_id=1, semester="Fall", instructor=ts1).save()
Section(scourse_code=courses[0], s_id=2, semester="Winter", instructor=ts1).save()

Section(scourse_code=courses[1], s_id=1, semester="Spring", instructor=ts1).save()
Section(scourse_code=courses[2], s_id=1, semester="Fall", instructor=ts1).save()
Section(scourse_code=courses[3], s_id=1, semester="Winter", instructor=ts1).save()

Section(scourse_code=courses[4], s_id=1, semester="Fall", instructor=ts2).save()
Section(scourse_code=courses[4], s_id=2, semester="Spring", instructor=ts2).save()

Section(scourse_code=courses[5], s_id=1, semester="Fall", instructor=ts2).save()
Section(scourse_code=courses[6], s_id=2, semester="Winter", instructor=ts2).save()

Section(scourse_code=courses[7], s_id=1, semester="Spring", instructor=ts3).save()
Section(scourse_code=courses[8], s_id=1, semester="Fall", instructor=ts3).save()
Section(scourse_code=courses[9], s_id=1, semester="Winter", instructor=ts3).save()

# --- HasTaken ---
HasTaken(scourse_code=courses[0], s_id=1, student=s1, grade="A", course_status='W').save()
HasTaken(scourse_code=courses[4], s_id=1, student=s2, grade="B+", course_status='C').save()
HasTaken(scourse_code=courses[8], s_id=1, student=s3, grade="A-", course_status='IP').save()

# --- Prerequisites ---
HasAsPreq(course_code=courses[3], prereq_code=courses[2]).save()  # CPSC413 ← CPSC301
HasAsPreq(course_code=courses[1], prereq_code=courses[2]).save()  # CPSC441 ← CPSC301
HasAsPreq(course_code=courses[0], prereq_code=courses[1]).save()  # CPSC471 ← CPSC441

HasAsPreq(course_code=courses[5], prereq_code=courses[6]).save()  # DATA401 ← DATA211
HasAsPreq(course_code=courses[2], prereq_code=courses[6]).save()  # CPSC301 ← DATA211
HasAsPreq(course_code=courses[1], prereq_code=courses[7]).save()  # CPSC441 ← MATH211
HasAsPreq(course_code=courses[2], prereq_code=courses[8]).save()  # CPSC301 ← MATH265

# --- Antirequisites ---
HasAsAntireq(course_code=courses[0], antireq_code=courses[5]).save()  # CPSC471 ↮ DATA401
HasAsAntireq(course_code=courses[4], antireq_code=courses[9]).save()  # DATA301 ↮ MATH381
HasAsAntireq(course_code=courses[5], antireq_code=courses[9]).save()  # DATA401 ↮ MATH381

print("Database populated with data.")
