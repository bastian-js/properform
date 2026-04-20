import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function GetTrainersRequests() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>GET /trainers/requests</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Returns all join requests for the authenticated trainer (pending,
        accepted and rejected), ordered by creation date descending.
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
      "status": "accepted",
      "created_at": "2025-03-10T08:00:00.000Z",
      "uid": 42,
      "firstname": "Anna"
    },
    {
      "id": 9,
      "status": "pending",
      "created_at": "2025-04-01T12:00:00.000Z",
      "uid": 55,
      "firstname": "Ben"
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
