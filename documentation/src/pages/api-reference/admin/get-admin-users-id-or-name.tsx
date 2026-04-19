import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function GetAdminUsersIdOrName() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>GET /admin/users/:idOrName</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Searches for users by numeric ID or by name (partial match). If the
        parameter is a number the query searches by <code>uid</code>, otherwise
        it performs a <code>LIKE</code> search on <code>firstname</code>. Owner
        only.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>URL Parameters</Heading>
      <CodeBlock
        language="text"
        code={`idOrName (string, required) - numeric user ID or name substring`}
      />

      <Heading>Example Requests</Heading>
      <CodeBlock
        language="http"
        code={`GET /admin/users/42
GET /admin/users/anna`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`[
  {
    "uid": 42,
    "firstname": "Anna",
    "email": "anna@example.com"
  }
]`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// User not found by ID (404)
{
  "success": false,
  "message": "user not found."
}`}
      />

      <Heading>Requirements</Heading>
      <Text>
        Requires authentication and the <code>owner</code> role.
      </Text>
    </div>
  );
}
