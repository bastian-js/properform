import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function DeleteTrainersExercisesEid() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>DELETE /trainers/exercises/:eid</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Deletes an exercise created by the authenticated trainer. Trainers can
        only delete their own exercises.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>URL Parameters</Heading>
      <CodeBlock
        language="text"
        code={`eid (integer, required) - exercise ID`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "deleted"
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Invalid ID (400)
{
  "error": "invalid exercise id."
}

// Not the trainer's exercise or already deleted (403)
{
  "error": "not yours"
}

// Server error (500)
{
  "error": "failed"
}`}
      />

      <Heading>Requirements</Heading>
      <Text>
        Requires authentication and the <code>trainer</code> role.
      </Text>
    </div>
  );
}
