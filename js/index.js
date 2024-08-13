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
    currentRecipes = [...initialRecipes];
    renderRecipes(currentRecipes);
    updateDropdownsWithFilteredRecipes(initialRecipes, initialRecipes);
    deleteSearchBtn.classList.add('hidden');
    clearFilters();
})


const mainSearch = document.getElementById('main-search')
mainSearch.addEventListener('input', e => {
    const searchValue = e.target.value.toLowerCase();

    if (searchValue.length === 0) {
        currentRecipes = [...initialRecipes];
        renderRecipes(currentRecipes);
        updateDropdownsWithFilteredRecipes(initialRecipes, initialRecipes);
        deleteSearchBtn.classList.add('hidden');
        clearFilters()
        return
    }

    else if (searchValue.length >= 3) {
        currentRecipes = initialRecipes.filter(recipe => {
            return recipe.name.toLowerCase().includes(searchValue) ||
                recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchValue)) ||
                recipe.description.toLowerCase().includes(searchValue);
        });
        if (currentRecipes.length === 0) {
            const errorMessage = document.querySelector('.error-message');
            errorMessage.innerHTML = `Aucune recette ne contient '${searchValue}' vous pouvez chercher « tarte aux pommes », « poisson », etc.`

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
        deleteButtons.forEach(deleteButton => {
            deleteButton.classList.add('hidden')
        })
        filterContents.forEach(filterContent => {
            filterContent.classList.remove('bg-custom-yellow');
        })
    }
    activeIngredientFilters.clear()
    activeApplianceFilters.clear()
    activeUstensilFilters.clear()
    applyFilters(initialRecipes, initialRecipes);
}

async function init() {
    initialRecipes = await getRecipes()
    currentRecipes = [...initialRecipes];
    renderRecipes(currentRecipes);
    openDropdown();
    launchRenderDropdownElements(currentRecipes);
    searchDropdownFilter(currentRecipes, initialRecipes);
    addFilter(currentRecipes, initialRecipes);
    deleteFilter(currentRecipes, initialRecipes);
}

init();

