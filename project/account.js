document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       AVATAR UPLOAD SIMULATION
    ========================================= */
    const uploadBtn = document.getElementById('uploadAvatarBtn');
    const avatarInput = document.getElementById('avatarInput');

    if (uploadBtn && avatarInput) {
        uploadBtn.addEventListener('click', () => {
            avatarInput.click();
        });

        avatarInput.addEventListener('change', (e) => {
            if (e.target.files.length > 0) {
                // In a real app, you would handle the file upload via API here
                alert("Profile picture selected: " + e.target.files[0].name);
            }
        });
    }

    /* =========================================
       FORM SUBMISSION LOGIC
    ========================================= */
    const handleFormSubmit = (formId, successMessage) => {
        const form = document.getElementById(formId);
        
        if (form) {
            form.addEventListener('submit', function(event) {
                event.preventDefault();
                
                const submitBtn = form.querySelector('.btn-primary');
                const originalText = submitBtn.innerHTML;
                
                // Loading state
                submitBtn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Saving...`;
                if (typeof lucide !== "undefined") lucide.createIcons();
                
                // Simulate network request
                setTimeout(() => {
                    alert(successMessage);
                    submitBtn.innerHTML = originalText;
                    
                    // Specific logic for security form
                    if (formId === 'securityForm') {
                        document.getElementById('currentPassword').value = '';
                        document.getElementById('newPassword').value = '';
                    }
                }, 800);
            });
        }
    };

    handleFormSubmit('personalInfoForm', 'Personal information updated successfully!');
    handleFormSubmit('securityForm', 'Password changed successfully!');

    /* =========================================
       TOGGLE PREFERENCES SIMULATION
    ========================================= */
    const toggles = document.querySelectorAll('.toggle-switch input');
    toggles.forEach(toggle => {
        toggle.addEventListener('change', (e) => {
            const isChecked = e.target.checked;
            const settingName = e.target.closest('.preference-item').querySelector('h4').innerText;
            console.log(`${settingName} turned ${isChecked ? 'ON' : 'OFF'}`);
        });
    });

});