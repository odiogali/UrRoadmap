from django.db import models

# Create your models here.
class Department(models.Model):
    name = models.CharField(max_length=100)
    
    # def __str__(self):
    #     return self.name

class DegreeProgram(models.Model):
    name = models.CharField(max_length=100)
    type = models.CharField(max_length=50)  # e.g., "Bachelor's", "Master's", "PhD"
    
    def __str__(self):
        return f"{self.name} ({self.type})"

class Employee(models.Model):
    eid = models.CharField(max_length=20, unique=True)
    fname = models.CharField(max_length=50)
    lname = models.CharField(max_length=50)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    
    def __str__(self):
        return f"{self.fname} {self.lname}"

class SupportStaff(Employee):
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='support_staff')
    
    class Meta:
        verbose_name = "Support Staff"
        verbose_name_plural = "Support Staff"

class AdminStaff(Employee):
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='admin_staff')
    
    class Meta:
        verbose_name = "Administrative Staff"
        verbose_name_plural = "Administrative Staff"

class Professor(Employee):
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='professors')
    
    def __str__(self):
        return f"Prof. {self.fname} {self.lname}"

class TeachingStaff(Employee):
    pass
    
    class Meta:
        verbose_name = "Teaching Staff"
        verbose_name_plural = "Teaching Staff"

class Textbook(models.Model):
    isbn = models.CharField(max_length=13, unique=True)
    title = models.CharField(max_length=200)
    edition_no = models.CharField(max_length=2, null=True, blank=True)
    price = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    
    # def __str__(self):
    #     return self.title

class Course(models.Model):
    code = models.CharField(max_length=20, unique=True)
    name = models.CharField(max_length=200)
    department = models.ForeignKey(Department, on_delete=models.CASCADE, related_name='courses')
    textbooks = models.ManyToManyField(Textbook, through='CourseTextbook')
    prerequisites = models.ManyToManyField('self', symmetrical=False, blank=True, related_name='is_prerequisite_for')
    
    def __str__(self):
        return f"{self.code}: {self.name}"

class CourseTextbook(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    textbook = models.ForeignKey(Textbook, on_delete=models.CASCADE)
    is_required = models.BooleanField(null=True)
    
    class Meta:
        unique_together = ('course', 'textbook')

class Section(models.Model):
    course = models.ForeignKey(Course, on_delete=models.CASCADE, related_name='sections')
    instructor = models.ForeignKey(TeachingStaff, on_delete=models.CASCADE, related_name='teaching_sections')
    semester = models.CharField(max_length=20)  # e.g., "Fall 2024"
    section_id = models.CharField(max_length=10)  # e.g., "A", "B", "001"
    
    class Meta:
        unique_together = ('course', 'section_id', 'semester')
    
    # def __str__(self):
    #     return f"{self.course.code}-{self.section_id} ({self.semester})"

class Student(models.Model):
    STUDENT_TYPES = [
        ('U', 'Undergraduate'),
        ('G', 'Graduate'),
    ]
    
    student_id = models.CharField(max_length=20, unique=True)
    fname = models.CharField(max_length=50)
    lname = models.CharField(max_length=50)
    student_type = models.CharField(max_length=1, choices=STUDENT_TYPES)
    degree_program = models.ForeignKey(DegreeProgram, on_delete=models.CASCADE, related_name='students')
    gpa = models.FloatField(null=True, blank=True)
    majors = models.ManyToManyField(Department, related_name='majoring_students')
    minors = models.ManyToManyField(Department, related_name='minoring_students', blank=True)
    status = models.CharField(max_length=20)  # e.g., "Active", "Graduated", "On Leave"
    
    def __str__(self):
        return f"{self.fname} {self.lname} ({self.student_id})"

class Graduate(Student):
    thesis = models.CharField(max_length=255, null=True, blank=True)
    research_area = models.CharField(max_length=100, null=True, blank=True)
    
    def save(self, *args, **kwargs):
        self.student_type = 'G'
        super().save(*args, **kwargs)

class Undergraduate(Student):
    credits_completed = models.IntegerField()
    
    def save(self, *args, **kwargs):
        self.student_type = 'U'
        super().save(*args, **kwargs)

class Enrollment(models.Model):
    GRADE_CHOICES = [
        ('A', 'A'), ('B', 'B'), ('C', 'C'), ('D', 'D'), ('F', 'F'),
        ('P', 'Pass'), ('NP', 'Not Pass'), ('W', 'Withdrawn'), ('I', 'Incomplete')
    ]
    
    student = models.ForeignKey(Student, on_delete=models.CASCADE, related_name='enrollments')
    section = models.ForeignKey(Section, on_delete=models.CASCADE, related_name='enrollments')
    grade = models.CharField(max_length=2, choices=GRADE_CHOICES, null=True, blank=True)
    
    class Meta:
        unique_together = ('student', 'section')
    
    def __str__(self):
        return f"{self.student} in {self.section}"
