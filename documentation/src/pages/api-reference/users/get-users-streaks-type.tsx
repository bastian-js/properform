import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function GetUsersStreaksType() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>GET /users/streaks/:type</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Returns streak information for the authenticated user by activity type,
        including current streak, longest streak, and last activity date.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>Path Parameters</Heading>
      <CodeBlock
        language="text"
        code={`type  (string, required, streak category in the URL)`}
      />

      <Heading>Success Response (200) - Streak Found</Heading>
      <CodeBlock
        language="json"
        code={`{
  "streak": {
    "current_streak": 1,
    "longest_streak": 1,
    "last_activity_date": "2026-03-27T23:00:00.000Z"
  },
  "logs": [
    {
      "activity_date": "2026-03-26T23:00:00.000Z",
      "created_at": "2026-03-27T20:11:24.000Z"
    },
    {
      "activity_date": "2026-03-27T23:00:00.000Z",
      "created_at": "2026-03-28T00:16:57.000Z"
    }
  ]
}`}
      />

      <Heading>Success Response (200) - No Streak Yet</Heading>
      <CodeBlock
        language="json"
        code={`{
  "streak": {
    "current_streak": 0,
    "longest_streak": 0,
    "last_activity_date": null
  },
  "logs": []
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Missing type (400)
{
  "message": "type is required."
}

// Unauthorized (401)
{
  "error": "Unauthorized"
}

// Server error (500)
{
  "message": "server error.",
  "error": "error details"
}`}
      />

      <Heading>Requirements</Heading>
      <Text>Requires authentication and a type value in the URL.</Text>
    </div>
  );
}
