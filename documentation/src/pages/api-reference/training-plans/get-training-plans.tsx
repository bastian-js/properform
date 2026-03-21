import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function GetTrainingPlans() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>GET /training-plans</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Retrieves all training plans created by the current user. Returns plans
        with associated sport and difficulty level information. Plans are sorted
        by most recent first.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>Example Request</Heading>
      <CodeBlock
        language="http"
        code={`GET /training-plans
Authorization: Bearer <JWT_TOKEN>`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "count": 3,
  "plans": [
    {
      "tpid": 1,
      "name": "Push Day Workout",
      "description": "Focuses on chest, shoulders, and triceps",
      "sport": "gym",
      "difficulty": "intermediate",
      "duration_weeks": 8,
      "sessions_per_week": 4
    },
    {
      "tpid": 2,
      "name": "Basketball Season Training",
      "description": "Agility and endurance training",
      "sport": "basketball",
      "difficulty": "advanced",
      "duration_weeks": 12,
      "sessions_per_week": 5
    }
  ]
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// No training plans found (404)
{
  "message": "no training plan found for this user."
}

// Unauthorized (401)
{
  "error": "Unauthorized"
}

// Server error (500)
{
  "message": "error fetching training plans.",
  "error": "error details"
}`}
      />

      <Heading>Notes</Heading>
      <Text>
        Only returns training plans created by the authenticated user. Results
        are sorted by creation date in descending order (newest first).
      </Text>
    </div>
  );
}
