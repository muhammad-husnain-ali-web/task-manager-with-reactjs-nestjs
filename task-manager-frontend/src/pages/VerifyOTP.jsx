import { useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Button from "../components/Button";
import { verifyOtp, resendOtp } from "../../lib/services";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

function VerifyOTP() {
  const navigate = useNavigate();

  const { setUser } = useContext(AuthContext);

  const { search } = useLocation(); // get query string
  const query = new URLSearchParams(search); // parse it
  const email = query.get("email"); // get email value

  const [isloading, setIsLoading] = useState(false);
  const [OTP, setOTP] = useState(["", "", "", "", "", ""]);
  const [cooldown, setCooldown] = useState(60);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (cooldown > 0) {
      const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [cooldown]);

  const handleChange = (e, index) => {
    const value = e.target.value;

    const newOTP = [...OTP];
    newOTP[index] = value;
    setOTP(newOTP);

    if (value && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1].focus(); // go back if empty
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const finalOTP = OTP.join("");
    if (finalOTP.length !== 6) {
      return;
    }
    const verification = {
      otp: finalOTP,
      email: email,
    };
    const res = await verifyOtp(verification);
    setIsLoading(false);

    if (!res.success) {
      toast(res.message);
    }

    if (res.success) {
      if (res.purpose === "login" || res.purpose === "register") {
        setUser({ auth: true, user: res.user })
        navigate("/");
      }
      if (res.purpose === "forgot-password") {
        navigate(`/auth/reset-password?token=${res.token}`);
      }
    }
  };

  const handleResend = async () => {
    setCooldown(60);
    const res = await resendOtp(email);
  };

  return (
    <div className="flex justify-center items-center h-[90vh]">
      <ToastContainer />
      <div className=" p-8 w-[350px] md:w-[400px] text-center">
        <h2 className="text-2xl font-bold text-green-500 mb-2">
          OTP Verification
        </h2>
        <p className="text-sm text-green-400 mb-6">
          Enter the 6-digit code we sent to your email
        </p>
        <form onSubmit={handleSubmit}>
          <div className="flex justify-between gap-2 mb-6">
            {Array(6)
              .fill("")
              .map((_, i) => (
                <input
                  key={i}
                  type="text"
                  maxLength="1"
                  className="w-11 h-11 border border-green-500 rounded-xl text-center text-xl focus:ring-2 focus:ring-green-300 outline-none transition"
                  ref={(el) => (inputRefs.current[i] = el)}
                  onChange={(e) => handleChange(e, i)}
                  onKeyDown={(e) => handleKeyDown(e, i)}
                />
              ))}
          </div>
          <Button isSubmitting={isloading} title={"Verify"} />
        </form>

        <div className="mt-4 text-sm text-gray-600">
          Didn’t receive the code?{" "}
          <button
            type="button"
            disabled={cooldown > 0}
            onClick={handleResend}
            className={`font-semibold hover:underline ${
              cooldown > 0
                ? "text-gray-400 cursor-not-allowed"
                : "text-green-600 cursor-pointer"
            }`}
          >
            {cooldown > 0 ? `Resend OTP in ${cooldown}s` : "Resend OTP"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default VerifyOTP;
