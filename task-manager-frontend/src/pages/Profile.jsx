import React from "react";
import { useState } from "react";
import { twofa, UploadImage, nameChange, logout } from "../../lib/services";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";

const Profile = () => {
  const navigate = useNavigate();
  const { user, setUser } = useContext(AuthContext);
  const [loading, setLoading] = useState(false)
  const [nameDisable, setNameDisable] = useState(true)
  const [name, setName] = useState(user.user.name)
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(user.user.twofa);
  const handleTwofa = async (e) => {
    setTwoFactorEnabled(e.target.checked);
    const res = await twofa();
  };

  const handleChange = async (e) => {
    setLoading(true)
    const file = e.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await UploadImage(formData);
    if (res.success) {
      setUser((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          image: res.url || null,
        },
      }));
    }
    setLoading(false)
  };

  const handleLogout = async () => {
    const res = await logout();
    setUser({ auth: false, user: null });
    
    if (res.success) {
      navigate(`/auth/login`);
    }
  };
  
  const handleNameSave = async () => {
    setNameDisable(true);
    const res = await nameChange(name);
    if (res.statusCode === 400) {
        toast(res.message[0]);
      }
      if (res.success) {
        toast(res.message);
      }
    if (res.success) {
      setUser((prev) => ({
        ...prev,
        user: {
          ...prev.user,
          name: res.name,
        },
      }));
    }
  }
  

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      <ToastContainer />
      <h2 className="text-2xl font-bold text-center">Profile Settings</h2>

      <div className="shadow flex justify-center items-center rounded-lg p-4 text-center">
        
        {loading ? (
          <div className="loader ease-linear rounded-full border-8 border-t-8 border-gray-200 h-8 w-8 mb-4 animate-spin border-t-green-500"></div>
        ):(
          <div className="relative w-full inset-0">
          <img
            src={
              user.user.image === null
                ? "/icons/userBlack.svg"
                : `${user.user.image}`
            }
            alt="Profile"
            className="w-32 h-32 mx-auto rounded-full object-cover"
          />

          <label
            htmlFor="file"
            className="mt-3 px-4 py-2 rounded-lg absolute bottom-[3%] z-10 left-[53%] "
          >
            <img
              src={"/icons/camera.svg"}
              className="w-12 h-12 mx-auto rounded-full object-cover cursor-pointer"
              alt="camera"
            />
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
            id="file"
          />
        </div>
        )}
      </div>

      {/* User Info Section */}
      <div className="shadow rounded-lg p-4 space-y-4">

        <div className="relative">
          <label className="block text-sm font-medium">Name</label>
          <input
          disabled={nameDisable}
            type="text"
            value={name}
            onChange={(e)=>{setName(e.target.value)}}
            className="rounded-full mt-2 px-3 py-1 border disabled:border-gray-500 border-green-500 focus:ring-2 focus:ring-green-300 outline-none w-full bg-white"
          />
          <button
                                className="cursor-pointer mx-1 absolute bottom-0.5 right-2"
                                
                              >
                                {nameDisable ? 
                                (<span onClick={() => {
                                  setNameDisable(false);
                                }}>
                                  
                                <lord-icon
                                  src="https://cdn.lordicon.com/gwlusjdu.json"
                                  trigger="hover"
                                  style={{ width: "25px", height: "25px" }}
                                  ></lord-icon>
                                  </span>
                                ):(
                                <span onClick={handleNameSave}>
                                  <img src="/icons/save.svg" alt="save" />
                                  </span>)}

                              </button>
        </div>

        <div className="flex items-center justify-between">
          <span className="font-medium">Two-Factor Auth</span>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={twoFactorEnabled}
              onChange={(e) => handleTwofa(e)}
              className="sr-only peer"
            />
            <div
              className="w-11 h-6 bg-gray-300 peer-focus:outline-none rounded-full peer
         peer-checked:after:translate-x-full peer-checked:after:border-white
         after:content-[''] after:absolute after:top-[2px] after:left-[2px] 
         after:bg-white after:border-gray-300 after:border after:rounded-full 
         after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500"
            ></div>
          </label>
        </div>

        {twoFactorEnabled === false && (
          <p className="text-sm text-red-500">
            ⚠️ Turning off 2FA reduces account security.
          </p>
        )}
        <button onClick={handleLogout} className="block w-full text-center px-4 py-2 text-red-600 cursor-pointer hover:bg-gray-100">
          Logout
        </button>
      </div>
    </div>
  );
};

export default Profile;
