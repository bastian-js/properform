import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function GetTrainersRequestsPending() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>GET /trainers/requests/pending</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Returns all pending join requests for the authenticated trainer, ordered
        oldest first. Use <code>PATCH /trainers/requests/:id</code> to
        accept or reject each request.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "requests": [
    {
      "id": 7,
      "created_at": "2025-03-10T08:00:00.000Z",
      "uid": 42,
      "firstname": "Anna",
      "email": "anna@example.com"
    }
  ]
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Server error (500)
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
