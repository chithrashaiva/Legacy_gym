from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from .models import User, Membership, WorkoutPlan, DietPlan, TrainerInstruction

@admin.register(User)
class UserAdmin(BaseUserAdmin):
    fieldsets = BaseUserAdmin.fieldsets + (
        ('Gym Profile Info', {'fields': ('role', 'phone', 'profile_image', 'date_of_birth', 'gender')}),
    )
    list_display = ('username', 'email', 'first_name', 'last_name', 'role', 'phone', 'is_staff')
    list_filter = ('role', 'is_staff', 'is_superuser', 'gender')
    search_fields = ('username', 'first_name', 'last_name', 'email', 'phone')

@admin.register(Membership)
class MembershipAdmin(admin.ModelAdmin):
    list_display = ('user', 'plan_title', 'total_fee', 'paid_fee', 'balance_due', 'status', 'date_of_joining', 'end_date')
    list_filter = ('status', 'plan_name')
    search_fields = ('user__username', 'user__first_name', 'user__last_name', 'plan_title')

@admin.register(WorkoutPlan)
class WorkoutPlanAdmin(admin.ModelAdmin):
    list_display = ('day_of_week', 'title', 'category', 'focus_muscle', 'duration_minutes', 'user')
    list_filter = ('day_of_week', 'category')
    search_fields = ('title', 'focus_muscle', 'trainer_notes')

@admin.register(DietPlan)
class DietPlanAdmin(admin.ModelAdmin):
    list_display = ('category', 'day_of_week', 'daily_calories')
    list_filter = ('category', 'day_of_week')
    search_fields = ('category', 'trainer_advice')

@admin.register(TrainerInstruction)
class TrainerInstructionAdmin(admin.ModelAdmin):
    list_display = ('title', 'trainer', 'target_member', 'scheduled_for_date', 'is_advance', 'created_at')
    list_filter = ('is_advance', 'scheduled_for_date')
    search_fields = ('title', 'instruction_text', 'trainer__username')
