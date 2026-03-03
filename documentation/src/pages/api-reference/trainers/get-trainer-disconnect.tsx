import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function DisconnectTrainer() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>GET /trainers/disconnect</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Disconnects the authenticated user from their trainer. Removes the
        trainer connection and makes the user available for a new trainer
        assignment. Requires authentication. Rate limited to 20 requests per 15
        minutes.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "trainer disconnected successfully"
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// No trainer connection found (404)
{
  "message": "no trainer connection found."
}

// Server error (500)
{
  "message": "server error",
  "error": "error details"
}`}
      />

      <Heading>Requirements</Heading>
      <Text>Requires authentication.</Text>
    </div>
  );
}
