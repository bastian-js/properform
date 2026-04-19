import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function DeleteTrainersTrainingPlansTpid() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>DELETE /trainers/training-plans/:tpid</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Deletes a training plan owned by the authenticated trainer. Only plans
        created by this trainer can be deleted.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>URL Parameters</Heading>
      <CodeBlock
        language="text"
        code={`tpid (integer, required) - training plan ID`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "training plan deleted successfully",
  "tpid": 12
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Plan not found or not owned by trainer (404)
{
  "error": "training plan not found."
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
