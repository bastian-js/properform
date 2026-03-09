import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function PostRegister() {
  return (
    <div className="px-6 py-8 space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3">
        <code>POST /auth/register</code>
        <Label text="Public route" color="#10B981" />
      </div>

      <Text>
        Creates a new user account with fitness profile information. Sends a
        verification email with a 6-digit code that must be confirmed before
        login. Rate limited to 5 requests per 15 minutes.
      </Text>

      <Heading>Request Body</Heading>
      <CodeBlock
        language="json"
        code={`{
  "firstname": "John",
  "birthdate": "1990-05-15",
  "email": "john@example.com",
  "password": "SecurePass123!",
  "weight": 75,
  "height": 180,
  "gender": "male",
  "onboarding_completed": false,
  "fitness_level": "intermediate",
  "training_frequency": 4,
  "primary_goal": "muscle_gain",
  "stayLoggedIn": true
}`}
      />

      <Heading>Field Requirements</Heading>
      <CodeBlock
        language="json"
        code={`{
  "firstname": "string (required)",
  "birthdate": "string (required, YYYY-MM-DD)",
  "email": "string (required, valid email)",
  "password": "string (required, 8+ chars)",
  "weight": "number (required, kg)",
  "height": "number (required, cm)",
  "gender": "string (required)",
  "onboarding_completed": "boolean (required)",
  "fitness_level": "string (required)",
  "training_frequency": "number (required)",
  "primary_goal": "string (required)",
  "stayLoggedIn": "boolean (optional)"
}`}
      />

      <Heading>Password Requirements</Heading>
      <Text>
        The password must be at least 8 characters long and contain at least one
        uppercase letter, one lowercase letter, one number, and one special
        character (@$!%*?&#_-).
      </Text>

      <Heading>Success Response (201)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "user successfully created.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "uid": 42
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Missing required fields (400)
{
  "error": "please fill all required fields."
}

// Invalid password (400)
{
  "error": "password must be at least 8 characters..."
}

// Invalid email (400)
{
  "error": "invalid email address."
}

// Email already registered (409)
{
  "error": "email already registered."
}

// Verification email failed (201)
{
  "message": "user created but verification email failed.",
  "error": "error details"
}

// Server error (500)
{
  "message": "failed to create user.",
  "error": "error details"
}`}
      />

      <Heading>Token Expiration</Heading>
      <Text>
        If <code>stayLoggedIn</code> is true, the token expires in 60 days.
        Otherwise it expires in 3 days.
      </Text>
    </div>
  );
}
