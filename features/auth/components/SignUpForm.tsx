"use client";

import { useFormik } from "formik";
import { validationSchema } from "../types/schema";
import { useLogin } from "../api/use-sign-in";
import { useState } from "react";
import { useRouter } from "next/navigation";

const LoginForm = () => {
  const loginMutation = useLogin();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      remember: false,
    },
    validationSchema,
    onSubmit: (values) => {
      if (values.remember) {
        localStorage.setItem(
          "savedLogin",
          JSON.stringify({
            username: values.username,
            password: values.password,
          })
        );
      } else {
        localStorage.removeItem("savedLogin");
      }

      setLoading(true);
      setErrorMsg(null);

      loginMutation.mutate(values, {
        onSuccess: (data) => {
          setLoading(false);
          router.push("/dashboard");
        },
        onError: (error: any) => {
          setLoading(false);
          setErrorMsg(error.message || "Login failed");
        },
      });
    },
  });

  return (
    <>
      <style>
        {`
          @keyframes spinner {
            to {transform: rotate(360deg);}
          }
          .spinner {
            display: inline-block;
            width: 18px;
            height: 18px;
            border: 3px solid rgba(255, 255, 255, 0.6);
            border-top-color: white;
            border-radius: 50%;
            animation: spinner 0.6s linear infinite;
            vertical-align: middle;
            margin-left: 8px;
          }
        `}
      </style>

      <form onSubmit={formik.handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="username">
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.username}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Username"
            disabled={loading}
          />
          {formik.touched.username && formik.errors.username && (
            <p className="text-sm text-red-500 mt-1">{formik.errors.username}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="password">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Password"
            disabled={loading}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-sm text-red-500 mt-1">{formik.errors.password}</p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="checkbox"
            name="remember"
            id="remember"
            onChange={formik.handleChange}
            checked={formik.values.remember}
            className="w-4 h-4 text-blue-600 border-gray-300 rounded"
            disabled={loading}
          />
          <label htmlFor="remember" className="text-sm text-gray-600">
            I agree to the{" "}
            <a href="#" className="text-blue-600 font-semibold">
              Terms and Conditions
            </a>
          </label>
        </div>

        {errorMsg && <p className="text-sm text-red-600">{errorMsg}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center"
        >
          {loading ? (
            <>
              Signing in
              <span className="spinner" />
            </>
          ) : (
            "SIGN IN"
          )}
        </button>
      </form>
    </>
  );
};

export default LoginForm;
