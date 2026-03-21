import Heading from "../../components/docs/Heading";
import Text from "../../components/docs/Text";
import CodeBlock from "../../components/docs/CodeBlock";
import Label from "../../components/Label";

export default function TrainingPlansImplementation() {
  return (
    <div className="px-4 sm:px-6 py-8 space-y-6 w-full max-w-full overflow-x-hidden">
      <div>
        <h1 className="text-3xl font-bold mb-2">
          Training Plans - Implementation Guide
        </h1>
        <Text>
          Complete guide for integrating training plan functionality in the
          frontend. This guide shows all necessary endpoints, request/response
          formats, and best practices.
        </Text>
      </div>

      <hr className="my-8" />

      {/* OVERVIEW */}
      <div className="bg-blue-900 p-4 sm:p-6 rounded-lg w-full max-w-full min-w-0 border border-blue-700">
        <Heading>📋 Overview: Training Plan System</Heading>
        <Text>The system consists of two main parts:</Text>
        <div className="space-y-3 mt-4 text-sm">
          <div className="bg-blue-800 p-3 rounded border-l-4 border-blue-500">
            <strong>1. Create & Manage TrainingPlans</strong>
            <p className="text-gray-300 mt-1">
              Admin/Owner creates templates that trainers can assign to users.
            </p>
          </div>
          <div className="bg-blue-800 p-3 rounded border-l-4 border-green-500">
            <strong>2. Assign & Execute UserTrainingPlans</strong>
            <p className="text-gray-300 mt-1">
              Users receive trainings and execute them.
            </p>
          </div>
        </div>
      </div>

      {/* SECTION 1: TRAININGSPLAN VERWALTUNG (ADMIN) */}
      <div className="border-t-4 border-purple-500 pt-6">
        <Heading>🛠️ Part 1: Manage TrainingPlans (Admin/Owner)</Heading>
        <Text>
          These endpoints are for Admins/Owners to create training plans that
          will be assigned to users later.
        </Text>

        {/* 1.1 GET /training-plans */}
        <div className="mt-8 bg-blue-900 p-4 sm:p-6 rounded-lg w-full max-w-full min-w-0 border-l-4 border-blue-600">
          <div className="flex flex-wrap items-center gap-2 mb-3 min-w-0">
            <span className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold">
              GET
            </span>
            <code className="text-sm sm:text-lg font-mono break-all">/training-plans</code>
            <Label text="Protected" color="#F59E0B" />
          </div>
          <Text className="text-sm font-semibold">
            List all created training plans
          </Text>

          <Heading>Frontend Implementation:</Heading>
          <CodeBlock
            language="typescript"
            code={`// Hook to load all TrainingPlans
const fetchTrainingPlans = async () => {
  const response = await fetch('https://backend.url/training-plans', {
    headers: {
      'Authorization': \`Bearer \${accessToken}\`
    }
  });
  
  if (!response.ok) throw new Error('Failed to fetch.');
  
  const data = await response.json();
  // data.count = 3
  // data.plans = [{tpid, name, description, sport, difficulty, duration_weeks, sessions_per_week}, ...]
  return data.plans;
};`}
          />
          <Heading>Use in UI:</Heading>
          <CodeBlock
            language="typescript"
            code={`// E.g. for a list in Dashboard:
const [plans, setPlans] = useState([]);

useEffect(() => {
  fetchTrainingPlans().then(setPlans);
}, [accessToken]);

return (
  <div>
    {plans.map(plan => (
      <div key={plan.tpid} className="p-4 border rounded">
        <h3>{plan.name}</h3>
        <p>{plan.duration_weeks} weeks, {plan.sessions_per_week}x per week</p>
      </div>
    ))}
  </div>
);`}
          />
        </div>

        {/* 1.2 POST /training-plans */}
        <div className="mt-6 bg-blue-900 p-4 sm:p-6 rounded-lg w-full max-w-full min-w-0 border-l-4 border-green-600">
          <div className="flex flex-wrap items-center gap-2 mb-3 min-w-0">
            <span className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold">
              POST
            </span>
            <code className="text-sm sm:text-lg font-mono break-all">/training-plans</code>
            <Label text="Protected" color="#F59E0B" />
          </div>
          <Text className="text-sm font-semibold">
            Create a new training plan
          </Text>

          <Heading>Request Body (required fields):</Heading>
          <CodeBlock
            language="json"
            code={`{
  "name": "Push Day Workout",
  "description": "Chest, shoulders, triceps",
  "sportId": 1,              // 1 = gym, 2 = basketball
  "difficultyLevelId": 2,    // 1 = basic, 2 = intermediate, 3 = advanced
  "durationWeeks": 8,
  "sessionsPerWeek": 4
}`}
          />

          <Heading>Frontend Implementation:</Heading>
          <CodeBlock
            language="typescript"
            code={`const createTrainingPlan = async (planData) => {
  const response = await fetch('https://backend.url/training-plans', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${accessToken}\`
    },
    body: JSON.stringify({
      name: planData.name,
      description: planData.description,
      sportId: planData.sportId,
      difficultyLevelId: planData.difficultyLevelId,
      durationWeeks: planData.durationWeeks,
      sessionsPerWeek: planData.sessionsPerWeek
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || 'Failed to create plan.');
  }
  
  return await response.json(); // { message, planId }
};

// In React Form:
const handleCreatePlan = async (e) => {
  e.preventDefault();
  try {
    const result = await createTrainingPlan({
      name: formData.name,
      description: formData.description,
      sportId: parseInt(formData.sportId),
      difficultyLevelId: parseInt(formData.difficultyLevelId),
      durationWeeks: parseInt(formData.durationWeeks),
      sessionsPerWeek: parseInt(formData.sessionsPerWeek)
    });
    alert(\`Plan created with ID: \${result.planId}\`);
    // Reload plans
    fetchTrainingPlans();
  } catch (error) {
    alert(\`Error: \${error.message}\`);
  }
};`}
          />
        </div>

        {/* 1.3 GET /training-plans/:tpid */}
        <div className="mt-6 bg-blue-900 p-4 sm:p-6 rounded-lg w-full max-w-full min-w-0 border-l-4 border-blue-600">
          <div className="flex flex-wrap items-center gap-2 mb-3 min-w-0">
            <span className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold">
              GET
            </span>
            <code className="text-sm sm:text-lg font-mono break-all">/training-plans/:tpid</code>
            <Label text="Protected" color="#F59E0B" />
          </div>
          <Text className="text-sm font-semibold">
            Get single plan with details
          </Text>

          <Heading>Frontend Implementation:</Heading>
          <CodeBlock
            language="typescript"
            code={`const getTrainingPlan = async (tpid) => {
  const response = await fetch(
    \`https://backend.url/training-plans/\${tpid}\`,
    {
      headers: {
        'Authorization': \`Bearer \${accessToken}\`
      }
    }
  );
  
  if (!response.ok) throw new Error('Plan not found');
  
  const data = await response.json();
  return data.plan; // { tpid, name, description, sport, difficulty, ... }
};`}
          />
        </div>

        {/* 1.4 PUT /training-plans/:tpid */}
        <div className="mt-6 bg-blue-900 p-4 sm:p-6 rounded-lg w-full max-w-full min-w-0 border-l-4 border-yellow-600">
          <div className="flex flex-wrap items-center gap-2 mb-3 min-w-0">
            <span className="bg-yellow-600 text-white px-3 py-1 rounded text-xs font-bold">
              PUT
            </span>
            <code className="text-sm sm:text-lg font-mono break-all">/training-plans/:tpid</code>
            <Label text="Protected" color="#F59E0B" />
          </div>
          <Text className="text-sm font-semibold">Update a training plan</Text>
          <Text className="text-xs text-red-400 mt-2">
            ⚠️ IMPORTANT: All fields are required!
          </Text>

          <Heading>Frontend Implementation:</Heading>
          <CodeBlock
            language="typescript"
            code={`const updateTrainingPlan = async (tpid, planData) => {
  const response = await fetch(
    \`https://backend.url/training-plans/\${tpid}\`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${accessToken}\`
      },
      body: JSON.stringify({
        name: planData.name,
        description: planData.description,
        sportId: planData.sportId,
        difficultyLevelId: planData.difficultyLevelId,
        durationWeeks: planData.durationWeeks,
        sessionsPerWeek: planData.sessionsPerWeek
      })
    }
  );
  
  if (!response.ok) throw new Error('Update failed');
  return await response.json();
};`}
          />
        </div>

        {/* 1.5 DELETE /training-plans/:tpid */}
        <div className="mt-6 bg-blue-900 p-4 sm:p-6 rounded-lg w-full max-w-full min-w-0 border-l-4 border-red-600">
          <div className="flex flex-wrap items-center gap-2 mb-3 min-w-0">
            <span className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold">
              DELETE
            </span>
            <code className="text-sm sm:text-lg font-mono break-all">/training-plans/:tpid</code>
            <Label text="Protected" color="#F59E0B" />
          </div>
          <Text className="text-sm font-semibold">Delete a training plan</Text>
          <Text className="text-xs text-red-400 mt-2">
            ⚠️ WARNING: All exercises and user assignments will be deleted!
          </Text>

          <Heading>Frontend Implementation:</Heading>
          <CodeBlock
            language="typescript"
            code={`const deleteTrainingPlan = async (tpid) => {
  if (!window.confirm('Sure? The plan and all exercises will be deleted!')) {
    return;
  }
  
  const response = await fetch(
    \`https://backend.url/training-plans/\${tpid}\`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': \`Bearer \${accessToken}\`
      }
    }
  );
  
  if (!response.ok) throw new Error('Delete failed');
  return await response.json();
};`}
          />
        </div>
      </div>

      {/* SECTION 2: EXERCISES IM PLAN */}
      <div className="border-t-4 border-indigo-500 pt-6 mt-8">
        <Heading>💪 Part 2: Manage Exercises in TrainingPlans</Heading>
        <Text>
          Exercises are organized under a plan by week, day, and order.
        </Text>

        {/* 2.1 GET /training-plans/:tpid/exercises */}
        <div className="mt-6 bg-blue-900 p-4 sm:p-6 rounded-lg w-full max-w-full min-w-0 border-l-4 border-blue-600">
          <div className="flex flex-wrap items-center gap-2 mb-3 min-w-0">
            <span className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold">
              GET
            </span>
            <code className="text-sm sm:text-lg font-mono break-all">
              /training-plans/:tpid/exercises
            </code>
            <Label text="Protected" color="#F59E0B" />
          </div>
          <Text className="text-sm font-semibold">
            Get all exercises of a plan
          </Text>

          <Heading>Response Format:</Heading>
          <CodeBlock
            language="json"
            code={`{
  "trainingPlanId": 15,
  "count": 2,
  "exercises": [
    {
      "id": 1,
      "eid": 5,
      "week_number": 1,
      "day_number": 1,
      "exercise_order": 1,
      "sets": 4,
      "reps": 10,
      "duration_minutes": null,
      "rest_seconds": 90,
      "notes": "Focus on form"
    }
  ]
}`}
          />

          <Heading>Frontend Implementation:</Heading>
          <CodeBlock
            language="typescript"
            code={`const getPlanExercises = async (tpid) => {
  const response = await fetch(
    \`https://backend.url/training-plans/\${tpid}/exercises\`,
    {
      headers: {
        'Authorization': \`Bearer \${accessToken}\`
      }
    }
  );
  
  if (!response.ok) throw new Error('Failed to fetch exercises');
  
  const data = await response.json();
  // Example: Organize exercises by day
  const byDay = {};
  data.exercises.forEach(ex => {
    const key = \`Week \${ex.week_number}, Day \${ex.day_number}\`;
    if (!byDay[key]) byDay[key] = [];
    byDay[key].push(ex);
  });
  return byDay;
};`}
          />
        </div>

        {/* 2.2 POST /training-plans/:tpid/exercises */}
        <div className="mt-6 bg-blue-900 p-4 sm:p-6 rounded-lg w-full max-w-full min-w-0 border-l-4 border-green-600">
          <div className="flex flex-wrap items-center gap-2 mb-3 min-w-0">
            <span className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold">
              POST
            </span>
            <code className="text-sm sm:text-lg font-mono break-all">
              /training-plans/:tpid/exercises
            </code>
            <Label text="Protected" color="#F59E0B" />
          </div>
          <Text className="text-sm font-semibold">Add exercise to plan</Text>

          <Heading>Request Format (required fields):</Heading>
          <CodeBlock
            language="json"
            code={`{
  "eid": 5,                    // Exercise ID (must exist!)
  "weekNumber": 1,             // 1-N
  "dayNumber": 1,              // 1-7 (Monday-Sunday)
  "exerciseOrder": 1,          // Position in workout
  "sets": 4,                   // optional
  "reps": 10,                  // optional
  "durationMinutes": null,     // optional (e.g. for cardio)
  "restSeconds": 90,           // optional
  "notes": "Focus on form"     // optional
}`}
          />

          <Heading>Frontend Implementation:</Heading>
          <CodeBlock
            language="typescript"
            code={`const addExerciseToPlan = async (tpid, exerciseData) => {
  const response = await fetch(
    \`https://backend.url/training-plans/\${tpid}/exercises\`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${accessToken}\`
      },
      body: JSON.stringify({
        eid: exerciseData.eid,
        weekNumber: exerciseData.weekNumber,
        dayNumber: exerciseData.dayNumber,
        exerciseOrder: exerciseData.exerciseOrder,
        sets: exerciseData.sets || null,
        reps: exerciseData.reps || null,
        durationMinutes: exerciseData.durationMinutes || null,
        restSeconds: exerciseData.restSeconds || null,
        notes: exerciseData.notes || null
      })
    }
  );
  
  if (!response.ok) throw new Error('Failed to add exercise');
  return await response.json();
};

// In Component: Select exercise and enter position
const handleAddExercise = async () => {
  await addExerciseToPlan(planId, {
    eid: selectedExerciseId,
    weekNumber: 1,
    dayNumber: 1,
    exerciseOrder: 1,
    sets: 4,
    reps: 10,
    restSeconds: 90,
    notes: 'Form matters most'
  });
  // Reload exercises
  const exercises = await getPlanExercises(planId);
  setExercises(exercises);
};`}
          />
        </div>

        {/* 2.3 PUT /training-plans/:tpid/exercises/:id */}
        <div className="mt-6 bg-blue-900 p-4 sm:p-6 rounded-lg w-full max-w-full min-w-0 border-l-4 border-yellow-600">
          <div className="flex flex-wrap items-center gap-2 mb-3 min-w-0">
            <span className="bg-yellow-600 text-white px-3 py-1 rounded text-xs font-bold">
              PUT
            </span>
            <code className="text-sm sm:text-lg font-mono break-all">
              /training-plans/:tpid/exercises/:id
            </code>
            <Label text="Protected" color="#F59E0B" />
          </div>
          <Text className="text-sm font-semibold">Update exercise in plan</Text>
          <Text className="text-xs text-yellow-400 mt-2">
            ⚠️ All fields required (except eid)
          </Text>

          <Heading>Frontend Implementation:</Heading>
          <CodeBlock
            language="typescript"
            code={`const updatePlanExercise = async (tpid, exerciseId, updates) => {
  const response = await fetch(
    \`https://backend.url/training-plans/\${tpid}/exercises/\${exerciseId}\`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': \`Bearer \${accessToken}\`
      },
      body: JSON.stringify({
        weekNumber: updates.weekNumber,
        dayNumber: updates.dayNumber,
        exerciseOrder: updates.exerciseOrder,
        sets: updates.sets || null,
        reps: updates.reps || null,
        durationMinutes: updates.durationMinutes || null,
        restSeconds: updates.restSeconds || null,
        notes: updates.notes || null
      })
    }
  );
  
  if (!response.ok) throw new Error('Update failed');
  return await response.json();
};`}
          />
        </div>

        {/* 2.4 DELETE /training-plans/:tpid/exercises/:id */}
        <div className="mt-6 bg-blue-900 p-4 sm:p-6 rounded-lg w-full max-w-full min-w-0 border-l-4 border-red-600">
          <div className="flex flex-wrap items-center gap-2 mb-3 min-w-0">
            <span className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold">
              DELETE
            </span>
            <code className="text-sm sm:text-lg font-mono break-all">
              /training-plans/:tpid/exercises/:id
            </code>
            <Label text="Protected" color="#F59E0B" />
          </div>
          <Text className="text-sm font-semibold">
            Remove exercise from plan
          </Text>

          <Heading>Frontend Implementation:</Heading>
          <CodeBlock
            language="typescript"
            code={`const removeExerciseFromPlan = async (tpid, exerciseId) => {
  const response = await fetch(
    \`https://backend.url/training-plans/\${tpid}/exercises/\${exerciseId}\`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': \`Bearer \${accessToken}\`
      }
    }
  );
  
  if (!response.ok) throw new Error('Delete failed');
  return await response.json();
};`}
          />
        </div>
      </div>

      {/* SECTION 3: USER TRAINING PLANS */}
      <div className="border-t-4 border-pink-500 pt-6 mt-8">
        <Heading>👤 Part 3: UserTrainingPlans (Assignment & Execution)</Heading>
        <Text>
          These endpoints are for users to assign and execute training plans.
        </Text>

        {/* 3.1 GET /users/training-plans */}
        <div className="mt-6 bg-blue-900 p-4 sm:p-6 rounded-lg w-full max-w-full min-w-0 border-l-4 border-blue-600">
          <div className="flex flex-wrap items-center gap-2 mb-3 min-w-0">
            <span className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold">
              GET
            </span>
            <code className="text-sm sm:text-lg font-mono break-all">/users/training-plans</code>
            <Label text="Protected" color="#F59E0B" />
          </div>
          <Text className="text-sm font-semibold">
            Get all user training plans
          </Text>

          <Heading>Frontend Implementation:</Heading>
          <CodeBlock
            language="typescript"
            code={`const getUserTrainingPlans = async () => {
  const response = await fetch('https://backend.url/users/training-plans', {
    headers: {
      'Authorization': \`Bearer \${accessToken}\`
    }
  });
  
  if (!response.ok) throw new Error('Failed to fetch');
  
  const data = await response.json();
  // data.plans = [{id, uid, tpid, assigned_by_trainer, start_date, end_date, completion_percentage, status, is_selected, created_at, updated_at, plan_name}, ...]
  return data.plans;
};

// In Dashboard/My Plans Screen:
const MyPlans = () => {
  const [plans, setPlans] = useState([]);
  
  useEffect(() => {
    getUserTrainingPlans().then(setPlans);
  }, []);
  
  return (
    <div>
      {plans.map(plan => (
        <div key={plan.id} className="p-4 border">
          <h3>{plan.plan_name}</h3>
          <p>Status: {plan.status}</p>
          <p>Progress: {plan.completion_percentage}%</p>
          {plan.is_selected === 1 && <span className="badge">Active</span>}
        </div>
      ))}
    </div>
  );
};`}
          />
        </div>

        {/* 3.2 POST /users/training-plans */}
        <div className="mt-6 bg-blue-900 p-4 sm:p-6 rounded-lg w-full max-w-full min-w-0 border-l-4 border-green-600">
          <div className="flex flex-wrap items-center gap-2 mb-3 min-w-0">
            <span className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold">
              POST
            </span>
            <code className="text-sm sm:text-lg font-mono break-all">/users/training-plans</code>
            <Label text="Protected" color="#F59E0B" />
          </div>
          <Text className="text-sm font-semibold">
            Assign training plan to user
          </Text>

          <Heading>Request Format:</Heading>
          <CodeBlock
            language="json"
            code={`{
  "tpid": 15,
  "startDate": "2024-03-21"
}`}
          />

          <Heading>Frontend Implementation:</Heading>
          <CodeBlock
            language="typescript"
            code={`const assignPlanToUser = async (tpid, startDate) => {
  const response = await fetch('https://backend.url/users/training-plans', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': \`Bearer \${accessToken}\`
    },
    body: JSON.stringify({
      tpid: tpid,
      startDate: startDate  // Format: "2024-03-21"
    })
  });
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }
  
  return await response.json();
};

// In Component:
const handleAssignPlan = async (planId) => {
  try {
    const today = new Date().toISOString().split('T')[0];
    await assignPlanToUser(planId, today);
    alert('Plan assigned!');
    // Reload plans
    const plans = await getUserTrainingPlans();
    setPlans(plans);
  } catch (error) {
    alert(\`Error: \${error.message}\`);
  }
};`}
          />
        </div>

        {/* 3.3 GET /users/training-plans/selected */}
        <div className="mt-6 bg-blue-900 p-4 sm:p-6 rounded-lg w-full max-w-full min-w-0 border-l-4 border-blue-600">
          <div className="flex flex-wrap items-center gap-2 mb-3 min-w-0">
            <span className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold">
              GET
            </span>
            <code className="text-sm sm:text-lg font-mono break-all">
              /users/training-plans/selected
            </code>
            <Label text="Protected" color="#F59E0B" />
          </div>
          <Text className="text-sm font-semibold">
            Get currently active training plan
          </Text>

          <Heading>Frontend Implementation:</Heading>
          <CodeBlock
            language="typescript"
            code={`const getSelectedPlan = async () => {
  const response = await fetch(
    'https://backend.url/users/training-plans/selected',
    {
      headers: {
        'Authorization': \`Bearer \${accessToken}\`
      }
    }
  );
  
  if (!response.ok) throw new Error('No active plan');
  
  const data = await response.json();
  return data.plan; // Contains plan + training_plan details
};`}
          />
        </div>

        {/* 3.4 GET /users/training-plans/start/current */}
        <div className="mt-6 bg-blue-900 p-4 sm:p-6 rounded-lg w-full max-w-full min-w-0 border-l-4 border-blue-600">
          <div className="flex flex-wrap items-center gap-2 mb-3 min-w-0">
            <span className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold">
              GET
            </span>
            <code className="text-sm sm:text-lg font-mono break-all">
              /users/training-plans/start/current
            </code>
            <Label text="Protected" color="#F59E0B" />
          </div>
          <Text className="text-sm font-semibold">
            🎯 Start current workout with all exercises
          </Text>
          <Text className="text-sm font-semibold text-green-400 mt-2">
            🔥 MOST IMPORTANT FOR WORKOUT SCREEN!
          </Text>

          <Heading>Response Format:</Heading>
          <CodeBlock
            language="json"
            code={`{
  "message": "current training loaded successfully",
  "plan": {
    "tpid": 15,
    "name": "Push Day Workout",
    "description": "Chest, shoulders, triceps",
    "duration_weeks": 8,
    "sessions_per_week": 4
  },
  "exercises": [
    {
      "id": 1,
      "eid": 5,
      "week_number": 1,
      "day_number": 1,
      "exercise_order": 1,
      "sets": 4,
      "reps": 10,
      "duration_minutes": null,
      "rest_seconds": 90,
      "notes": "Focus on form"
    }
  ]
}`}
          />

          <Heading>Frontend Implementation (WorkoutScreen):</Heading>
          <CodeBlock
            language="typescript"
            code={`const WorkoutScreen = () => {
  const [workout, setWorkout] = useState(null);
  const [currentExerciseIndex, setCurrentExerciseIndex] = useState(0);
  
  useEffect(() => {
    // Load on app startup or when opening workout page
    const loadCurrentWorkout = async () => {
      try {
        const response = await fetch(
          'https://backend.url/users/training-plans/start/current',
          {
            headers: {
              'Authorization': \`Bearer \${accessToken}\`
            }
          }
        );
        
        if (!response.ok) throw new Error('No active workout');
        
        const data = await response.json();
        setWorkout(data);
      } catch (error) {
        console.log('No active workout:', error.message);
      }
    };
    
    loadCurrentWorkout();
  }, []);
  
  if (!workout) return <p>No active workout</p>;
  
  const currentExercise = workout.exercises[currentExerciseIndex];
  
  return (
    <div className="p-4">
      <h1>{workout.plan.name}</h1>
      
      <div className="bg-blue-800 p-4 rounded">
        <h2>Exercise {currentExerciseIndex + 1}/{workout.exercises.length}</h2>
        <p className="text-2xl font-bold mt-3">{currentExercise.eid}</p>
        
        <div className="grid grid-cols-2 gap-4 mt-4">
          {currentExercise.sets && (
            <div className="bg-blue-900 p-3 rounded">
              <p className="text-sm text-gray-400">Sets</p>
              <p className="text-2xl font-bold">{currentExercise.sets}</p>
            </div>
          )}
          {currentExercise.reps && (
            <div className="bg-blue-900 p-3 rounded">
              <p className="text-sm text-gray-400">Reps</p>
              <p className="text-2xl font-bold">{currentExercise.reps}</p>
            </div>
          )}
          {currentExercise.rest_seconds && (
            <div className="bg-blue-900 p-3 rounded">
              <p className="text-sm text-gray-400">Rest</p>
              <p className="text-2xl font-bold">{currentExercise.rest_seconds}s</p>
            </div>
          )}
        </div>
        
        {currentExercise.notes && (
          <p className="mt-4 text-sm italic text-gray-300">{currentExercise.notes}</p>
        )}
      </div>
      
      <div className="flex gap-2 mt-6">
        <button 
          onClick={() => setCurrentExerciseIndex(i => Math.max(0, i - 1))}
          disabled={currentExerciseIndex === 0}
        >
          ← Back
        </button>
        <button 
          onClick={() => setCurrentExerciseIndex(i => 
            i < workout.exercises.length - 1 ? i + 1 : i
          )}
        >
          Next →
        </button>
      </div>
    </div>
  );
};`}
          />
        </div>

        {/* 3.5 PATCH /users/training-plans/:id/select */}
        <div className="mt-6 bg-blue-900 p-4 sm:p-6 rounded-lg w-full max-w-full min-w-0 border-l-4 border-yellow-600">
          <div className="flex flex-wrap items-center gap-2 mb-3 min-w-0">
            <span className="bg-yellow-600 text-white px-3 py-1 rounded text-xs font-bold">
              PATCH
            </span>
            <code className="text-sm sm:text-lg font-mono break-all">
              /users/training-plans/:id/select
            </code>
            <Label text="Protected" color="#F59E0B" />
          </div>
          <Text className="text-sm font-semibold">
            Set training plan as active
          </Text>

          <Heading>Frontend Implementation:</Heading>
          <CodeBlock
            language="typescript"
            code={`const selectPlan = async (planId) => {
  const response = await fetch(
    \`https://backend.url/users/training-plans/\${planId}/select\`,
    {
      method: 'PATCH',
      headers: {
        'Authorization': \`Bearer \${accessToken}\`
      }
    }
  );
  
  if (!response.ok) throw new Error('Selection failed');
  return await response.json();
};

// In Component:
const handleSelectPlan = async (planId) => {
  await selectPlan(planId);
  // Plan is now active - update UI
  const plans = await getUserTrainingPlans();
  setPlans(plans);
};`}
          />
        </div>

        {/* 3.6 DELETE /users/training-plans/:id */}
        <div className="mt-6 bg-blue-900 p-4 sm:p-6 rounded-lg w-full max-w-full min-w-0 border-l-4 border-red-600">
          <div className="flex flex-wrap items-center gap-2 mb-3 min-w-0">
            <span className="bg-red-600 text-white px-3 py-1 rounded text-xs font-bold">
              DELETE
            </span>
            <code className="text-sm sm:text-lg font-mono break-all">/users/training-plans/:id</code>
            <Label text="Protected" color="#F59E0B" />
          </div>
          <Text className="text-sm font-semibold">
            Remove training plan assignment
          </Text>

          <Heading>Frontend Implementation:</Heading>
          <CodeBlock
            language="typescript"
            code={`const removePlanFromUser = async (planId) => {
  if (!window.confirm('Remove plan?')) return;
  
  const response = await fetch(
    \`https://backend.url/users/training-plans/\${planId}\`,
    {
      method: 'DELETE',
      headers: {
        'Authorization': \`Bearer \${accessToken}\`
      }
    }
  );
  
  if (!response.ok) throw new Error('Removal failed');
  return await response.json();
};`}
          />
        </div>
      </div>

      {/* CHECKLIST */}
      <div className="bg-blue-900 p-4 sm:p-6 rounded-lg w-full max-w-full min-w-0 border-l-4 border-green-600 mt-8">
        <Heading>✅ Frontend Development Checklist</Heading>

        <div className="space-y-3 mt-4">
          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <div>
              <strong>1. Admin Dashboard - TrainingPlan CRUD</strong>
              <p className="text-sm text-gray-400">
                GET, POST, PUT, DELETE for /training-plans
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <div>
              <strong>2. Exercise Editor for Plans</strong>
              <p className="text-sm text-gray-400">
                Interface to add/edit/delete exercises in a plan
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <div>
              <strong>3. My Training Plans Screen</strong>
              <p className="text-sm text-gray-400">
                User sees all assigned plans and can select them
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <div>
              <strong>4. 🔥 WORKOUT SCREEN (Priority!)</strong>
              <p className="text-sm text-gray-400">
                GET /users/training-plans/start/current - shows current workout
                with exercises
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <div>
              <strong>5. Plan Selection / Activation</strong>
              <p className="text-sm text-gray-400">
                PATCH /users/training-plans/:id/select
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <div>
              <strong>6. Error Handling for all Endpoints</strong>
              <p className="text-sm text-gray-400">
                Catch API errors, show user-friendly messages
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <div>
              <strong>7. Loading States</strong>
              <p className="text-sm text-gray-400">
                Spinners for API calls, disable buttons while loading
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <input type="checkbox" className="mt-1" />
            <div>
              <strong>8. Token Management</strong>
              <p className="text-sm text-gray-400">
                JWT token in headers, refresh on expiry, logout on 401
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK REFERENCE */}
      <div className="bg-blue-800 p-4 sm:p-6 rounded-lg w-full max-w-full min-w-0 mt-8">
        <Heading>📚 Quick Reference - API Base URLs</Heading>
        <CodeBlock
          language="bash"
          code={`# Development
https://localhost:3000/api

# Production
https://api.properform.app

# All TrainingPlan Endpoints:
GET    /training-plans
POST   /training-plans
GET    /training-plans/:tpid
PUT    /training-plans/:tpid
DELETE /training-plans/:tpid

GET    /training-plans/:tpid/exercises
POST   /training-plans/:tpid/exercises
PUT    /training-plans/:tpid/exercises/:id
DELETE /training-plans/:tpid/exercises/:id

GET    /users/training-plans
POST   /users/training-plans
GET    /users/training-plans/selected
GET    /users/training-plans/start/current
PATCH  /users/training-plans/:id/select
DELETE /users/training-plans/:id`}
        />
      </div>

      {/* NOTES */}
      <div className="bg-blue-900 p-4 sm:p-6 rounded-lg w-full max-w-full min-w-0 border-l-4 border-amber-600 mt-8">
        <Heading>⚠️ Important Notes</Heading>
        <ul className="list-disc list-inside space-y-2 text-sm mt-4">
          <li>
            <strong>JWT Token:</strong> All protected routes require
            Authorization header with Bearer token
          </li>
          <li>
            <strong>Content-Type:</strong> POST/PUT requests need `Content-Type:
            application/json`
          </li>
          <li>
            <strong>Error Handling:</strong> API returns meaningful error
            messages
          </li>
          <li>
            <strong>Rate Limiting:</strong> Be aware of rate limits (15
            requests/min for most endpoints)
          </li>
          <li>
            <strong>Workout Screen:</strong> This is the most important screen -
            focus on good UX!
          </li>
          <li>
            <strong>State Management:</strong> Consider using Redux/Context for
            plan state
          </li>
        </ul>
      </div>
    </div>
  );
}
