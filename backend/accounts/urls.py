from django.urls import path
from rest_framework_simplejwt.views import TokenRefreshView
from .views import (
    RegisterView, CustomTokenObtainPairView, UserDetailView,
    MemberDashboardSummaryView, AdminPortalOverviewView,
    UpdateMembershipView, DeleteMemberView, WorkoutPlanViewSet, DietPlanViewSet,
    TrainerInstructionCreateView, SendAdminOTPView, VerifyAdminOTPView,
    GymGalleryMediaView, GymGalleryMediaDetailView, CategoryGuidanceView,
    MemberDailyWorkoutLogView
)

urlpatterns = [
    # Auth
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', CustomTokenObtainPairView.as_view(), name='login'),
    path('refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', UserDetailView.as_view(), name='user_detail'),

    # 2-Step OTP Verification
    path('portal/send-otp/', SendAdminOTPView.as_view(), name='send_admin_otp'),
    path('portal/verify-otp/', VerifyAdminOTPView.as_view(), name='verify_admin_otp'),

    # Member Dashboard
    path('portal/member-summary/', MemberDashboardSummaryView.as_view(), name='member_summary'),

    # Admin Portal
    path('portal/admin-overview/', AdminPortalOverviewView.as_view(), name='admin_overview'),
    path('portal/members/<int:user_id>/membership/', UpdateMembershipView.as_view(), name='update_membership'),
    path('portal/members/<int:user_id>/', DeleteMemberView.as_view(), name='delete_member'),
    
    # Workout & Diet Plans
    path('portal/workouts/', WorkoutPlanViewSet.as_view(), name='workouts'),
    path('portal/workouts/<int:plan_id>/', WorkoutPlanViewSet.as_view(), name='workout_detail'),
    path('portal/diets/', DietPlanViewSet.as_view(), name='diets'),
    path('portal/diets/<int:diet_id>/', DietPlanViewSet.as_view(), name='diet_detail'),

    # Category Guidance
    path('portal/guidance/', CategoryGuidanceView.as_view(), name='category_guidance'),

    # Daily Workout Logs
    path('portal/workout-logs/', MemberDailyWorkoutLogView.as_view(), name='workout_logs'),

    # Trainer Instructions
    path('portal/instructions/', TrainerInstructionCreateView.as_view(), name='create_instruction'),

    # Workout Room & Gym Gallery Media Management
    path('portal/gallery/', GymGalleryMediaView.as_view(), name='gallery_media'),
    path('portal/gallery/<int:media_id>/', GymGalleryMediaDetailView.as_view(), name='gallery_media_detail'),
]
