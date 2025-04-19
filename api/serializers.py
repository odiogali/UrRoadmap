from rest_framework import serializers
from .models import (Department, DegreeProgram, SupportStaff, 
                   AdminStaff, Professor, Student, Graduate, 
                   TeachingStaff, Textbook, Course, 
                   Section, Undergraduate, HasAsPreq, HasAsAntireq)

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class DegreeProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = DegreeProgram
        fields = '__all__'

class SupportStaffSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = SupportStaff
        fields = '__all__'

class AdminStaffSerializer(serializers.ModelSerializer):
    
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
    majors = serializers.StringRelatedField(many=True, read_only=True)
    minors = serializers.StringRelatedField(many=True, read_only=True)
    degree_program_name = serializers.CharField(source='degree_program.name', read_only=True)
    
    class Meta:
        model = Graduate
        fields = ['student_id', 'fname', 'lname', 'student_type', 'degree_program', 
                'degree_program_name', 'gpa', 'majors', 'minors', 'thesis', 'research_area']

class UndergraduateSerializer(serializers.ModelSerializer):
    
    class Meta:
        model = Undergraduate
        fields = '__all__'

