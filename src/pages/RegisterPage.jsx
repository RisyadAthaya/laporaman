import { Link } from "react-router-dom";
import hero from "../assets/hero.png";
import logo from "../assets/logo.svg";

function RegisterPage() {
  return (
    <>
      <main className="flex h-screen w-screen flex-row items-stretch p-5 gap-5">

        <form className="flex flex-col justify-center items-start flex-1 px-16 py-5">
          <h1 className="text-4xl font-bold m-0">Welcome Back!</h1>
          <h2 className="text-lg font-light mb-4">Login to your account</h2>

          <div className="form">
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Email"
            />
          </div>

          <div className="form">
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Password"
            />
          </div>

          <div className="form">
            <input
              type="password"
              id="password"
              name="password"
              required
              placeholder="Password"
            />
          </div>

          <button
            type="submit"
            className="bg-brand text-white border-none block rounded-[5px] p-2.5 text-base cursor-pointer w-full disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Login
          </button>

          <div className="flex items-center gap-2.5 w-full my-2.5 text-sm text-gray-400">
            <span className="flex-1 h-px bg-gray-200" />
            or
            <span className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            type="button"
            className="flex items-center justify-center gap-2.5 w-full border border-gray-300 rounded-[5px] p-2.5 text-base cursor-pointer bg-white"
          >
            Continue with Google
          </button>

          <div className="flex mt-2.5 text-sm text-gray-500">
            <p>
              {" "}
              Don't have an account?{" "}
              <Link to="/register" className="text-brand hover:underline">
                {" "}
                Register
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
          <div
            className="flex flex-row items-start absolute top-0 left-0 w-full h-full p-5
        bg-linear-to-t from-brand to-transparent rounded-[20px] gap-2.5"
          >
            <div className="flex items-center gap-2.5">
              <img
                src={logo}
                alt="JalanAman"
                className="object-cover object-center block w-10 h-auto"
              />
              <Link to="/" className="text-white text-2xl font-bold m-0">
                Lapor Aman
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default RegisterPage;
