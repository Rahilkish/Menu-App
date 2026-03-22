// --- YOUR DATASET ---
const ingredients = [
    "Eggs", "Bread", "Milk", "Rice", "Chicken", "Onion", 
    "Tomato", "Potato", "Pasta", "Cheese", "Oil", "Butter", "Garlic"
];

const recipes = [
    { name: "Scrambled Eggs", ingredients: ["Eggs", "Butter", "Milk"], type: "breakfast" },
    { name: "French Toast", ingredients: ["Bread", "Eggs", "Milk", "Butter"], type: "breakfast" },
    { name: "Tomato Cheese Pasta", ingredients: ["Pasta", "Tomato", "Garlic", "Cheese", "Oil"], type: "lunch" },
    { name: "Fried Rice", ingredients: ["Rice", "Onion", "Garlic", "Oil", "Eggs"], type: "lunch" },
    { name: "Chicken Curry", ingredients: ["Chicken", "Onion", "Tomato", "Garlic", "Oil"], type: "dinner" },
    { name: "Mashed Potatoes", ingredients: ["Potato", "Butter", "Milk"], type: "dinner" }
];

// --- APP LOGIC ---
// 1. Load ingredients onto the screen
const ingredientContainer = document.getElementById('ingredient-list');
ingredients.forEach(ing => {
    const label = document.createElement('label');
    label.innerHTML = `<input type="checkbox" value="${ing}" class="ingredient-checkbox"> ${ing}`;
    ingredientContainer.appendChild(label);
});

// 2. Helper function to find what we can make
function getAvailableRecipes() {
    // Get checked ingredients
    const checkboxes = document.querySelectorAll('.ingredient-checkbox:checked');
    const selectedIngs = Array.from(checkboxes).map(cb => cb.value);

    // Get selected meal types
    const types = [];
    if(document.getElementById('toggle-breakfast').checked) types.push('breakfast');
    if(document.getElementById('toggle-lunch').checked) types.push('lunch');
    if(document.getElementById('toggle-dinner').checked) types.push('dinner');

    // Filter recipes
    return recipes.filter(recipe => {
        // Check if meal type is selected
        if (!types.includes(recipe.type)) return false;
        // Check if user has ALL required ingredients for this recipe
        return recipe.ingredients.every(neededIng => selectedIngs.includes(neededIng));
    });
}

// 3. Show all possible options
function showOptions() {
    const possibleRecipes = getAvailableRecipes();
    const resultsDiv = document.getElementById('results');
    
    if (possibleRecipes.length === 0) {
        resultsDiv.innerHTML = "<p>Not enough ingredients for a full recipe yet! Try selecting more.</p>";
        return;
    }

    let html = "<h3>You can make:</h3><ul>";
    possibleRecipes.forEach(r => {
        html += `<li><strong>${r.name}</strong> (${r.type})</li>`;
    });
    html += "</ul>";
    resultsDiv.innerHTML = html;
}

// 4. Decide for me (The Magic Button)
function decideForMe() {
    const possibleRecipes = getAvailableRecipes();
    const resultsDiv = document.getElementById('results');
    const plan = {};

    // Group available recipes by type
    const byType = { breakfast: [], lunch: [], dinner: [] };
    possibleRecipes.forEach(r => byType[r.type].push(r));

    let html = "<h3>Your Meal Plan:</h3>";
    let madePlan = false;

    // Pick a random recipe for each selected category
    ['breakfast', 'lunch', 'dinner'].forEach(type => {
        if (document.getElementById(`toggle-${type}`).checked) {
            if (byType[type].length > 0) {
                const randomRecipe = byType[type][Math.floor(Math.random() * byType[type].length)];
                html += `<p><strong>${type.toUpperCase()}:</strong> ${randomRecipe.name}</p>`;
                madePlan = true;
            } else {
                html += `<p><strong>${type.toUpperCase()}:</strong> <em>No recipes available with current ingredients.</em></p>`;
            }
        }
    });

    if (!madePlan) {
        resultsDiv.innerHTML = "<p>Please select more ingredients or check your meal toggles!</p>";
    } else {
        resultsDiv.innerHTML = html;
    }
}
