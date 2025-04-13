from django.urls import path 
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
    path('course-progression/', views.CourseProgressionView.as_view(), name='course-progression'),
]
