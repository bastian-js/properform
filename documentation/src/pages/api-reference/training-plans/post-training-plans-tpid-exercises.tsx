import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function PostTrainingPlanExercises() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>POST /training-plans/:tpid/exercises</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Adds a new exercise to a training plan at a specific position. The
        position is defined by week number, day number, and exercise order. Only
        the plan owner can add exercises.
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
  "eid": 5,
  "weekNumber": 1,
  "dayNumber": 1,
  "exerciseOrder": 1,
  "sets": 4,
  "reps": 10,
  "durationMinutes": null,
  "restSeconds": 90,
  "notes": "Focus on form"
}`}
      />

      <Heading>Field Requirements</Heading>
      <CodeBlock
        language="text"
        code={`eid             (number, required)
weekNumber      (number, required, positive)
dayNumber       (number, required, positive)
exerciseOrder   (number, required, positive)
sets            (number, optional)
reps            (number, optional)
durationMinutes (number, optional)
restSeconds     (number, optional)
notes           (string, optional)`}
      />

      <Heading>Success Response (201)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "exercise added to training plan successfully",
  "exercise": {
    "id": 45,
    "tpid": 15,
    "eid": 5,
    "week_number": 1,
    "day_number": 1,
    "exercise_order": 1,
    "sets": 4,
    "reps": 10,
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
        The exercise must exist in the database before it can be added to a
        training plan. Use the position fields (week_number, day_number,
        exercise_order) to organize exercises throughout the training week.
      </Text>
    </div>
  );
}
