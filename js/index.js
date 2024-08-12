import { renderRecipes } from './renders.js'
import { openDropdown, launchRenderDropdownElements, searchDropdownFilter, addFilter, deleteFilter, updateDropdownsWithFilteredRecipes, applyFilters, activeIngredientFilters, activeApplianceFilters, activeUstensilFilters } from './dropdown.js'

let currentRecipes
let initialRecipes

async function getRecipes() {
    const response = await fetch('./api/recipes.json')
    const recipes = await response.json()
    return recipes
}

const deleteSearchBtn = document.querySelector('.delete-search-btn');
deleteSearchBtn.addEventListener('click', () => {
    mainSearch.value = ''
    currentRecipes = initialRecipes.slice();
    renderRecipes(currentRecipes);
    updateDropdownsWithFilteredRecipes(initialRecipes, initialRecipes);
    deleteSearchBtn.classList.add('hidden');
    clearFilters();
})

const mainSearch = document.getElementById('main-search')
mainSearch.addEventListener('input', e => {
    const searchValue = e.target.value.toLowerCase();

    if (searchValue.length === 0) {
        currentRecipes = initialRecipes.slice();
        renderRecipes(currentRecipes);
        updateDropdownsWithFilteredRecipes(initialRecipes, initialRecipes);
        deleteSearchBtn.classList.add('hidden');
        clearFilters();
        return;
    }

    else if (searchValue.length >= 3) {
        const filteredRecipes = [];
        for (let i = 0; i < initialRecipes.length; i++) {
            const recipe = initialRecipes[i];
            if (recipe.name.toLowerCase().includes(searchValue) || 
                recipe.description.toLowerCase().includes(searchValue)) {
                filteredRecipes.push(recipe);
            } else {
                for (let j = 0; j < recipe.ingredients.length; j++) {
                    const ingredient = recipe.ingredients[j];
                    if (ingredient.ingredient.toLowerCase().includes(searchValue)) {
                        filteredRecipes.push(recipe);
                        break;
                    }
                }
            }
        }
        currentRecipes = filteredRecipes;
        if (currentRecipes.length === 0) {
            const errorMessage = document.querySelector('.error-message');
            errorMessage.innerHTML = 'Aucun résultat';
        }
        renderRecipes(currentRecipes);
        updateDropdownsWithFilteredRecipes(currentRecipes, currentRecipes);
        deleteSearchBtn.classList.remove('hidden');
    }
});

// Supprimer les filtres à la suppression de la recherche principale 
function clearFilters() {
    const currentFilterContainer = document.querySelector('.current-filter');
    const filterContents = document.querySelectorAll('.filter-content');
    const deleteButtons = document.querySelectorAll('.delete-filter');
    if (currentFilterContainer) {
        currentFilterContainer.innerHTML = '';
        for (let i = 0; i < deleteButtons.length; i++) {
            deleteButtons[i].classList.add('hidden');
        }
        for (let i = 0; i < filterContents.length; i++) {
            filterContents[i].classList.remove('bg-custom-yellow');
        }
    }
    activeIngredientFilters.clear()
    activeApplianceFilters.clear()
    activeUstensilFilters.clear()
    applyFilters(initialRecipes, initialRecipes);
}

async function init() {
    initialRecipes = await getRecipes()
    currentRecipes = initialRecipes.slice();
    renderRecipes(currentRecipes);
    openDropdown();
    launchRenderDropdownElements(initialRecipes);
    searchDropdownFilter(currentRecipes, initialRecipes);
    addFilter(currentRecipes, initialRecipes);
    deleteFilter(currentRecipes, initialRecipes);
}

init();