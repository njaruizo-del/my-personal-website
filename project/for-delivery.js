document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       INSTANT DISPATCH STATUS CHANGE LOGIC
    ========================================= */
    document.addEventListener('change', function (e) {
        if (e.target.classList.contains('status-dropdown')) {
            const dropdown = e.target;
            const selectedVal = dropdown.value;
            const row = dropdown.closest('tr');
            const orderId = row.cells[0].innerText;

            // Update dropdown color class instantly
            dropdown.className = 'status-dropdown';
            if (selectedVal === 'Ready for Dispatch') {
                dropdown.classList.add('badge-ready');
            } else if (selectedVal === 'Out for Delivery') {
                dropdown.classList.add('badge-transit');
            } else {
                dropdown.classList.add('badge-completed');
            }

            // If marked as delivered, archive from the delivery dispatch queue
            if (selectedVal === 'Delivered & Completed') {
                setTimeout(() => {
                    alert(`Order ${orderId} marked as Delivered! Archiving from active dispatch queue.`);
                    row.style.animation = 'fadeIn 0.3s ease reverse';
                    setTimeout(() => row.remove(), 300);
                }, 300);
            }
        }
    });

    /* =========================================
       DELIVERY SEARCH FILTER
    ========================================= */
    const deliverySearch = document.getElementById('deliverySearch');
    const deliveryTableBody = document.getElementById('deliveryTableBody');

    if (deliverySearch && deliveryTableBody) {
        deliverySearch.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();
            const rows = deliveryTableBody.querySelectorAll('tr');

            rows.forEach(row => {
                const nameCell = row.cells[1];
                const idCell = row.cells[0];
                const locCell = row.cells[3];
                if (nameCell && idCell && locCell) {
                    const rowText = (nameCell.textContent + " " + idCell.textContent + " " + locCell.textContent).toLowerCase();
                    if (rowText.includes(query)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });
    }

});