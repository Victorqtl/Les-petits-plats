import { renderRecipes } from './renders.js'
import { openDropdown, launchRenderDropdownElements, searchDropdownFilter, addFilter, deleteFilter, updateDropdownsWithFilteredRecipes } from './dropdown.js'

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
})

const mainSearch = document.getElementById('main-search')
mainSearch.addEventListener('input', e => {
    const searchValue = e.target.value.toLowerCase();

    if (searchValue.length === 0) {
        currentRecipes = [...initialRecipes];
        renderRecipes(currentRecipes);
        updateDropdownsWithFilteredRecipes(initialRecipes, initialRecipes);
        deleteSearchBtn.classList.add('hidden');
        return
    }

    else if (searchValue.length >= 3) {
        currentRecipes = initialRecipes.filter(recipe => {
            return recipe.name.toLowerCase().includes(searchValue) ||
                recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchValue));
        });
        
    }
    renderRecipes(currentRecipes);
    updateDropdownsWithFilteredRecipes(currentRecipes, currentRecipes);
    deleteSearchBtn.classList.remove('hidden');

});

async function init() {
    initialRecipes = await getRecipes()
    currentRecipes = [...initialRecipes];
    renderRecipes(currentRecipes);
    openDropdown();
    launchRenderDropdownElements(initialRecipes);
    searchDropdownFilter(currentRecipes, initialRecipes);
    addFilter(currentRecipes, initialRecipes);
    deleteFilter(currentRecipes, initialRecipes);
}
init();