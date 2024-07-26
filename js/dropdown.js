function openDropdown() {
    const dropdownBtn = document.querySelectorAll('.dropdown-btn');

    dropdownBtn.forEach(btn => {
        btn.addEventListener('click', function () {
            const dropdown = this.closest('.dropdown');

            if (dropdown) {
                const dropdownContent = dropdown.querySelector('.dropdown-content');
                const chevronSvg = dropdown.querySelector('.lucide-chevron');

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

function launchRenderDropdownElements(recipes) {
    const ingredientsDropdown = document.querySelector(".dropdown-ingredients");
    const appliancesDropdown = document.querySelector(".dropdown-appliances");
    const ustensilsDropdown = document.querySelector(".dropdown-ustensils");

    renderDropdownElements(ingredientsDropdown, recipes);
    renderDropdownElements(appliancesDropdown, recipes);
    renderDropdownElements(ustensilsDropdown, recipes);
}

function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

function renderDropdownElements(dropdown, recipes) {
    const filterContainer = dropdown.querySelector(".filter-container");
    const dropdownType = dropdown.dataset.type;

    const filterSet = new Set();

    recipes.forEach(recipe => {
        if (dropdownType === "ingredients") {
            recipe.ingredients.forEach(ingredient => {
                filterSet.add(capitalizeFirstLetter(ingredient.ingredient));
            });
        } else if (dropdownType === "appliances") {
            filterSet.add(capitalizeFirstLetter(recipe.appliance));
        } else if (dropdownType === "ustensils") {
            recipe.ustensils.forEach(ustensil => {
                filterSet.add(capitalizeFirstLetter(ustensil));
            });
        }
    });

    filterContainer.innerHTML = [...filterSet].map(item => {
        return `
            <div class="filter-content flex justify-between items-center py-2 px-4 cursor-pointer hover:bg-custom-yellow">
                <p class ="filter-element" data-item="${item}">${item}</p>
                <button class="delete-filter hidden"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> </button>
            </div>
            `;
    }).join('');
}


function searchDropdownFilter(recipes) {
    const dropdownSearchInputs = document.querySelectorAll(".dropdown-search-input");

    dropdownSearchInputs.forEach(function (dropdownSearchInput) {
        dropdownSearchInput.addEventListener('input', function (e) {
            const dropdown = this.closest('.dropdown');
            const searchValue = e.target.value.toLowerCase();
            if (dropdown) {
                const deleteSearchBtn = dropdown.querySelector('.dropdown-delete-search-btn');

                if (searchValue.length === 0) {
                    renderDropdownElements(dropdown, recipes);
                    deleteSearchBtn.classList.add('hidden');
                    addFilter();
                    deleteFilter()
                    reapplyActiveFilters();
                    return;
                }

                deleteSearchBtn.classList.remove('hidden');
                deleteSearchDropdown(recipes);

                const filteredItems = new Set();
                recipes.forEach(recipe => {
                    if (dropdown.dataset.type === "ingredients") {
                        recipe.ingredients.forEach(ingredient => {
                            if (ingredient.ingredient.toLowerCase().includes(searchValue)) {
                                filteredItems.add(capitalizeFirstLetter(ingredient.ingredient));
                            }
                        });
                    } else if (dropdown.dataset.type === "appliances") {
                        if (recipe.appliance.toLowerCase().includes(searchValue)) {
                            filteredItems.add(capitalizeFirstLetter(recipe.appliance));
                        }
                    } else if (dropdown.dataset.type === "ustensils") {
                        recipe.ustensils.forEach(ustensil => {
                            if (ustensil.toLowerCase().includes(searchValue)) {
                                filteredItems.add(capitalizeFirstLetter(ustensil));
                            }
                        });
                    }
                });

                const filterContainer = dropdown.querySelector(".filter-container");
                filterContainer.innerHTML = [...filteredItems].map(item => {
                    return `
                        <div class="filter-content flex justify-between items-center py-2 px-4 cursor-pointer hover:bg-custom-yellow">
                            <p class="filter-element" data-item="${item}">${item}</p>
                            <button class="delete-filter hidden"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg> </button>
                        </div>
                    `;
                }).join('');

                addFilter();
                deleteFilter()
                reapplyActiveFilters();
            }
        });
    });
}

function deleteSearchDropdown(recipes) {
    const dropdownDeleteSearchBtns = document.querySelectorAll(".dropdown-delete-search-btn");
    dropdownDeleteSearchBtns.forEach(function (dropdownDeleteSearchBtn) {
        dropdownDeleteSearchBtn.addEventListener('click', function () {
            const dropdown = this.closest('.dropdown');
            const searchInput = dropdown.querySelector('.dropdown-search-input');
            if (searchInput) {
                searchInput.value = '';
                renderDropdownElements(dropdown, recipes);
                dropdownDeleteSearchBtn.classList.add('hidden');

                addFilter();
                deleteFilter()
                reapplyActiveFilters();
            }
        });
    });
}

const activeFilters = new Set();

function addFilter() {
    const filterContent = document.querySelectorAll('.filter-content');

    filterContent.forEach(element => {
        element.addEventListener('click', (event) => {
            const targetElement = event.currentTarget;
            const deleteFilter = targetElement.querySelector('.delete-filter');
            const item = targetElement.querySelector('.filter-element').dataset.item;
            const dropdown = event.currentTarget.closest('.dropdown');
            if(dropdown){
            const chevronSvg = dropdown.querySelector('.lucide-chevron')
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
            
            activeFilters.add(item);

            element.classList.add('bg-custom-yellow');
            deleteFilter.classList.remove('hidden');
            element.closest('.dropdown-content').classList.add('hidden');

                

           

            const container = document.createElement('div');
            container.className = 'tag w-52 p-4 flex items-center justify-between bg-custom-yellow rounded-xl';

            const paragraph = document.createElement('p');
            paragraph.textContent = item;

            const button = document.createElement('button');
            button.className = 'delete-filter';
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
            button.addEventListener('click', (e) => {
                e.target.closest('.tag').remove();
                deleteFilter.classList.add('hidden');
                element.classList.remove('bg-custom-yellow');
                activeFilters.delete(item);
            });

            container.appendChild(paragraph);
            container.appendChild(button);

            const currentFilter = document.querySelector('.current-filter');
            currentFilter.appendChild(container);
        });
    });
}

function reapplyActiveFilters() {
    const filterContent = document.querySelectorAll('.filter-content');
    filterContent.forEach(element => {
        const item = element.querySelector('.filter-element').dataset.item;
        if (activeFilters.has(item)) {
            element.classList.add('bg-custom-yellow');
            const deleteFilter = element.querySelector('.delete-filter');
            if (deleteFilter) {
                deleteFilter.classList.remove('hidden');
            }
        }
    });
}

function deleteFilter() {
    const filterContents = document.querySelectorAll('.filter-content');
    filterContents.forEach(filterContent => {
        const item = filterContent.querySelector('.filter-element').dataset.item;
        const deleteButton = filterContent.querySelector('.delete-filter');
        if (deleteButton) {
            deleteButton.addEventListener('click', (event) => {
                deleteButton.classList.add('hidden');
                event.stopPropagation();
                
                const tag = document.querySelector('.tag');
                tag.remove()

                activeFilters.delete(item);

                filterContent.classList.remove('bg-custom-yellow');
            });
        }
    });
}

export { openDropdown, launchRenderDropdownElements, searchDropdownFilter, addFilter, deleteFilter }