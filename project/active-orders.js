document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       INSTANT STATUS CHANGE LOGIC
    ========================================= */
    document.addEventListener('change', function (e) {
        if (e.target.classList.contains('status-dropdown')) {
            const dropdown = e.target;
            const selectedVal = dropdown.value;
            const row = dropdown.closest('tr');
            const orderId = row.cells[0].innerText;

            // Update dropdown color class instantly
            dropdown.className = 'status-dropdown';
            if (selectedVal === 'Washing & Drying') {
                dropdown.classList.add('badge-washing');
            } else if (selectedVal === 'Folding & Packaging') {
                dropdown.classList.add('badge-folding');
            } else {
                dropdown.classList.add('badge-ready');
            }

            // Optional: simulate auto-archiving or updating the backend database record
            if (selectedVal === 'Ready for Delivery') {
                setTimeout(() => {
                    alert(`Order ${orderId} marked as Ready for Delivery! Moving to delivery log.`);
                    row.style.animation = 'fadeIn 0.3s ease reverse';
                    setTimeout(() => row.remove(), 300);
                }, 300);
            }
        }
    });

    /* =========================================
       ACTIVE ORDER SEARCH FILTER
    ========================================= */
    const orderSearch = document.getElementById('activeOrderSearch');
    const ordersTableBody = document.getElementById('activeOrdersTableBody');

    if (orderSearch && ordersTableBody) {
        orderSearch.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();
            const rows = ordersTableBody.querySelectorAll('tr');

            rows.forEach(row => {
                const nameCell = row.cells[1];
                const idCell = row.cells[0];
                if (nameCell && idCell) {
                    const rowText = (nameCell.textContent + " " + idCell.textContent).toLowerCase();
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