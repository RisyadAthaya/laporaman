import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import hero from "../assets/registerhero.png";
import BrandLogo from "../components/BrandLogo.jsx";
import { useAuth } from "../contexts/useAuth.js";
import { getAuthErrorMessage } from "../utils/firebaseErrors.js";

function RegisterPage() {
  const { currentUser, register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      navigate("/", { replace: true });
    }
  }, [currentUser, navigate]);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await register(email, password);
      navigate("/", { replace: true });
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleRegister() {
    setError("");
    setGoogleLoading(true);
    try {
      await loginWithGoogle();
      navigate("/", { replace: true });
    } catch (err) {
      setError(getAuthErrorMessage(err));
    } finally {
      setGoogleLoading(false);
    }
  }

  return (
    <>
      <main className="flex h-screen w-screen flex-row items-stretch p-5 gap-5 bg-background">
        <form
          className="flex flex-col justify-center items-start flex-1 px-16 py-5"
          onSubmit={handleSubmit}
        >
          <h1 className="text-4xl font-bold m-0">Create Account</h1>
          <h2 className="text-lg font-light mb-4">
            Fill in your details to get started
          </h2>

          {error && (
            <div className="w-full mb-4 rounded-[5px] bg-red-50 border border-red-200 text-red-600 text-sm p-2.5">
              {error}
            </div>
          )}

          <div className="form">
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || googleLoading}
            />
          </div>

          <div className="form">
            <input
              type="password"
              id="password"
              name="password"
              required
              minLength={6}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || googleLoading}
            />
          </div>

          <div className="form">
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              required
              minLength={6}
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading || googleLoading}
            />
          </div>

          <button
            type="submit"
            disabled={loading || googleLoading}
            className="bg-main text-white border-none block rounded-[5px] p-2.5 text-base cursor-pointer w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? "Creating account..." : "Register"}
          </button>

          <div className="flex items-center gap-2.5 w-full my-2.5 text-sm text-gray-400">
            <span className="flex-1 h-px bg-gray-200" />
            or
            <span className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={loading || googleLoading}
            className="flex items-center justify-center gap-2.5 w-full border border-gray-300 rounded-[5px] p-2.5 text-base cursor-pointer bg-white disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <GoogleIcon />
            {googleLoading ? "Signing in..." : "Continue with Google"}
          </button>

          <div className="flex mt-2.5 text-sm text-gray-500">
            <p>
              {" "}
              Already have an account?{" "}
              <Link to="/login" className="text-main hover:underline">
                {" "}
                Sign in
              </Link>
            </p>
          </div>
        </form>

        <div className="relative min-w-[55%] rounded-[20px] overflow-hidden">
          <img
            src={hero}
            alt="JalanAman"
            className="w-full h-full rounded-[20px] object-cover object-center block"
          />
          <div className="flex items-center gap-2.5 absolute top-0 right-0 bg-background rounded-bl-[20px] px-5 py-4">
            <Link to="/" className="text-main text-xl font-bold m-0">
              <BrandLogo imgStyle={{ width: "25px", height: "38.5px" }} />
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
      <path
        fill="#4285F4"
        d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84a4.14 4.14 0 0 1-1.8 2.72v2.26h2.9c1.7-1.57 2.7-3.88 2.7-6.62z"
      />
      <path
        fill="#34A853"
        d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.9-2.26c-.8.54-1.84.86-3.06.86-2.35 0-4.34-1.59-5.05-3.72H.96v2.33A9 9 0 0 0 9 18z"
      />
      <path
        fill="#FBBC05"
        d="M3.95 10.7A5.41 5.41 0 0 1 3.67 9c0-.59.1-1.17.28-1.7V4.97H.96A9 9 0 0 0 0 9c0 1.45.35 2.83.96 4.03l2.99-2.33z"
      />
      <path
        fill="#EA4335"
        d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0A9 9 0 0 0 .96 4.97l2.99 2.33C4.66 5.17 6.65 3.58 9 3.58z"
      />
    </svg>
  );
}

export default RegisterPage;
