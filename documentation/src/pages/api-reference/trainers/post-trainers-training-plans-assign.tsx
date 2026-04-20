import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function PostTrainersTrainingPlansAssign() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>POST /trainers/training-plans/assign</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Assigns one or more training plans to an athlete. Plans must be owned by
        the authenticated trainer. Already-assigned plans are skipped. If no
        plan is currently selected for the athlete, the first successfully
        assigned plan is automatically selected.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>Request Body</Heading>
      <CodeBlock
        language="json"
        code={`{
  "uid": 42,
  "tpid": 5,
  "start_date": "2025-05-01"
}

// Or assign multiple plans at once
{
  "uid": 42,
  "tpid_list": [5, 6, 7],
  "start_date": "2025-05-01"
}`}
      />

      <Heading>Field Requirements</Heading>
      <CodeBlock
        language="text"
        code={`uid        (integer, required) - athlete user ID
tpid       (integer, optional) - single plan ID
tpid_list  (array,   optional) - list of plan IDs (use either tpid or tpid_list)
start_date (string,  optional) - ISO date, defaults to today`}
      />

      <Heading>Success Response (201)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "training plan assignment completed",
  "createdCount": 2,
  "skippedPlanIds": [6],
  "assignmentDate": "2025-05-01"
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Missing uid (400)
{
  "error": "uid is required."
}

// Missing plan (400)
{
  "error": "tpid or tpid_list is required."
}

// Athlete not found (404)
{
  "error": "athlete not found."
}

// Server error (500)
{
  "error": "internal server error."
}`}
      />

      <Heading>Requirements</Heading>
      <Text>
        Requires authentication and the <code>trainer</code> role. The athlete
        must exist and have role_id 2.
      </Text>
    </div>
  );
}
