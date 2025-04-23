from rest_framework import serializers
from .models import (Department, DegreeProgram, Specialization,
                   AdminStaff, Professor, Student, Graduate, 
                   TeachingStaff, Textbook, Course, Section,
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
    is_professor = serializers.SerializerMethodField()
    is_admin = serializers.SerializerMethodField()
    is_teaching = serializers.SerializerMethodField()
    research_area = serializers.SerializerMethodField()
    department_name = serializers.CharField(source="dno.dname", read_only=True)

    class Meta:
        model = Employee
        fields = [
            'eid', 'fname', 'lname', 'salary', 'dno',
            'department_name', 'is_professor', 'is_admin',
            'is_teaching', 'research_area'
        ]

    def get_is_professor(self, obj):
        return hasattr(obj, 'teachingstaff') and hasattr(obj.teachingstaff, 'professor')

    def get_is_teaching(self, obj):
        return hasattr(obj, 'teachingstaff')

    def get_is_admin(self, obj):
        return hasattr(obj, 'adminstaff')

    def get_research_area(self, obj):
        if hasattr(obj, 'teachingstaff'):
            # If employee is a professor, get research area from professor model
            if hasattr(obj.teachingstaff, 'professor'):
                return obj.teachingstaff.professor.research_area
            
            # If employee is a teaching staff but not a professor,
            # check if they're a graduate student teaching staff
            if hasattr(obj.teachingstaff, 'graduate'):
                return obj.teachingstaff.graduate.research_area
            
            # Try to find a graduate student with matching name
            graduate = Graduate.objects.filter(
                student__fname=obj.fname,
                student__lname=obj.lname
            ).first()
            if graduate:
                return graduate.research_area
        
        return None

class AdminStaffSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer(read_only=True)  # Nested serializer
    
    class Meta:
        model = AdminStaff
        fields = '__all__'

class SimpleTeachingStaffSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer(read_only=True)

    class Meta:
        model = TeachingStaff
        fields = ['employee']

class TeachingStaffSerializer(serializers.ModelSerializer):
    employee = serializers.PrimaryKeyRelatedField(queryset=Employee.objects.all())
    professor_details = serializers.SerializerMethodField()
    graduate_students = serializers.SerializerMethodField()
    
    class Meta:
        model = TeachingStaff
        fields = ['employee', 'professor_details', 'graduate_students']

    def get_professor_details(self, obj):
        try:
            professor = Professor.objects.get(teaching=obj)
            return SimpleProfessorSerializer(professor).data
        except Professor.DoesNotExist:
            return None

    def get_graduate_students(self, obj):
        graduates = Graduate.objects.filter(teaching=obj)
        return GraduateSerializer(graduates, many=True).data if graduates.exists() else []
    
class SimpleProfessorSerializer(serializers.ModelSerializer):
    employee = EmployeeSerializer(source='teaching.employee')

    class Meta:
        model = Professor
        fields = ['employee', 'research_area']

class ProfessorSerializer(serializers.ModelSerializer):
    teaching = SimpleTeachingStaffSerializer(read_only=True)

    class Meta:
        model = Professor
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
    course_title = serializers.CharField()
    textbook_title = serializers.CharField(source='textbook_isbn.title', read_only=True) 
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
    instructor_name = serializers.SerializerMethodField()

    class Meta:
        model = Section
        fields = ['id', 'scourse_code', 's_id', 'semester', 'instructor', 'instructor_name']

    def get_instructor_name(self, obj):
        if obj.instructor and obj.instructor.employee:
            first = obj.instructor.employee.fname
            last = obj.instructor.employee.lname
            return f"{first} {last}"
        return None


class StudentSerializer(serializers.ModelSerializer):
    type = serializers.SerializerMethodField()
    credits_completed = serializers.SerializerMethodField()
    major = serializers.SerializerMethodField()
    specialization = serializers.SerializerMethodField()
    minor = serializers.SerializerMethodField()
    research_area = serializers.SerializerMethodField()
    thesis_title = serializers.SerializerMethodField()
    advisor = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = [
            "student_id",
            "fname",
            "lname",
            "type",
            "credits_completed",
            "major",
            "specialization",
            "minor",
            "research_area",
            "thesis_title",
            "advisor",
        ]

    def get_type(self, obj):
        try:
            if obj.undergraduate:
                return "Undergraduate"
        except Undergraduate.DoesNotExist:
            pass
        try:
            if obj.graduate:
                return "Graduate"
        except Graduate.DoesNotExist:
            pass
        return "Unspecified"

    def get_credits_completed(self, obj):
        try:
            return obj.undergraduate.credits_completed
        except Undergraduate.DoesNotExist:
            return None

    def get_major(self, obj):
        try:
            return obj.undergraduate.major.prog_name
        except (Undergraduate.DoesNotExist, AttributeError):
            return None

    def get_specialization(self, obj):
        try:
            return obj.undergraduate.specialization.sname
        except (Undergraduate.DoesNotExist, AttributeError):
            return None

    def get_minor(self, obj):
        try:
            return obj.undergraduate.minor.prog_name
        except (Undergraduate.DoesNotExist, AttributeError):
            return None

    def get_research_area(self, obj):
        try:
            return obj.graduate.research_area
        except Graduate.DoesNotExist:
            return None

    def get_thesis_title(self, obj):
        try:
            return obj.graduate.thesis_title
        except Graduate.DoesNotExist:
            return None

    def get_advisor(self, obj):
        try:
            employee = obj.graduate.teaching.employee
            return f"{employee.fname} {employee.lname}"
        except (Graduate.DoesNotExist, AttributeError):
            return None
    
class GraduateSerializer(serializers.ModelSerializer):
    student = serializers.PrimaryKeyRelatedField(queryset=Student.objects.all())
    fname = serializers.SerializerMethodField()
    lname = serializers.SerializerMethodField()

    class Meta:
        model = Graduate
        fields = ['student', 'fname', 'lname', 'research_area', 'thesis_title', 'teaching']

    def get_fname(self, obj):
        return obj.student.fname

    def get_lname(self, obj):
        return obj.student.lname

class UndergraduateSerializer(serializers.ModelSerializer):
    student = StudentSerializer(read_only=True)  # For reading the nested data
    student_id = serializers.PrimaryKeyRelatedField(
        queryset=Student.objects.all(),
        source='student',
        write_only=True  # Only used when writing
    )
    
    class Meta:
        model = Undergraduate
        fields = ['student', 'student_id', 'credits_completed', 'major', 'specialization', 'minor']

class SpecializationSerializer(serializers.ModelSerializer):
    program = serializers.SlugRelatedField(
        read_only=False,
        queryset=DegreeProgram.objects.all(),
        slug_field='prog_name'
    )

    class Meta:
        model = Specialization
        fields = ['id', 'sname', 'program']

    def to_internal_value(self, data):
        program_name = data.get('program')
        try:
            program = DegreeProgram.objects.get(prog_name=program_name)
        except DegreeProgram.DoesNotExist:
            raise serializers.ValidationError({
                'program': 'Degree program with this name does not exist.'
            })
        data['program'] = program.prog_name
        return super().to_internal_value(data)
