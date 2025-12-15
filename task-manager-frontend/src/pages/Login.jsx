import React from "react";
import { useState} from "react";
import { Link } from "react-router-dom";
import Button from "../components/Button";
import { login } from "../../lib/services";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();

  const { setUser } = useContext(AuthContext);

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPwd, setShowPwd] = useState(false);
  const [isloading, setIsloading] = useState(false);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    const res = await login(form);
    setIsloading(false);
    if (!res.success) {
      toast(res.message);
    }

    if (res.success && res.twofa) {
      navigate(`/auth/verifyOTP?email=${res.email}`);
    }
    if(res.success && !res.twofa){
      setUser({ auth: true, user: res.user })
        navigate("/");
    }
  };

  return (
    <div className="flex justify-center">
      <ToastContainer />
      <form
        className="w-[90%] md:w-[70%] lg:w-[50%] my-14 p-4 border border-green-800 rounded-md"
        onSubmit={handleSubmit}
      >
        <h2 className="text-green-500 text-xl p-4">Login your account</h2>
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

        <div className="flex sm:flex-row flex-col items-center justify-between w-full">
        <div className="my-2">
          Dont have an account?{" "}
          <Link to={"/auth/register"} className="text-green-600 underline">
            register
          </Link>
        </div>
        <div className='my-2'> <Link to={"/auth/forgot-password"} className='text-green-600 underline'>Forgot Password</Link></div>
        </div>

        <Button isSubmitting={isloading} title={"Login"} />
      </form>
    </div>
  );
};

export default Login;
