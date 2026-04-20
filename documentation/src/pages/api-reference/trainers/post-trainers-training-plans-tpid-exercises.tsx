import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function PostTrainersTrainingPlansTpidExercises() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>POST /trainers/training-plans/:tpid/exercises</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Adds an exercise to a training plan owned by the authenticated trainer.
        Each combination of week/day/exercise_order must be unique within the
        plan.
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
  "eid": 10,
  "weekNumber": 1,
  "dayNumber": 1,
  "exerciseOrder": 1,
  "sets": 4,
  "reps": 8,
  "durationMinutes": null,
  "restSeconds": 90,
  "notes": "Focus on form"
}`}
      />

      <Heading>Field Requirements</Heading>
      <CodeBlock
        language="text"
        code={`eid            (integer, required)
weekNumber     (integer, required)
dayNumber      (integer, required)
exerciseOrder  (integer, required)
sets           (integer, optional)
reps           (integer, optional)
durationMinutes (integer, optional)
restSeconds    (integer, optional)
notes          (string,  optional)`}
      />

      <Heading>Success Response (201)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "exercise added to training plan successfully",
  "exercise": {
    "id": 15,
    "tpid": 5,
    "eid": 10,
    "name": "Squat",
    "week_number": 1,
    "day_number": 1,
    "exercise_order": 1,
    "sets": 4,
    "reps": 8,
    "duration_minutes": null,
    "rest_seconds": 90,
    "notes": "Focus on form"
  }
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Missing required fields (400)
{
  "error": "eid, weekNumber, dayNumber and exerciseOrder are required."
}

// Plan not found (404)
{
  "error": "training plan not found."
}

// Exercise not found (404)
{
  "error": "exercise not found."
}

// Duplicate position in plan (409)
{
  "error": "exercise already exists for this week/day in the selected training plan."
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
