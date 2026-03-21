import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function PutTrainingPlanExercise() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>PUT /training-plans/:tpid/exercises/:id</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Updates an exercise within a training plan. Allows changing sets, reps,
        duration, rest periods, position, and notes. Only the plan owner can
        update exercises.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>URL Parameters</Heading>
      <CodeBlock
        language="text"
        code={`tpid  (number, required) - Training plan ID
id    (number, required) - Exercise ID within plan`}
      />

      <Heading>Request Body</Heading>
      <CodeBlock
        language="json"
        code={`{
  "weekNumber": 1,
  "dayNumber": 1,
  "exerciseOrder": 1,
  "sets": 5,
  "reps": 8,
  "durationMinutes": null,
  "restSeconds": 120,
  "notes": "Increased intensity"
}`}
      />

      <Heading>Field Requirements</Heading>
      <CodeBlock
        language="text"
        code={`weekNumber      (number, required, positive)
dayNumber       (number, required, positive)
exerciseOrder   (number, required, positive)
sets            (number, optional)
reps            (number, optional)
durationMinutes (number, optional)
restSeconds     (number, optional)
notes           (string, optional)`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "training plan exercise updated successfully",
  "exercise": {
    "id": 45,
    "tpid": 15,
    "eid": 5,
    "week_number": 1,
    "day_number": 1,
    "exercise_order": 1,
    "sets": 5,
    "reps": 8,
    "duration_minutes": null,
    "rest_seconds": 120,
    "notes": "Increased intensity"
  }
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Missing required fields (400)
{
  "message": "missing required fields."
}

// Training plan not found (404)
{
  "message": "training plan not found or access denied"
}

// Exercise not found (404)
{
  "message": "exercise not found in this training plan"
}

// Unauthorized (401)
{
  "error": "Unauthorized"
}

// Server error (500)
{
  "error": "error details"
}`}
      />

      <Heading>Notes</Heading>
      <Text>
        All fields are required in the update. The exercise itself (eid) cannot
        be changed—delete and recreate if you need a different exercise.
      </Text>
    </div>
  );
}
