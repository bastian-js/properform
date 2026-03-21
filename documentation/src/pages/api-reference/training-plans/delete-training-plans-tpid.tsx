import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function DeleteTrainingPlan() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>DELETE /training-plans/:tpid</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Deletes a training plan and all associated exercises. Only the owner can
        delete their training plans. This action cannot be undone.
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
        code={`DELETE /training-plans/15
Authorization: Bearer <JWT_TOKEN>`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "training plan deleted successfully.",
  "rowsAffected": 1,
  "id": 15
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Training plan not found (404)
{
  "message": "training plan not found."
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
        Deleting a training plan will also cascade delete all exercises
        associated with it. If the plan is assigned to users, those assignments
        will also be removed.
      </Text>
    </div>
  );
}
