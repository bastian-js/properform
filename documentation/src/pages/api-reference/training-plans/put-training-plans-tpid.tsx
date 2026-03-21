import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function PutTrainingPlans() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>PUT /training-plans/:tpid</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Updates an existing training plan. All fields must be provided. Only the
        owner of the training plan can update it.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>URL Parameters</Heading>
      <CodeBlock
        language="text"
        code={`tpid  (number, required) - Training plan ID`}
      />

      <Heading>Request Body</Heading>
      <CodeBlock
        language="json"
        code={`{
  "name": "Updated Push Day Workout",
  "description": "Enhanced chest, shoulders, and triceps program",
  "sportId": 1,
  "difficultyLevelId": 3,
  "durationWeeks": 12,
  "sessionsPerWeek": 5
}`}
      />

      <Heading>Field Requirements</Heading>
      <CodeBlock
        language="text"
        code={`name                (string, required)
description         (string, required)
sportId             (number, required)
difficultyLevelId   (number, required)
durationWeeks       (number, required, positive)
sessionsPerWeek     (number, required, positive)`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "training plan updated successfully.",
  "rowsAffected": 1,
  "id": 15
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Missing required fields (400)
{
  "message": "missing required fields."
}

// Training plan not found (404)
{
  "message": "training plan not found."
}

// Unauthorized (401)
{
  "error": "Unauthorized"
}

// Server error (500)
{
  "error": "error details"
}`}
      />

      <Heading>Notes</Heading>
      <Text>
        All fields are required in the update request. The training plan can
        only be updated by its creator.
      </Text>
    </div>
  );
}
