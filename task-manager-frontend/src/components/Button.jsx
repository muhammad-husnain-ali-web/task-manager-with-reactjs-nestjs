import React from 'react'

const Button = ({isSubmitting, title}) => {
  return (
    <button type="submit" disabled={isSubmitting} className={`w-full px-2 py-3 my-4 font-bold text-lg rounded-xl text-white ${isSubmitting ? "bg-green-300 cursor-not-allowed" : "bg-green-500 hover:bg-green-400  cursor-pointer"}`}>

                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"></path>
                    </svg>
                    Processing...
                  </div>
                ) : (
                  title
                )}

              </button>
  )
}

export default Button
