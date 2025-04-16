from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'departments', views.DepartmentViewSet)
router.register(r'degree-programs', views.DegreeProgramViewSet)
router.register(r'courses', views.CourseViewSet)
router.register(r'textbooks', views.TextbookViewSet)
router.register(r'sections', views.SectionViewSet)
router.register(r'students', views.StudentViewSet)
router.register(r'enrollments', views.EnrollmentViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # ListAPIView paths
    path('graduates/', views.GraduateListView.as_view(), name='graduate-list'),
    path('undergraduates/', views.UndergraduateListView.as_view(), name='undergraduate-list'),
    path('employees/', views.EmployeeListView.as_view(), name='employee-list'),
    path('support-staff/', views.SupportStaffListView.as_view(), name='support-staff-list'),
    path('admin-staff/', views.AdminStaffListView.as_view(), name='admin-staff-list'),
    path('professors/', views.ProfessorListView.as_view(), name='professor-list'),
    path('teaching-staff/', views.TeachingStaffListView.as_view(), name='teaching-staff-list'),
    path('course-textbooks/', views.CourseTextbookListView.as_view(), name='course-textbook-list'),
    path('course-progression/', views.CourseProgressionView.as_view(), name='course-progression'),
]
