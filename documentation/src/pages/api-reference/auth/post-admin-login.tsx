import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function PostAdminLogin() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>POST /auth/admin/login</code>
        <Label text="Public route" color="#10B981" />
      </div>

      <Text>
        Authenticates an admin account with email and password. Only admin
        accounts (role_id: 1) can use this endpoint. Rate limited to 5 requests
        per 15 minutes.
      </Text>

      <Heading>Request Body</Heading>
      <CodeBlock
        language="json"
        code={`{
  "email": "admin@example.com",
  "password": "SecurePass123!"
}`}
      />

      <Heading>Field Requirements</Heading>
      <CodeBlock
        language="text"
        code={`email     (string, required)
password  (string, required)`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "admin login successful.",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Missing fields (400)
{
  "error": "email and password are required."
}

// Invalid credentials (401)
{
  "error": "invalid credentials."
}

// Server error (500)
{
  "error": "server error: error message"
}`}
      />

      <Heading>Token Expiration</Heading>
      <Text>
        The access token expires in 15 minutes. The refresh token expires in 30
        days and is stored server-side. The access token payload includes the
        user&apos;s uid, email, and role (<code>owner</code>).
      </Text>
    </div>
  );
}
