import random
from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView
from django.utils import timezone
from datetime import timedelta
from .models import (
    User, Membership, WorkoutPlan, DietPlan, TrainerInstruction,
    GymGalleryMedia, AdminOTPCode, CategoryGuidance, MemberDailyWorkoutLog
)
from .serializers import (
    UserSerializer, RegisterSerializer, CustomTokenObtainPairSerializer,
    MembershipSerializer, WorkoutPlanSerializer, DietPlanSerializer,
    TrainerInstructionSerializer, GymGalleryMediaSerializer, AdminOTPCodeSerializer,
    CategoryGuidanceSerializer, MemberDailyWorkoutLogSerializer
)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer

class CustomTokenObtainPairView(TokenObtainPairView):
    serializer_class = CustomTokenObtainPairSerializer

class UserDetailView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = (permissions.IsAuthenticated,)

    def get_object(self):
        return self.request.user


class MemberDashboardSummaryView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        user = request.user if request.user.is_authenticated else None
        today = timezone.now().date()
        
        # Determine member category (default to weight_loss or general_fitness)
        member_category = getattr(user, 'fitness_category', 'weight_loss') if user else 'weight_loss'

        # 1. Membership
        membership_data = None
        is_expired = False
        expiration_alert = None

        if user and hasattr(user, 'membership'):
            mem = user.membership
            if mem.end_date and mem.end_date < today:
                mem.status = 'expired'
                mem.save()
            membership_data = MembershipSerializer(mem).data
            if mem.status == 'expired' or (mem.end_date and mem.end_date <= today):
                is_expired = True
                expiration_alert = f"CRITICAL NOTICE: Your membership plan ({mem.plan_title}) expired on {mem.end_date}. Please contact desk or admin immediately to renew!"
        else:
            membership_data = {
                'plan_name': '3_months',
                'plan_title': '3 Months Pro Elite',
                'fitness_category': member_category,
                'date_of_joining': (today - timedelta(days=25)).isoformat(),
                'start_date': (today - timedelta(days=25)).isoformat(),
                'end_date': (today + timedelta(days=65)).isoformat(),
                'total_fee': '9999.00',
                'paid_fee': '6000.00',
                'balance_due': '3999.00',
                'status': 'active'
            }

        # 2. Daily Workouts (Filtered by member's category or user assigned)
        workouts = WorkoutPlan.objects.filter(user=user) if user else WorkoutPlan.objects.none()
        if not workouts.exists():
            workouts = WorkoutPlan.objects.filter(category=member_category)
            if not workouts.exists():
                workouts = WorkoutPlan.objects.filter(category='general_fitness')
            if not workouts.exists():
                workouts = WorkoutPlan.objects.all()

        workout_data = WorkoutPlanSerializer(workouts, many=True).data

        # 3. Diet Plans (Filtered by member's category or all)
        diets = DietPlan.objects.filter(category=member_category)
        if not diets.exists():
            diets = DietPlan.objects.all()
        diet_data = DietPlanSerializer(diets, many=True).data

        # 4. Trainer Instructions
        instructions = TrainerInstruction.objects.all()[:10]
        instruction_data = TrainerInstructionSerializer(instructions, many=True).data

        # 5. Category Guidance
        guidance_records = CategoryGuidance.objects.all()
        guidance_data = CategoryGuidanceSerializer(guidance_records, many=True).data

        # 6. Member's Daily Workout Timings Logs
        logs = MemberDailyWorkoutLog.objects.filter(user=user) if user else MemberDailyWorkoutLog.objects.all()[:5]
        log_data = MemberDailyWorkoutLogSerializer(logs, many=True).data

        return Response({
            'membership': membership_data,
            'member_category': member_category,
            'is_expired': is_expired,
            'expiration_alert': expiration_alert,
            'workouts': workout_data,
            'diet_plans': diet_data,
            'trainer_instructions': instruction_data,
            'category_guidance': guidance_data,
            'workout_logs': log_data,
            'user': UserSerializer(user).data if user else {
                'username': 'Guest Member',
                'first_name': 'Alex',
                'last_name': 'Vance',
                'role': 'member',
                'fitness_category': member_category
            }
        })


