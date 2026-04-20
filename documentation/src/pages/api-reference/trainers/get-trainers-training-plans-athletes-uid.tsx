import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function GetTrainersTrainingPlansAthletesUid() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>GET /trainers/training-plans/athletes/:uid</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Returns all training plans assigned to a specific athlete by the
        authenticated trainer. Only plans assigned by this trainer are returned.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>URL Parameters</Heading>
      <CodeBlock
        language="text"
        code={`uid (integer, required) - athlete user ID`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "count": 1,
  "plans": [
    {
      "id": 8,
      "uid": 42,
      "tpid": 5,
      "assigned_by_trainer": 2,
      "start_date": "2025-05-01",
      "end_date": null,
      "completion_percentage": 0,
      "status": "active",
      "is_selected": 1,
      "created_at": "2025-04-20T10:00:00.000Z",
      "updated_at": "2025-04-20T10:00:00.000Z",
      "plan_name": "Beginner Strength",
      "description": "4-week program",
      "sid": 1,
      "sport": "Fitness",
      "dlid": 1,
      "difficulty": "Beginner",
      "duration_weeks": 4,
      "sessions_per_week": 3
    }
  ]
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Invalid athlete ID (400)
{
  "error": "invalid athlete id."
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
