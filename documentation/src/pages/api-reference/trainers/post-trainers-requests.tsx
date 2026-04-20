import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function PostTrainersRequests() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>POST /trainers/requests</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Sends a join request to a trainer using their invite code. Only users
        (role: user) can call this endpoint. The request starts with status{" "}
        <code>pending</code> until the trainer accepts or rejects it.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>Request Body</Heading>
      <CodeBlock
        language="json"
        code={`{
  "code": "TRN-ABC123XYZ"
}`}
      />

      <Heading>Field Requirements</Heading>
      <CodeBlock
        language="text"
        code={`code (string, required) - trainer invite code`}
      />

      <Heading>Success Response (201)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "trainer request sent."
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Missing code (400)
{
  "message": "code is required."
}

// Invalid invite code (400)
{
  "message": "invalid code."
}

// Server error (500)
{
  "error": "internal server error."
}`}
      />

      <Heading>Requirements</Heading>
      <Text>
        Requires authentication and the <code>user</code> role.
      </Text>
    </div>
  );
}
