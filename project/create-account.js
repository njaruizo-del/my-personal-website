document.addEventListener("DOMContentLoaded", function () {

    const createAccountForm = document.getElementById('createAccountForm');

    if (createAccountForm) {
        createAccountForm.addEventListener('submit', function(event) {
            event.preventDefault(); // Prevent page refresh

            const fullName = document.getElementById('fullName').value.trim();
            const username = document.getElementById('username').value.trim();
            const phoneNumber = document.getElementById('phoneNumber').value.trim();

            if (!fullName || !username || !phoneNumber) {
                alert("Please fill in all fields (Full Name, Username, and Phone Number).");
                return;
            }

            const submitBtn = createAccountForm.querySelector('.submit-btn');
            const originalText = submitBtn.innerHTML;
            
            // Loading state
            submitBtn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Creating Account...`;
            if (typeof lucide !== "undefined") lucide.createIcons();
            
            // Simulate network request
            setTimeout(() => {
                alert(`Customer account successfully created for ${fullName} (@${username})!`);
                
                // Reset the button and the form
                submitBtn.innerHTML = originalText;
                if (typeof lucide !== "undefined") lucide.createIcons();
                createAccountForm.reset();
                
            }, 1000);
        });
    }

});