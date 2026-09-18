import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.utils import timezone
from datetime import timedelta
from accounts.models import User, Membership, WorkoutPlan, DietPlan, TrainerInstruction

def seed():
    # 1. Admin / Trainer user
    admin_user, _ = User.objects.get_or_create(
        username='admin',
        defaults={
            'first_name': 'Marcus',
            'last_name': 'Sterling',
            'email': 'headcoach@legacyfitness.com',
            'role': 'admin'
        }
    )
    if not admin_user.has_usable_password():
        admin_user.set_password('admin123')
        admin_user.is_staff = True
        admin_user.is_superuser = True
        admin_user.save()

    # 2. Member demo user
    member_user, _ = User.objects.get_or_create(
        username='johndoe',
        defaults={
            'first_name': 'John',
            'last_name': 'Doe',
            'email': 'john.doe@example.com',
            'role': 'member',
            'phone': '+1 555-019-2834',
            'gender': 'M'
        }
    )
    if not member_user.has_usable_password():
        member_user.set_password('member123')
        member_user.save()

    today = timezone.now().date()

    # 3. Membership for member
    Membership.objects.update_or_create(
        user=member_user,
        defaults={
            'plan_name': '3_months',
            'plan_title': '3 Months Pro Elite',
            'date_of_joining': today - timedelta(days=28),
            'start_date': today - timedelta(days=28),
            'end_date': today + timedelta(days=62),
            'total_fee': 9999.00,
            'paid_fee': 6000.00,
            'balance_due': 3999.00,
            'status': 'active'
        }
    )

    # 4. Workouts (Mon - Sat)
    workouts_data = [
        {
            'day_of_week': 'mon',
            'title': 'Chest & Triceps Hypertrophy',
            'focus_muscle': 'Chest, Anterior Deltoids, Triceps',
            'duration_minutes': 65,
            'category': 'general',
            'trainer_notes': 'Focus on deep stretch and controlled 3-second eccentric tempo on bench press.',
            'exercises': [
                {'name': 'Incline Barbell Bench Press', 'sets': '4', 'reps': '8-10', 'rest': '90s', 'notes': 'Warmup with 2 lighter sets'},
                {'name': 'Flat Dumbbell Press', 'sets': '3', 'reps': '10-12', 'rest': '60s', 'notes': 'Squeeze pecs at top peak'},
                {'name': 'Cable Chest Flyes (Low to High)', 'sets': '3', 'reps': '15', 'rest': '45s', 'notes': 'Constant tension'},
                {'name': 'Overhead Tricep Cable Extension', 'sets': '4', 'reps': '12', 'rest': '60s', 'notes': 'Full stretch at bottom'},
                {'name': 'Dips (Weighted or Assisted)', 'sets': '3', 'reps': 'To Failure', 'rest': '60s', 'notes': 'Lean forward slightly'}
            ]
        },
        {
            'day_of_week': 'tue',
            'title': 'Back & Biceps Power Engine',
            'focus_muscle': 'Lats, Rhomboids, Traps, Biceps',
            'duration_minutes': 70,
            'category': 'general',
            'trainer_notes': 'Use lifting straps if grip fatigues on heavy deadlifts/pullups.',
            'exercises': [
                {'name': 'Barbell Deadlift', 'sets': '4', 'reps': '5-6', 'rest': '120s', 'notes': 'Keep neutral spine and brace core'},
                {'name': 'Wide-Grip Lat Pulldowns', 'sets': '4', 'reps': '10-12', 'rest': '60s', 'notes': 'Drive elbows down to hips'},
                {'name': 'Chest-Supported T-Bar Row', 'sets': '3', 'reps': '10', 'rest': '75s', 'notes': 'Hold peak squeeze 1 second'},
                {'name': 'Incline Dumbbell Bicep Curls', 'sets': '3', 'reps': '12', 'rest': '60s', 'notes': 'Supinate wrists at top'},
                {'name': 'Hammer Rope Curls', 'sets': '3', 'reps': '15', 'rest': '45s', 'notes': 'Strict form, no swinging'}
            ]
        },
        {
            'day_of_week': 'wed',
            'title': 'Lower Body Quad & Core Builder',
            'focus_muscle': 'Quadriceps, Glutes, Calves, Abs',
            'duration_minutes': 75,
            'category': 'general',
            'trainer_notes': 'Hydrate thoroughly between sets; heavy compound leg volume today.',
            'exercises': [
                {'name': 'Barbell Back Squats', 'sets': '4', 'reps': '6-8', 'rest': '120s', 'notes': 'Break parallel depth comfortably'},
                {'name': 'Bulgarian Split Squats', 'sets': '3 each', 'reps': '10', 'rest': '60s', 'notes': 'Elevate rear foot on bench'},
                {'name': 'Leg Press (45 Degree)', 'sets': '4', 'reps': '12-15', 'rest': '90s', 'notes': 'Controlled depth, do not lock knees'},
                {'name': 'Seated Calf Raises', 'sets': '4', 'reps': '15-20', 'rest': '45s', 'notes': 'Pause 2 sec at top and bottom'},
                {'name': 'Hanging Leg Raises', 'sets': '3', 'reps': '15', 'rest': '45s', 'notes': 'Tuck knees to chest without swinging'}
            ]
        },
        {
            'day_of_week': 'thu',
            'title': 'Shoulders & Upper Trap Sculpt',
            'focus_muscle': 'Deltoids (Lateral, Rear, Front), Traps',
            'duration_minutes': 60,
            'category': 'general',
            'trainer_notes': 'Prioritize lateral deltoids for that signature V-taper aesthetic.',
            'exercises': [
                {'name': 'Seated Overhead Dumbbell Press', 'sets': '4', 'reps': '8-10', 'rest': '90s', 'notes': 'Elbows slightly tucked in'},
                {'name': 'Lean-Away Cable Lateral Raises', 'sets': '4', 'reps': '12-15', 'rest': '45s', 'notes': 'Smooth continuous motion'},
                {'name': 'Face Pulls with External Rotation', 'sets': '4', 'reps': '15', 'rest': '45s', 'notes': 'Pull rope toward forehead'},
                {'name': 'Barbell Shrugs', 'sets': '3', 'reps': '12', 'rest': '60s', 'notes': 'Pause at the peak shrug'},
                {'name': 'Plank to Pushup', 'sets': '3', 'reps': '12', 'rest': '45s', 'notes': 'Maintain tight hollow body'}
            ]
        },
        {
            'day_of_week': 'fri',
            'title': 'Posterior Chain & Hamstring Focus',
            'focus_muscle': 'Hamstrings, Gluteus Maximus, Lower Back',
            'duration_minutes': 65,
            'category': 'general',
            'trainer_notes': 'Feel the hamstring stretch on Romanian deadlifts; don’t round your back.',
            'exercises': [
                {'name': 'Romanian Deadlifts (RDLs)', 'sets': '4', 'reps': '8-10', 'rest': '90s', 'notes': 'Hinge at the hips with soft knees'},
                {'name': 'Lying Leg Curls', 'sets': '4', 'reps': '12', 'rest': '60s', 'notes': 'Controlled negative tempo'},
                {'name': 'Barbell Hip Thrusts', 'sets': '4', 'reps': '10-12', 'rest': '90s', 'notes': 'Drive through heels, squeeze glutes'},
                {'name': 'Standing Single-Leg Calf Raises', 'sets': '3 each', 'reps': '15', 'rest': '45s', 'notes': 'Full range of motion'},
                {'name': 'Ab Wheel Rollouts', 'sets': '3', 'reps': '12', 'rest': '45s', 'notes': 'Engage core tightly throughout'}
            ]
        },
        {
            'day_of_week': 'sat',
            'title': 'High-Octane Athletic Conditioning & Core',
            'focus_muscle': 'Full Body, Cardiovascular Endurance, Core',
            'duration_minutes': 50,
            'category': 'general',
            'trainer_notes': 'End the week strong! Keep rest periods brief to maximize VO2 and metabolic conditioning.',
            'exercises': [
                {'name': 'Kettlebell Swings', 'sets': '4', 'reps': '20', 'rest': '45s', 'notes': 'Explosive hip drive'},
                {'name': 'Assault Bike / Rower Sprints', 'sets': '6 rounds', 'reps': '30s sprint / 30s rest', 'rest': '30s', 'notes': 'Max effort intervals'},
                {'name': 'Medicine Ball Slams', 'sets': '4', 'reps': '15', 'rest': '45s', 'notes': 'Full overhead extension slam down'},
                {'name': 'Farmer Walks with Heavy Dumbbells', 'sets': '4', 'reps': '40 meters', 'rest': '60s', 'notes': 'Tall upright posture'},
                {'name': 'Cable Woodchoppers', 'sets': '3 each', 'reps': '12', 'rest': '45s', 'notes': 'Rotational power from hips'}
            ]
        }
    ]

    for w in workouts_data:
        WorkoutPlan.objects.update_or_create(
            day_of_week=w['day_of_week'],
            category=w['category'],
            user=None,
            defaults=w
        )

    # 5. Diet Plans (Weight Loss, Weight Gain, General Fitness)
    diet_definitions = [
        # --- Weight Loss ---
        ('weight_loss', 1800, {'protein': '160g', 'carbs': '140g', 'fats': '45g'}, 'High-protein deficit plan. Drink 3.5L of water and minimize sodium retention.'),
        # --- Weight Gain ---
        ('weight_gain', 3100, {'protein': '190g', 'carbs': '400g', 'fats': '75g'}, 'Calorie surplus with clean carbs and continuous amino acid availability for mass building.'),
        # --- General Fitness ---
        ('general_fitness', 2300, {'protein': '150g', 'carbs': '240g', 'fats': '60g'}, 'Balanced macronutrient ratio maintaining peak vitality, recovery, and cognitive focus.')
    ]

    days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat']
    day_titles = {
        'mon': 'Monday Peak Fuel',
        'tue': 'Tuesday Performance Plan',
        'wed': 'Wednesday Mid-Week Revitalizer',
        'thu': 'Thursday Lean Sustenance',
        'fri': 'Friday Power Conditioning',
        'sat': 'Saturday High Output Fuel'
    }

    for cat, cals, macros, advice in diet_definitions:
        for d in days:
            if cat == 'weight_loss':
                meals = [
                    {'time': '07:30 AM', 'title': 'Breakfast', 'items': '4 Egg whites + 1 whole egg omelette with spinach, 1 slice whole wheat toast, Black coffee or Green tea', 'cals': '340 kcal'},
                    {'time': '11:00 AM', 'title': 'Mid-Morning Snack', 'items': '1 Scoop Whey isolate in cold water, 10 raw almonds', 'cals': '210 kcal'},
                    {'time': '01:30 PM', 'title': 'Lunch', 'items': '180g Grilled chicken breast / Tofu, 1 cup Steamed brown rice, Large crunchy cucumber & tomato salad', 'cals': '490 kcal'},
                    {'time': '05:30 PM', 'title': 'Evening Pre-Workout', 'items': '1 Green apple + 1 tablespoon Peanut butter or 1 scoop BCAA', 'cals': '180 kcal'},
                    {'time': '08:30 PM', 'title': 'Dinner', 'items': '180g Baked white fish / Paneer tikka, Sautéed broccoli, zucchini and bell peppers with olive oil spray', 'cals': '380 kcal'}
                ]
            elif cat == 'weight_gain':
                meals = [
                    {'time': '07:30 AM', 'title': 'Breakfast', 'items': '4 Whole eggs scrambled with cheddar cheese, 2 cups rolled oats with whole milk, honey & banana slices', 'cals': '720 kcal'},
                    {'time': '10:30 AM', 'title': 'Mid-Morning Mass Shake', 'items': '2 Scoops Whey protein, 1 banana, 2 tbsp natural peanut butter, oats, whole milk blended', 'cals': '580 kcal'},
                    {'time': '01:30 PM', 'title': 'Lunch', 'items': '220g Chicken breast or Lean beef, 2 cups Jasmine white rice, black beans and avocado slices', 'cals': '780 kcal'},
                    {'time': '05:00 PM', 'title': 'Pre-Workout Energy', 'items': '2 Slices multi-grain bread with strawberry jam, 1 medium banana, 1 espresso shot', 'cals': '320 kcal'},
                    {'time': '08:30 PM', 'title': 'Dinner', 'items': '200g Salmon fillet / Paneer bhurji, 2 large baked sweet potatoes, steamed asparagus and quinoa', 'cals': '700 kcal'}
                ]
            else:
                meals = [
                    {'time': '08:00 AM', 'title': 'Breakfast', 'items': '3 Scrambled eggs, 1 slice avocado toast with pumpkin seeds, freshly brewed black espresso', 'cals': '450 kcal'},
                    {'time': '11:00 AM', 'title': 'Mid-Morning Boost', 'items': 'Greek yogurt (200g) with mixed organic berries and crushed walnuts', 'cals': '250 kcal'},
                    {'time': '01:30 PM', 'title': 'Lunch', 'items': '180g Grilled lemon-herb chicken or Lentil bowl, 1.5 cups brown basmati rice, mixed vegetable medley', 'cals': '580 kcal'},
                    {'time': '05:00 PM', 'title': 'Pre-Workout Fuel', 'items': 'Handful roasted almonds and pumpkin seeds, 1 medium banana or coconut water', 'cals': '220 kcal'},
                    {'time': '08:30 PM', 'title': 'Dinner', 'items': 'Grilled fish or Tofu stir-fry, generous bowl of leafy greens with balsamic vinaigrette & sweet potato mash', 'cals': '520 kcal'}
                ]

            DietPlan.objects.update_or_create(
                category=cat,
                day_of_week=d,
                defaults={
                    'daily_calories': cals,
                    'macros': macros,
                    'meals': meals,
                    'trainer_advice': advice
                }
            )

    # 6. Trainer Instructions (Advance Notifications)
    instructions = [
        {
            'trainer': admin_user,
            'title': 'Tomorrow: Heavy Quad & Core Progressive Overload',
            'instruction_text': 'All morning & evening athletes: Please ensure 500ml hydration prior to gym arrival tomorrow. We will be executing 4 heavy sets of back squats followed by Bulgarian split squats. Warm up hip flexors and ankles for 10 minutes beforehand.',
            'scheduled_for_date': today + timedelta(days=1),
            'is_advance': True
        },
        {
            'trainer': admin_user,
            'title': 'Hydration & Electrolyte Advisory for Peak Recovery',
            'instruction_text': 'Intense humidity expected. Replenish your sodium/potassium balance with lime water and a pinch of pink salt during your mid-workout breaks. Keep recovery window nutrition within 45 minutes.',
            'scheduled_for_date': today,
            'is_advance': False
        }
    ]

    for inst in instructions:
        TrainerInstruction.objects.get_or_create(
            trainer=inst['trainer'],
            title=inst['title'],
            defaults=inst
        )

    print("Seed complete: Admin, John Doe, 6 Workouts, 18 Diet Plans, 2 Trainer Instructions created successfully.")

if __name__ == '__main__':
    seed()
