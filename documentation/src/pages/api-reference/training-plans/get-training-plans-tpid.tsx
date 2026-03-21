import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function GetTrainingPlanById() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>GET /training-plans/:tpid</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Retrieves a specific training plan by its ID. Only the owner of the
        training plan can access it. Returns full plan details including sport
        and difficulty level information.
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
        code={`GET /training-plans/15
Authorization: Bearer <JWT_TOKEN>`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "plan": {
    "tpid": 15,
    "name": "Push Day Workout",
    "description": "Focuses on chest, shoulders, and triceps",
    "sport": "gym",
    "difficulty": "intermediate",
    "duration_weeks": 8,
    "sessions_per_week": 4
  }
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Training plan not found (404)
{
  "message": "training plan not found for this user."
}

// Invalid plan ID format (400)
{
  "error": "invalid training plan id."
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
        Returns 404 if the plan doesn't exist or doesn't belong to the
        authenticated user.
      </Text>
    </div>
  );
}
