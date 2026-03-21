import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function PatchSelectUserTrainingPlan() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>PATCH /users/training-plans/:id/select</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Activates a training plan as the user's current plan. When a new plan is
        selected, the previously selected plan is automatically deselected. Only
        one plan can be active at a time.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>URL Parameters</Heading>
      <CodeBlock
        language="text"
        code={`id  (number, required) - User training plan ID`}
      />

      <Heading>Example Request</Heading>
      <CodeBlock
        language="http"
        code={`PATCH /users/training-plans/8/select
Authorization: Bearer <JWT_TOKEN>`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "training plan selected successfully",
  "selected_plan_id": 8
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Training plan not found (404)
{
  "message": "training plan not found or access denied"
}

// Unauthorized (401)
{
  "error": "Unauthorized"
}

// Server error (500)
{
  "message": "error selecting training plan",
  "error": "error details"
}`}
      />

      <Heading>Notes</Heading>
      <Text>
        Automatically sets is_selected = 1 for the specified plan and
        is_selected = 0 for all other plans. This operation happens atomically
        to prevent race conditions.
      </Text>
    </div>
  );
}
