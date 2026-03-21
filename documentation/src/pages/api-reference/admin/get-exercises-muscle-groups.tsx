import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function GetMuscleGroups() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>GET /admin/exercises/muscle-groups</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Retrieves all available muscle groups in the system. This list is used
        when creating or assigning muscle groups to exercises. Only admins can
        access this endpoint. Results are sorted alphabetically.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>Requirements</Heading>
      <Text>
        Requires admin/owner role. Rate limited to 30 requests per 15 minutes.
      </Text>

      <Heading>Example Request</Heading>
      <CodeBlock
        language="http"
        code={`GET /admin/exercises/muscle-groups
Authorization: Bearer <JWT_TOKEN>`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "count": 12,
  "data": [
    {
      "mgid": 1,
      "name": "Chest"
    },
    {
      "mgid": 2,
      "name": "Triceps"
    },
    {
      "mgid": 3,
      "name": "Shoulders"
    },
    {
      "mgid": 4,
      "name": "Lats"
    },
    {
      "mgid": 5,
      "name": "Quads"
    },
    {
      "mgid": 6,
      "name": "Hamstrings"
    },
    {
      "mgid": 7,
      "name": "Back"
    },
    {
      "mgid": 8,
      "name": "Biceps"
    }
  ]
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Unauthorized (401)
{
  "error": "Unauthorized"
}

// Forbidden (403) - Not an admin
{
  "error": "Forbidden"
}

// Server error (500)
{
  "error": "internal server error."
}`}
      />

      <Heading>Notes</Heading>
      <Text>
        Results are automatically sorted by muscle group name alphabetically.
        This data is relatively static and can be cached on the client side.
        Each muscle_group can be assigned as primary or secondary to an
        exercise.
      </Text>
    </div>
  );
}
