import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function GetMediaByMid() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>GET /media/:mid</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Retrieves metadata for a specific media file by its ID. Returns the
        filename and type (image or video). Only admins can access this
        endpoint.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>URL Parameters</Heading>
      <CodeBlock
        language="text"
        code={`mid  (number, required) - Media file ID`}
      />

      <Heading>Requirements</Heading>
      <Text>Requires admin/owner role.</Text>

      <Heading>Example Request</Heading>
      <CodeBlock
        language="http"
        code={`GET /media/42
Authorization: Bearer <JWT_TOKEN>`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "filename": "exercise_demo_bench_press.mp4",
  "type": "video"
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Invalid media ID format (400)
{
  "error": "invalid media id."
}

// Media not found (404)
{
  "error": "media not found."
}

// Unauthorized (401)
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
        This endpoint returns only metadata. To access the actual file, use the
        URL stored in the database (format:
        https://media.properform.app/[images|videos]/[filename]).
      </Text>
    </div>
  );
}