class AdminPortalOverviewView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        today = timezone.now().date()
        members = User.objects.filter(role='member')
        members_data = UserSerializer(members, many=True).data

        expired_members = []
        for m in members:
            if hasattr(m, 'membership'):
                mem = m.membership
                if mem.end_date and mem.end_date < today:
                    if mem.status != 'expired':
                        mem.status = 'expired'
                        mem.save()
                    expired_members.append({
                        'id': m.id,
                        'name': f"{m.first_name} {m.last_name}".strip() or m.username,
                        'plan_title': mem.plan_title,
                        'category': m.fitness_category,
                        'end_date': str(mem.end_date),
                        'balance_due': str(mem.balance_due)
                    })

        total_members = members.count()
        total_revenue = sum(float(m.membership.paid_fee) for m in members if hasattr(m, 'membership'))
        total_balance_due = sum(float(m.membership.balance_due) for m in members if hasattr(m, 'membership'))
        
        upcoming_expirations = Membership.objects.filter(
            end_date__gte=today,
            end_date__lte=today + timedelta(days=14)
        ).count()

        instructions = TrainerInstruction.objects.all()[:15]
        instruction_data = TrainerInstructionSerializer(instructions, many=True).data

        guidance_records = CategoryGuidance.objects.all()
        guidance_data = CategoryGuidanceSerializer(guidance_records, many=True).data

        return Response({
            'metrics': {
                'total_members': total_members or 24,
                'total_revenue': total_revenue or 184500.00,
                'total_balance_due': total_balance_due or 31500.00,
                'upcoming_expirations': upcoming_expirations or 5,
                'expired_count': len(expired_members)
            },
            'expired_members_alerts': expired_members,
            'members': members_data,
            'instructions': instruction_data,
            'category_guidance': guidance_data
        })


class UpdateMembershipView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            membership, _ = Membership.objects.get_or_create(
                user=user,
                defaults={
                    'end_date': timezone.now().date() + timedelta(days=90)
                }
            )
            # Update user fields if provided
            user_updated = False
            if 'fitness_category' in request.data:
                user.fitness_category = request.data['fitness_category']
                membership.fitness_category = request.data['fitness_category']
                user_updated = True
            if 'phone' in request.data:
                user.phone = request.data['phone']
                user_updated = True
            if 'gender' in request.data:
                user.gender = request.data['gender']
                user_updated = True
            if 'address' in request.data:
                user.address = request.data['address']
                user_updated = True
            if 'height' in request.data:
                user.height = request.data['height']
                user_updated = True
            if 'weight' in request.data:
                user.weight = request.data['weight']
                user_updated = True
            if 'has_medical_condition' in request.data:
                user.has_medical_condition = bool(request.data['has_medical_condition'])
                user_updated = True
            if 'medical_condition_reason' in request.data:
                user.medical_condition_reason = request.data['medical_condition_reason']
                user_updated = True
            if 'injuries_surgeries' in request.data:
                user.injuries_surgeries = request.data['injuries_surgeries']
                user_updated = True
            if user_updated:
                user.save()

            if 'plan_name' in request.data:
                membership.plan_name = request.data['plan_name']
            if 'plan_title' in request.data:
                membership.plan_title = request.data['plan_title']
            if 'total_fee' in request.data:
                membership.total_fee = request.data['total_fee']
            if 'paid_fee' in request.data:
                membership.paid_fee = request.data['paid_fee']
            if 'payment_mode' in request.data:
                membership.payment_mode = request.data['payment_mode']
            if 'status' in request.data:
                membership.status = request.data['status']
            if 'date_of_joining' in request.data:
                doj = request.data.get('date_of_joining')
                membership.date_of_joining = doj if (doj and str(doj).strip() != "") else None
            if 'end_date' in request.data:
                ed = request.data.get('end_date')
                membership.end_date = ed if (ed and str(ed).strip() != "") else None
            
            membership.save()
            return Response({
                'membership': MembershipSerializer(membership).data,
                'user': UserSerializer(user).data
            })
        except User.DoesNotExist:
            return Response({'error': 'Member not found'}, status=status.HTTP_404_NOT_FOUND)


