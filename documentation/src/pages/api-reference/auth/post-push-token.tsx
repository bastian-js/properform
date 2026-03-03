import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function PostAuthPushToken() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>POST /auth/push-token</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Registers or updates an Expo push notification token for the
        authenticated user. Used to enable push notifications on mobile devices.
        If a token already exists, it will be updated automatically.
      </Text>

      <Heading>Request Body</Heading>
      <CodeBlock
        language="json"
        code={`{
  "token": "ExponentPushToken[xxxxxxxxxxxxxxxxxxxxxxxxxx]"
}`}
      />

      <Heading>Field Requirements</Heading>
      <CodeBlock
        language="text"
        code={`token  (string, required)
       Expo push notification token from the device`}
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
        code={`// Missing token (400)
{
  "message": "token is required."
}

// Server error (500)
{
  "success": false,
  "message": "error message"
}`}
      />

      <Heading>Details</Heading>
      <Text>
        This endpoint uses an "ON DUPLICATE KEY UPDATE" mechanism, meaning if
        the user already has a registered token, the new token will replace the
        old one. This is useful for updating tokens when a user reinstalls the
        app or gets a new device.
      </Text>

      <Heading>Authentication</Heading>
      <Text>
        Requires a valid authentication token in the Authorization header. Token
        must be from an authenticated user.
      </Text>
    </div>
  );
}
