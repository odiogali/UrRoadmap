from django.shortcuts import render
from django.db import models
from rest_framework import viewsets, generics, status, permissions
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import (Department, DegreeProgram, Course, Textbook, 
                    Section, Student, Graduate, Undergraduate, 
                    Professor, SupportStaff, 
                    AdminStaff, TeachingStaff, HasAsPreq, HasAsAntireq)
from .serializers import (DepartmentSerializer, DegreeProgramSerializer, 
                         CourseSerializer, 
                         TextbookSerializer, SectionSerializer, 
                         StudentSerializer, GraduateSerializer, 
                         UndergraduateSerializer, 
                         SupportStaffSerializer, AdminStaffSerializer, 
                         ProfessorSerializer, TeachingStaffSerializer)

class DepartmentViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Department.objects.all()
    serializer_class = DepartmentSerializer

class DegreeProgramViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = DegreeProgram.objects.all()
    serializer_class = DegreeProgramSerializer

class CourseViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return CourseSerializer
        return CourseSerializer
    
    def get_queryset(self):
        queryset = Course.objects.all()
        department_id = self.request.query_params.get('department')
        if department_id:
            queryset = queryset.filter(department_id=department_id)
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
                SELECT c.Course_code, c.Textbook_ISBN, d.Dname, c.Prof_id
                FROM course c
                JOIN department d ON c.Dno = d.Dno
                WHERE c.Dno = %s
            """, [department])
        else:
            cursor.execute("""
                SELECT c.Course_code, c.Textbook_ISBN, d.Dname, c.Prof_id
                FROM course c
                LEFT JOIN department d ON c.Dno = d.Dno
            """)
        
        # Build node details dictionary
        node_details = {}
        for code, isbn, dept_name, prof_id in cursor.fetchall():
            nodes.add(code)
            node_details[code] = {
                "id": code,
                "textbook": isbn,
                "department": dept_name,
                "professor": prof_id,
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

class TextbookViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Textbook.objects.all()
    serializer_class = TextbookSerializer

class SectionViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Section.objects.all()
    serializer_class = SectionSerializer
    
    def get_queryset(self):
        queryset = Section.objects.all()
        course_id = self.request.query_params.get('course')
        semester = self.request.query_params.get('semester')
        if course_id:
            queryset = queryset.filter(course_id=course_id)
        if semester:
            queryset = queryset.filter(semester=semester)
        return queryset

class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentSerializer


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


class SupportStaffListView(generics.ListCreateAPIView):
    queryset = SupportStaff.objects.all()
    serializer_class = SupportStaffSerializer
    
    def get_queryset(self):
        queryset = SupportStaff.objects.all()
        department = self.request.query_params.get('department')
        if department:
            queryset = queryset.filter(department__name=department)
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
        queryset = Professor.objects.all()
        department = self.request.query_params.get('department')
        if department:
            queryset = queryset.filter(department__name=department)
        return queryset

class ProfessorViewSet(viewsets.ModelViewSet):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer
    lookup_field = 'eid'  

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
