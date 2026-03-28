import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function GetUsers() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>GET /users</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Returns a paginated list of all users (owners, users, and trainers).
        Requires authentication. Rate limited to 10 requests per 15 minutes.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>Query Parameters</Heading>
      <CodeBlock
        language="http"
        code={`role   (string, optional, filter by role: "owners", "users", "trainers")
page   (number, optional, default: 1)
limit  (number, optional, default: 10, max: 100)`}
      />

      <Heading>Example Request</Heading>
      <CodeBlock
        language="http"
        code={`GET /users?role=users&page=1&limit=10
Authorization: Bearer <JWT_TOKEN>`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "page": 1,
  "limit": 10,
  "total": 42,
  "totalPages": 5,
  "users": [
    {
      "uid": 1,
      "firstname": "John",
      "birthdate": "1990-05-15",
      "email": "john@example.com",
      "role_id": 2,
      "type": "user"
    },
    {
      "tid": 5,
      "firstname": "Jane",
      "lastname": "Smith",
      "birthdate": "1985-03-20",
      "email": "jane@example.com",
      "phone_number": "+41791234567",
      "type": "trainer"
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

// Server error (500)
{
  "error": "Fehler beim Abrufen der Benutzer"
}`}
      />

      <Heading>Notes</Heading>
      <Text>
        Results include owners, users, and trainers. The response distinguishes
        between user types with the <code>type</code> field. Results are sorted
        by ID in descending order.
      </Text>
    </div>
  );
}
