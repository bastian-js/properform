import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function GetExercisesEid() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>GET /exercises/:eid</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Retrieves a specific exercise by ID with all its details including
        associated muscle groups. Requires authentication and the{" "}
        <code>owner</code> role.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>URL Parameters</Heading>
      <CodeBlock
        language="text"
        code={`eid: number - The exercise ID to retrieve`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "eid": 42,
  "name": "Push-Up",
  "description": "Upper body pushing exercise",
  "instructions": "Place hands shoulder-width apart...",
  "video_url": "https://media.properform.app/videos/video.mp4",
  "thumbnail_url": "https://media.properform.app/images/thumb.jpg",
  "sid": 1,
  "dlid": 2,
  "duration_minutes": 10,
  "equipment_needed": "None",
  "created_by": 1,
  "created_at": "2024-01-15T10:30:00Z",
  "updated_at": "2024-02-20T14:45:00Z",
  "muscle_groups": [
    {
      "mgid": 1,
      "name": "Chest",
      "is_primary": 1
    }
  ]
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Exercise not found (404)
{
  "error": "Exercise not found"
}

// Unauthorized (401)
{
  "error": "Unauthorized"
}

// Forbidden (403)
{
  "error": "Forbidden"
}

// Server error (500)
{
  "error": "Server error"
}`}
      />
    </div>
  );
}
