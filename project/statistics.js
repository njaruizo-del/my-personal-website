document.addEventListener("DOMContentLoaded", function () {

    /* =========================================
       TAB NAVIGATION LOGIC
    ========================================= */
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabPanes = document.querySelectorAll('.tab-pane');

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active classes
            tabBtns.forEach(b => b.classList.remove('active'));
            tabPanes.forEach(p => p.classList.remove('active'));

            // Add active class to clicked tab and target pane
            btn.classList.add('active');
            const targetPane = document.getElementById(btn.getAttribute('data-target'));
            if (targetPane) {
                targetPane.classList.add('active');
            }
        });
    });

    /* =========================================
       GENERATE REPORT LOGIC
    ========================================= */
    const generateBtn = document.getElementById('generateReportBtn');
    
    if (generateBtn) {
        generateBtn.addEventListener('click', function() {
            const originalHTML = generateBtn.innerHTML;
            
            // Set loading state
            generateBtn.innerHTML = `<i data-lucide="loader-2" class="spin"></i> Generating...`;
            if (typeof lucide !== "undefined") lucide.createIcons();
            generateBtn.disabled = true;

            // Simulate report generation delay
            setTimeout(() => {
                // Formatting today's date
                const today = new Date();
                const options = { month: 'short', day: '2-digit', year: 'numeric' };
                const formattedDate = today.toLocaleDateString('en-US', options);

                // Add new row to the table
                const tableBody = document.querySelector('#reportsTable tbody');
                const newRow = document.createElement('tr');
                
                newRow.innerHTML = `
                    <td>${formattedDate} (End of Day)</td>
                    <td>Rafael Jhon Jevardan</td>
                    <td class="amount">₱4,350.00</td>
                    <td>
                        <button class="action-btn download-btn" aria-label="Download PDF"><i data-lucide="download"></i></button>
                    </td>
                `;

                // Add animation class to new row
                newRow.style.animation = "fadeIn 0.5s ease";
                
                // Prepend to top of the table
                tableBody.insertBefore(newRow, tableBody.firstChild);

                // Re-initialize icons for the new row
                if (typeof lucide !== "undefined") lucide.createIcons();

                // Switch to Reports tab automatically to view the generated report
                document.querySelector('.tab-btn[data-target="reportsTab"]').click();

                // Restore button state
                generateBtn.innerHTML = `<i data-lucide="check"></i> Report Saved`;
                if (typeof lucide !== "undefined") lucide.createIcons();

                setTimeout(() => {
                    generateBtn.innerHTML = originalHTML;
                    generateBtn.disabled = false;
                    if (typeof lucide !== "undefined") lucide.createIcons();
                }, 2000);

            }, 1500);
        });
    }

    /* =========================================
       FUNCTIONAL DOWNLOAD BUTTONS (Event Delegation)
    ========================================= */
    document.addEventListener('click', function(event) {
        const downloadBtn = event.target.closest('.download-btn') || event.target.closest('.action-btn[aria-label="Download PDF"]');
        
        if (downloadBtn) {
            event.preventDefault();
            
            // Find the table row containing this button to get the report date
            const row = downloadBtn.closest('tr');
            const reportDate = row ? row.cells[0].innerText : 'Sales Report';

            // Simulate file download process
            const originalContent = downloadBtn.innerHTML;
            downloadBtn.innerHTML = `<i data-lucide="loader-2" class="spin"></i>`;
            if (typeof lucide !== "undefined") lucide.createIcons();
            downloadBtn.style.pointerEvents = 'none';

            setTimeout(() => {
                alert(`Successfully downloaded: EOD_Sales_Report_${reportDate.replace(/[^a-zA-Z0-9]/g, '_')}.pdf`);
                
                downloadBtn.innerHTML = originalContent;
                downloadBtn.style.pointerEvents = 'auto';
                if (typeof lucide !== "undefined") lucide.createIcons();
            }, 1000);
        }
    });

});