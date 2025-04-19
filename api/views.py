from django.shortcuts import render
from django.db import models
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import viewsets, generics, status
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
                         ProfessorSerializer, TeachingStaffSerializer, PrerequisiteSerializer, AntirequisiteSerializer)

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
        # Get the Course object first to ensure it exists
        course = Course.objects.get(course_code=course_code)
        
        # Then find prerequisites using the Course object
        prereqs = HasAsPreq.objects.filter(course_code=course).select_related('prereq_code')
        
        # You may need to create a custom response format depending on what data you want
        result = []
        for prereq in prereqs:
            result.append({
                'prereq_code': prereq.prereq_code.course_code,
                # Include any other fields you need
            })
        
        return Response(result)
    except Course.DoesNotExist:
        return Response({"error": f"Course with code {course_code} not found"}, 
                        status=status.HTTP_404_NOT_FOUND)
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
    except Course.DoesNotExist:
        return Response({"error": f"Course with code {course_code} not found"}, 
                        status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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

class StudentViewSet(viewsets.ReadOnlyModelViewSet):
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

# New ListAPIViews
class GraduateListView(generics.ListAPIView):
    queryset = Graduate.objects.all()
    serializer_class = GraduateSerializer
    
    def get_queryset(self):
        queryset = Graduate.objects.all()
        research_area = self.request.query_params.get('research_area')
        if research_area:
            queryset = queryset.filter(research_area__icontains=research_area)
        return queryset

class UndergraduateListView(generics.ListAPIView):
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


class SupportStaffListView(generics.ListAPIView):
    queryset = SupportStaff.objects.all()
    serializer_class = SupportStaffSerializer
    
    def get_queryset(self):
        queryset = SupportStaff.objects.all()
        department = self.request.query_params.get('department')
        if department:
            queryset = queryset.filter(department__name=department)
        return queryset

class AdminStaffListView(generics.ListAPIView):
    queryset = AdminStaff.objects.all()
    serializer_class = AdminStaffSerializer
    
    def get_queryset(self):
        queryset = AdminStaff.objects.all()
        department = self.request.query_params.get('department')
        if department:
            queryset = queryset.filter(department__name=department)
        return queryset

class ProfessorListView(generics.ListAPIView):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer
    lookup_field = 'eid'
    
    def get_queryset(self):
        queryset = Professor.objects.all()
        department = self.request.query_params.get('department')
        if department:
            queryset = queryset.filter(department__name=department)
        return queryset

class ProfessorViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Professor.objects.all()
    serializer_class = ProfessorSerializer
    lookup_field = 'eid'  

class TeachingStaffListView(generics.ListAPIView):
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
