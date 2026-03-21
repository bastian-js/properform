import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function GetUserSelectedTrainingPlan() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>GET /users/training-plans/selected</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Retrieves the currently active training plan for the user. Returns the
        user's assignment record along with the complete training plan details.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>Example Request</Heading>
      <CodeBlock
        language="http"
        code={`GET /users/training-plans/selected
Authorization: Bearer <JWT_TOKEN>`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "selected training plan fetched successfully",
  "plan": {
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
    "training_plan": {
      "tpid": 15,
      "name": "Push Day Workout",
      "description": "Focuses on chest, shoulders, and triceps",
      "duration_weeks": 8,
      "sessions_per_week": 4
    }
  }
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// No selected training plan found (404)
{
  "message": "no selected training plan found"
}

// Unauthorized (401)
{
  "error": "Unauthorized"
}

// Server error (500)
{
  "message": "error fetching selected training plan",
  "error": "error details"
}`}
      />

      <Heading>Notes</Heading>
      <Text>
        Returns a plan where is_selected = 1. If no plan is selected, return
        404. Use the PATCH endpoint to select a different plan.
      </Text>
    </div>
  );
}
