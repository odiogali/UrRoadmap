from django.db.models import Q
from django.db import models
from rest_framework import viewsets, generics, status, mixins
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.decorators import action
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import (Department, DegreeProgram, Course, Textbook, 
                    Section, Student, Graduate, Undergraduate, 
                    Professor, Employee, Section, HasTaken,
                    AdminStaff, TeachingStaff, Specialization, HasAsPreq, HasAsAntireq)
from .serializers import (DepartmentSerializer, DegreeProgramSerializer, 
                         CourseSerializer, SectionSerializer,
                         TextbookSerializer, SectionSerializer, 
                         StudentSerializer, GraduateSerializer, 
                         UndergraduateSerializer, 
                         AdminStaffSerializer, SpecializationSerializer,
                         ProfessorSerializer, TeachingStaffSerializer, EmployeeSerializer)

class DepartmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class SpecializationList(generics.ListCreateAPIView):
    queryset = Specialization.objects.all()
    serializer_class = SpecializationSerializer

    def get_queryset(self):
        queryset = self.queryset
        sname = self.request.query_params.get('sname')
        program = self.request.query_params.get('program')
        if sname is not None:
            queryset = queryset.filter(sname=sname)
        if program is not None:
            queryset = queryset.filter(program__prog_name=program)
        return queryset

class DegreeProgramViewSet(viewsets.ModelViewSet):
    queryset = DegreeProgram.objects.all()
    serializer_class = DegreeProgramSerializer