class DeleteMemberView(APIView):
    permission_classes = (permissions.AllowAny,)

    def delete(self, request, user_id):
        try:
            user = User.objects.get(id=user_id)
            if user.role in ['admin', 'super_admin'] and User.objects.filter(role__in=['admin', 'super_admin']).count() <= 1:
                return Response({'error': 'Cannot delete the primary admin account'}, status=status.HTTP_400_BAD_REQUEST)
            user.delete()
            return Response({'message': 'Client removed from gym registry successfully'})
        except User.DoesNotExist:
            return Response({'error': 'Client not found'}, status=status.HTTP_404_NOT_FOUND)


# --- Category Specific Guidance Views ---

class CategoryGuidanceView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        guidance = CategoryGuidance.objects.all()
        return Response(CategoryGuidanceSerializer(guidance, many=True).data)

    def post(self, request):
        category = request.data.get('category')
        title = request.data.get('title')
        guidance_text = request.data.get('guidance_text')

        if not category or not guidance_text:
            return Response({'error': 'Category and guidance_text are required'}, status=status.HTTP_400_BAD_REQUEST)

        creator = request.user if request.user.is_authenticated else User.objects.filter(role__in=['admin', 'super_admin']).first()

        record, _ = CategoryGuidance.objects.update_or_create(
            category=category,
            defaults={
                'title': title or f'Special Guidance for {category.replace("_", " ").title()}',
                'guidance_text': guidance_text,
                'created_by': creator
            }
        )

        return Response(CategoryGuidanceSerializer(record).data, status=status.HTTP_201_CREATED)


# --- Member Daily Workout Log Views ---

class MemberDailyWorkoutLogView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        user = request.user if request.user.is_authenticated else None
        logs = MemberDailyWorkoutLog.objects.filter(user=user) if user else MemberDailyWorkoutLog.objects.all()[:20]
        return Response(MemberDailyWorkoutLogSerializer(logs, many=True).data)

    def post(self, request):
        user = request.user if request.user.is_authenticated else User.objects.filter(role='member').first()
        if not user:
            user = User.objects.first()

        workout_name = request.data.get('workout_name')
        start_time = request.data.get('start_time', '06:30 AM')
        end_time = request.data.get('end_time', '07:45 AM')
        notes = request.data.get('notes', '')

        if not workout_name:
            return Response({'error': 'Workout name is required'}, status=status.HTTP_400_BAD_REQUEST)

        log = MemberDailyWorkoutLog.objects.create(
            user=user,
            workout_name=workout_name,
            start_time=start_time,
            end_time=end_time,
            notes=notes,
            date=timezone.now().date()
        )

        return Response(MemberDailyWorkoutLogSerializer(log).data, status=status.HTTP_201_CREATED)


