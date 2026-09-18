from rest_framework import serializers
from .models import (
    User, Membership, WorkoutPlan, DietPlan, TrainerInstruction,
    GymGalleryMedia, AdminOTPCode, CategoryGuidance, MemberDailyWorkoutLog
)
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

class MembershipSerializer(serializers.ModelSerializer):
    payment_mode_display = serializers.CharField(source='get_payment_mode_display', read_only=True)
    plan_name_display = serializers.CharField(source='get_plan_name_display', read_only=True)

    class Meta:
        model = Membership
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    membership = MembershipSerializer(read_only=True)
    fitness_category_display = serializers.CharField(source='get_fitness_category_display', read_only=True)
    gender_display = serializers.CharField(source='get_gender_display', read_only=True)

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'first_name', 'last_name', 'role',
            'fitness_category', 'fitness_category_display', 'phone',
            'date_of_birth', 'gender', 'gender_display', 'address',
            'height', 'weight', 'has_medical_condition',
            'medical_condition_reason', 'injuries_surgeries', 'membership'
        )


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    fitness_category = serializers.CharField(required=False, default='general_fitness')
    
    # Optional membership configuration fields passed during registration
    plan_name = serializers.CharField(write_only=True, required=False, default='3_months')
    plan_title = serializers.CharField(write_only=True, required=False, default='')
    date_of_joining = serializers.DateField(write_only=True, required=False, allow_null=True)
    end_date = serializers.DateField(write_only=True, required=False, allow_null=True)
    total_fee = serializers.DecimalField(write_only=True, max_digits=10, decimal_places=2, required=False, default=4999.00)
    paid_fee = serializers.DecimalField(write_only=True, max_digits=10, decimal_places=2, required=False, default=4999.00)
    payment_mode = serializers.CharField(write_only=True, required=False, default='upi')

    class Meta:
        model = User
        fields = (
            'id', 'username', 'email', 'password', 'first_name', 'last_name',
            'phone', 'date_of_birth', 'gender', 'address', 'height', 'weight',
            'has_medical_condition', 'medical_condition_reason', 'injuries_surgeries',
            'fitness_category',
            'plan_name', 'plan_title', 'date_of_joining', 'end_date', 'total_fee', 'paid_fee', 'payment_mode'
        )
        extra_kwargs = {
            'email': {'required': False, 'allow_blank': True},
            'first_name': {'required': False, 'allow_blank': True},
            'last_name': {'required': False, 'allow_blank': True},
            'phone': {'required': False, 'allow_blank': True, 'allow_null': True},
            'date_of_birth': {'required': False, 'allow_null': True},
            'gender': {'required': False, 'allow_blank': True, 'allow_null': True},
            'address': {'required': False, 'allow_blank': True},
            'height': {'required': False, 'allow_blank': True},
            'weight': {'required': False, 'allow_blank': True},
            'has_medical_condition': {'required': False},
            'medical_condition_reason': {'required': False, 'allow_blank': True},
            'injuries_surgeries': {'required': False, 'allow_blank': True},
            'fitness_category': {'required': False},
        }

    def create(self, validated_data):
        from django.utils import timezone
        from datetime import timedelta

        # Extract membership specific fields
        plan_name = validated_data.pop('plan_name', '3_months')
        plan_title = validated_data.pop('plan_title', '')
        date_of_joining = validated_data.pop('date_of_joining', None)
        end_date = validated_data.pop('end_date', None)
        total_fee = validated_data.pop('total_fee', 4999.00)
        paid_fee = validated_data.pop('paid_fee', 4999.00)
        payment_mode = validated_data.pop('payment_mode', 'upi')

        fitness_cat = validated_data.get('fitness_category', 'general_fitness')

        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            phone=validated_data.get('phone', ''),
            date_of_birth=validated_data.get('date_of_birth'),
            gender=validated_data.get('gender', ''),
            address=validated_data.get('address', ''),
            height=validated_data.get('height', ''),
            weight=validated_data.get('weight', ''),
            has_medical_condition=validated_data.get('has_medical_condition', False),
            medical_condition_reason=validated_data.get('medical_condition_reason', ''),
            injuries_surgeries=validated_data.get('injuries_surgeries', ''),
            fitness_category=fitness_cat,
            role='member'
        )

        today = timezone.now().date()
        joining_date = date_of_joining or today

        # Calculate default end date based on selected plan if not provided
        plan_titles = {
            '1_month': '1 Month Starter',
            '3_months': '3 Months Pro',
            '6_months': '6 Months Elite',
            '12_months': '12 Months Annual VIP',
        }
        plan_durations = {
            '1_month': 30,
            '3_months': 90,
            '6_months': 180,
            '12_months': 365,
        }

        if not plan_title:
            plan_title = plan_titles.get(plan_name, '3 Months Pro')

        if not end_date:
            days = plan_durations.get(plan_name, 90)
            end_date = joining_date + timedelta(days=days)

        Membership.objects.create(
            user=user,
            plan_name=plan_name,
            plan_title=plan_title,
            fitness_category=fitness_cat,
            date_of_joining=joining_date,
            start_date=joining_date,
            end_date=end_date,
            total_fee=total_fee,
            paid_fee=paid_fee,
            payment_mode=payment_mode,
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