class SectionViewSet(viewsets.ModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    
    @action(detail=False, methods=['get'], url_path='by-course/(?P<course_code>[^/.]+)')
    def by_course(self, request, course_code=None):
        """Get all sections for a specific course code"""
        if course_code:
            # Use the proper field name from your model
            # We need to use the exact field name as in the Section model
            sections = Section.objects.filter(scourse_code__course_code=course_code)
            serializer = self.get_serializer(sections, many=True)
            return Response(serializer.data)
        return Response({"error": "Course code is required"}, status=400)

class CourseViewSet(viewsets.ModelViewSet):
    serializer_class = CourseSerializer
    queryset = Course.objects.all()

    def get_queryset(self):
        queryset = Course.objects.all()
        department_id = self.request.query_params.get('department')
        if department_id:
            queryset = queryset.filter(dno=department_id)

        search = self.request.query_params.get("search", "").strip()
        if search:
            queryset = queryset.filter(
                Q(course_code__icontains=search) |
                Q(course_title__icontains=search) |
                Q(textbook_isbn__isbn__icontains=search) |
                Q(textbook_isbn__title__icontains=search) |
                Q(dno__dname__icontains=search)  # or whatever the department name field is
            )
        return queryset

@api_view(['GET'])
def get_prereqs(request, course_code):
    try:
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT c.Course_code 
                FROM has_as_preq hp
                JOIN course c ON hp.Prereq_code = c.Course_code
                WHERE hp.Course_code = %s
            """, [course_code])
            
            result = [{'prereq_code': row[0]} for row in cursor.fetchall()]
        
        return Response(result)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def create_prereq(request):
    course_code = request.data.get('course_code')
    prereq_code = request.data.get('prereq_code')
    
    if not course_code or not prereq_code:
        return Response({"error": "Both course_code and prereq_code are required"}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Check if both courses exist
        course_exists = Course.objects.filter(course_code=course_code).exists()
        prereq_exists = Course.objects.filter(course_code=prereq_code).exists()
        
        if not course_exists or not prereq_exists:
            return Response({"error": "One or both courses do not exist"}, 
                          status=status.HTTP_404_NOT_FOUND)
        
        # Use raw SQL to insert the relationship
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("""
                INSERT INTO has_as_preq (Course_code, Prereq_code)
                VALUES (%s, %s)
            """, [course_code, prereq_code])
        
        return Response({"success": f"Added {prereq_code} as prerequisite for {course_code}"}, 
                       status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"error": str(e)}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def get_antireqs(request, course_code):
    try:
        # Get the Course object first
        course = Course.objects.get(course_code=course_code)
        
        # Use a raw query that doesn't rely on the id field
        from django.db import connection
        with connection.cursor() as cursor:
            cursor.execute("""
                SELECT c.Course_code 
                FROM has_as_antireq ha
                JOIN course c ON ha.Antireq_code = c.Course_code
                WHERE ha.Course_code = %s
            """, [course_code])
            
            result = []
            for row in cursor.fetchall():
                result.append({'antireq_code': row[0]})
        
        return Response(result)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['POST'])
def create_antireq(request):
    course_code = request.data.get('course_code')
    antireq_code = request.data.get('antireq_code')
    
    if not course_code or not antireq_code:
        return Response({"error": "Both course_code and antireq_code are required"}, 
                        status=status.HTTP_400_BAD_REQUEST)
    
    try:
        course = Course.objects.get(course_code=course_code)
        antireq = Course.objects.get(course_code=antireq_code)
        
        # Create the antirequisite relationship
        HasAsAntireq.objects.create(
            course_code=course,
            antireq_code=antireq
        )
        
        return Response({"success": f"Added {antireq_code} as antirequisite for {course_code}"}, 
                       status=status.HTTP_201_CREATED)
    except Course.DoesNotExist:
        return Response({"error": "One or both courses do not exist"}, 
                       status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, 
                       status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def course_graph(request):
    from django.db import connection
    department = request.query_params.get('department', 'all')
    
    nodes = set()
    links = []
    
    with connection.cursor() as cursor:
        # Get courses based on department filter
        if department != 'all':
            cursor.execute("""
                SELECT c.Course_code, c.Textbook_ISBN, d.Dname, s.Instructor_id
                FROM course c
                JOIN department d ON c.Dno = d.Dno
                LEFT JOIN section s ON c.Course_code = s.SCourse_code
                WHERE c.Dno = %s
            """, [department])
        else:
            cursor.execute("""
                SELECT c.Course_code, c.Textbook_ISBN, d.Dname, s.Instructor_id
                FROM course c
                LEFT JOIN department d ON c.Dno = d.Dno
                LEFT JOIN section s ON c.Course_code = s.SCourse_code
            """)
        
        # Build node details dictionary
        node_details = {}
        for code, isbn, dept_name, instructor_id in cursor.fetchall():
            nodes.add(code)
            node_details[code] = {
                "id": code,
                "textbook": isbn,
                "department": dept_name,
                "professor": instructor_id,
                "antirequisites": []
            }
        
        # Get prerequisite relationships relevant to the department
        if department != 'all':
            cursor.execute("""
                SELECT h.Prereq_code, h.Course_code
                FROM has_as_preq h
                JOIN course c ON h.Course_code = c.Course_code
                WHERE c.Dno = %s
            """, [department])
        else:
            cursor.execute("SELECT Prereq_code, Course_code FROM has_as_preq")
        
        # Process prerequisites - only for links, not for node attributes
        for prereq, course in cursor.fetchall():
            nodes.add(prereq)
            nodes.add(course)
            
            # Create only links for prerequisites
            links.append({
                "source": prereq,
                "target": course,
                "type": "prereq"
            })
            
            # Ensure both nodes exist in node_details, at minimum with an ID
            if prereq not in node_details:
                node_details[prereq] = {"id": prereq, "antirequisites": []}
            if course not in node_details:
                node_details[course] = {"id": course, "antirequisites": []}
        
        # Get antirequisite relationships
        if department != 'all':
            cursor.execute("""
                SELECT h.Antireq_code, h.Course_code
                FROM has_as_antireq h
                JOIN course c ON h.Course_code = c.Course_code
                WHERE c.Dno = %s
            """, [department])
        else:
            cursor.execute("SELECT Antireq_code, Course_code FROM has_as_antireq")
        
        # Process antirequisites - only adding to node details
        for antireq, course in cursor.fetchall():
            # Add antirequisite information to both courses (bidirectional)
            # For the course
            if course in node_details:
                node_details[course]["antirequisites"].append(antireq)
            else:
                node_details[course] = {"id": course, "antirequisites": [antireq]}
                nodes.add(course)
                
            # For the antirequisite
            if antireq in node_details:
                node_details[antireq]["antirequisites"].append(course)
            else:
                node_details[antireq] = {"id": antireq, "antirequisites": [course]}
                nodes.add(antireq)
        
        # Build final node list with all details
        node_list = []
        for code in nodes:
            details = node_details.get(code, {"id": code})
            node_list.append(details)
    
    return Response({
        "nodes": node_list,
        "links": links
    })

class TextbookViewSet(viewsets.ModelViewSet):
    queryset = Textbook.objects.all()
    serializer_class = TextbookSerializer

class EmployeeViewSet(viewsets.ModelViewSet):
    queryset = Employee.objects.all()
    serializer_class = EmployeeSerializer

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer
    
    def get_queryset(self):
        queryset = super().get_queryset()
        search = self.request.query_params.get("search", "").strip()
        student_type = self.request.query_params.get("type", "").strip().lower()

        if search:
            queryset = queryset.filter(
                Q(fname__icontains=search) |
                Q(lname__icontains=search) |
                Q(student_id__icontains=search)
            )
            
        if student_type == "undergraduate":
            queryset = queryset.filter(undergraduate__isnull=False)
        elif student_type == "graduate":
            queryset = queryset.filter(graduate__isnull=False)
            
        return queryset

class CourseProgressionView(generics.ListAPIView):
    """Special view for getting course progression data for visualization"""
    #serializer_class = CourseProgressionSerializer
    
    def get_queryset(self):
        queryset = Course.objects.all().prefetch_related('prerequisites', 'is_prerequisite_for')
        department_id = self.request.query_params.get('department')
        degree_program_id = self.request.query_params.get('degree_program')
        
        if department_id:
            queryset = queryset.filter(department_id=department_id)
        
        # For degree program filtering, we'd need a more complex query
        # This is a placeholder - you might need to implement a more sophisticated
        # filter based on requirements for each degree program
        if degree_program_id:
            # This assumes you have a model or field connecting courses to degree programs
            # which isn't in your current model setup
            pass
        
        return queryset

class GraduateListView(generics.ListCreateAPIView):
    queryset = Graduate.objects.all()
    serializer_class = GraduateSerializer

    def get_queryset(self):
        queryset = Graduate.objects.all()
        research_area = self.request.query_params.get('research_area')
        if research_area:
            queryset = queryset.filter(research_area__icontains=research_area)
        return queryset

    def create(self, request, *args, **kwargs):
        make_teaching_staff = request.data.get('make_teaching_staff', False)
        fname = request.data.get('fname')
        lname = request.data.get('lname')

        # Remove custom flags before passing to serializer
        data = request.data.copy()
        data.pop('make_teaching_staff', None)
        data.pop('fname', None)
        data.pop('lname', None)

        serializer = self.get_serializer(data=data)
        serializer.is_valid(raise_exception=True)
        graduate = serializer.save()

        # Handle optional teaching staff creation
        if make_teaching_staff and fname and lname:
            employee = Employee.objects.create(
                fname=fname,
                lname=lname,
                salary=0,  # default or customize
                dno=None   # default or pass this too
            )
            teaching_staff = TeachingStaff.objects.create(employee=employee)
            graduate.teaching = teaching_staff
            graduate.save()

        return Response(self.get_serializer(graduate).data, status=status.HTTP_201_CREATED)

class UndergraduateListView(generics.ListCreateAPIView):
    queryset = Undergraduate.objects.all()
    serializer_class = UndergraduateSerializer
    
    def get_queryset(self):
        queryset = Undergraduate.objects.all()
        credits_min = self.request.query_params.get('credits_min')
        credits_max = self.request.query_params.get('credits_max')
        if credits_min:
            queryset = queryset.filter(credits_completed__gte=int(credits_min))
        if credits_max:
            queryset = queryset.filter(credits_completed__lte=int(credits_max))
        return queryset

class AdminStaffListView(generics.ListCreateAPIView):
    queryset = AdminStaff.objects.all()
    serializer_class = AdminStaffSerializer
    
    def get_queryset(self):
        queryset = AdminStaff.objects.all()
        department = self.request.query_params.get('department')
        if department:
            queryset = queryset.filter(department__name=department)
        return queryset

class ProfessorListView(generics.ListCreateAPIView):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer
    lookup_field = 'eid'
    
    def get_queryset(self):
        queryset = Professor.objects.select_related(
            'teaching__employee__dno'  # following the relation chain
        ).all()

        department = self.request.query_params.get('department')
        if department:
            queryset = queryset.filter(teaching__employee__dno__dname__icontains=department)

        return queryset

class ProfessorViewSet(viewsets.ModelViewSet):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer
    lookup_field = 'teaching_id'  

class TeachingStaffListView(generics.ListCreateAPIView):
    queryset = TeachingStaff.objects.all()
    serializer_class = TeachingStaffSerializer
    
    def get_queryset(self):
        queryset = TeachingStaff.objects.all()
        # Filter by professor department
        department = self.request.query_params.get('department')
        if department:
            queryset = queryset.filter(
                models.Q(professor__department__name=department) |
                models.Q(graduate_student__majors__name=department)
            )
        return queryset

class TeachingStaffDetailView(generics.RetrieveAPIView):
    queryset = TeachingStaff.objects.all()
    serializer_class = TeachingStaffSerializer
    lookup_field = 'employee_id'

class SecureExampleView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({"message": "You are authenticated!"})
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def student_progress(request, student_id):
    taken_courses = HasTaken.objects.filter(student_id=student_id).values_list('SCourse_code', flat=True)

    all_courses = Course.objects.all()
    prereq_map = {
        course.Course_code: list(
            HasAsPreq.objects.filter(Course_code=course.Course_code).values_list('Prereq_code', flat=True)
        )
        for course in all_courses
    }

    graph = []
    taken_set = set(taken_courses)

    for course in all_courses:
        graph.append({
            "code": course.Course_code,
            "prereqs": prereq_map[course.Course_code]
        })

    remaining = []
    locked = []

    for course in all_courses:
        if course.Course_code in taken_set:
            continue

        prereqs = prereq_map[course.Course_code]
        if all(prereq in taken_set for prereq in prereqs):
            remaining.append(course.Course_code)
        else:
            locked.append(course.Course_code)

    return Response({
        "taken": list(taken_set),
        "remaining": remaining,
        "locked": locked,
        "graph": graph
    })