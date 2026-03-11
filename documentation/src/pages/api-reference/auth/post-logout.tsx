import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function PostLogout() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>POST /auth/logout</code>
        <Label text="Public route" color="#10B981" />
      </div>

      <Text>
        Invalidates a refresh token by deleting it from the database. After
        logout the refresh token can no longer be used to obtain new access
        tokens.
      </Text>

      <Heading>Request Body</Heading>
      <CodeBlock
        language="json"
        code={`{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`}
      />

      <Heading>Field Requirements</Heading>
      <CodeBlock language="text" code={`refresh_token  (string, required)`} />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "logout successful."
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Missing refresh token (400)
{
  "message": "refresh token required."
}

// Token not found (404)
{
  "message": "session not found."
}

// Server error (500)
{
  "message": "logout failed",
  "error": "error details"
}`}
      />
    </div>
  );
}
