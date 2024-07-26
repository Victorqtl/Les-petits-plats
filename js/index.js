import { renderRecipes } from './renders.js'
import { openDropdown, launchRenderDropdownElements, searchDropdownFilter, addFilter, deleteFilter } from './dropdown.js'

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
    currentRecipes = [...initialRecipes]
    renderRecipes(currentRecipes)
    deleteSearchBtn.classList.add('hidden');
})

const mainSearch = document.getElementById('main-search')
mainSearch.addEventListener('input', e => {
    const searchValue = e.target.value.toLowerCase();
    
    if (searchValue.length === 0) {
        currentRecipes = [...initialRecipes];
        renderRecipes(currentRecipes);
        deleteSearchBtn.classList.add('hidden');
        return
    }
    
    else if (searchValue.length >= 3){
    currentRecipes = initialRecipes.filter(recipe => {
        return recipe.name.toLowerCase().includes(searchValue) ||
        recipe.ingredients.some(ingredient => ingredient.ingredient.toLowerCase().includes(searchValue));
    });
    }
    renderRecipes(currentRecipes);
    deleteSearchBtn.classList.remove('hidden');
    
});

async function init() {
    initialRecipes = await getRecipes()
    currentRecipes = [...initialRecipes];
    renderRecipes(currentRecipes);
    openDropdown();
    launchRenderDropdownElements(currentRecipes);
    searchDropdownFilter(currentRecipes);
    addFilter();
    deleteFilter();
}
init();