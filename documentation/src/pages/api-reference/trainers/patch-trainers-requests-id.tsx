import Heading from "../../../components/docs/Heading";
import Text from "../../../components/docs/Text";
import CodeBlock from "../../../components/docs/CodeBlock";
import Label from "../../../components/Label";

export default function PatchTrainersRequestsId() {
  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <code>PATCH /trainers/requests/:id</code>
        <Label text="Protected route" color="#F59E0B" />
      </div>

      <Text>
        Accepts or rejects a pending join request from a user. Only trainers can
        call this endpoint. The trainer can only act on requests directed to
        them.
      </Text>

      <Heading>Authorization Header</Heading>
      <CodeBlock language="http" code={`Authorization: Bearer <JWT_TOKEN>`} />

      <Heading>URL Parameters</Heading>
      <CodeBlock
        language="text"
        code={`id (integer, required) - trainer_requests record ID`}
      />

      <Heading>Request Body</Heading>
      <CodeBlock
        language="json"
        code={`{
  "action": "accept"
}`}
      />

      <Heading>Field Requirements</Heading>
      <CodeBlock
        language="text"
        code={`action (string, required) - "accept" or "reject"`}
      />

      <Heading>Success Response (200)</Heading>
      <CodeBlock
        language="json"
        code={`// When accepted
{
  "message": "accepted"
}

// When rejected
{
  "message": "rejected"
}`}
      />

      <Heading>Error Responses</Heading>
      <CodeBlock
        language="json"
        code={`// Invalid action (400)
{
  "message": "invalid action."
}

// Request not found (404)
{
  "message": "trainer request not found."
}

// Server error (500)
{
  "error": "internal server error."
}`}
      />

      <Heading>Requirements</Heading>
      <Text>
        Requires authentication and the <code>trainer</code> role. Trainers can
        only respond to requests assigned to their own <code>tid</code>.
      </Text>
    </div>
  );
}
