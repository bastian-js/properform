import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function GetUserTrainingPlans() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>GET /users/training-plans</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Retrieves all training plans assigned to the current user. Returns plans
        with their assignment details, status, and completion information. Plans
        are sorted by most recent first.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>Example Request</Heading>
      <CodeBlock
        language="http"
        code={`GET /users/training-plans
Authorization: Bearer <JWT_TOKEN>`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "user training plans fetched successfully",
  "plans": [
    {
      "id": 8,
      "uid": 42,
      "tpid": 15,
      "assigned_by_trainer": null,
      "start_date": "2024-01-15",
      "end_date": null,
      "completion_percentage": 45,
      "status": "active",
      "is_selected": 1,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-03-21T14:22:00Z",
      "plan_name": "Push Day Workout"
    }
  ]
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// No training plans found (404)
{
  "message": "no training plans found for this user"
}

// Unauthorized (401)
{
  "error": "Unauthorized"
}

// Server error (500)
{
  "message": "error fetching user training plans",
  "error": "error details"
}`}
      />

      <Heading>Notes</Heading>
      <Text>
        Returns all training plans that have been assigned to the user, whether
        by themselves or by their trainer. The is_selected field indicates which
        plan is currently active.
      </Text>
    </div>
  );
}
