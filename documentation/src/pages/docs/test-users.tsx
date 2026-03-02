import Heading from "../../components/docs/Heading";
import Text from "../../components/docs/Text";
import CodeBlock from "../../components/docs/CodeBlock";
import Button from "../../components/Button";

import { useEffect, useRef, useState } from "react";

export default function TestUsers() {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [requestState, setRequestState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [hasRegistered, setHasRegistered] = useState(false);

  const stateTimeoutRef = useRef<number | null>(null);

  const generateUser = () => {
    const testUserName = "Testuser";
    const randomInt = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;
    const fullName = `${testUserName}${randomInt}`;
    const email = `${fullName}@test.com`;
    return { fullName, email };
  };

  const [loginUser, setLoginUser] = useState(() => generateUser());
  const [registerUser, setRegisterUser] = useState(() => generateUser());

  useEffect(() => {
    return () => {
      if (stateTimeoutRef.current) {
        window.clearTimeout(stateTimeoutRef.current);
      }
    };
  }, []);

  const handleRegisterRequest = async () => {
    if (requestState === "loading") return;

    if (stateTimeoutRef.current) {
      window.clearTimeout(stateTimeoutRef.current);
      stateTimeoutRef.current = null;
    }

    setRequestState("loading");

    try {
      const result = await fetch("https://api.properform.app/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          firstname: registerUser.fullName,
          birthdate: "1995-04-12",
          email: registerUser.email,
          password: "Demo1234!",
          weight: 82.5,
          height: 180.0,
          gender: "male",
          onboarding_completed: false,
          fitness_level: "beginner",
          training_frequency: 3,
          primary_goal: "build_muscle",
        }),
      });

      if (result.ok) {
        const data = await result.json();

        setSuccessMessage(
          `Test user registered successfully with email: ${registerUser.email}, Id: ${data.uid}`,
        );
        setErrorMessage("");
        setRequestState("success");
        setHasRegistered(true);

        // Update login user to the registered user
        setLoginUser(registerUser);
        // Generate new register user for next registration
        setRegisterUser(generateUser());

        stateTimeoutRef.current = window.setTimeout(() => {
          setRequestState("idle");
          stateTimeoutRef.current = null;
        }, 5000);
      } else {
        const errorData = await result.json();
        setErrorMessage(`Error registering test user: ${errorData.message}`);
        setSuccessMessage("");
        setRequestState("error");

        stateTimeoutRef.current = window.setTimeout(() => {
          setRequestState("idle");
          stateTimeoutRef.current = null;
        }, 5000);
      }
    } catch {
      setErrorMessage("Error registering test user: Network error.");
      setSuccessMessage("");
      setRequestState("error");

      stateTimeoutRef.current = window.setTimeout(() => {
        setRequestState("idle");
        stateTimeoutRef.current = null;
      }, 5000);
    }
  };

  return (
    <div className="px-6 py-8 space-y-6">
      <div className="flex items-center gap-3">
        <Heading>Existing Test Users</Heading>
      </div>

      <Text>
        For testing purposes, you can use the following pre-registered user
        accounts.
      </Text>

      <Heading>User - Register</Heading>
      <CodeBlock
        language="http"
        code={`{
  "firstname": "${registerUser.fullName}",
  "birthdate": "1995-04-12",
  "email": "${registerUser.email}",
  "password": "Demo1234!",
  "weight": 82.5,
  "height": 180.0,
  "gender": "male",
  "onboarding_completed": false,
  "fitness_level": "beginner",
  "training_frequency": 3,
  "primary_goal": "build_muscle"
}`}
      />

      {successMessage && (
        <div className="p-4 bg-green-100 text-green-800 rounded-2xl">
          {successMessage}
        </div>
      )}

      {errorMessage && (
        <div className="p-4 bg-red-100 text-red-800 rounded-2xl">
          {errorMessage}
        </div>
      )}

      <Button
        onClick={handleRegisterRequest}
        variant="primary"
        disabled={requestState === "loading"}
      >
        Register Test User
      </Button>

      {hasRegistered && (
        <>
          <Heading>User - Login</Heading>
          <CodeBlock
            language="http"
            code={`{
  "email": "${loginUser.email}",
  "password": "Demo1234!"
}`}
          />
        </>
      )}

      <Heading>Notes</Heading>
      <Text>
        Login and register requests always use the same generated test user.
      </Text>
    </div>
  );
}
