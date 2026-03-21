import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function GetNotifications() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>GET /admin/notifications</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Retrieves all notifications that have been sent through the system. Only
        admins can access this endpoint. Returns a complete history of
        notifications with sender and recipient information. Results are sorted
        by most recent first.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>Requirements</Heading>
      <Text>Requires admin/owner role.</Text>

      <Heading>Example Request</Heading>
      <CodeBlock
        language="http"
        code={`GET /admin/notifications
Authorization: Bearer <JWT_TOKEN>`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`[
  {
    "nid": 5,
    "title": "New Workout Available",
    "body": "Your trainer assigned a new training plan",
    "target_type": "single",
    "target_id": 42,
    "created_by": 1,
    "created_at": "2024-03-21T14:30:00Z"
  },
  {
    "nid": 4,
    "title": "System Update",
    "body": "ProPerform API has been updated with new features",
    "target_type": "all",
    "target_id": null,
    "created_by": 1,
    "created_at": "2024-03-20T10:15:00Z"
  },
  {
    "nid": 3,
    "title": "Maintenance Window",
    "body": "Maintenance scheduled for tomorrow at 2 AM UTC",
    "target_type": "all",
    "target_id": null,
    "created_by": 1,
    "created_at": "2024-03-19T16:00:00Z"
  }
]`}
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
  "error": "failed to fetch notifications."
}`}
      />

      <Heading>Notes</Heading>
      <Text>
        This endpoint provides a complete audit trail of all notifications sent
        in the system. The target_type indicates whether the notification was
        sent to all users ("all") or a specific user ("single"). target_id is
        null for broadcast notifications.
      </Text>
    </div>
  );
}
