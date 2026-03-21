import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function PostTrainingPlans() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>POST /training-plans</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Creates a new training plan. Requires all mandatory fields. The training
        plan will be owned by the authenticated user and can include multiple
        exercises.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>Request Body</Heading>
      <CodeBlock
        language="json"
        code={`{
  "name": "Push Day Workout",
  "description": "Focuses on chest, shoulders, and triceps",
  "sportId": 1,
  "difficultyLevelId": 2,
  "durationWeeks": 8,
  "sessionsPerWeek": 4
}`}
      />

      <Heading>Field Requirements</Heading>
      <CodeBlock
        language="text"
        code={`name                (string, required, 1-255 chars)
description         (string, optional)
sportId             (number, required)
difficultyLevelId   (number, required)
durationWeeks       (number, required, positive)
sessionsPerWeek     (number, required, positive)`}
      />

      <Heading>Success Response (201)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "training plan created successfully",
  "planId": 15
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Missing required fields (400)
{
  "message": "missing required fields"
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
        After creating a training plan, you can add exercises to it using the
        POST /training-plans/:tpid/exercises endpoint.
      </Text>
    </div>
  );
}
