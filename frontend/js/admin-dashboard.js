/* =========================================
   ADMIN DASHBOARD SCRIPT
========================================= */

/*
    This file will later handle:

    - Sidebar interactions
    - API integration
    - Dynamic statistics
    - Charts
    - Notifications
    - Real-time updates
    - Logout handling
*/

/* =========================================
   SELECT NAV ITEMS
========================================= */

const navItems = document.querySelectorAll(".nav-item");

/* =========================================
   ACTIVE SIDEBAR MENU
========================================= */

navItems.forEach((item) => {

    item.addEventListener("click", () => {

        // Remove active class from all items
        navItems.forEach((nav) => {
            nav.classList.remove("active");
        });

        // Add active class to clicked item
        item.classList.add("active");
    });

});

/* =========================================
   LOGOUT BUTTON
========================================= */

const logoutButton = document.querySelector(".logout-btn");

/*
    Temporary logout logic
    Later:
    - Clear auth token
    - Destroy session
    - Redirect to login
*/

logoutButton.addEventListener("click", () => {

    const confirmLogout = confirm(
        "Are you sure you want to logout?"
    );

    if (confirmLogout) {

        // Redirect to login page
        window.location.href = "login.html";
    }

});

/* =========================================
   FUTURE FEATURES PLACEHOLDER
========================================= */

/*

Later we can add:

1. Fetch dashboard statistics from backend

Example:

async function loadDashboardStats() {

}

2. Charts using Chart.js

3. Real-time notifications

4. Student management APIs

5. Teacher management APIs

6. Subject CRUD operations

7. AI analytics integration

*/