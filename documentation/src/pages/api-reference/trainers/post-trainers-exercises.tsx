import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function PostTrainersExercises() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>POST /trainers/exercises</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Creates a new exercise owned by the authenticated trainer. The trainer
        must own the media files referenced by <code>video_mid</code> and{" "}
        <code>thumbnail_mid</code>.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>Request Body</Heading>
      <CodeBlock
        language="json"
        code={`{
  "name": "Squat",
  "description": "Lower body compound movement",
  "instructions": "Stand with feet shoulder-width apart...",
  "video_mid": 10,
  "thumbnail_mid": 11,
  "sid": 1,
  "dlid": 2,
  "duration_minutes": 5,
  "equipment_needed": "Barbell"
}`}
      />

      <Heading>Field Requirements</Heading>
      <CodeBlock
        language="text"
        code={`name             (string,  required) - exercise name
sid              (integer, required) - sport ID
dlid             (integer, required) - difficulty level ID
video_mid        (integer, required) - media ID for the exercise video (must be owned by trainer)
description      (string,  optional)
instructions     (string,  optional)
thumbnail_mid    (integer, optional) - media ID for thumbnail (must be owned by trainer)
duration_minutes (integer, optional) - must be positive
equipment_needed (string,  optional)`}
      />

      <Heading>Success Response (201)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "eid": 42
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Missing required fields (400)
{
  "error": "name, sid and dlid are required."
}

// Invalid media ownership (400)
{
  "error": "invalid video media"
}

// Server error (500)
{
  "error": "failed"
}`}
      />

      <Heading>Requirements</Heading>
      <Text>
        Requires authentication and the <code>trainer</code> role. Media files
        must be uploaded by the same trainer before use.
      </Text>
    </div>
  );
}
