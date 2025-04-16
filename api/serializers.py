from rest_framework import serializers
from .models import (Department, DegreeProgram, Employee, SupportStaff, 
                   AdminStaff, Professor, Student, Graduate, 
                   Undergraduate, TeachingStaff, Textbook, Course, 
                   CourseTextbook, Section, Enrollment)

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = ['name']

class DegreeProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = DegreeProgram
        fields = ['name', 'degree_type']

class EmployeeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Employee
        fields = ['id', 'fname', 'lname', 'salary']

class SupportStaffSerializer(serializers.ModelSerializer):
    employee_details = EmployeeSerializer(source='employee', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    
    class Meta:
        model = SupportStaff
        fields = ['employee', 'employee_details', 'department', 'department_name']

class AdminStaffSerializer(serializers.ModelSerializer):
    employee_details = EmployeeSerializer(source='employee', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    
    class Meta:
        model = AdminStaff
        fields = ['employee', 'employee_details', 'department', 'department_name']

class ProfessorSerializer(serializers.ModelSerializer):
    employee_details = EmployeeSerializer(source='employee', read_only=True)
    department_name = serializers.CharField(source='department.name', read_only=True)
    
    class Meta:
        model = Professor
        fields = ['employee', 'employee_details', 'department', 'department_name']

class TeachingStaffSerializer(serializers.ModelSerializer):
    professor_details = ProfessorSerializer(source='professor', read_only=True)
    graduate_details = serializers.SerializerMethodField()
    
    class Meta:
        model = TeachingStaff
        fields = ['id', 'professor', 'professor_details', 'graduate_student', 'graduate_details']
    
    def get_graduate_details(self, obj):
        if obj.graduate_student:
            return {
                'id': obj.graduate_student.student_id,
                'name': f"{obj.graduate_student.fname} {obj.graduate_student.lname}",
                'research_area': obj.graduate_student.research_area
            }
        return None

class TextbookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Textbook
        fields = ['isbn', 'title', 'edition_no', 'price']

class CourseSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    
    class Meta:
        model = Course
        fields = ['code', 'name', 'department', 'department_name']

class CourseDetailSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='department.name', read_only=True)
    textbooks = TextbookSerializer(many=True, read_only=True)
    prerequisites = CourseSerializer(many=True, read_only=True)
    
    class Meta:
        model = Course
        fields = ['code', 'name', 'department', 'department_name', 'textbooks', 'prerequisites']

class CourseTextbookSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.name', read_only=True)
    textbook_title = serializers.CharField(source='textbook.title', read_only=True)
    
    class Meta:
        model = CourseTextbook
        fields = ['id', 'course', 'course_name', 'textbook', 'textbook_title', 'is_required']

class SectionSerializer(serializers.ModelSerializer):
    course_details = CourseSerializer(source='course', read_only=True)
    instructor_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Section
        fields = ['id', 'course', 'course_details', 'instructor', 'instructor_name', 'semester', 'section_id']
    
    def get_instructor_name(self, obj):
        if not obj.instructor:
            return None
        if obj.instructor.professor:
            emp = obj.instructor.professor.employee
            return f"Prof. {emp.fname} {emp.lname}"
        elif obj.instructor.graduate_student:
            grad = obj.instructor.graduate_student
            return f"{grad.fname} {grad.lname} (TA)"
        return "Unknown"

class StudentSerializer(serializers.ModelSerializer):
    majors = serializers.StringRelatedField(many=True, read_only=True)
    minors = serializers.StringRelatedField(many=True, read_only=True)
    degree_program_name = serializers.CharField(source='degree_program.name', read_only=True)
    
    class Meta:
        model = Student
        fields = ['student_id', 'fname', 'lname', 'student_type', 'degree_program', 
                 'degree_program_name', 'gpa', 'majors', 'minors']

class GraduateSerializer(serializers.ModelSerializer):
    majors = serializers.StringRelatedField(many=True, read_only=True)
    minors = serializers.StringRelatedField(many=True, read_only=True)
    degree_program_name = serializers.CharField(source='degree_program.name', read_only=True)
    
    class Meta:
        model = Graduate
        fields = ['student_id', 'fname', 'lname', 'student_type', 'degree_program', 
                'degree_program_name', 'gpa', 'majors', 'minors', 'thesis', 'research_area']

class UndergraduateSerializer(serializers.ModelSerializer):
    majors = serializers.StringRelatedField(many=True, read_only=True)
    minors = serializers.StringRelatedField(many=True, read_only=True)
    degree_program_name = serializers.CharField(source='degree_program.name', read_only=True)
    
    class Meta:
        model = Undergraduate
        fields = ['student_id', 'fname', 'lname', 'student_type', 'degree_program', 
                'degree_program_name', 'gpa', 'majors', 'minors', 'credits_completed']

class EnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.SerializerMethodField()
    course_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'student_name', 'section', 'course_name', 'grade']
    
    def get_student_name(self, obj):
        return f"{obj.student.fname} {obj.student.lname}"
    
    def get_course_name(self, obj):
        return f"{obj.section.course.code}: {obj.section.course.name}"

class CourseProgressionSerializer(serializers.ModelSerializer):
    prerequisites = serializers.SerializerMethodField()
    next_courses = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ['code', 'name', 'prerequisites', 'next_courses']
    
    def get_prerequisites(self, obj):
        return [{'code': course.code, 'name': course.name} for course in obj.prerequisites.all()]
    
    def get_next_courses(self, obj):
        return [{'code': course.code, 'name': course.name} for course in obj.is_prerequisite_for.all()]
