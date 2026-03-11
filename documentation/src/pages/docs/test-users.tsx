import Heading from "../../components/docs/Heading";
import Text from "../../components/docs/Text";
import CodeBlock from "../../components/docs/CodeBlock";
import Button from "../../components/Button";
import { Copy, Check, CircleCheck, Hash, Mail } from "lucide-react";

import { useEffect, useRef, useState } from "react";
import { apiFetch } from "../../helpers/apiFetch";

function CopyableToken({ label, value }: { label: string; value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs font-semibold text-green-700 uppercase tracking-wider">
        {label}
      </span>
      <div className="flex items-center gap-3 bg-white/60 border border-green-200 rounded-xl px-3 py-2.5">
        <button
          onClick={handleCopy}
          className="flex-shrink-0 p-1 rounded-lg hover:bg-green-100 transition-all duration-200 hover:scale-110 cursor-pointer"
          title={`Copy ${label}`}
        >
          {copied ? (
            <Check className="w-3.5 h-3.5 text-green-500" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-green-500" />
          )}
        </button>
        <span className="font-mono text-xs text-green-900 break-all leading-relaxed">
          {value}
        </span>
      </div>
    </div>
  );
}

interface SuccessData {
  email: string;
  uid: number;
  access_token: string;
  refresh_token: string;
}

function SuccessBox({ data }: { data: SuccessData }) {
  return (
    <div className="rounded-2xl border border-green-200 bg-green-50 overflow-hidden">
      {/* Header */}
      <div className="flex items-center gap-2.5 px-4 py-3 bg-green-500">
        <CircleCheck className="w-4 h-4 text-white flex-shrink-0" />
        <span className="text-white font-semibold text-sm">
          User registered successfully
        </span>
      </div>

      {/* Meta info */}
      <div className="flex items-center gap-6 px-4 py-3 border-b border-green-200 bg-green-100/60">
        <div className="flex items-center gap-2 text-sm text-green-800">
          <Mail className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
          <span className="font-mono">{data.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-green-800">
          <Hash className="w-3.5 h-3.5 text-green-600 flex-shrink-0" />
          <span className="font-mono">{data.uid}</span>
        </div>
      </div>

      {/* Tokens */}
      <div className="flex flex-col gap-3 px-4 py-4">
        <CopyableToken label="access_token" value={data.access_token} />
        <CopyableToken label="refresh_token" value={data.refresh_token} />
      </div>
    </div>
  );
}

export default function TestUsers() {
  const BASE_URL = "https://api.properform.app";

  const [successData, setSuccessData] = useState<SuccessData | null>(null);
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
      const result = await apiFetch(`${BASE_URL}/auth/register`, {
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

        const saveResult = await apiFetch(`${BASE_URL}/system/save-log`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            filename: "registered_test_users",
            message: data.uid.toString(),
          }),
        });

        if (!saveResult.ok) {
          console.error("Failed to save test user:", await saveResult.text());
          alert("Test user registered but failed to save logs.");
        }

        setSuccessData({
          email: registerUser.email,
          uid: data.uid,
          access_token: data.access_token,
          refresh_token: data.refresh_token,
        });
        setErrorMessage("");
        setRequestState("success");
        setHasRegistered(true);

        setLoginUser(registerUser);
        setRegisterUser(generateUser());

        stateTimeoutRef.current = window.setTimeout(() => {
          setRequestState("idle");
          stateTimeoutRef.current = null;
        }, 5000);
      } else {
        const errorData = await result.json();
        setErrorMessage(`Error registering test user: ${errorData.message}`);
        setSuccessData(null);
        setRequestState("error");

        stateTimeoutRef.current = window.setTimeout(() => {
          setRequestState("idle");
          stateTimeoutRef.current = null;
        }, 5000);
      }
    } catch {
      setErrorMessage("Error registering test user: Network error.");
      setSuccessData(null);
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
        language="json"
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

      {successData && <SuccessBox data={successData} />}

      {errorMessage && (
        <div className="rounded-2xl border border-red-200 bg-red-50 overflow-hidden">
          <div className="flex items-center gap-2.5 px-4 py-3 bg-red-500">
            <span className="text-white font-semibold text-sm">
              Registration failed
            </span>
          </div>
          <p className="px-4 py-3 text-sm text-red-800 font-mono">
            {errorMessage}
          </p>
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
            language="json"
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
