from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import ( # type: ignore
    TokenObtainPairView,
    TokenRefreshView,)
from . import views
from .views import SecureExampleView

router = DefaultRouter()
router.register(r'department', views.DepartmentViewSet)
router.register(r'degreeprogram', views.DegreeProgramViewSet)
router.register(r'course', views.CourseViewSet)
router.register(r'textbook', views.TextbookViewSet)
router.register(r'student', views.StudentViewSet)
router.register(r'employees', views.EmployeeViewSet)
router.register(r'professors', views.ProfessorViewSet)
router.register(r'sections', views.SectionViewSet)

urlpatterns = [
    path('', include(router.urls)),
    # ListAPIView paths
    path('graduates/', views.GraduateListView.as_view(), name='graduate-list'),
    path('undergraduates/', views.UndergraduateListView.as_view(), name='undergraduate-list'),
    path('admin-staff/', views.AdminStaffListView.as_view(), name='admin-staff-list'),
    path('teaching-staff/<str:employee_id>/', views.TeachingStaffDetailView.as_view(), name='teaching-detail'),
    path('teaching-staff/', views.TeachingStaffListView.as_view(), name='teaching-staff-list'),
    path('prerequisites/<str:course_code>/', views.get_prereqs, name='get_prereqs'),
    path('antirequisites/<str:course_code>/', views.get_antireqs, name='get_antireqs'),
    path('graph/', views.course_graph),
    path('specialization/', views.SpecializationList.as_view()),
    path('token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('secure/', SecureExampleView.as_view(), name='secure'),
]
