import React from "react";
import { useState, useEffect } from "react";
import {
  fetchTasks,
  addTask,
  deleteTask,
  updateTask,
} from "../../lib/services";
import { ToastContainer, toast } from "react-toastify";
import Loader from "../components/Loader";
import { dateget } from "../../lib/dateCorrect";
import { Link } from "react-router-dom";
import TaskForm from "../components/TaskForm";

const Home = () => {
  const [tasks, setTasks] = useState(null);
  const [taskId, setTaskId] = useState(null);
  const [editDisable, setEditDisable] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [statusSearch, setStatusSearch] = useState("all");
  const [searchValue, setSearchValue] = useState("");
  const [task, setTask] = useState({
    title: "",
    description: "",
    status: "",
  });

  const taskByStatus = (tasks) => {
    const tasksFilter = tasks.filter((i) => {
      if (i.status.includes(statusSearch)) {
        return i;
      }
    });
    setTasks(tasksFilter);
  };
  const getTask = async () => {
    const res = await fetchTasks();
    if (res.success) {
      const tasks = dateget(res.tasks);
      if (statusSearch === "all") {
        setTasks(tasks);
      } else {
        taskByStatus(tasks);
      }
    }
  };

  const handleUpdate = async (t) => {
    setIsUpdated(true);
    setEditDisable(true);
    setTaskId(t.id);
    localStorage.setItem(
      "task",
      JSON.stringify({ title: task.title, description: task.description })
    );
    setTask({
      title: t.title,
      description: t.description || "",
      status: t.status,
    });
  };
  const saveTask = async (e) => {
    e.preventDefault();
    if (!isUpdated) {
      const res = await addTask(task);
      if (res.statusCode === 400) {
        toast(res.message[0]);
      }
      if (res.success) {
        toast(res.message);
      }

      if (res.success) {
        if (searchValue !== "") {
          search();
        } else {
          getTask();
        }
      }
    } else {
      const t = JSON.parse(localStorage.getItem("task"));

      const res = await updateTask(taskId, task);
      if (res.statusCode === 400) {
        toast(res.message[0]);
      }
      if (res.success) {
        toast(res.message);
      }
      if (res.success) {
        setIsUpdated(false);
        setTaskId(null);
        setEditDisable(false);
        setTask(t);
        if (searchValue !== "") {
          search();
        } else {
          getTask();
        }
      }
    }
  };

  const handleDelete = async (id) => {
    const res = await deleteTask(id);
    if (res.success) {
      toast(res.message);
      getTask();
    }
  };

  const search = async () => {
    const res = await fetchTasks();
    if (res.success) {
      const tasks = dateget(res.tasks);

      const tasksFilter = tasks.filter((i) => {
        if (i.title.includes(searchValue)) {
          return i;
        }
      });
      setTasks(tasksFilter);
    }
  };

  useEffect(() => {
    if (searchValue === "") {
      getTask();
    } else {
      search();
    }
  }, [searchValue, statusSearch]);

  return (
    <>
      <ToastContainer />
      {tasks === null ? (
        <Loader />
      ) : (
        <div className="p-3 w-[95%] lg:container md:px-40 py-5 md:py-16 mx-auto">
          <h1 className="text-4xl text font-bold text-center">
            <span className="text-green-500">&lt;</span>
            <span>Task</span>
            <span className="text-green-500">Manager/&gt;</span>
          </h1>

          <p className="text-green-900 text-lg text-center">
            Your own Task Manager
          </p>

          <form
            className="w-full flex flex-col p-4 text-black gap-4 items-center"
            onSubmit={saveTask}
          >
            <TaskForm task={task} setTask={setTask} isUpdated={isUpdated} />
          </form>

          <div className="bg-green-800 h-1 w-full my-2 rounded-full"></div>

          <label
            htmlFor="search"
            className="text-green-300 text-lg mx-auto w-full md:w-4/5 px-4 py-2 block"
          >
            <input
              value={searchValue}
              onChange={(e) => {
                setSearchValue(e.target.value);
              }}
              placeholder="Search your task"
              className="rounded-full border border-green-500 focus:ring-2 focus:ring-green-300 outline-none w-full p-4 py-1 bg-white"
              type="text"
              name="search"
              id="search"
            />
          </label>

          <div className="w-full flex overflow-x-auto gap-3 justify-around items-center ">
            <button
              className={`${
                statusSearch === "all" ? "bg-green-400" : "bg-gray-500"
              } text-white hover:bg-green-200 rounded-full px-8 py-2 w-fit border border-green-900 cursor-pointer`}
              onClick={() => {
                setStatusSearch("all");
              }}
            >
              All
            </button>
            <button
              className={`${
                statusSearch === "pending" ? "bg-green-400" : "bg-gray-500"
              } text-white hover:bg-green-200 rounded-full px-8 py-2 w-fit border border-green-900 cursor-pointer`}
              onClick={() => {
                setStatusSearch("pending");
              }}
            >
              Pending
            </button>
            <button
              className={`${
                statusSearch === "in-progress" ? "bg-green-400" : "bg-gray-500"
              } text-white hover:bg-green-200 rounded-full px-8 py-2 w-fit border border-green-900 cursor-pointer`}
              onClick={() => {
                setStatusSearch("in-progress");
              }}
            >
              InProgress
            </button>
            <button
              className={`${
                statusSearch === "completed" ? "bg-green-400" : "bg-gray-500"
              } text-white hover:bg-green-200 rounded-full px-8 py-2 w-fit border border-green-900 cursor-pointer`}
              onClick={() => {
                setStatusSearch("completed");
              }}
            >
              Completed
            </button>
          </div>

          <div className="tasks ">
            <h2 className="font-bold text-2xl py-4">Your Tasks</h2>
            {tasks.length === 0 && <div>No task to show</div>}
            {tasks.length != 0 && (
              <div className="overflow-x-auto w-full bg-white shadow rounded-lg">
                <table className="table-auto w-full rounded-md border-collapse">
                  <thead className="bg-green-800 text-white">
                    <tr>
                      <th className="py-3">Title</th>
                      <th className="py-3">Status</th>
                      <th className="py-3">Created At</th>
                      <th className="py-3 px-2">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-green-100">
                    {tasks.map((task, index) => {
                      return (
                        <tr
                          key={index}
                          className="hover:bg-green-200 text-center border-b border-b-green-900"
                        >
                          <td className="p-3">{task.title}</td>

                          <td className="p-3">
                            <div
                              className={` px-2 py-1 font-semibold rounded-md ${
                                task.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : task.status === "completed"
                                  ? "bg-green-300 text-green-700"
                                  : "bg-red-100 text-yellow-400"
                              }`}
                            >
                              {task.status}
                            </div>
                          </td>

                          <td className="p-3">{task.createdAt}</td>

                          <td className="p-3">
                            <div className="flex justify-center items-center gap-4">
                              <Link
                                to={`/task/${task.id}`}
                                className="text-white bg-green-400 hover:bg-green-300 rounded-full px-8 py-2 w-fit
                              border border-green-900 cursor-pointer"
                              >
                                View
                              </Link>
                              <button
                                className="cursor-pointer mx-1"
                                disabled={editDisable}
                                onClick={() => {
                                  handleUpdate(task);
                                }}
                              >
                                <lord-icon
                                  src="https://cdn.lordicon.com/gwlusjdu.json"
                                  trigger="hover"
                                  style={{ width: "25px", height: "25px" }}
                                ></lord-icon>
                              </button>
                              <button
                                className="cursor-pointer mx-1"
                                onClick={() => {
                                  handleDelete(task.id);
                                }}
                              >
                                <lord-icon
                                  src="https://cdn.lordicon.com/skkahier.json"
                                  trigger="hover"
                                  style={{ width: "25px", height: "25px" }}
                                ></lord-icon>
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default Home;
