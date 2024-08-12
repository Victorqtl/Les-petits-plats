import { renderRecipes } from './renders.js';

// Ouverture de la dropdown
function openDropdown() {
    const dropdownBtn = document.querySelectorAll('.dropdown-btn');

    dropdownBtn.forEach(btn => {
        btn.addEventListener('click', function () {
            // .closest pour sélectionner la dropdown concerné par le click
            const dropdown = this.closest('.dropdown');

            if (dropdown) {
                const dropdownContent = dropdown.querySelector('.dropdown-content');
                const chevronSvg = dropdown.querySelector('.lucide-chevron');

                if (dropdownContent) {
                    dropdownContent.classList.toggle('hidden');
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

// Affiche les éléments dans la dropdown
function launchRenderDropdownElements(recipes) {
    renderDropdownElements(document.querySelector('.dropdown-ingredients'), recipes);
    renderDropdownElements(document.querySelector('.dropdown-appliances'), recipes);
    renderDropdownElements(document.querySelector('.dropdown-ustensils'), recipes);
}

// Affiches les nouveaux éléments filtrer par la recherche dans la dropdown
function updateDropdownsWithFilteredRecipes(filteredRecipes, initialRecipes) {
    renderDropdownElements(document.querySelector('.dropdown-ingredients'), filteredRecipes);
    renderDropdownElements(document.querySelector('.dropdown-appliances'), filteredRecipes);
    renderDropdownElements(document.querySelector('.dropdown-ustensils'), filteredRecipes);

    addFilter(filteredRecipes, initialRecipes);
    deleteFilter(filteredRecipes, initialRecipes);
    reapplyActiveFilters();
    searchDropdownFilter(filteredRecipes, initialRecipes);
}

// Fonction pour afficher les élements avec première lettre en masjuscule et le reste en minuscule
function capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}

// Tri chaque éléments dans la dropdown correspondante grâce à dataset
function renderDropdownElements(dropdown, recipes) {
    const filterContainer = dropdown.querySelector('.filter-container');

    // Set() pour 
    const filterSet = new Set(); // Méthode set pour créer un objet qui n'a que des valeurs uniques et éviter les doublons dans les ingredients

    recipes.forEach(recipe => {
        if (dropdown.dataset.type === 'ingredients') {
            recipe.ingredients.forEach(ingredient => {
                filterSet.add(capitalizeFirstLetter(ingredient.ingredient));
            });
        } else if (dropdown.dataset.type === 'appliances') {
            filterSet.add(capitalizeFirstLetter(recipe.appliance));
        } else if (dropdown.dataset.type === 'ustensils') {
            recipe.ustensils.forEach(ustensil => {
                filterSet.add(capitalizeFirstLetter(ustensil));
            });
        }
    });

    // Transforme les éléments en chaîne de caractère pour les afficher dans la dropdown
    filterContainer.innerHTML = [...filterSet].map(item => {
        return `
            <div class='filter-content flex justify-between items-center py-2 px-4 cursor-pointer hover:bg-custom-yellow'>
                <p class='filter-element' data-item='${item}'>${item}</p>
                <button class='delete-filter hidden'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-x'><path d='M18 6 6 18'/><path d='m6 6 12 12'/></svg> </button>
            </div>
            `;
    }).join('');
}

// Permet d'effectuer une recherche dans la dropdown
function searchDropdownFilter(currentRecipes, initialRecipes) {
    const dropdownSearchInputs = document.querySelectorAll('.dropdown-search-input');

    dropdownSearchInputs.forEach(function (dropdownSearchInput) {
        dropdownSearchInput.addEventListener('input', function (e) {
            // .closest pour savoir dans quelle dropdown on se situe
            const dropdown = this.closest('.dropdown');
            const searchValue = e.target.value.toLowerCase();
            if (dropdown) {
                const deleteSearchBtn = dropdown.querySelector('.dropdown-delete-search-btn');

                if (searchValue.length === 0) {
                    renderDropdownElements(dropdown, currentRecipes);
                    deleteSearchBtn.classList.add('hidden');
                    addFilter(currentRecipes, initialRecipes);
                    deleteFilter(currentRecipes, initialRecipes)
                    reapplyActiveFilters();
                    return;
                }

                deleteSearchBtn.classList.remove('hidden');

                const filteredItems = new Set();
                currentRecipes.forEach(recipe => {
                    if (dropdown.dataset.type === 'ingredients') {
                        recipe.ingredients.forEach(ingredient => {
                            if (ingredient.ingredient.toLowerCase().includes(searchValue)) {
                                filteredItems.add(capitalizeFirstLetter(ingredient.ingredient));
                            }
                        });
                    } else if (dropdown.dataset.type === 'appliances') {
                        if (recipe.appliance.toLowerCase().includes(searchValue)) {
                            filteredItems.add(capitalizeFirstLetter(recipe.appliance));
                        }
                    } else if (dropdown.dataset.type === 'ustensils') {
                        recipe.ustensils.forEach(ustensil => {
                            if (ustensil.toLowerCase().includes(searchValue)) {
                                filteredItems.add(capitalizeFirstLetter(ustensil));
                            }
                        });
                    }
                });

                const filterContainer = dropdown.querySelector('.filter-container');
                filterContainer.innerHTML = [...filteredItems].map(item => {
                    return `
                    <div class='filter-content flex justify-between items-center py-2 px-4 cursor-pointer hover:bg-custom-yellow'>
                    <p class='filter-element' data-item='${item}'>${item}</p>
                    <button class='delete-filter hidden'><svg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round' class='lucide lucide-x'><path d='M18 6 6 18'/><path d='m6 6 12 12'/></svg> </button>
                    </div>
                    `;
                }).join('');

                deleteSearchDropdown(currentRecipes, initialRecipes);
                addFilter(currentRecipes, initialRecipes);
                deleteFilter(currentRecipes, initialRecipes);
                reapplyActiveFilters();
            }
        });
    });
}

// Bouton pour supprimer la recherche dans l'input de la dropdown
function deleteSearchDropdown(currentRecipes, initialRecipes) {
    const dropdownDeleteSearchBtns = document.querySelectorAll('.dropdown-delete-search-btn');
    dropdownDeleteSearchBtns.forEach(function (dropdownDeleteSearchBtn) {
        dropdownDeleteSearchBtn.addEventListener('click', function () {
            const dropdown = this.closest('.dropdown');
            const searchInput = dropdown.querySelector('.dropdown-search-input');
            if (searchInput) {
                searchInput.value = '';
                renderDropdownElements(dropdown, currentRecipes);
                dropdownDeleteSearchBtn.classList.add('hidden');

                addFilter(currentRecipes, initialRecipes);
                deleteFilter(currentRecipes, initialRecipes)
                reapplyActiveFilters();
            }
        });
    });
}

const activeIngredientFilters = new Set();
const activeApplianceFilters = new Set();
const activeUstensilFilters = new Set();

// Ajoute l'élément sous forme de tag sous la dropdown 
function addFilter(currentRecipes, initialRecipes) {
    const filterContent = document.querySelectorAll('.filter-content');

    filterContent.forEach(element => {
        element.addEventListener('click', (event) => {
            const targetElement = event.currentTarget;
            const deleteFilter = targetElement.querySelector('.delete-filter');
            const item = targetElement.querySelector('.filter-element').dataset.item;

            const dropdown = event.currentTarget.closest('.dropdown');
            if (dropdown) {
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
                // Ajoute l'élément en fonction de son type à une liste active
                const dataType = dropdown.getAttribute('data-type')
                switch (dataType) {
                    case 'ingredients':
                        activeIngredientFilters.add(item.toLowerCase());
                        break;
                    case 'appliances':
                        activeApplianceFilters.add(item.toLowerCase())
                        break;
                    case 'ustensils':
                        activeUstensilFilters.add(item.toLowerCase())
                        break;
                }
            }

            element.classList.add('bg-custom-yellow');
            // Ferme la dropdown au click d'un élément
            element.closest('.dropdown-content').classList.add('hidden');

            deleteFilter.classList.remove('hidden');

            // Reset l'input en cas de recherche
            const dropdownSearchInputs = document.querySelectorAll('.dropdown-search-input');
            dropdownSearchInputs.forEach(input => {
                input.value = '';
            })

            const dropdownDeleteSearchBtns = document.querySelectorAll('.dropdown-delete-search-btn');
            dropdownDeleteSearchBtns.forEach(btn => {
                btn.classList.add('hidden');
            })

            // Applique le style des tags
            const container = document.createElement('div');
            container.className = 'tag w-52 p-4 flex items-center justify-between bg-custom-yellow rounded-xl';

            const paragraph = document.createElement('p');
            paragraph.textContent = item;

            // Supprime l'élément depuis le taf
            const button = document.createElement('button');
            button.className = 'delete-filter';
            button.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-x"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>';
            button.addEventListener('click', (event) => {
                event.target.closest('.tag').remove();
                deleteFilter.classList.add('hidden');
                element.classList.remove('bg-custom-yellow');

                // Supprime l'élément de la liste active
                if (activeIngredientFilters.has(item.toLowerCase())) {
                    activeIngredientFilters.delete(item.toLowerCase());
                }
                else if (activeApplianceFilters.has(item.toLowerCase())) {
                    activeApplianceFilters.delete(item.toLowerCase());
                }
                else if (activeUstensilFilters.has(item.toLowerCase())) {
                    activeUstensilFilters.delete(item.toLowerCase());
                }

                applyFilters(currentRecipes, initialRecipes);
                updateDropdownsWithFilteredRecipes(initialRecipes, initialRecipes);
            });

            container.appendChild(paragraph);
            container.appendChild(button);

            const currentFilter = document.querySelector('.current-filter');
            currentFilter.appendChild(container);

            applyFilters(currentRecipes, initialRecipes);

        });
    });
}

// Maintient le style sur les filtres sélectionnés dans la dropdown 
function reapplyActiveFilters() {
    const filterContent = document.querySelectorAll('.filter-content');
    filterContent.forEach(element => {
        const item = element.querySelector('.filter-element').dataset.item;
        // Vérifie si l'élément est dans une liste active avec .has
        if (activeIngredientFilters.has(item.toLowerCase()) || activeApplianceFilters.has(item.toLowerCase()) || activeUstensilFilters.has(item.toLowerCase())) {
            element.classList.add('bg-custom-yellow');

            const deleteFilter = element.querySelector('.delete-filter');
            if (deleteFilter) {
                deleteFilter.classList.remove('hidden');
            }
        }
    });
}

// Supprime le tag depuis l'élément dans la dropdown
function deleteFilter(currentRecipes, initialRecipes) {
    const filterContent = document.querySelectorAll('.filter-content');
    filterContent.forEach(filterContent => {
        const item = filterContent.querySelector('.filter-element').dataset.item;
        const deleteButton = filterContent.querySelector('.delete-filter');
        if (deleteButton) {
            deleteButton.addEventListener('click', (event) => {
                deleteButton.classList.add('hidden');
                event.stopPropagation();
                filterContent.classList.remove('bg-custom-yellow');

                const tags = document.querySelectorAll('.tag');
                tags.forEach(tag => {
                    const tagContent = tag.querySelector('p').textContent;
                    // Vérifie si le tag correspond à l'item de la dropdown
                    if (tagContent === item) {
                        tag.remove();
                    }
                });

                // Supprime l'élément de la liste active
                if (activeIngredientFilters.has(item.toLowerCase())) {
                    activeIngredientFilters.delete(item.toLowerCase());
                }
                else if (activeApplianceFilters.has(item.toLowerCase())) {
                    activeApplianceFilters.delete(item.toLowerCase());
                }
                else if (activeUstensilFilters.has(item.toLowerCase())) {
                    activeUstensilFilters.delete(item.toLowerCase());
                }

                applyFilters(currentRecipes, initialRecipes);
                updateDropdownsWithFilteredRecipes(initialRecipes, initialRecipes);
            });
        }
    });
}

// Affiche les nouvelles recettes correspondantes aux filtres ajoutés dans les listes active
function applyFilters(currentRecipes, initialRecipes) {
    currentRecipes = initialRecipes.filter(recipe => {
        // Transforme les objets Set en tableaux pour appliquer les méthodes .every 
        // Pour chaque éléments dans la liste active, compare l'éléments à celui de la recette
        const hasActiveIngredient = Array.from(activeIngredientFilters).every(activeIngredient =>
            recipe.ingredients.some(ingredient =>
                ingredient.ingredient.toLowerCase() === activeIngredient
            )
        );
        const hasActiveAppliance = Array.from(activeApplianceFilters).every(activeAppliance =>
            recipe.appliance.toLowerCase() === activeAppliance
        );
        const hasActiveUstensil = Array.from(activeUstensilFilters).every(activeUstensil =>
            recipe.ustensils.some(ustensil =>
                ustensil.toLowerCase() === activeUstensil
            )
        );

        return hasActiveIngredient && hasActiveAppliance && hasActiveUstensil;
    });

    // Applique les nouvelles recettes et dropdown filtrées
    renderRecipes(currentRecipes);
    updateDropdownsWithFilteredRecipes(currentRecipes, initialRecipes);
}

export { openDropdown, launchRenderDropdownElements, searchDropdownFilter, addFilter, deleteFilter, updateDropdownsWithFilteredRecipes, applyFilters, activeIngredientFilters, activeApplianceFilters, activeUstensilFilters }