import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function DeleteUserTrainingPlan() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>DELETE /users/training-plans/:id</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Removes a training plan assignment from the user. This does not delete
        the training plan itself—other users can still use it. If the plan is
        currently selected, it will no longer be available.
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
        code={`DELETE /users/training-plans/8
Authorization: Bearer <JWT_TOKEN>`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "user training plan deleted successfully"
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
  "message": "error deleting user training plan",
  "error": "error details"
}`}
      />

      <Heading>Notes</Heading>
      <Text>
        Deleting a user's training plan assignment removes their progress
        tracking for that specific plan but does not affect the plan itself or
        other users' assignments.
      </Text>
    </div>
  );
}
