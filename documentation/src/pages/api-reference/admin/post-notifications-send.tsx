import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function PostAdminNotificationsSend() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>POST /admin/notifications/send</code>
        <Label text="Admin only" color="#EF4444" />
      </div>

      <Text>
        Sends push notifications to users. Only owner-role users can access this
        endpoint. Supports sending to all users or a single specific user.
        Stores notification in database for later retrieval.
      </Text>

      <Heading>Request Body</Heading>
      <CodeBlock
        language="json"
        code={`{
  "title": "Important Update",
  "body": "Check out what's new in version 2.0",
  "targetType": "all",
  "targetId": null
}`}
      />

      <CodeBlock
        language="json"
        code={`{
  "title": "Personal Message",
  "body": "This notification is just for you",
  "targetType": "single",
  "targetId": "user_123"
}`}
      />

      <Heading>Field Requirements</Heading>
      <CodeBlock
        language="text"
        code={`title       (string, required)
            Notification title
body        (string, required)
            Notification message body
targetType  (string, required)
            Either "all" or "single"
targetId    (string, conditional)
            Required if targetType is "single", user ID to target`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "success": true
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Missing fields (400)
{
  "success": false,
  "message": "title and body are required."
}

// Invalid targetType (400)
{
  "success": false,
  "message": "only all and single are required targettypes."
}

// No users found (400)
{
  "success": false,
  "message": "no users found."
}`}
      />

      <Heading>Target Types</Heading>
      <Text>
        <strong>all</strong> - Sends notification to every registered user in
        the system.
      </Text>
      <Text>
        <strong>single</strong> - Sends notification only to a specific user.
        Requires targetId to be provided.
      </Text>

      <Heading>Authentication & Authorization</Heading>
      <Text>
        Requires valid authentication token and owner role (role_id: 0).
        Non-owner users will receive a 403 Forbidden response.
      </Text>
    </div>
  );
}
