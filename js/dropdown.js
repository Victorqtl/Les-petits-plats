function openDropdown(){
const dropdownBtn = document.querySelectorAll('.dropdown-btn');

dropdownBtn.forEach(btn => {
    btn.addEventListener("click", function() {
        const dropdown = this.closest('.dropdown');

        if (dropdown) {
            const dropdownContent = dropdown.querySelector('.dropdown-content');
            const chevronSvg = dropdown.querySelector('.lucide');

            if (dropdownContent) {
                dropdownContent.classList.toggle("hidden");
            }

            if (chevronSvg) {
                if (chevronSvg.classList.contains('lucide-chevron-down')) {
                    chevronSvg.classList.remove('lucide-chevron-down');
                    chevronSvg.classList.add('lucide-chevron-up');
                    chevronSvg.innerHTML = '<path d="m18 15-6-6-6 6"/>';
                } else {
                    chevronSvg.classList.remove('lucide-chevron-up');
                    chevronSvg.classList.add('lucide-chevron-down');
                    chevronSvg.innerHTML = '<path d="m6 9 6 6 6-6"/>';
                }
            }
        }
    });
});
}
export { openDropdown }