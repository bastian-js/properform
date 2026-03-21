import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function PostSystemSaveLog() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>POST /system/save-log</code>
        <Label text="Public route" color="#10B981" />
      </div>

      <Text>
        Stores client-side logs on the server. Used by frontend applications to
        report errors, warnings, and debug information. Logs are persisted to
        the server's log files for debugging and monitoring purposes.
      </Text>

      <Heading>Request Body</Heading>
      <CodeBlock
        language="json"
        code={`{
  "level": "error",
  "message": "Failed to load exercises",
  "timestamp": "2024-03-21T14:30:00Z",
  "userAgent": "Mozilla/5.0...",
  "url": "https://app.properform.app/dashboard",
  "stack": "Error: Failed to fetch\n    at fetchExercises (app.js:125:15)"
}`}
      />

      <Heading>Field Requirements</Heading>
      <CodeBlock
        language="text"
        code={`level      (string, required) - Log level: 'error', 'warn', 'info', 'debug'
message    (string, required) - Log message
timestamp  (string, required) - ISO 8601 timestamp
userAgent  (string, optional) - Browser user agent
url        (string, optional) - Current page URL
stack      (string, optional) - Stack trace for errors`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "log saved successfully"
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Missing required fields (400)
{
  "error": "missing required fields"
}

// Invalid log level (400)
{
  "error": "invalid log level"
}

// Server error (500)
{
  "error": "failed to save log."
}`}
      />

      <Heading>HTTP Headers</Heading>
      <CodeBlock
        language="http"
        code={`Origin  (optional) - Used for CORS validation (allowed: http://localhost:5173, https://docs.properform.app)
Content-Type: application/json`}
      />

      <Heading>Notes</Heading>
      <Text>
        This endpoint accepts requests from specific origins for security
        purposes. Logs are written to the logs/ directory on the server. This is
        useful for debugging issues in production and understanding user
        experience problems.
      </Text>
    </div>
  );
}
