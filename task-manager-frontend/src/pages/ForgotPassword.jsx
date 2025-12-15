import React from "react";
import { useState } from "react";
import Button from "../components/Button";
import { forgotPassword } from "../../lib/services";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
  });
  const [isloading, setIsloading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    const res = await forgotPassword(form);
    setIsloading(false);
    if (!res.success) {
      toast(res.message);
    }

    if (res.success) {
      navigate(`/auth/verifyOTP?email=${res.email}`);
    }
  };

  return (
    <div className="flex justify-center">
      <ToastContainer />
      <form
        className="w-[90%] md:w-[70%] lg:w-[50%] my-14 p-4 border border-green-800 rounded-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-green-500 text-xl p-4">Forgot your password</h2>
        <div className="bg-green-800 h-[1px]"></div>

        <label
          htmlFor="email"
          className="text-green-300 text-lg px-4 py-2 block"
        >
          Enter your email:
        </label>
        <input
          value={form.email}
          onChange={handleChange}
          placeholder="Enter your name"
          className="rounded-full border border-green-500 focus:ring-2 focus:ring-green-300 outline-none w-full p-4 py-1 bg-white"
          type="email"
          name="email"
          id="email"
        />

        <Button isSubmitting={isloading} title={"Login"} />
      </form>
    </div>
  );
};

export default ForgotPassword;
