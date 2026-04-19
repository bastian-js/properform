import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function GetTrainersTrainingPlansTpidExercises() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>GET /trainers/training-plans/:tpid/exercises</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Returns all exercises added to a specific training plan owned by the
        authenticated trainer, ordered by week, day and exercise order.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>URL Parameters</Heading>
      <CodeBlock
        language="text"
        code={`tpid (integer, required) - training plan ID`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "trainingPlanId": 5,
  "count": 2,
  "exercises": [
    {
      "id": 1,
      "tpid": 5,
      "eid": 10,
      "name": "Squat",
      "description": "Lower body movement",
      "sid": 1,
      "sport": "Fitness",
      "dlid": 2,
      "difficulty": "Intermediate",
      "week_number": 1,
      "day_number": 1,
      "exercise_order": 1,
      "sets": 4,
      "reps": 8,
      "duration_minutes": null,
      "rest_seconds": 90,
      "notes": null
    }
  ]
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Plan not found or not owned by trainer (404)
{
  "error": "training plan not found."
}

// Server error (500)
{
  "error": "internal server error."
}`}
      />

      <Heading>Requirements</Heading>
      <Text>
        Requires authentication and the <code>trainer</code> role.
      </Text>
    </div>
  );
}
