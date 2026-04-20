import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function PostTrainersTrainingPlans() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>POST /trainers/training-plans</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Creates a new training plan owned by the authenticated trainer. The plan
        can optionally be marked as a template for reuse.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>Request Body</Heading>
      <CodeBlock
        language="json"
        code={`{
  "name": "Beginner Strength",
  "description": "4-week beginner program",
  "sid": 1,
  "dlid": 1,
  "duration_weeks": 4,
  "sessions_per_week": 3,
  "is_template": false
}`}
      />

      <Heading>Field Requirements</Heading>
      <CodeBlock
        language="text"
        code={`name              (string,  required) - plan name
sid               (integer, required) - sport ID
duration_weeks    (integer, required) - must be positive
sessions_per_week (integer, required) - must be positive
description       (string,  optional)
dlid              (integer, optional) - difficulty level ID
is_template       (boolean, optional, default: false)`}
      />

      <Heading>Success Response (201)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "training plan created successfully",
  "tpid": 12
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Missing required fields (400)
{
  "error": "name, sid, duration_weeks and sessions_per_week are required."
}

// Server error (500)
{
  "error": "internal server error."
}`}
      />

      <Heading>Requirements</Heading>
      <Text>
        Requires authentication and the <code>trainer</code> role.
      </Text>
    </div>
  );
}
