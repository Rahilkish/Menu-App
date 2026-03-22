// --- DATASET ---
const categorizedIngredients = {
    "Dairy & Eggs": ["Eggs", "Milk", "Cheese", "Butter"],
    "Pantry & Carbs": ["Bread", "Rice", "Pasta", "Oil"],
    "Produce": ["Onion", "Tomato", "Potato", "Garlic"],
    "Proteins": ["Chicken"]
};

const recipes = [
    { name: "Scrambled Eggs", ingredients: ["Eggs", "Butter", "Milk"], type: "breakfast" },
    { name: "French Toast", ingredients: ["Bread", "Eggs", "Milk", "Butter"], type: "breakfast" },
    { name: "Tomato Cheese Pasta", ingredients: ["Pasta", "Tomato", "Garlic", "Cheese", "Oil"], type: "lunch" },
    { name: "Fried Rice", ingredients: ["Rice", "Onion", "Garlic", "Oil", "Eggs"], type: "lunch" },
    { name: "Chicken Curry", ingredients: ["Chicken", "Onion", "Tomato", "Garlic", "Oil"], type: "dinner" },
    { name: "Mashed Potatoes", ingredients: ["Potato", "Butter", "Milk"], type: "dinner" }
];

// --- INITIALIZATION ---
// Load saved ingredients from local storage, or start empty
let savedIngredients = JSON.parse(localStorage.getItem('myPantry')) || [];

const categoryContainer = document.getElementById('ingredient-categories');

// Render ingredients by category
for (const [category, items] of Object.entries(categorizedIngredients)) {
    // Create Category Header
    const header = document.createElement('h3');
    header.textContent = category;
    categoryContainer.appendChild(header);

    // Create Grid for this category
    const grid = document.createElement('div');
    grid.className = 'grid';

    items.forEach(ing => {
        const label = document.createElement('label');
        label.className = 'ingredient-label';
        
        // Check if ingredient was previously saved
        const isChecked = savedIngredients.includes(ing) ? 'checked' : '';
        
        label.innerHTML = `<input type="checkbox" value="${ing}" class="ingredient-checkbox" ${isChecked} onchange="savePantry()"> <span class="ing-name">${ing}</span>`;
        grid.appendChild(label);
    });

    categoryContainer.appendChild(grid);
}

// --- NEW FEATURES LOGIC ---

// Save current selections to phone storage
function savePantry() {
    const checkboxes = document.querySelectorAll('.ingredient-checkbox:checked');
    const selectedIngs = Array.from(checkboxes).map(cb => cb.value);
    localStorage.setItem('myPantry', JSON.stringify(selectedIngs));
}

// Tab Switching logic
function switchTab(tabId) {
    // Hide all tabs
    document.getElementById('pantry-tab').style.display = 'none';
    document.getElementById('meals-tab').style.display = 'none';
    
    // Remove active class from buttons
    document.getElementById('btn-pantry').classList.remove('active');
    document.getElementById('btn-meals').classList.remove('active');

    // Show target tab and set button active
    document.getElementById(tabId).style.display = 'block';
    if (tabId === 'pantry-tab') document.getElementById('btn-pantry').classList.add('active');
    if (tabId === 'meals-tab') document.getElementById('btn-meals').classList.add('active');
}

// Search Filter
function filterIngredients() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const labels = document.querySelectorAll('.ingredient-label');

    labels.forEach(label => {
        const text = label.querySelector('.ing-name').textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            label.style.display = 'flex';
        } else {
            label.style.display = 'none';
        }
    });
}

// --- RECIPE LOGIC ---
function getAvailableRecipes() {
    // Always check what is currently ticked
    const checkboxes = document.querySelectorAll('.ingredient-checkbox:checked');
    const selectedIngs = Array.from(checkboxes).map(cb => cb.value);

    const types = [];
    if(document.getElementById('toggle-breakfast').checked) types.push('breakfast');
    if(document.getElementById('toggle-lunch').checked) types.push('lunch');
    if(document.getElementById('toggle-dinner').checked) types.push('dinner');

    return recipes.filter(recipe => {
        if (!types.includes(recipe.type)) return false;
        return recipe.ingredients.every(neededIng => selectedIngs.includes(neededIng));
    });
}

function showOptions() {
    const possibleRecipes = getAvailableRecipes();
    const resultsDiv = document.getElementById('results');
    
    if (possibleRecipes.length === 0) {
        resultsDiv.innerHTML = "<p>Not enough ingredients for a full recipe! Add more in the Pantry tab.</p>";
        return;
    }

    let html = "<h3>You can make:</h3><ul>";
    possibleRecipes.forEach(r => {
        html += `<li><strong>${r.name}</strong> (${r.type})</li>`;
    });
    html += "</ul>";
    resultsDiv.innerHTML = html;
}

function decideForMe() {
    const possibleRecipes = getAvailableRecipes();
    const resultsDiv = document.getElementById('results');
    const byType = { breakfast: [], lunch: [], dinner: [] };
    
    possibleRecipes.forEach(r => byType[r.type].push(r));

    let html = "<h3>Your Meal Plan:</h3>";
    let madePlan = false;

    ['breakfast', 'lunch', 'dinner'].forEach(type => {
        if (document.getElementById(`toggle-${type}`).checked) {
            if (byType[type].length > 0) {
                const randomRecipe = byType[type][Math.floor(Math.random() * byType[type].length)];
                html += `<p><strong>${type.toUpperCase()}:</strong> ${randomRecipe.name}</p>`;
                madePlan = true;
            } else {
                html += `<p><strong>${type.toUpperCase()}:</strong> <em>No recipes available.</em></p>`;
            }
        }
    });

    if (!madePlan) {
        resultsDiv.innerHTML = "<p>Please select more ingredients or check your meal toggles!</p>";
    } else {
        resultsDiv.innerHTML = html;
    }
}
