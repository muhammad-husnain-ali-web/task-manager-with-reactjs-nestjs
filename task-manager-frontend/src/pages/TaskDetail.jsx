import React from "react";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchTaskDetail, deleteTask, updateTask } from "../../lib/services";
import { dateget } from "../../lib/dateCorrect";
import Loader from "../components/Loader";
import { ToastContainer, toast } from "react-toastify";
import TaskForm from "../components/TaskForm";

const TaskDetail = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { id } = params;
  const [isUpdated, setIsUpdated] = useState(false);
  const [taskDetail, setTaskDetail] = useState(null);
  const [task, setTask] = useState({
      title: "",
      description: "",
      status: "",
    });

  const getData = async () => {
    const res = await fetchTaskDetail(id)
    if (res.success) {
      const arrayTask = []
      arrayTask.push(res.task)
      const tasks = dateget(arrayTask);
      setTaskDetail(tasks[0])
    }
  };

  const handleComplete = async () => {
    const task = {
      title: taskDetail.title,
      description: taskDetail.description || "",
      status: "completed",
    }

    const res = await updateTask(id, task);
        toast(res.message);
        if (res.success) {
          setIsUpdated(false)
          getData()
        }

  }
  const handleUpdate = async () => {
    setIsUpdated(true)
    setTask({
      title: taskDetail.title,
      description: taskDetail.description || "",
      status: taskDetail.status,
    });
  };
  const handleDelete = async (id) => {
      const res = await deleteTask(id);
      if (res.success) {
        navigate("/");
      }
    };
    const saveTask = async (e) => {
        e.preventDefault();
        const res = await updateTask(id, task);
        toast(res.message);
        if (res.success) {
          setIsUpdated(false)
          getData()
        }
      }

  useEffect(() => {
    getData();
  }, []);

  return (
    <>
    <ToastContainer />
    {taskDetail===null ? (
      <Loader />
    ):(
      <div className="p-3 w-[95%] lg:container md:px-40 py-5 md:py-16 mx-auto">
          <h1 className="text-4xl text font-bold text-center">
            <span className="text-green-500">&lt;</span>
            <span>Task </span>
            <span className="text-green-500">Detail/&gt;</span>
          </h1>

          {isUpdated && <form className="w-full flex flex-col p-4 text-black gap-4 items-center" onSubmit={saveTask}>
            <TaskForm task={task} setTask={setTask} isUpdated={isUpdated} />
          </form>}

          <div className="bg-green-100 my-10 p-4 rounded-md shadow border border-green-800">
            <div className="task flex flex-col gap-5 py-2">
              <div className="w-full md:w-1/2 flex justify-between items-center ">
                <div className="font-bold">Task Tital:</div>
                <div>{taskDetail.title}</div>
              </div>

              <div className="w-full md:w-1/2 flex justify-between items-center">
                <div className="font-bold">Status:</div>
                <div className={` px-2 py-1 font-semibold rounded-md ${
                                taskDetail.status === "pending"
                                  ? "bg-yellow-100 text-yellow-700"
                                  : taskDetail.status === "completed"
                                  ? "bg-green-300 text-green-700"
                                  : "bg-red-100 text-yellow-400"
                              }`}>{taskDetail.status}</div>
              </div>

              <div className="w-full md:w-1/2 flex justify-between items-center">
                <div className="font-bold">Created At:</div>
                <div>{taskDetail.createdAt}</div>
              </div>

            </div>
            
            {taskDetail.description && <>
            <div className="bg-green-800 h-1 w-full my-2 rounded-full"></div>
            <div className="font-bold">Discription</div>
            <div className="break-words px-4">{taskDetail.description}</div>
            </>}
            <div className="bg-green-800 h-1 w-full my-2 rounded-full"></div>
            <div className="w-full md:w-1/2 flex justify-between items-center">
                <div className="font-bold">Action:</div>
                

                <div className="flex justify-center items-center gap-3">
                              
                              <button
                                className="cursor-pointer mx-1"
                                disabled={isUpdated}
                                onClick={() => {
                                  handleUpdate();
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
                                  handleDelete(taskDetail.id);
                                }}
                              >
                                <lord-icon
                                  src="https://cdn.lordicon.com/skkahier.json"
                                  trigger="hover"
                                  style={{ width: "25px", height: "25px" }}
                                ></lord-icon>
                              </button>

                              <button
                              disabled={taskDetail.status==="completed"}
                              onClick={handleComplete}
                                className="text-white disabled:bg-green-300 bg-green-400 hover:bg-green-300 rounded-full p-2 w-fit
                              border border-green-900 cursor-pointer"
                              >
                                Mark As Completed
                              </button>
                            </div>

              </div>
          </div>
        </div>
        
    )}
    </>
  )
};

export default TaskDetail;
