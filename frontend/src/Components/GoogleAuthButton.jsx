import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { signInWithGoogle } from "../lib/services/auth.service";

/**
 * Reusable "continue with Google" button, shared by the Sign In and Sign Up
 * pages.
 *
 * `role` only matters when Google is creating a brand new account, so the sign
 * up page passes whatever role the visitor picked.
 */
export default function GoogleAuthButton({ role, onSuccess }) {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSuccess = async (credentialResponse) => {
    setError("");
    try {
      // We send the raw ID token to our backend, which verifies it. Decoding
      // it here proves nothing, so the browser never gets a say.
      await signInWithGoogle({
        credential: credentialResponse.credential,
        role,
      });
      onSuccess?.();
      navigate("/dashboard");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "We couldn't sign you in with Google. Please try again.",
      );
    }
  };

  return (
    <div className="flex w-full flex-col items-center gap-3">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() =>
          setError("Google couldn't complete the sign in. Please try again.")
        }
        shape="pill"
        text="continue_with"
      />

      {error && (
        <p
          role="alert"
          className="flex w-full items-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600"
        >
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
