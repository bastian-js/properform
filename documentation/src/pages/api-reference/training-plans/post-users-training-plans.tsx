import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function PostUserTrainingPlans() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>POST /users/training-plans</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Assigns an existing training plan to the current user. Initiates the
        plan with active status and the specified start date. A user can have
        multiple training plans assigned.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>Request Body</Heading>
      <CodeBlock
        language="json"
        code={`{
  "tpid": 15,
  "startDate": "2024-01-15"
}`}
      />

      <Heading>Field Requirements</Heading>
      <CodeBlock
        language="text"
        code={`tpid       (number, required) - Training plan ID
startDate  (string, required) - Start date (YYYY-MM-DD format)`}
      />

      <Heading>Success Response (201)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "training plan assigned successfully",
  "user_training_plan": {
    "id": 8,
    "uid": 42,
    "tpid": 15,
    "assigned_by_trainer": null,
    "start_date": "2024-01-15",
    "end_date": null,
    "completion_percentage": 0,
    "status": "active",
    "is_selected": 0,
    "created_at": "2024-03-21T14:25:00Z",
    "updated_at": "2024-03-21T14:25:00Z"
  }
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Missing required fields (400)
{
  "message": "missing required fields"
}

// Training plan not found (404)
{
  "message": "training plan not found"
}

// Plan already assigned (400)
{
  "message": "user already has this training plan"
}

// Unauthorized (401)
{
  "error": "Unauthorized"
}

// Server error (500)
{
  "message": "error assigning training plan",
  "error": "error details"
}`}
      />

      <Heading>Notes</Heading>
      <Text>
        After assignment, the plan status is automatically set to "active". The
        plan is not automatically selected—use the PATCH endpoint to set it as
        the active plan.
      </Text>
    </div>
  );
}
