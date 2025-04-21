# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AdminStaff(models.Model):
    eid = models.IntegerField(db_column='EID', primary_key=True)  
    fname = models.CharField(db_column='Fname', max_length=50, blank=True, null=True)  
    lname = models.CharField(db_column='Lname', max_length=50, blank=True, null=True)  
    salary = models.IntegerField(db_column='Salary', blank=True, null=True)  
    dno = models.ForeignKey('Department', models.DO_NOTHING, db_column='Dno', blank=True, null=True)  

    class Meta:
        managed = False
        db_table = 'admin_staff'


class Course(models.Model): # DONE
    course_code = models.CharField(db_column='Course_code', primary_key=True, max_length=10)  
    textbook_isbn = models.ForeignKey('Textbook', on_delete=models.SET_NULL, db_column='Textbook_ISBN', null=True)
    prof = models.ForeignKey(
        'Professor', # WARNING: Should remove the foreign key and refer to possible sections to show teacher(s)
        on_delete=models.SET_DEFAULT, # course should not be deleted with a professor
        db_column='Prof_id', 
        default=1
    )
    dno = models.ForeignKey('Department', models.CASCADE, db_column='Dno')  # Course CANNOT exist without department

    class Meta:
        managed = False
        db_table = 'course'


class DegreeProgram(models.Model): # DONE
    prog_name = models.CharField(db_column='Prog_name', primary_key=True, max_length=50)

    class Meta:
        managed = False
        db_table = 'degree_program'

class Specialization(models.Model): # DONE
    sname = models.CharField(db_column='SName', max_length=50)
    prog_name = models.ForeignKey(
        'DegreeProgram',
        on_delete=models.CASCADE,
        db_column='Prog_name'
    )

    class Meta:
        managed = False
        db_table = 'specialization'
        unique_together = (('prog_name', 'sname'),)

    @property
    def pk(self):
        return (self.prog_name, self.sname)

class Department(models.Model): # DONE
    dno = models.AutoField(db_column='Dno', primary_key=True)
    dname = models.CharField(db_column='Dname', max_length=50)  
    manager_id = models.IntegerField(db_column='Manager_id', blank=True, null=True)  

    class Meta:
        managed = False
        db_table = 'department'


class Student(models.Model): # DONE
    student_id = models.IntegerField(db_column='Student_id', primary_key=True)  
    fname = models.CharField(db_column='Fname', max_length=50)  
    lname = models.CharField(db_column='Lname', max_length=50)  

    class Meta:
        managed = False
        db_table = 'student'


class Graduate(models.Model): # DONE
    student = models.OneToOneField('Student', models.CASCADE, db_column='Student_id', primary_key=True)  
    thesis_title = models.CharField(db_column='Thesis_title', max_length=100, null=True)  
    research_area = models.CharField(db_column='Research_area', max_length=50)  
    teaching = models.ForeignKey('TeachingStaff', models.SET_NULL, db_column='Teaching_id', null=True)  

    class Meta:
        managed = False
        db_table = 'graduate'


class Undergraduate(models.Model): # DONE
    student = models.OneToOneField(Student, models.CASCADE, db_column='Student_id', primary_key=True)  
    credits_completed = models.IntegerField(db_column='Credits_completed', null=True)  

    major = models.ForeignKey(DegreeProgram, models.SET_DEFAULT, db_column='Major', default="Computer Science")  
    specialization = models.ForeignKey(Specialization, models.SET_NULL, db_column='Specialization', null=True)
    minor = models.ForeignKey(DegreeProgram, models.SET_NULL, db_column='Minor', related_name='student_minor_set', null=True)  

    class Meta:
        managed = False
        db_table = 'undergraduate'


class HasAsAntireq(models.Model): # DONE
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


class HasAsPreq(models.Model): # DONE
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

class HasTaken(models.Model):
    course_code = models.ForeignKey(Course, models.DO_NOTHING, db_column='Course_code')
    student = models.ForeignKey('Student', models.DO_NOTHING, db_column='Student_id')
    grade = models.CharField(db_column='Grade', max_length=2, blank=True, null=True)
    course_status = models.IntegerField(db_column='Course_status', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'has_taken'
        unique_together = (('course_code', 'student'),)


class Professor(models.Model):
    eid = models.IntegerField(db_column='EID', primary_key=True)  
    fname = models.CharField(db_column='Fname', max_length=50, blank=True, null=True)  
    lname = models.CharField(db_column='Lname', max_length=50, blank=True, null=True)  
    salary = models.IntegerField(db_column='Salary', blank=True, null=True)  
    dno = models.ForeignKey(Department, models.DO_NOTHING, db_column='Dno', blank=True, null=True)  
    research_area = models.CharField(db_column='Research_area', max_length=50, blank=True, null=True)  
    teaching = models.ForeignKey('TeachingStaff', models.DO_NOTHING, db_column='Teaching_id', blank=True, null=True)  

    class Meta:
        managed = False
        db_table = 'professor'


class Section(models.Model): # DONE
    scourse_code = models.ForeignKey('Course', models.CASCADE, db_column='SCourse_code')
    s_id = models.IntegerField(db_column='S_ID')
    semester = models.CharField(db_column='Semester', max_length=6, null=True)
    instructor = models.ForeignKey('TeachingStaff', models.SET_NULL, db_column='Instructor_id', null=True)

    class Meta:
        managed = False
        db_table = 'section'
        unique_together = (('scourse_code', 's_id'),)


class SupportStaff(models.Model):
    eid = models.IntegerField(db_column='EID', primary_key=True)  
    fname = models.CharField(db_column='Fname', max_length=50, blank=True, null=True)  
    lname = models.CharField(db_column='Lname', max_length=50, blank=True, null=True)  
    salary = models.IntegerField(db_column='Salary', blank=True, null=True)  
    dno = models.IntegerField(db_column='Dno', blank=True, null=True)  

    class Meta:
        managed = False
        db_table = 'support_staff'


class TeachingStaff(models.Model):
    teaching_id = models.IntegerField(db_column='Teaching_ID', primary_key=True)  

    class Meta:
        managed = False
        db_table = 'teaching_staff' 


class Textbook(models.Model): # DONE
    isbn = models.CharField(db_column='ISBN', primary_key=True, max_length=13)  
    title = models.CharField(db_column='Title', max_length=200, blank=True)  
    edition_no = models.IntegerField(db_column='Edition_no', null=True)  
    price = models.FloatField(db_column='Price', null=True)  

    class Meta:
        managed = False
        db_table = 'textbook'


class WorksFor(models.Model):
    id = models.AutoField(primary_key=True)
    eid = models.ForeignKey(SupportStaff, models.DO_NOTHING, db_column='EID')
    dno = models.ForeignKey(Department, models.DO_NOTHING, db_column='Dno')

    class Meta:
        managed = False
        db_table = 'works_for'
        unique_together = (('eid', 'dno'),)
