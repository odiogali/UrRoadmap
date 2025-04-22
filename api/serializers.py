from rest_framework import serializers
from .models import (Department, DegreeProgram,
                   AdminStaff, Professor, Student, Graduate, 
                   TeachingStaff, Textbook, Course, 
                   Section, Undergraduate, Employee, HasAsPreq, HasAsAntireq)

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class DegreeProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = DegreeProgram
        fields = '__all__'

class EmployeeSerializer(serializers.ModelSerializer):
    # Include department details instead of just the ID
    dno = DepartmentSerializer(read_only=True)
    
    class Meta:
        model = Employee
        fields = ['eid', 'fname', 'lname', 'salary', 'dno']

class AdminStaffSerializer(serializers.ModelSerializer):
    student = EmployeeSerializer(read_only=True)  # Nested serializer

    class Meta:
        model = AdminStaff
        fields = '__all__'

class ProfessorSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Professor
        fields = '__all__'

class TeachingStaffSerializer(serializers.ModelSerializer):
    professor_details = ProfessorSerializer(source='professor', read_only=True)
    graduate_details = serializers.SerializerMethodField()
    
    class Meta:
        model = TeachingStaff
        fields = '__all__'
    

class TextbookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Textbook
        fields = '__all__'

class PrerequisiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = HasAsPreq
        fields = ['prereq_code', 'course_code']

class AntirequisiteSerializer(serializers.ModelSerializer):
    class Meta:
        model = HasAsAntireq
        fields = ['antireq_code', 'course_code']

class CourseSerializer(serializers.ModelSerializer):
    department_name = serializers.CharField(source='dno.dname', read_only=True)
    
    class Meta:
        model = Course
        fields = '__all__'

    def get_prerequisites(self, obj):
        prereqs = obj.hasaspreq_course_code_set.select_related('prereq_code')
        return PrerequisiteSerializer([p.prereq_code for p in prereqs], many=True).data

    def get_antirequisites(self, obj):
        antireqs = obj.hasasantireq_course_code_set.select_related('antireq_code')
        return AntirequisiteSerializer([a.antireq_code for a in antireqs], many=True).data


class SectionSerializer(serializers.ModelSerializer):
    course_details = CourseSerializer(source='course', read_only=True)
    instructor_name = serializers.SerializerMethodField()
    
    class Meta:
        model = Section
        fields = '__all__'
    

class StudentSerializer(serializers.ModelSerializer):
    majors = serializers.CharField(source='major.prog_name', read_only=True)
    minors = serializers.CharField(source='minor.prog_name', read_only=True)
    #degree_program_name = serializers.CharField(source='degree_program.name', read_only=True) #this isn't in backend
    
    class Meta:
        model = Student
        fields = ['student_id', 'fname', 'lname', 'majors', 'minors']

class GraduateSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)  # Nested serializer
    
    class Meta:
        model = Graduate
        fields = ['student', 'thesis_title', 'research_area', 'teaching']

class UndergraduateSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)  # Nested serializer
    
    class Meta:
        model = Undergraduate
        fields = ['student', 'credits_completed', 'major', 'specialization', 'minor']
