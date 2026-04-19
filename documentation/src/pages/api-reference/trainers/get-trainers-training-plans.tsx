import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function GetTrainersTrainingPlans() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>GET /trainers/training-plans</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Returns all training plans created by the authenticated trainer,
        including assignment counts per plan.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "count": 2,
  "plans": [
    {
      "tpid": 5,
      "name": "Beginner Strength",
      "description": "4-week program",
      "sid": 1,
      "sport": "Fitness",
      "dlid": 1,
      "difficulty": "Beginner",
      "duration_weeks": 4,
      "sessions_per_week": 3,
      "created_by_trainer": 2,
      "is_template": 0,
      "created_at": "2025-01-10T09:00:00.000Z",
      "updated_at": "2025-01-10T09:00:00.000Z",
      "assigned_count": 5
    }
  ]
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Server error (500)
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
