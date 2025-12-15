import React from "react";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

const Navbar = () => {

  const { user } = useContext(AuthContext);
  return (
    <nav className="bg-slate-800 text-white">
      <div className="mycontainer flex justify-between items-center px-4 py-5 h-14">
        <div className="logo font-bold text-white text-2xl">
          <span className="text-green-500">&lt;</span>
          <span>Task</span>
          <span className="text-green-500">Manager/&gt;</span>
        </div>

        <div className="flex justify-center items-center gap-2">
          <Link to="/">Home</Link>

          {user && user.auth && (
              <Link to={'/profile'}
                className=" cursor-pointer px-3 py-1 rounded-lg"
              >
                <img src={user.user.image===null ? "/icons/user.svg" : `${user.user.image}` } className="w-12 h-12 mx-auto rounded-full object-cover" alt="logo" />
              </Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
