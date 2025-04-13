# serializers.py
from rest_framework import serializers
from .models import (Department, DegreeProgram, Course, Textbook, 
                     Section, Student, Graduate, Undergraduate, 
                     Enrollment, Professor, TeachingStaff)

class DepartmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Department
        fields = '__all__'

class DegreeProgramSerializer(serializers.ModelSerializer):
    class Meta:
        model = DegreeProgram
        fields = '__all__'

class TextbookSerializer(serializers.ModelSerializer):
    class Meta:
        model = Textbook
        fields = '__all__'

class CourseSerializer(serializers.ModelSerializer):
    department_name = serializers.ReadOnlyField(source='department.name')
    prerequisite_courses = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ['id', 'code', 'name', 'department', 'department_name', 
                  'textbooks', 'prerequisites', 'prerequisite_courses']
    
    def get_prerequisite_courses(self, obj):
        return CourseSimpleSerializer(obj.prerequisites.all(), many=True).data

class CourseSimpleSerializer(serializers.ModelSerializer):
    """Simplified Course serializer to prevent recursion in prerequisites"""
    class Meta:
        model = Course
        fields = ['id', 'code', 'name']

class CourseDetailSerializer(serializers.ModelSerializer):
    department = DepartmentSerializer(read_only=True)
    textbooks = TextbookSerializer(many=True, read_only=True)
    prerequisites = CourseSimpleSerializer(many=True, read_only=True)
    subsequent_courses = serializers.SerializerMethodField()
    
    class Meta:
        model = Course
        fields = ['id', 'code', 'name', 'department', 'textbooks', 
                  'prerequisites', 'subsequent_courses']
    
    def get_subsequent_courses(self, obj):
        return CourseSimpleSerializer(obj.is_prerequisite_for.all(), many=True).data

class SectionSerializer(serializers.ModelSerializer):
    course_code = serializers.ReadOnlyField(source='course.code')
    course_name = serializers.ReadOnlyField(source='course.name')
    instructor_name = serializers.ReadOnlyField(source='instructor.__str__')
    
    class Meta:
        model = Section
        fields = ['id', 'course', 'course_code', 'course_name', 'instructor', 
                  'instructor_name', 'semester', 'section_id']

class StudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ['id', 'student_id', 'fname', 'lname', 'student_type', 
                  'degree_program', 'gpa', 'majors', 'minors', 'status']

class GraduateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Graduate
        fields = '__all__'

class UndergraduateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Undergraduate
        fields = '__all__'

class EnrollmentSerializer(serializers.ModelSerializer):
    student_name = serializers.ReadOnlyField(source='student.__str__')
    course_code = serializers.ReadOnlyField(source='section.course.code')
    course_name = serializers.ReadOnlyField(source='section.course.name')
    semester = serializers.ReadOnlyField(source='section.semester')
    
    class Meta:
        model = Enrollment
        fields = ['id', 'student', 'student_name', 'section', 'course_code', 
                  'course_name', 'semester', 'grade']

class CourseProgressionSerializer(serializers.ModelSerializer):
    """Special serializer for visualizing course progression"""
    prerequisites = CourseSimpleSerializer(many=True, read_only=True)
    subsequent_courses = serializers.SerializerMethodField()
    department_name = serializers.ReadOnlyField(source='department.name')
    
    class Meta:
        model = Course
        fields = ['id', 'code', 'name', 'department_name', 'prerequisites', 'subsequent_courses']
    
    def get_subsequent_courses(self, obj):
        return CourseSimpleSerializer(obj.is_prerequisite_for.all(), many=True).data
