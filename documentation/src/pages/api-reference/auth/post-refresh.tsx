import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function PostAuthRefresh() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>POST /auth/refresh</code>
        <Label text="Public route" color="#10B981" />
      </div>

      <Text>
        Generates a new access token using a valid refresh token. This endpoint
        is used to extend the user session when the access token has expired.
        Refresh tokens are valid for 30 days or 3 days depending on the
        stayLoggedIn flag during login.
      </Text>

      <Heading>Request Body</Heading>
      <CodeBlock
        language="json"
        code={`{
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`}
      />

      <Heading>Field Requirements</Heading>
      <CodeBlock
        language="text"
        code={`refresh_token  (string, required) - Valid refresh token from login or previous refresh`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "new access token created.",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Missing refresh token (401)
{
  "message": "refresh token is required."
}

// Invalid token type (403)
{
  "message": "invalid token type."
}

// Invalid token payload (403)
{
  "message": "invalid refresh token payload."
}

// Expired or invalid refresh token (403)
{
  "message": "invalid or expired refresh token."
}

// User not found (404)
{
  "message": "user not found."
}

// Server error (500)
{
  "error": "error details"
}`}
      />

      <Heading>Notes</Heading>
      <Text>
        The new access token also expires in 15 minutes. Store the returned
        token and use it for subsequent authenticated requests. If the refresh
        token is invalid or expired, the user must login again.
      </Text>
    </div>
  );
}
