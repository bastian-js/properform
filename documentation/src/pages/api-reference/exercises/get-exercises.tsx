import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function GetExercises() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>GET /exercises</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Returns a paginated list of exercises. For <code>admin</code> scope,
        returns only ID and name. For regular users, returns full exercise data
        with media URLs. Requires authentication and user or owner role.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>Query Parameters</Heading>
      <CodeBlock
        language="http"
        code={`page      (number, optional, default: 1)
limit     (number, optional, default: 10, max: 100)
filter    (string, optional, allowed: "gym", "basketball")
scope     (string, optional, default: user, can be "admin" for owners only)`}
      />

      <Heading>Example Request - With Filter</Heading>
      <CodeBlock
        language="http"
        code={`GET /exercises?page=1&limit=10&filter=gym
Authorization: Bearer <JWT_TOKEN>`}
      />

      <Heading>Example Request - User Scope</Heading>
      <CodeBlock
        language="http"
        code={`GET /exercises?page=1&limit=10
Authorization: Bearer <JWT_TOKEN>`}
      />

      <Heading>Example Request - Admin Scope</Heading>
      <CodeBlock
        language="http"
        code={`GET /exercises?page=1&limit=10&scope=admin
Authorization: Bearer <JWT_TOKEN>`}
      />

      <Heading>Example Response - User Scope (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "count": 2,
  "total": 42,
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "exercises": [
    {
      "eid": 42,
      "name": "Push-Up",
      "description": "Upper body pushing exercise",
      "instructions": "Place hands shoulder-width apart...",
      "sid": 1,
      "sport": "gym",
      "dlid": 2,
      "duration_minutes": 10,
      "equipment_needed": "None",
      "created_by": 1,
      "created_at": "2024-01-15T10:30:00Z",
      "updated_at": "2024-02-20T14:45:00Z",
      "video_url": "https://media.properform.app/videos/video.mp4",
      "thumbnail_url": "https://media.properform.app/images/thumb.jpg"
    }
  ]
}`}
      />

      <Heading>Example Response - Admin Scope (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "count": 2,
  "total": 42,
  "page": 1,
  "limit": 10,
  "totalPages": 5,
  "exercises": [
    {
      "eid": 42,
      "name": "Push-Up",
      "created_by": 1
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

// Forbidden - wrong role (403)
{
  "error": "forbidden"
}

// Invalid filter (400)
{
  "error": "invalid filter"
}

// Server error (500)
{
  "error": "internal server error"
}`}
      />

      <Heading>Requirements</Heading>
      <Text>
        Requires authentication. User or owner role. For <code>admin</code>{" "}
        scope, must have owner role. The <code>filter</code> parameter accepts
        only "gym" or "basketball".
      </Text>
    </div>
  );
}
