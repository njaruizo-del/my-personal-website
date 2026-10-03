document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       PRICING FORM SUBMISSION
    ========================================= */
    const pricingForm = document.getElementById('pricingForm');
    if (pricingForm) {
        pricingForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const price = document.getElementById('pricePerKilo').value;
            const minKg = document.getElementById('minKilos').value;
            alert(`Service configuration updated successfully!\nNew Price: ₱${price}/kg (Min: ${minKg} kg)`);
        });
    }

    /* =========================================
       OPERATING HOURS SUBMISSION
    ========================================= */
    const hoursForm = document.getElementById('hoursForm');
    if (hoursForm) {
        hoursForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const open = document.getElementById('openTime').value;
            const close = document.getElementById('closeTime').value;
            const sundays = document.getElementById('openSundays').checked;
            alert(`Store hours updated successfully!\nHours: ${open} - ${close}\nSundays Open: ${sundays ? 'Yes' : 'No'}`);
        });
    }

    /* =========================================
       MAINTENANCE ACTIONS
    ========================================= */
    const exportBtn = document.getElementById('exportBtn');
    if (exportBtn) {
        exportBtn.addEventListener('click', function () {
            alert("Exporting system transaction logs as CSV... Download will start shortly.");
        });
    }

    const clearCacheBtn = document.getElementById('clearCacheBtn');
    if (clearCacheBtn) {
        clearCacheBtn.addEventListener('click', function () {
            if (confirm("Are you sure you want to clear local application cache?")) {
                alert("Cache cleared successfully.");
            }
        });
    }

});