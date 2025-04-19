from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r'department', views.DepartmentViewSet)
router.register(r'degreeprogram', views.DegreeProgramViewSet)
router.register(r'course', views.CourseViewSet)
router.register(r'textbook', views.TextbookViewSet)
router.register(r'student', views.StudentViewSet)
router.register(r'professors', views.ProfessorViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # ListAPIView paths
    path('graduates/', views.GraduateListView.as_view(), name='graduate-list'),
    path('undergraduates/', views.UndergraduateListView.as_view(), name='undergraduate-list'),
    path('support-staff/', views.SupportStaffListView.as_view(), name='support-staff-list'),
    path('admin-staff/', views.AdminStaffListView.as_view(), name='admin-staff-list'),
    path('teaching-staff/', views.TeachingStaffListView.as_view(), name='teaching-staff-list'),
    path('prerequisites/<str:course_code>/', views.get_prereqs, name='get_prereqs'),
    path('antirequisites/<str:course_code>/', views.get_antireqs, name='get_antireqs'),
]
