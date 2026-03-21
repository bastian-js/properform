import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function DeleteTrainingPlanExercise() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>DELETE /training-plans/:tpid/exercises/:id</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Removes an exercise from a training plan. Only the plan owner can delete
        exercises. Other exercises in the plan remain unchanged.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>URL Parameters</Heading>
      <CodeBlock
        language="text"
        code={`tpid  (number, required) - Training plan ID
id    (number, required) - Exercise ID within plan`}
      />

      <Heading>Example Request</Heading>
      <CodeBlock
        language="http"
        code={`DELETE /training-plans/15/exercises/45
Authorization: Bearer <JWT_TOKEN>`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "training plan exercise deleted successfully"
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Training plan not found (404)
{
  "message": "training plan not found or access denied"
}

// Exercise not found (404)
{
  "message": "exercise not found in this training plan"
}

// Unauthorized (401)
{
  "error": "Unauthorized"
}

// Server error (500)
{
  "message": "error deleting training plan exercise",
  "error": "error details"
}`}
      />

      <Heading>Notes</Heading>
      <Text>
        Deleting an exercise from a training plan does not delete the exercise
        itself from the database—it only removes it from this specific plan. The
        exercise can be added back later if needed.
      </Text>
    </div>
  );
}
