# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models

class Section(models.Model): 
    id = models.AutoField(primary_key=True)
    scourse_code = models.ForeignKey('Course', models.CASCADE, db_column='SCourse_code')
    s_id = models.IntegerField(db_column='S_ID')
    semester = models.CharField(db_column='Semester', max_length=6, null=True)
    instructor = models.ForeignKey('TeachingStaff', models.SET_NULL, db_column='Instructor_id', null=True)

    class Meta:
        managed = False
        db_table = 'section'
        unique_together = (('scourse_code', 's_id'),)

class Course(models.Model): 
    course_code = models.CharField(db_column='Course_code', primary_key=True, max_length=10)  
    course_title = models.CharField(db_column='Course_title', max_length=50)
    textbook_isbn = models.ForeignKey('Textbook', on_delete=models.SET_NULL, db_column='Textbook_ISBN', null=True)
    dno = models.ForeignKey('Department', models.CASCADE, db_column='Dno')  # Course CANNOT exist without department

    class Meta:
        managed = False
        db_table = 'course'

class HasAsAntireq(models.Model): 
    course_code = models.ForeignKey(
        'Course',
        models.CASCADE,
        db_column='Course_code',
        related_name='hasasantireq_course_code_set'
    )
    antireq_code = models.ForeignKey('Course', models.CASCADE, db_column='Antireq_code')

    class Meta:
        managed = False
        db_table = 'has_as_antireq'
        unique_together = (('antireq_code', 'course_code'),)

    @property
    def pk(self):
        return (self.course_code, self.antireq_code)

class HasAsPreq(models.Model): 
    course_code = models.ForeignKey(
        'Course',
        models.CASCADE,
        db_column='Course_code',
        related_name='hasaspreq_course_code_set'
    )
    prereq_code = models.ForeignKey('Course', models.CASCADE, db_column='Prereq_code')

    class Meta:
        managed = False
        db_table = 'has_as_preq'
        unique_together = (('prereq_code', 'course_code'),)

    @property
    def pk(self):
        return (self.course_code, self.prereq_code)

class CourseGrade(models.TextChoices):
    APLUS = "A+", "A+"
    A = "A", "A"
    AMINUS = "A-", "A-"
    BPLUS = "B+", "B+"
    B = "B", "B"
    BMINUS = "B-", "B-"
    CPLUS = "C+", "C+"
    C = "C", "C"
    CMINUS = "C-", "C-"
    DPLUS = "D+", "D+"
    D = "D", "D"
    DMINUS = "D-", "D-"
    F = "F", "F"

class CourseStatus(models.TextChoices):
    IN_PROGRESS = "IP", "In progress"
    COMPLETED = "C", "Completed"
    WITHDRAWN = "W", "Withdrawn"
    FAILED = "F", "Failed"

class HasTaken(models.Model): 
    scourse_code = models.ForeignKey('Course', models.CASCADE, db_column='SCourse_code')
    s_id = models.IntegerField(db_column='S_ID')
    student = models.ForeignKey('Student', models.CASCADE, db_column='Student_id')

    grade = models.CharField(db_column='Course_grade', max_length=2, choices=CourseGrade.choices, null=True)
    course_status = models.CharField(db_column='Course_status', max_length=2, choices=CourseStatus.choices , null=True)

    class Meta:
        managed = False
        db_table = 'has_taken'
        unique_together = (('scourse_code', 's_id', 'student'),)

class Textbook(models.Model): 
    isbn = models.CharField(db_column='ISBN', primary_key=True, max_length=13)  
    title = models.CharField(db_column='Title', max_length=200)  
    edition_no = models.IntegerField(db_column='Edition_no', null=True)  
    price = models.FloatField(db_column='Price', null=True)  

    class Meta:
        managed = False
        db_table = 'textbook'

class DegreeProgram(models.Model): 
    prog_name = models.CharField(db_column='Prog_name', primary_key=True, max_length=50)

    class Meta:
        managed = False
        db_table = 'degree_program'

class Specialization(models.Model):
    id = models.AutoField(primary_key=True)
    sname = models.CharField(db_column='sname', max_length=50)
    program = models.ForeignKey(DegreeProgram, on_delete=models.CASCADE, db_column='prog_name')
    
    class Meta:
        managed = False
        db_table = 'specialization'
        unique_together = (('program', 'sname'),)
    
class Department(models.Model): 
    dno = models.AutoField(db_column='Dno', primary_key=True)
    dname = models.CharField(db_column='Dname', max_length=50)  
    manager_id = models.IntegerField(db_column='Manager_id', blank=True, null=True)  

    class Meta:
        managed = False
        db_table = 'department'

class Student(models.Model): 
    student_id = models.IntegerField(db_column='Student_id', primary_key=True)  
    fname = models.CharField(db_column='Fname', max_length=50)  
    lname = models.CharField(db_column='Lname', max_length=50)  

    class Meta:
        managed = False
        db_table = 'student'

class Graduate(models.Model): 
    student = models.OneToOneField('Student', models.CASCADE, db_column='Student_id', primary_key=True)  
    thesis_title = models.CharField(db_column='Thesis_title', max_length=100, null=True)  
    research_area = models.CharField(db_column='Research_area', max_length=50)  
    teaching = models.ForeignKey('TeachingStaff', models.SET_NULL, db_column='Teaching_id', null=True)  

    class Meta:
        managed = False
        db_table = 'graduate'

class Undergraduate(models.Model):
    student = models.OneToOneField('Student', models.CASCADE, db_column='student_id', primary_key=True)
    credits_completed = models.IntegerField(db_column='credits_completed', null=True)
    major = models.ForeignKey(DegreeProgram, models.SET_DEFAULT, 
                             db_column='major', default="Computer Science", 
                             related_name='major_students')
    specialization = models.ForeignKey(Specialization, models.SET_NULL, db_column='specialization_id', null=True)
    minor = models.ForeignKey(DegreeProgram, models.SET_NULL, db_column='minor', null=True, related_name='minor_students')
    
    class Meta:
        managed = False
        db_table = 'undergraduate'

class Employee(models.Model): 
    eid = models.AutoField(db_column='EID', primary_key=True)
    fname = models.CharField(db_column='Fname', max_length=50)  
    lname = models.CharField(db_column='Lname', max_length=50)  
    salary = models.IntegerField(db_column='Salary', null=True)  
    dno = models.ForeignKey('Department', models.SET_NULL, db_column='Dno', null=True)  

    class Meta:
        managed = False
        db_table = 'employee'

class TeachingStaff(models.Model): 
    employee = models.OneToOneField(Employee, models.CASCADE, db_column='EID', primary_key=True)

    class Meta:
        managed = False
        db_table = 'teaching_staff' 

class AdminStaff(models.Model): 
    employee = models.OneToOneField(Employee, models.CASCADE, db_column='EID', primary_key=True)

    class Meta:
        managed = False
        db_table = 'admin_staff'

class Professor(models.Model): 
    teaching = models.OneToOneField('TeachingStaff', models.CASCADE, db_column='Teaching_id', primary_key=True)  
    research_area = models.CharField(db_column='Research_area', max_length=50)  

    class Meta:
        managed = False
        db_table = 'professor'
