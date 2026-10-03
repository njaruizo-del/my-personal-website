document.addEventListener("DOMContentLoaded", function () {

    const addOrderModal = document.getElementById('addOrderModal');
    const openAddOrderBtn = document.getElementById('openAddOrderModal');
    const closeAddOrderBtn = document.getElementById('closeAddOrderModal');
    const cancelOrderBtn = document.getElementById('cancelOrderBtn');
    const walkInForm = document.getElementById('walkInOrderForm');
    
    const weightInput = document.getElementById('weightKg');
    const pricePreviewDisplay = document.getElementById('pricePreviewDisplay');

    const RATE_PER_KILO = 35.00; // Standard rate for wash, dry, and fold

    // Open Walk-in Order Modal via Floating Button
    if (openAddOrderBtn && addOrderModal) {
        openAddOrderBtn.addEventListener('click', () => {
            addOrderModal.classList.add('active');
        });
    }

    // Close Modal triggers
    function closeModal() {
        if (addOrderModal) {
            addOrderModal.classList.remove('active');
            walkInForm.reset();
            pricePreviewDisplay.textContent = '₱0.00';
        }
    }

    if (closeAddOrderBtn) closeAddOrderBtn.addEventListener('click', closeModal);
    if (cancelOrderBtn) cancelOrderBtn.addEventListener('click', closeModal);
    
    if (addOrderModal) {
        addOrderModal.addEventListener('click', (e) => {
            if (e.target === addOrderModal) closeModal();
        });
    }

    // Real-time price calculation based on weight (Wash, Dry, Fold)
    if (weightInput && pricePreviewDisplay) {
        weightInput.addEventListener('input', () => {
            const weight = parseFloat(weightInput.value) || 0;
            const total = weight * RATE_PER_KILO;
            pricePreviewDisplay.textContent = `₱${total.toFixed(2)}`;
        });
    }

    // Handle Walk-in Form Submission
    if (walkInForm) {
        walkInForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('walkInName').value.trim();
            const phone = document.getElementById('walkInPhone').value.trim();
            const weight = parseFloat(weightInput.value) || 0;
            const paymentMode = document.getElementById('paymentMode').value;
            const totalAmount = weight * RATE_PER_KILO;

            if (!name || !phone || weight <= 0) {
                alert("Please fill out all fields with valid information.");
                return;
            }

            // Create new row data for the recent transactions table
            const tableBody = document.getElementById('transactionTableBody');
            const newRow = document.createElement('tr');
            
            const badgeClass = paymentMode === 'GCash' ? 'badge-gcash' : 'badge-cash';

            newRow.innerHTML = `
                <td>Just now</td>
                <td>${name}</td>
                <td><span class="badge ${badgeClass}">${paymentMode}</span></td>
                <td class="amount">₱${totalAmount.toFixed(2)}</td>
                <td>
                    <button class="action-btn view-btn" title="View Details"><i data-lucide="eye"></i></button>
                    <button class="action-btn edit-btn" title="Edit Order"><i data-lucide="edit"></i></button>
                </td>
            `;

            tableBody.insertBefore(newRow, tableBody.firstChild);
            if (typeof lucide !== "undefined") lucide.createIcons();

            alert(`Walk-in order for ${name} (${weight}kg) recorded successfully via ${paymentMode}!`);
            closeModal();
        });
    }

});