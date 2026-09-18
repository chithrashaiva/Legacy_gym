from rest_framework import serializers
from .models import (
    User, Membership, WorkoutPlan, DietPlan, TrainerInstruction,
    GymGalleryMedia, AdminOTPCode, CategoryGuidance, MemberDailyWorkoutLog
)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MembershipSerializer(serializers.ModelSerializer):
    class Meta:
        model = Membership
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    membership = MembershipSerializer(read_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'first_name', 'last_name', 'role', 'phone', 'date_of_birth', 'gender', 'membership')


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password', 'first_name', 'last_name', 'phone', 'date_of_birth', 'gender')
        extra_kwargs = {
            'email': {'required': False, 'allow_blank': True},
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
            'phone': {'required': False, 'allow_blank': True, 'allow_null': True},
            'date_of_birth': {'required': False, 'allow_null': True},
            'gender': {'required': False, 'allow_blank': True, 'allow_null': True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            date_of_birth=validated_data.get('date_of_birth'),
            gender=validated_data.get('gender', ''),
            role='member'
        )
        from django.utils import timezone
        from datetime import timedelta
        today = timezone.now().date()
        Membership.objects.create(
            user=user,
            plan_name='3_months',
            plan_title='3 Months Pro',
            date_of_joining=today,
            start_date=today,
            end_date=today + timedelta(days=90),
            total_fee=9999.00,
            paid_fee=6000.00,
            balance_due=3999.00,
            status='active'
        )
        return user


class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = UserSerializer(self.user).data
        return data


class WorkoutPlanSerializer(serializers.ModelSerializer):
    day_display = serializers.CharField(source='get_day_of_week_display', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = WorkoutPlan
        fields = '__all__'


class DietPlanSerializer(serializers.ModelSerializer):
    day_display = serializers.CharField(source='get_day_of_week_display', read_only=True)
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = DietPlan
        fields = '__all__'


class TrainerInstructionSerializer(serializers.ModelSerializer):
    trainer_name = serializers.SerializerMethodField()
    target_member_name = serializers.SerializerMethodField()

    class Meta:
        model = TrainerInstruction
        fields = '__all__'

    def get_trainer_name(self, obj):
        return f"{obj.trainer.first_name} {obj.trainer.last_name}".strip() or obj.trainer.username

    def get_target_member_name(self, obj):
        if obj.target_member:
            return f"{obj.target_member.first_name} {obj.target_member.last_name}".strip() or obj.target_member.username
        return "All Members (Gym-Wide)"


class CategoryGuidanceSerializer(serializers.ModelSerializer):
    created_by_name = serializers.SerializerMethodField()
    category_display = serializers.CharField(source='get_category_display', read_only=True)

    class Meta:
        model = CategoryGuidance
        fields = '__all__'

    def get_created_by_name(self, obj):
        if obj.created_by:
            return f"{obj.created_by.first_name} {obj.created_by.last_name}".strip() or obj.created_by.username
        return "Admin Coach"


class MemberDailyWorkoutLogSerializer(serializers.ModelSerializer):
    user_name = serializers.SerializerMethodField()

    class Meta:
        model = MemberDailyWorkoutLog
        fields = '__all__'

    def get_user_name(self, obj):
        return f"{obj.user.first_name} {obj.user.last_name}".strip() or obj.user.username


class GymGalleryMediaSerializer(serializers.ModelSerializer):
    uploaded_by_name = serializers.SerializerMethodField()
    file_url = serializers.SerializerMethodField()

    class Meta:
        model = GymGalleryMedia
        fields = '__all__'

    def get_uploaded_by_name(self, obj):
        if obj.uploaded_by:
            return f"{obj.uploaded_by.first_name} {obj.uploaded_by.last_name}".strip() or obj.uploaded_by.username
        return "Gym Coach"

    def get_file_url(self, obj):
        if obj.file:
            return obj.file.url
        return obj.media_url


class AdminOTPCodeSerializer(serializers.ModelSerializer):
    class Meta:
        model = AdminOTPCode
        fields = '__all__'
