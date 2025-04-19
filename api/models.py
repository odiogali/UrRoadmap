# This is an auto-generated Django model module.
# You'll have to do the following manually to clean this up:
#   * Rearrange models' order
#   * Make sure each model has one field with primary_key=True
#   * Make sure each ForeignKey and OneToOneField has `on_delete` set to the desired behavior
#   * Remove `managed = False` lines if you wish to allow Django to create, modify, and delete the table
# Feel free to rename the models, but don't rename db_table values or field names.
from django.db import models


class AdminStaff(models.Model):
    eid = models.IntegerField(db_column='EID', primary_key=True)  # Field name made lowercase.
    fname = models.CharField(db_column='Fname', max_length=50, blank=True, null=True)  # Field name made lowercase.
    lname = models.CharField(db_column='Lname', max_length=50, blank=True, null=True)  # Field name made lowercase.
    salary = models.IntegerField(db_column='Salary', blank=True, null=True)  # Field name made lowercase.
    dno = models.ForeignKey('Department', models.DO_NOTHING, db_column='Dno', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'admin_staff'


class Course(models.Model):
    course_code = models.CharField(db_column='Course_code', primary_key=True, max_length=10)  # Field name made lowercase.
    textbook_isbn = models.CharField(db_column='Textbook_ISBN', max_length=20, blank=True, null=True)  # Field name made lowercase.
    prof = models.ForeignKey('Professor', models.DO_NOTHING, db_column='Prof_id', blank=True, null=True)  # Field name made lowercase.
    dno = models.ForeignKey('Department', models.DO_NOTHING, db_column='Dno', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'course'


class DegreeProgram(models.Model):
    prog_name = models.CharField(db_column='Prog_name', primary_key=True, max_length=50)  # Field name made lowercase.
    specialization = models.CharField(db_column='Specialization', max_length=50, blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'degree_program'


class Department(models.Model):
    dno = models.IntegerField(db_column='Dno', primary_key=True)  # Field name made lowercase.
    dname = models.CharField(db_column='Dname', max_length=50, blank=True, null=True)  # Field name made lowercase.
    manager_id = models.IntegerField(db_column='Manager_id', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'department'


class Graduate(models.Model):
    student = models.OneToOneField('Student', models.DO_NOTHING, db_column='Student_id', primary_key=True)  # Field name made lowercase.
    thesis_title = models.CharField(db_column='Thesis_title', max_length=100, blank=True, null=True)  # Field name made lowercase.
    research_area = models.CharField(db_column='Research_area', max_length=50, blank=True, null=True)  # Field name made lowercase.
    teaching = models.ForeignKey('TeachingStaff', models.DO_NOTHING, db_column='Teaching_id', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'graduate'


class HasAsAntireq(models.Model):
    id = models.AutoField(primary_key=True)
    antireq_code = models.ForeignKey(Course, models.DO_NOTHING, db_column='Antireq_code')
    course_code = models.ForeignKey(Course, models.DO_NOTHING, db_column='Course_code', related_name='hasasantireq_course_code_set')

    class Meta:
        managed = False
        db_table = 'has_as_antireq'
        unique_together = (('antireq_code', 'course_code'),)

    @property
    def pk(self):
        return (self.antireq_code, self.course_code)


class HasAsPreq(models.Model):
    id = models.AutoField(primary_key=True)
    prereq_code = models.ForeignKey(Course, models.DO_NOTHING, db_column='Prereq_code')
    course_code = models.ForeignKey(Course, models.DO_NOTHING, db_column='Course_code', related_name='hasaspreq_course_code_set')

    class Meta:
        managed = False
        db_table = 'has_as_preq'
        unique_together = (('prereq_code', 'course_code'),)

    @property
    def pk(self):
        return (self.prereq_code, self.course_code)

class HasTaken(models.Model):
    id = models.AutoField(primary_key=True)
    course_code = models.ForeignKey(Course, models.DO_NOTHING, db_column='Course_code')
    student = models.ForeignKey('Student', models.DO_NOTHING, db_column='Student_id')
    grade = models.CharField(db_column='Grade', max_length=2, blank=True, null=True)
    course_status = models.IntegerField(db_column='Course_status', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'has_taken'
        unique_together = (('course_code', 'student'),)


class Professor(models.Model):
    eid = models.IntegerField(db_column='EID', primary_key=True)  # Field name made lowercase.
    fname = models.CharField(db_column='Fname', max_length=50, blank=True, null=True)  # Field name made lowercase.
    lname = models.CharField(db_column='Lname', max_length=50, blank=True, null=True)  # Field name made lowercase.
    salary = models.IntegerField(db_column='Salary', blank=True, null=True)  # Field name made lowercase.
    dno = models.ForeignKey(Department, models.DO_NOTHING, db_column='Dno', blank=True, null=True)  # Field name made lowercase.
    research_area = models.CharField(db_column='Research_area', max_length=50, blank=True, null=True)  # Field name made lowercase.
    teaching = models.ForeignKey('TeachingStaff', models.DO_NOTHING, db_column='Teaching_id', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'professor'


class Requires(models.Model):
    id = models.AutoField(primary_key=True)
    course_code = models.ForeignKey(Course, models.DO_NOTHING, db_column='Course_code')
    isbn = models.ForeignKey('Textbook', models.DO_NOTHING, db_column='ISBN')

    class Meta:
        managed = False
        db_table = 'requires'
        unique_together = (('course_code', 'isbn'),)


class Section(models.Model):
    id = models.AutoField(primary_key=True)
    scourse_code = models.ForeignKey(Course, models.DO_NOTHING, db_column='SCourse_code')
    s_id = models.IntegerField(db_column='S_ID')
    semester = models.CharField(db_column='Semester', max_length=6, blank=True, null=True)
    instructor = models.ForeignKey('TeachingStaff', models.DO_NOTHING, db_column='Instructor_id', blank=True, null=True)

    class Meta:
        managed = False
        db_table = 'section'
        unique_together = (('scourse_code', 's_id'),)


class Student(models.Model):
    student_id = models.IntegerField(db_column='Student_id', primary_key=True)  # Field name made lowercase.
    fname = models.CharField(db_column='Fname', max_length=50, blank=True, null=True)  # Field name made lowercase.
    lname = models.CharField(db_column='Lname', max_length=50, blank=True, null=True)  # Field name made lowercase.
    major = models.ForeignKey(DegreeProgram, models.DO_NOTHING, db_column='Major', blank=True, null=True)  # Field name made lowercase.
    minor = models.ForeignKey(DegreeProgram, models.DO_NOTHING, db_column='Minor', related_name='student_minor_set', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'student'


class SupportStaff(models.Model):
    eid = models.IntegerField(db_column='EID', primary_key=True)  # Field name made lowercase.
    fname = models.CharField(db_column='Fname', max_length=50, blank=True, null=True)  # Field name made lowercase.
    lname = models.CharField(db_column='Lname', max_length=50, blank=True, null=True)  # Field name made lowercase.
    salary = models.IntegerField(db_column='Salary', blank=True, null=True)  # Field name made lowercase.
    dno = models.IntegerField(db_column='Dno', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'support_staff'


class TeachingStaff(models.Model):
    teaching_id = models.IntegerField(db_column='Teaching_ID', primary_key=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'teaching_staff'


class Textbook(models.Model):
    isbn = models.CharField(db_column='ISBN', primary_key=True, max_length=20)  # Field name made lowercase.
    title = models.CharField(db_column='Title', max_length=200, blank=True, null=True)  # Field name made lowercase.
    edition_no = models.IntegerField(db_column='Edition_no', blank=True, null=True)  # Field name made lowercase.
    price = models.FloatField(db_column='Price', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'textbook'


class Undergraduate(models.Model):
    student = models.OneToOneField(Student, models.DO_NOTHING, db_column='Student_id', primary_key=True)  # Field name made lowercase.
    credits_completed = models.IntegerField(db_column='Credits_completed', blank=True, null=True)  # Field name made lowercase.

    class Meta:
        managed = False
        db_table = 'undergraduate'


class WorksFor(models.Model):
    id = models.AutoField(primary_key=True)
    eid = models.ForeignKey(SupportStaff, models.DO_NOTHING, db_column='EID')
    dno = models.ForeignKey(Department, models.DO_NOTHING, db_column='Dno')

    class Meta:
        managed = False
        db_table = 'works_for'
        unique_together = (('eid', 'dno'),)
