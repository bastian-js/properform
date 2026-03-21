import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function GetCurrentTrainingWithExercises() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>GET /users/training-plans/start/current</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Retrieves the currently selected training plan with all its exercises.
        This endpoint is used to display the active workout program and all
        related exercises to the user.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>Example Request</Heading>
      <CodeBlock
        language="http"
        code={`GET /users/training-plans/start/current
Authorization: Bearer <JWT_TOKEN>`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "current training loaded successfully",
  "plan": {
    "tpid": 15,
    "name": "Push Day Workout",
    "description": "Focuses on chest, shoulders, and triceps",
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
    },
    {
      "id": 2,
      "eid": 8,
      "week_number": 1,
      "day_number": 1,
      "exercise_order": 2,
      "sets": 3,
      "reps": 12,
      "duration_minutes": null,
      "rest_seconds": 60,
      "notes": "Full range of motion"
    }
  ]
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// No selected training plan found (404)
{
  "message": "no selected training plan found"
}

// Training plan not found (404)
{
  "message": "training plan not found"
}

// Unauthorized (401)
{
  "error": "Unauthorized"
}

// Server error (500)
{
  "message": "error loading current training",
  "error": "error details"
}`}
      />

      <Heading>Notes</Heading>
      <Text>
        This endpoint is typically called when the user starts their workout
        session. Exercises are automatically sorted by week_number, day_number,
        and exercise_order. Requires an active selected training plan.
      </Text>
    </div>
  );
}
