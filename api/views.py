from django.shortcuts import render
from django.db import models
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import viewsets, generics, status
from .models import (Department, DegreeProgram, Course, Textbook, 
                    Section, Student, Graduate, Undergraduate, 
                    Professor, SupportStaff, 
                    AdminStaff, TeachingStaff)
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
    
    def get_queryset(self):
        queryset = Professor.objects.all()
        department = self.request.query_params.get('department')
        if department:
            queryset = queryset.filter(department__name=department)
        return queryset

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
