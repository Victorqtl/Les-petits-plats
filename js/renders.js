function renderRecipes(recipes) {
  const recipesContainer = document.getElementById('recipes-container')
  recipesContainer.innerHTML = recipes.map(recipe => 
    `
    <div class="recipe w-96 flex flex-col bg-white rounded-[20px]">
      <div class="relative">
        <img class="w-full h-64 object-cover rounded-t-[20px]" src="../photos/${recipe.image}" alt="Photo du plat"></img>
        <p class="absolute top-5 right-5 px-3.5 py-1.5 text-xs font-manrope bg-custom-yellow rounded-[20px]">${recipe.time}min</p>
      </div>
      <h2 class="mt-8 px-6 font-anton text-lg">${recipe.name}</h2>
      <div class="mt-7 px-6 pb-16 font-manrope">
        <div class="">
          <h3 class="mb-4 text-xs text-gray-500">RECETTE</h3>
          <p class="text-sm mb-8 line-clamp-4">${recipe.description}</p>
        </div>
        <div>
          <h3 class="mb-4 text-xs text-gray-500">INGRÉDIENTS</h3>
          ${recipe.ingredients.map(ingredient =>
            `
            <p>${ingredient.ingredient}</p>
            <p>${ingredient.quantity}</p>
            <p>${ingredient.unit}</p>
            `
          )}
        </div>
      </div>
    </div>
  `).join('')
  document.getElementById("counter").innerText = recipes.length + " recettes"
}
export { renderRecipes }