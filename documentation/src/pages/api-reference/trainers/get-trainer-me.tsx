import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function GetMyTrainer() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>GET /trainers/me</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Retrieves the trainer assigned to the authenticated user. Returns the
        trainer's information if a connection exists, or indicates that no
        trainer is assigned. Requires authentication. Rate limited to 20
        requests per 15 minutes.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>Success Response (200) - With Trainer</Heading>
      <CodeBlock
        language="json"
        code={`{
  "hasTrainer": true,
  "trainer": {
    "tid": 5,
    "firstname": "Max",
    "lastname": "Mustermann",
    "email": "max@example.com"
  }
}`}
      />

      <Heading>Success Response (200) - Without Trainer</Heading>
      <CodeBlock
        language="json"
        code={`{
  "hasTrainer": false
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Server error (500)
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
