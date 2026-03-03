import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function GetNotificationsMe() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>GET /notifications/me</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Retrieves all notifications for the authenticated user. Returns both
        global notifications sent to all users and personal notifications sent
        specifically to this user. Results are ordered by creation date (newest
        first).
      </Text>

      <Heading>Query Parameters</Heading>
      <Text>None</Text>

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "success": true,
  "notifications": [
    {
      "id": 1,
      "title": "Important Update",
      "body": "Check out what's new in version 2.0",
      "target_type": "all",
      "target_id": null,
      "created_by": "admin_user_123",
      "created_at": "2024-03-15T10:30:00Z"
    },
    {
      "id": 2,
      "title": "Personal Message",
      "body": "Special offer just for you",
      "target_type": "single",
      "target_id": "user_456",
      "created_by": "admin_user_123",
      "created_at": "2024-03-14T15:45:00Z"
    }
  ]
}`}
      />

      <Heading>Error Response</Heading>
      <CodeBlock
        language="json"
        code={`// Server error (500)
{
  "success": false,
  "error": "error message"
}`}
      />

      <Heading>Notification Object</Heading>
      <CodeBlock
        language="text"
        code={`id           (number)
             Unique notification identifier
title        (string)
             Notification title
body         (string)
             Notification message body
target_type  (string)
             Either "all" (sent to everyone) or "single" (sent to specific user)
target_id    (string | null)
             User ID if target_type is "single", null for "all"
created_by   (string)
             User ID of the admin who created the notification
created_at   (string)
             ISO 8601 timestamp of when notification was created`}
      />

      <Heading>Filtering Logic</Heading>
      <Text>
        The endpoint returns notifications that match either of these
        conditions:
      </Text>
      <CodeBlock
        language="text"
        code={`1. target_type = 'all' (global notifications for all users)
2. target_type = 'single' AND target_id = current_user_id (personal notifications)`}
      />

      <Heading>Authentication</Heading>
      <Text>
        Requires a valid authentication token in the Authorization header. Token
        must be from an authenticated user.
      </Text>

      <Heading>Sorting</Heading>
      <Text>
        Results are automatically sorted by created_at in descending order,
        showing the most recent notifications first.
      </Text>
    </div>
  );
}
