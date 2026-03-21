import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function GetTrainingPlanExercises() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>GET /training-plans/:tpid/exercises</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Retrieves all exercises assigned to a specific training plan. Exercises
        are sorted by week number, day number, and exercise order. Only the plan
        owner can access this.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>URL Parameters</Heading>
      <CodeBlock
        language="text"
        code={`tpid  (number, required) - Training plan ID`}
      />

      <Heading>Example Request</Heading>
      <CodeBlock
        language="http"
        code={`GET /training-plans/15/exercises
Authorization: Bearer <JWT_TOKEN>`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "trainingPlanId": 15,
  "count": 2,
  "exercises": [
    {
      "id": 1,
      "tpid": 15,
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
      "tpid": 15,
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
        code={`// Training plan not found (404)
{
  "message": "training plan not found."
}

// No exercises found (404)
{
  "message": "no exercises found for this training plan."
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
        Results are automatically sorted by week_number (ascending), then
        day_number (ascending), then exercise_order (ascending) to maintain the
        correct training sequence.
      </Text>
    </div>
  );
}
