document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       CUSTOMER SEARCH FILTER LOGIC
    ========================================= */
    const customerSearch = document.getElementById('customerSearch');
    const customersTableBody = document.getElementById('customersTableBody');

    if (customerSearch && customersTableBody) {
        customerSearch.addEventListener('input', function () {
            const query = this.value.toLowerCase().trim();
            const rows = customersTableBody.querySelectorAll('tr');

            rows.forEach(row => {
                const nameCell = row.cells[1];
                if (nameCell) {
                    const nameText = nameCell.textContent.toLowerCase();
                    if (nameText.includes(query)) {
                        row.style.display = '';
                    } else {
                        row.style.display = 'none';
                    }
                }
            });
        });
    }

});