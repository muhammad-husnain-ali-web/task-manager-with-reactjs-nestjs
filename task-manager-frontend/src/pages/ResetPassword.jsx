import React from "react";
import { useState, useEffect } from "react";
import Button from "../components/Button";
import { getPasswordStrength, ismatch } from "../../lib/strength";
import { resetPassword } from "../../lib/services";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const ResetPassword = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    password: "",
    confirmPassword: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [showCnfPwd, setshowCnfPwd] = useState(false);
  const [isloading, setIsloading] = useState(false);
  const [strength, setStrength] = useState(null);
  const [passwordMatch, setPasswordMatch] = useState(false);

  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const token = query.get("token");

  useEffect(() => {
    const ismatchResult = ismatch(form.password, form.confirmPassword);
    setPasswordMatch(ismatchResult);
  }, [form.password, form.confirmPassword]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (e.target.name === "password") {
      const strength = getPasswordStrength(e.target.value);
      setStrength(strength);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    const passwordReset = {
      password: form.password,
      confirmPassword: form.confirmPassword,
      token: token,
    };
    const res = await resetPassword(passwordReset);
    setIsloading(false);

    if (!res.success) {
      toast(res.message);
    }

    if (res.statusCode === 400) {
      toast(res.message[0]);
    }

    if (res.success) {
      toast(res.message);
      setTimeout(() => {
        navigate(`/auth/login`);
      }, 3000);
    }
  };

  return (
    <div className="flex justify-center">
      <ToastContainer />
      <form
        className="w-[90%] md:w-[70%] lg:w-[50%] my-14 p-4 border border-green-800 rounded-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-green-500 text-xl p-4">Reset your password</h2>
        <div className="bg-green-800 h-[1px]"></div>

        <label
          htmlFor="password"
          className="text-green-300 text-lg px-4 py-2 block"
        >
          Enter your password:
        </label>

        <div className="relative">
          <input
            value={form.password}
            onChange={handleChange}
            placeholder="Enter your name"
            className="rounded-full border border-green-500 focus:ring-2 focus:ring-green-300 outline-none w-full p-4 py-1 bg-white"
            type={showPwd ? "text" : "password"}
            name="password"
            id="password"
          />
          <img
            onClick={() => setShowPwd(!showPwd)}
            src={showPwd ? "/icons/eye-off.svg" : "/icons/eye.svg"}
            className="absolute right-2 top-1 cursor-pointer"
            alt="toggle"
          />
        </div>

        {form.password && (
          <p
            className={`text-sm mt-1 font-medium ${
              strength === "Weak"
                ? "text-red-500"
                : strength === "Moderate"
                ? "text-yellow-500"
                : "text-green-500"
            }`}
          >
            Strength: {strength}{" "}
          </p>
        )}

        <label
          htmlFor="confirmPassword"
          className="text-green-300 text-lg px-4 py-2 block"
        >
          Enter your password again:
        </label>

        <div className="relative">
          <input
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Enter your name"
            className="rounded-full border border-green-500 focus:ring-2 focus:ring-green-300 outline-none w-full p-4 py-1 bg-white"
            type={showCnfPwd ? "text" : "password"}
            name="confirmPassword"
            id="confirmPassword"
          />
          <img
            onClick={() => setshowCnfPwd(!showCnfPwd)}
            src={showCnfPwd ? "/icons/eye-off.svg" : "/icons/eye.svg"}
            className="absolute right-2 top-1 cursor-pointer"
            alt="toggle"
          />
        </div>
        {form.confirmPassword && (
          <p
            className={`text-sm mt-1 ${
              !passwordMatch ? "text-red-500" : "text-green-500"
            }`}
          >
            {passwordMatch ? `Password Match` : `Password do not match`}
          </p>
        )}

        <Button isSubmitting={isloading} title={"Create new password"} />
      </form>
    </div>
  );
};

export default ResetPassword;
