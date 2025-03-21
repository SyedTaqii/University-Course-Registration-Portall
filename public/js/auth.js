document.addEventListener("DOMContentLoaded", function () {
    const adminForm = document.getElementById("adminLoginForm");
    const studentForm = document.getElementById("studentLoginForm");

    if (adminForm) {
        adminForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const username = document.getElementById("adminUsername").value;
            const password = document.getElementById("adminPassword").value;

            const response = await fetch('/api/auth/admin/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                alert('Admin Login Successful');
                window.location.href = 'dashboard.html';
            } else {
                alert(data.message);
            }
        });
    }

    if (studentForm) {
        studentForm.addEventListener("submit", async function (e) {
            e.preventDefault();
            const rollNumber = document.getElementById("studentRollNumber").value;

            const response = await fetch('/api/auth/student/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ rollNumber })
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                alert('Student Login Successful');
                window.location.href = 'dashboard.html';
            } else {
                alert(data.message);
            }
        });
    }
});

// Function to toggle between Admin and Student login
function showForm(type) {
    document.getElementById("adminLoginForm").classList.add("hidden");
    document.getElementById("studentLoginForm").classList.add("hidden");

    if (type === 'admin') {
        document.getElementById("adminLoginForm").classList.remove("hidden");
    } else {
        document.getElementById("studentLoginForm").classList.remove("hidden");
    }
}
