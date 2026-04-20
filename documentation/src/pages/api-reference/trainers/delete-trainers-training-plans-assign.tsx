import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function DeleteTrainersTrainingPlansAssign() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>DELETE /trainers/training-plans/assign</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Removes one or more training plan assignments from an athlete. Only
        assignments originally made by this trainer can be removed. If the
        athlete's selected plan is removed, the most recently assigned plan is
        automatically selected as fallback.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>Request Body</Heading>
      <CodeBlock
        language="json"
        code={`{
  "uid": 42,
  "tpid": 5
}

// Or unassign multiple plans at once
{
  "uid": 42,
  "tpid_list": [5, 6]
}`}
      />

      <Heading>Field Requirements</Heading>
      <CodeBlock
        language="text"
        code={`uid       (integer, required) - athlete user ID
tpid      (integer, optional) - single plan ID
tpid_list (array,   optional) - list of plan IDs (use either tpid or tpid_list)`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`{
  "message": "training plan unassignment completed",
  "removedCount": 1,
  "removedPlanIds": [5]
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
