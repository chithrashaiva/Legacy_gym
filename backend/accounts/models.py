from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils import timezone

class User(AbstractUser):
    ROLE_CHOICES = (
        ('member', 'Member'),
        ('trainer', 'Trainer'),
        ('admin', 'Admin'),
        ('super_admin', 'Super Admin'),
    )
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
    phone = models.CharField(max_length=15, blank=True, null=True)
    profile_image = models.ImageField(upload_to='profiles/', blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    GENDER_CHOICES = (
        ('M', 'Male'),
        ('F', 'Female'),
        ('O', 'Other'),
    )
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, blank=True, null=True)

    def __str__(self):
        return f"{self.username} ({self.role})"


class Membership(models.Model):
    PLAN_CHOICES = (
        ('1_month', '1 Month Starter'),
        ('3_months', '3 Months Pro'),
        ('6_months', '6 Months Elite'),
        ('annual', 'Annual VIP Legacy'),
    )
    STATUS_CHOICES = (
        ('active', 'Active'),
        ('pending', 'Pending Renewal'),
        ('expired', 'Expired'),
    )

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='membership')
    plan_name = models.CharField(max_length=50, choices=PLAN_CHOICES, default='3_months')
    plan_title = models.CharField(max_length=100, default='3 Months Pro')
    date_of_joining = models.DateField(default=timezone.now)
    start_date = models.DateField(default=timezone.now)
    end_date = models.DateField()
    total_fee = models.DecimalField(max_digits=10, decimal_places=2, default=9999.00)
    paid_fee = models.DecimalField(max_digits=10, decimal_places=2, default=6000.00)
    balance_due = models.DecimalField(max_digits=10, decimal_places=2, default=3999.00)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        self.balance_due = max(0, float(self.total_fee) - float(self.paid_fee))
        if self.end_date and self.end_date < timezone.now().date():
            self.status = 'expired'
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Membership for {self.user.username} ({self.plan_title})"


class WorkoutPlan(models.Model):
    DAY_CHOICES = (
        ('mon', 'Monday'),
        ('tue', 'Tuesday'),
        ('wed', 'Wednesday'),
        ('thu', 'Thursday'),
        ('fri', 'Friday'),
        ('sat', 'Saturday'),
    )
    CATEGORY_CHOICES = (
        ('general', 'General Fitness'),
        ('weight_loss', 'Weight Loss'),
        ('weight_gain', 'Weight Gain / Hypertrophy'),
    )

    day_of_week = models.CharField(max_length=5, choices=DAY_CHOICES)
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, default='general')
    user = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='assigned_workouts')
    title = models.CharField(max_length=150)
    focus_muscle = models.CharField(max_length=100)
    duration_minutes = models.PositiveIntegerField(default=60)
    exercises = models.JSONField(default=list, help_text="List of exercises with sets, reps, and tips")
    trainer_notes = models.TextField(blank=True, default='')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['day_of_week']

    def __str__(self):
        return f"{self.get_day_of_week_display()}: {self.title} ({self.category})"


class DietPlan(models.Model):
    CATEGORY_CHOICES = (
        ('weight_loss', 'Weight Loss'),
        ('weight_gain', 'Weight Gain'),
        ('general_fitness', 'General Fitness'),
    )
    DAY_CHOICES = (
        ('mon', 'Monday'),
        ('tue', 'Tuesday'),
        ('wed', 'Wednesday'),
        ('thu', 'Thursday'),
        ('fri', 'Friday'),
        ('sat', 'Saturday'),
    )

    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES)
    day_of_week = models.CharField(max_length=5, choices=DAY_CHOICES)
    daily_calories = models.PositiveIntegerField(default=2200)
    macros = models.JSONField(default=dict, help_text="e.g. {'protein': '140g', 'carbs': '220g', 'fats': '55g'}")
    meals = models.JSONField(default=list, help_text="List of meals: breakfast, mid_morning, lunch, evening_snack, dinner")
    trainer_advice = models.TextField(blank=True, default='Stay hydrated, drink at least 3-4 liters of water today.')
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('category', 'day_of_week')
        ordering = ['category', 'day_of_week']

    def __str__(self):
        return f"{self.get_category_display()} - {self.get_day_of_week_display()}"


class TrainerInstruction(models.Model):
    trainer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='instructions_given')
    target_member = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True, related_name='instructions_received')
    title = models.CharField(max_length=150)
    instruction_text = models.TextField()
    scheduled_for_date = models.DateField(help_text="Scheduled date (e.g. one day in advance)")
    is_advance = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-scheduled_for_date', '-created_at']

    def __str__(self):
        return f"[{self.scheduled_for_date}] {self.title}"


class CategoryGuidance(models.Model):
    CATEGORY_CHOICES = (
        ('general_fitness', 'General Fitness'),
        ('weight_loss', 'Weight Loss'),
        ('weight_gain', 'Weight Gain'),
    )
    category = models.CharField(max_length=30, choices=CATEGORY_CHOICES, unique=True)
    title = models.CharField(max_length=150)
    guidance_text = models.TextField()
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Guidance for {self.get_category_display()}"


class MemberDailyWorkoutLog(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='workout_logs')
    workout_name = models.CharField(max_length=150)
    date = models.DateField(default=timezone.now)
    start_time = models.CharField(max_length=20, default='06:30 AM')
    end_time = models.CharField(max_length=20, default='07:45 AM')
    notes = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-date', '-created_at']

    def __str__(self):
        return f"Log for {self.user.username} - {self.workout_name} on {self.date}"


class GymGalleryMedia(models.Model):
    MEDIA_TYPES = (
        ('photo', 'Photo'),
        ('video', 'Video'),
    )
    title = models.CharField(max_length=150)
    category = models.CharField(max_length=100, default='Workout Room')
    media_type = models.CharField(max_length=10, choices=MEDIA_TYPES, default='photo')
    media_url = models.TextField(blank=True, default='')
    file = models.FileField(upload_to='gallery/', blank=True, null=True)
    description = models.TextField(blank=True, default='')
    tag = models.CharField(max_length=100, blank=True, default='Strength Training')
    uploaded_by = models.ForeignKey(User, on_delete=models.CASCADE, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"[{self.media_type.upper()}] {self.title} ({self.category})"


class AdminOTPCode(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='otp_codes', null=True, blank=True)
    phone_number = models.CharField(max_length=20)
    otp_code = models.CharField(max_length=6)
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"OTP {self.otp_code} for {self.phone_number} ({self.user.username if self.user else 'Guest'})"
