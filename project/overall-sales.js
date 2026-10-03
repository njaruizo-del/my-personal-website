document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       PAYMENT METHOD FILTER LOGIC
    ========================================= */
    const paymentFilter = document.getElementById('paymentFilter');
    const salesTableBody = document.getElementById('salesTableBody');

    if (paymentFilter && salesTableBody) {
        paymentFilter.addEventListener('change', function () {
            const selectedFilter = this.value;
            const rows = salesTableBody.querySelectorAll('tr');

            rows.forEach(row => {
                const paymentModeBadge = row.querySelector('.badge');
                const paymentText = paymentModeBadge ? paymentModeBadge.textContent.trim().toLowerCase() : '';

                if (selectedFilter === 'all') {
                    row.style.display = '';
                } else if (selectedFilter === 'cash' && paymentText === 'cash') {
                    row.style.display = '';
                } else if (selectedFilter === 'gcash' && paymentText === 'gcash') {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
        });
    }

    /* =========================================
       EXPORT SALES CSV SIMULATION
    ========================================= */
    const exportSalesBtn = document.getElementById('exportSalesBtn');
    if (exportSalesBtn) {
        exportSalesBtn.addEventListener('click', function () {
            const originalHTML = this.innerHTML;
            this.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Exporting...`;
            if (typeof lucide !== "undefined") lucide.createIcons();
            this.disabled = true;

            setTimeout(() => {
                alert("Overall Sales Report successfully exported as CSV!");
                this.innerHTML = originalHTML;
                this.disabled = false;
                if (typeof lucide !== "undefined") lucide.createIcons();
            }, 1200);
        });
    }

});