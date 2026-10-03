document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       INITIALIZE ICONS
    ========================================= */
    if (typeof lucide !== "undefined") {
        lucide.createIcons();
    }

    /* =========================================
       MOBILE MENU LOGIC
    ========================================= */
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const sidebar = document.querySelector('.sidebar');
    const overlay = document.getElementById('sidebarOverlay');

    if (mobileMenuBtn && sidebar && overlay) {
        // Open sidebar
        mobileMenuBtn.addEventListener('click', function() {
            sidebar.classList.add('mobile-active');
            overlay.classList.add('active');
        });

        // Close sidebar by clicking the dark overlay
        overlay.addEventListener('click', function() {
            sidebar.classList.remove('mobile-active');
            overlay.classList.remove('active');
        });
    }

    /* =========================================
       LOGOUT LOGIC
    ========================================= */
    const logoutButton = document.getElementById('logoutButton');
    
    if (logoutButton) {
        logoutButton.addEventListener('click', function(event) {
            event.preventDefault();

            // Retrieve the current user from localStorage
            const currentUser = localStorage.getItem("rhajjLaundryCurrentUser");

            // Clear the authentication flags to securely log the user out
            if (currentUser) {
                localStorage.removeItem(`rhajjLaundryLoggedIn_${currentUser}`);
                localStorage.removeItem("rhajjLaundryCurrentUser");
            }

            // Redirect back to the login screen
            window.location.href = "login.html";
        });
    }

});