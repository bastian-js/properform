import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function ConnectTrainer() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>POST /trainers/connect</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Connects an authenticated user to a trainer using an invite code. A user
        can only be connected to one trainer at a time. Requires authentication
        and the <code>user</code> role. Rate limited to 5 requests per 15
        minutes.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>Request Body</Heading>
      <CodeBlock
        language="json"
        code={`{
  "invite_code": "TRN-ABC123XYZ"
}`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "trainer connected successfully.",
  "trainer": {
    "tid": 5,
    "firstname": "Max",
    "lastname": "Mustermann"
  }
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Missing invite code (400)
{
  "error": "invite code is required."
}

// Invalid invite code (400)
{
  "error": "invalid invite code."
}

// User already connected to trainer (409)
{
  "error": "user already connected to a trainer."
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
