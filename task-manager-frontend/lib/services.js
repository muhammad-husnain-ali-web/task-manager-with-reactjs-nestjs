
const API_URL = import.meta.env.VITE_HOST;

export async function register(form) {
    console.log(form)
    let r = await fetch(`${API_URL}/auth/register`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
    })
    let res = await r.json();
    return res
}

export async function login(form) {
    console.log(form)
    let r = await fetch(`${API_URL}/auth/login`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
        credentials: "include"
    })
    let res = await r.json();
    return res
}

export async function twofa() {
    let r = await fetch(`${API_URL}/auth/twofa`, {
       method: "POST",
        credentials: "include"
    });
    let res = await r.json();
    return res
}

export async function UploadImage(formData) {
    let r = await fetch(`${API_URL}/auth/imageUpload`, {
       method: "POST",
       body: formData,
        credentials: "include"
    });
    let res = await r.json();
    return res
}

export async function forgotPassword(form) {
    console.log(form)
    let r = await fetch(`${API_URL}/auth/forgot-password`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
    })
    let res = await r.json();
    return res
}

export async function resetPassword(form) {
    console.log(form)
    let r = await fetch(`${API_URL}/auth/reset-password`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
    })
    let res = await r.json();
    return res
}


export async function verifyOtp(verification) {
    let r = await fetch(`${API_URL}/auth/verify-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(verification),
        credentials: "include",
    })
    let res = await r.json();
    return res
}

export async function resendOtp(email) {
    let r = await fetch(`${API_URL}/auth/resend-otp`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
    })
    let res = await r.json();
    return res
}

export async function nameChange(name) {
    let r = await fetch(`${API_URL}/auth/nameChange`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
        credentials: "include"
    })
    let res = await r.json();
    return res
}

export async function logout() {
    let r = await fetch(`${API_URL}/auth/logout`, {
        method: "POST",
        credentials: "include"
    });
    let res = await r.json();
    return res
}


export async function userFound() {
    let r = await fetch(`${API_URL}/auth/me`, {
        credentials: "include"
    })
    let res = await r.json();
    return res
}






export async function fetchTasks() {
    let r = await fetch(`${API_URL}/task`, {
        credentials: "include"
    })
    let res = await r.json();
    return res
}

export async function fetchTaskDetail(id) {
    let r = await fetch(`${API_URL}/task/${id}`, {
        credentials: "include"
    })
    let res = await r.json();
    return res
}

export async function addTask(task) {
    let r = await fetch(`${API_URL}/task`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({title: task.title, description: task.description}),
        credentials: "include"
    })
    let res = await r.json();
    return res
}







export async function deleteTask(id) {
    let r = await fetch(`${API_URL}/task/${id}`, {
        method: "DELETE",
        credentials: "include"
    });
    let res = await r.json();
    return res
}

export async function updateTask(id, task) {
    let r = await fetch(`${API_URL}/task/${id}`, {
       method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify(task),
        credentials: "include"
    });
    let res = await r.json();
    return res
}
