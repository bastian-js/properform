import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function PutTrainersTrainingPlansTpid() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>PUT /trainers/training-plans/:tpid</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Updates a training plan owned by the authenticated trainer. Trainers can
        only update their own plans.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>URL Parameters</Heading>
      <CodeBlock
        language="text"
        code={`tpid (integer, required) - training plan ID`}
      />

      <Heading>Request Body</Heading>
      <CodeBlock
        language="json"
        code={`{
  "name": "Beginner Strength v2",
  "description": "Updated description",
  "sid": 1,
  "dlid": 1,
  "duration_weeks": 6,
  "sessions_per_week": 4,
  "is_template": false
}`}
      />

      <Heading>Field Requirements</Heading>
      <CodeBlock
        language="text"
        code={`name              (string,  required)
sid               (integer, required)
duration_weeks    (integer, required) - must be positive
sessions_per_week (integer, required) - must be positive
description       (string,  optional)
dlid              (integer, optional)
is_template       (boolean, optional)`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "training plan updated successfully",
  "tpid": 12
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Plan not found or not owned by trainer (404)
{
  "error": "training plan not found."
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
