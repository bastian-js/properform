import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function PutTrainersExercisesEid() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>PUT /trainers/exercises/:eid</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Updates an exercise created by the authenticated trainer. Trainers can
        only update their own exercises.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>URL Parameters</Heading>
      <CodeBlock
        language="text"
        code={`eid (integer, required) - exercise ID`}
      />

      <Heading>Request Body</Heading>
      <CodeBlock
        language="json"
        code={`{
  "name": "Squat",
  "description": "Updated description",
  "instructions": "Updated instructions",
  "video_mid": 10,
  "thumbnail_mid": 11,
  "sid": 1,
  "dlid": 2,
  "duration_minutes": 6,
  "equipment_needed": "Barbell"
}`}
      />

      <Heading>Field Requirements</Heading>
      <CodeBlock
        language="text"
        code={`name          (string,  required)
sid           (integer, required)
dlid          (integer, required)
video_mid     (integer, required) - must be owned by trainer
description   (string,  optional)
instructions  (string,  optional)
thumbnail_mid (integer, optional) - must be owned by trainer
duration_minutes (integer, optional)
equipment_needed (string, optional)`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "updated"
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Missing fields (400)
{
  "error": "missing required fields."
}

// Not the trainer's exercise (403)
{
  "error": "not yours"
}

// Exercise not found (404)
{
  "error": "exercise not found."
}

// Server error (500)
{
  "error": "failed"
}`}
      />

      <Heading>Requirements</Heading>
      <Text>
        Requires authentication and the <code>trainer</code> role.
      </Text>
    </div>
  );
}