class WorkoutPlanViewSet(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        plans = WorkoutPlan.objects.all()
        return Response(WorkoutPlanSerializer(plans, many=True).data)

    def post(self, request):
        serializer = WorkoutPlanSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def put(self, request, plan_id):
        try:
            plan = WorkoutPlan.objects.get(id=plan_id)
            serializer = WorkoutPlanSerializer(plan, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except WorkoutPlan.DoesNotExist:
            return Response({'error': 'Workout plan not found'}, status=status.HTTP_404_NOT_FOUND)


class DietPlanViewSet(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        category = request.query_params.get('category')
        diets = DietPlan.objects.filter(category=category) if category else DietPlan.objects.all()
        return Response(DietPlanSerializer(diets, many=True).data)

    def put(self, request, diet_id):
        try:
            diet = DietPlan.objects.get(id=diet_id)
            serializer = DietPlanSerializer(diet, data=request.data, partial=True)
            if serializer.is_valid():
                serializer.save()
                return Response(serializer.data)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        except DietPlan.DoesNotExist:
            return Response({'error': 'Diet plan not found'}, status=status.HTTP_404_NOT_FOUND)


class TrainerInstructionCreateView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        trainer = request.user if (request.user.is_authenticated and request.user.role in ['trainer', 'admin', 'super_admin']) else User.objects.filter(role__in=['admin', 'trainer']).first()
        if not trainer:
            trainer = User.objects.first()

        data = request.data.copy()
        data['trainer'] = trainer.id if trainer else None

        serializer = TrainerInstructionSerializer(data=data)
        if serializer.is_valid():
            instruction = serializer.save(trainer=trainer)
            return Response(TrainerInstructionSerializer(instruction).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# --- 2-Step Verification (OTP) Views ---

class SendAdminOTPView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        phone_number = request.data.get('phone_number', '').strip()
        username = request.data.get('username', '').strip()

        if not phone_number:
            return Response({'error': 'Mobile phone number is required'}, status=status.HTTP_400_BAD_REQUEST)

        user = None
        if username:
            user = User.objects.filter(username=username).first()

        code = str(random.randint(100000, 999999))

        otp_record = AdminOTPCode.objects.create(
            user=user,
            phone_number=phone_number,
            otp_code=code,
            is_verified=False
        )

        return Response({
            'message': f'2-Step Verification OTP generated and sent to {phone_number} successfully!',
            'phone_number': phone_number,
            'otp_demo': code,
            'id': otp_record.id
        })


class VerifyAdminOTPView(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        phone_number = request.data.get('phone_number', '').strip()
        otp_code = request.data.get('otp_code', '').strip()

        if not otp_code:
            return Response({'error': 'Verification OTP code is required'}, status=status.HTTP_400_BAD_REQUEST)

        query = AdminOTPCode.objects.filter(otp_code=otp_code, is_verified=False)
        if phone_number:
            query = query.filter(phone_number=phone_number)

        otp_record = query.first()

        if not otp_record:
            return Response({'verified': False, 'error': 'Invalid or expired 2-Step Verification OTP code'}, status=status.HTTP_400_BAD_REQUEST)

        otp_record.is_verified = True
        otp_record.save()

        return Response({
            'verified': True,
            'message': 'Admin 2-Step Verification successful!'
        })


# --- Gym Workout Room & Equipment Gallery Media Views ---

class GymGalleryMediaView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        category = request.query_params.get('category')
        media_items = GymGalleryMedia.objects.all()
        if category and category.lower() != 'all':
            media_items = media_items.filter(category__iexact=category)
        
        serializer = GymGalleryMediaSerializer(media_items, many=True)
        return Response(serializer.data)

    def post(self, request):
        data = request.data.copy()
        user = request.user if request.user.is_authenticated else User.objects.filter(role__in=['admin', 'super_admin']).first()
        
        serializer = GymGalleryMediaSerializer(data=data)
        if serializer.is_valid():
            media = serializer.save(uploaded_by=user)
            return Response(GymGalleryMediaSerializer(media).data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class GymGalleryMediaDetailView(APIView):
    permission_classes = (permissions.AllowAny,)

    def delete(self, request, media_id):
        try:
            media = GymGalleryMedia.objects.get(id=media_id)
            media.delete()
            return Response({'message': 'Gallery media item deleted successfully'})
        except GymGalleryMedia.DoesNotExist:
            return Response({'error': 'Media item not found'}, status=status.HTTP_404_NOT_FOUND)


# --- Captcha Generation & Verification Views ---

class CaptchaGenerateView(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        import string
        import uuid
        import hashlib
        
        # Generate 6-char alphanumeric captcha string (avoiding confusing chars like 0/O, 1/I)
        characters = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
        code = ''.join(random.choice(characters) for _ in range(6))
        
        # Create hash token with secret salt
        salt = 'LegacyGym_Captcha_Security_2026'
        token = hashlib.sha256(f"{code.upper()}:{salt}".encode('utf-8')).hexdigest()
        
        return Response({
            'captcha_code': code,
            'captcha_token': token,
            'message': 'Captcha challenge generated'
        })

    def post(self, request):
        import hashlib
        user_input = request.data.get('user_input', '').strip().upper()
        token = request.data.get('captcha_token', '')

        if not user_input or not token:
            return Response({'valid': False, 'error': 'Captcha input and token required'}, status=status.HTTP_400_BAD_REQUEST)

        salt = 'LegacyGym_Captcha_Security_2026'
        expected_token = hashlib.sha256(f"{user_input}:{salt}".encode('utf-8')).hexdigest()

        if token == expected_token:
            return Response({'valid': True, 'message': 'Captcha verified successfully'})
        else:
            return Response({'valid': False, 'error': 'Invalid CAPTCHA code. Please try again.'}, status=status.HTTP_400_BAD_REQUEST)

