/* =====================================
   STUDENT DASHBOARD SCRIPT
===================================== */

/*
    Future Backend Integration:

    GET  /api/student/profile
    GET  /api/student/dashboard
    GET  /api/student/subjects
    GET  /api/student/notes
    GET  /api/student/pyqs
    POST /api/student/generate-paper
    POST /api/student/evaluate-answer-sheet
*/

/* =====================================
   PAGE LOADED
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    console.log("Student Dashboard Loaded");

    initializeSidebar();
    initializeQuickActions();
    initializeProfile();

});


/* =====================================
   SIDEBAR NAVIGATION
===================================== */

function initializeSidebar() {

    const menuLinks = document.querySelectorAll(".sidebar li");

    menuLinks.forEach(item => {

        item.addEventListener("click", () => {

            // Remove active class from all
            menuLinks.forEach(link => {
                link.classList.remove("active");
            });

            // Add active class
            item.classList.add("active");

            const text = item.innerText.trim();

            switch (text) {

                case "Dashboard":
                    showMessage("Dashboard Opened");
                    break;

                case "Generate Paper":
                    showMessage("Generate Paper Module");
                    break;

                case "Answer Evaluation":
                    showMessage("Answer Evaluation Module");
                    break;

                case "Subjects":
                    showMessage("Subjects Module");
                    break;

                case "Syllabus":
                    showMessage("Syllabus Module");
                    break;

                case "Notes":
                    showMessage("Notes Module");
                    break;

                case "PYQs":
                    showMessage("PYQ Module");
                    break;

                case "Logout":
                    logout();
                    break;
            }

        });

    });

}


/* =====================================
   QUICK ACTION CARDS
===================================== */

function initializeQuickActions() {

    const actionCards = document.querySelectorAll(".action-card");

    actionCards.forEach(card => {

        card.addEventListener("click", () => {

            const text = card.innerText.trim();

            switch (text) {

                case "Generate New Paper":
                    alert("Generate Paper Feature Coming Soon");
                    break;

                case "Evaluate Answer Sheet":
                    alert("Answer Evaluation Feature Coming Soon");
                    break;

                case "View Notes":
                    alert("Notes Section Opening");
                    break;

                case "View PYQs":
                    alert("PYQ Section Opening");
                    break;
            }

        });

    });

}


/* =====================================
   PROFILE CLICK
===================================== */

function initializeProfile() {

    const profile = document.querySelector(".profile");

    if (!profile) return;

    profile.style.cursor = "pointer";

    profile.addEventListener("click", () => {

        alert(
`Student Profile

Name: Yash
Year: 3rd Year

Email:
yash@example.com

Branch:
Computer Science`
        );

    });

}


/* =====================================
   SIMPLE MESSAGE
===================================== */

function showMessage(message) {

    console.log(message);

}


/* =====================================
   FUTURE API FUNCTIONS
===================================== */

// Student Profile
async function loadProfile() {

    /*
        Example:

        const response =
        await fetch("/api/student/profile");

        const data =
        await response.json();
    */

}


// Dashboard Stats
async function loadDashboardStats() {

    /*
        Example:

        const response =
        await fetch("/api/student/dashboard");

        const data =
        await response.json();
    */

}


// Subjects
async function loadSubjects() {

    /*
        GET /api/student/subjects
    */

}


// Notes
async function loadNotes() {

    /*
        GET /api/student/notes
    */

}


// PYQs
async function loadPYQs() {

    /*
        GET /api/student/pyqs
    */

}


// Generate Paper
async function generatePaper() {

    /*
        POST /api/student/generate-paper
    */

}


// Answer Evaluation
async function evaluateAnswerSheet() {

    /*
        POST /api/student/evaluate-answer-sheet
    */

}


/* =====================================
   LOGOUT
===================================== */

function logout() {

    const confirmLogout = confirm(
        "Are you sure you want to logout?"
    );

    if (!confirmLogout) return;

    // Future JWT Remove

    // localStorage.removeItem("token");

    window.location.href = "login.html";

}