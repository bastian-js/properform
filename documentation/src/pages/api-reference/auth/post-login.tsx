import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function PostLogin() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>POST /auth/login</code>
        <Label text="Public route" color="#10B981" />
      </div>

      <Text>
        Authenticates a user with email and password. Only regular user accounts
        (role_id: 2) can use this endpoint — owners must use the admin login.
        Email must be verified before login is successful. Updates the user's
        last login timestamp.
      </Text>

      <Heading>Request Body</Heading>
      <CodeBlock
        language="json"
        code={`{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "stayLoggedIn": true
}`}
      />

      <Heading>Field Requirements</Heading>
      <CodeBlock
        language="text"
        code={`email         (string, required)
password      (string, required)
stayLoggedIn  (boolean, optional, default: false)`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "login successful.",
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "uid": 42
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Missing fields (400)
{
  "error": "please fill all required fields."
}

// Invalid stayLoggedIn value (400)
{
  "error": "invalid value for stayloggedin."
}

// Invalid credentials (401)
{
  "error": "invalid credentials."
}

// Email not verified (403)
{
  "error": "email not verified."
}

// Owner account used on wrong endpoint (403)
{
  "message": "owners must use the admin login."
}

// Server error (500)
{
  "message": "login failed.",
  "error": "error details"
}`}
      />

      <Heading>Token Expiration</Heading>
      <Text>
        The access token expires in 15 minutes. The refresh token expires in 60
        days if <code>stayLoggedIn</code> is <code>true</code>, otherwise in 3
        days.
      </Text>
    </div>
  );
}
