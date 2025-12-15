import React from 'react'

const TaskForm = ({task, setTask, isUpdated}) => {

  const handleChange = (e) => {
    setTask({ ...task, [e.target.name]: e.target.value });
  };
  return (
    <>
    <input
              value={task.title}
              onChange={handleChange}
              placeholder="Enter your title"
              className="rounded-full border border-green-500 focus:ring-2 focus:ring-green-300 outline-none w-full p-4 py-1 bg-white"
              type="text"
              name="title"
              id="title"
            />
            <input
              value={task.description}
              onChange={handleChange}
              placeholder="Enter your description"
              className="rounded-full border border-green-500 focus:ring-2 focus:ring-green-300 outline-none w-full p-4 py-1 bg-white"
              type="text"
              name="description"
              id="description"
            />

            {isUpdated && (
              <div className="flex flex-col gap-3  md:flex-row md:justify-around md:items-center w-full">
                <label className="px-2 py-1 font-semibold rounded-md text-center cursor-pointer bg-yellow-100 text-yellow-700">
                  <input
                    type="radio"
                    onChange={handleChange}
                    value={"pending"}
                    name="status"
                    id=""
                    checked={task.status === "pending"}
                  />
                  Pending
                </label>
                <label className="px-2 py-1 font-semibold rounded-md text-center cursor-pointer bg-red-100 text-yellow-400">
                  <input
                    type="radio"
                    onChange={handleChange}
                    value={"in-progress"}
                    name="status"
                    id=""
                    checked={task.status === "in-progress"}
                  />
                  In-progress
                </label>
                <label className="px-2 py-1 font-semibold rounded-md text-center cursor-pointer bg-green-300 text-green-700">
                  <input
                    onChange={handleChange}
                    type="radio"
                    value={"completed"}
                    name="status"
                    id=""
                    checked={task.status === "completed"}
                  />
                  completed
                </label>
              </div>
            )}

            <button
              type="submit"
              className="flex justify-center items-center gap-2 text-white bg-green-400 hover:bg-green-300 rounded-full px-8 py-2 w-fit
            border border-green-900 cursor-pointer"
            >
              <lord-icon
                src="https://cdn.lordicon.com/jgnvfzqg.json"
                trigger="hover"
              ></lord-icon>
              {isUpdated ? "Update" : "Save"}
            </button>
    </>
  )
}

export default TaskForm
