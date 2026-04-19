import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function GetTrainersRequestsMe() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>GET /trainers/requests/me</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Returns all trainer join requests submitted by the authenticated user,
        ordered by creation date descending. Includes trainer details and
        request status.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "requests": [
    {
      "id": 12,
      "status": "pending",
      "created_at": "2025-03-15T10:30:00.000Z",
      "tid": 3,
      "firstname": "Max",
      "lastname": "Mustermann"
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
        Requires authentication and the <code>user</code> role.
      </Text>
    </div>
  );
}
