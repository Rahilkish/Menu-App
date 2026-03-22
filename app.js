// --- INDIAN KITCHEN DATASET ---
const categorizedIngredients = {
    "Spices & Tadka (Masala)": [
        "Salt", "Turmeric (Haldi)", "Red Chilli Powder", "Cumin Seeds (Jeera)", 
        "Mustard Seeds (Rai)", "Garam Masala", "Curry Leaves"
    ],
    "Vegetables (Sabzi)": [
        "Onion", "Tomato", "Potato", "Green Chillies", "Garlic", 
        "Ginger", "Spinach (Palak)", "Cauliflower", "Coriander Leaves"
    ],
    "Lentils & Grains (Dal/Atta)": [
        "Basmati Rice", "Toor Dal", "Moong Dal", "Wheat Flour (Atta)", "Poha"
    ],
    "Dairy, Oil & Protein": [
        "Cooking Oil", "Ghee", "Milk", "Eggs", "Paneer", "Chicken"
    ]
};

const recipes = [
    // Breakfast
    { name: "Kanda Batata Poha", ingredients: ["Poha", "Onion", "Potato", "Mustard Seeds (Rai)", "Turmeric (Haldi)", "Curry Leaves", "Cooking Oil", "Green Chillies", "Salt"], type: "breakfast" },
    { name: "Egg Bhurji", ingredients: ["Eggs", "Onion", "Tomato", "Green Chillies", "Turmeric (Haldi)", "Cooking Oil", "Salt"], type: "breakfast" },
    { name: "Masala Oats/Upma (if added)", ingredients: ["Onion", "Tomato", "Green Chillies", "Cooking Oil", "Salt"], type: "breakfast" }, 
    
    // Lunch
    { name: "Dal Tadka & Rice", ingredients: ["Toor Dal", "Basmati Rice", "Onion", "Tomato", "Garlic", "Cumin Seeds (Jeera)", "Turmeric (Haldi)", "Ghee", "Salt"], type: "lunch" },
    { name: "Aloo Gobi Sabzi", ingredients: ["Potato", "Cauliflower", "Onion", "Tomato", "Turmeric (Haldi)", "Garam Masala", "Cooking Oil", "Salt"], type: "lunch" },
    { name: "Lemon/Jeera Rice", ingredients: ["Basmati Rice", "Cumin Seeds (Jeera)", "Mustard Seeds (Rai)", "Curry Leaves", "Cooking Oil", "Salt"], type: "lunch" },

    // Dinner
    { name: "Simple Chicken Curry", ingredients: ["Chicken", "Onion", "Tomato", "Garlic", "Ginger", "Garam Masala", "Red Chilli Powder", "Cooking Oil", "Salt"], type: "dinner" },
    { name: "Palak Paneer", ingredients: ["Spinach (Palak)", "Paneer", "Onion", "Tomato", "Garlic", "Garam Masala", "Ghee", "Salt"], type: "dinner" },
    { name: "Chicken Biryani", ingredients: ["Chicken", "Basmati Rice", "Onion", "Garlic", "Ginger", "Garam Masala", "Ghee", "Salt"], type: "dinner" },
    { name: "Moong Dal & Roti", ingredients: ["Moong Dal", "Wheat Flour (Atta)", "Garlic", "Cumin Seeds (Jeera)", "Ghee", "Salt"], type: "dinner" }
];

// --- INITIALIZATION ---
let savedIngredients = JSON.parse(localStorage.getItem('myIndianPantry')) || [];
const categoryContainer = document.getElementById('ingredient-categories');

for (const [category, items] of Object.entries(categorizedIngredients)) {
    const section = document.createElement('div');
    section.className = 'category-section';
    
    const header = document.createElement('h3');
    header.textContent = category;
    section.appendChild(header);

    const grid = document.createElement('div');
    grid.className = 'grid';

    items.forEach(ing => {
        const label = document.createElement('label');
        label.className = 'ingredient-label';
        const isChecked = savedIngredients.includes(ing) ? 'checked' : '';
        label.innerHTML = `<input type="checkbox" value="${ing}" class="ingredient-checkbox" ${isChecked} onchange="savePantry()"> <span class="ing-name">${ing}</span>`;
        grid.appendChild(label);
    });

    section.appendChild(grid);
    categoryContainer.appendChild(section);
}

// --- LOGIC ---
function savePantry() {
    const checkboxes = document.querySelectorAll('.ingredient-checkbox:checked');
    const selectedIngs = Array.from(checkboxes).map(cb => cb.value);
    localStorage.setItem('myIndianPantry', JSON.stringify(selectedIngs));
}

function switchTab(tabId) {
    document.getElementById('pantry-tab').style.display = 'none';
    document.getElementById('meals-tab').style.display = 'none';
    document.getElementById('btn-pantry').classList.remove('active');
    document.getElementById('btn-meals').classList.remove('active');

    document.getElementById(tabId).style.display = 'block';
    if (tabId === 'pantry-tab') document.getElementById('btn-pantry').classList.add('active');
    if (tabId === 'meals-tab') document.getElementById('btn-meals').classList.add('active');
}

function filterIngredients() {
    const searchTerm = document.getElementById('search-bar').value.toLowerCase();
    const labels = document.querySelectorAll('.ingredient-label');

    labels.forEach(label => {
        const text = label.querySelector('.ing-name').textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            label.style.display = 'inline-flex';
        } else {
            label.style.display = 'none';
        }
    });
}

function getAvailableRecipes() {
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
        resultsDiv.innerHTML = "<p class='empty-state'>Not enough ingredients for a full recipe! Add basics like Oil, Salt, and Onion first.</p>";
        return;
    }

    let html = "<h3>You can make:</h3><ul>";
    possibleRecipes.forEach(r => {
        html += `<li><strong>${r.name}</strong> <span style="color:var(--text-muted); font-size:12px;">(${r.type})</span></li>`;
    });
    html += "</ul>";
    resultsDiv.innerHTML = html;
}

function decideForMe() {
    const possibleRecipes = getAvailableRecipes();
    const resultsDiv = document.getElementById('results');
    const byType = { breakfast: [], lunch: [], dinner: [] };
    
    possibleRecipes.forEach(r => byType[r.type].push(r));

    let html = "";
    let madePlan = false;

    ['breakfast', 'lunch', 'dinner'].forEach(type => {
        if (document.getElementById(`toggle-${type}`).checked) {
            if (byType[type].length > 0) {
                const randomRecipe = byType[type][Math.floor(Math.random() * byType[type].length)];
                html += `
                <div class="meal-plan-item">
                    <span class="meal-label">${type}</span>
                    <p class="meal-dish">${randomRecipe.name}</p>
                </div>`;
                madePlan = true;
            } else {
                html += `
                <div class="meal-plan-item">
                    <span class="meal-label">${type}</span>
                    <p class="meal-dish" style="color: var(--text-muted); font-weight: normal;">No recipe available</p>
                </div>`;
            }
        }
    });

    if (!madePlan) {
        resultsDiv.innerHTML = "<p class='empty-state'>Please select more ingredients or check your meal toggles!</p>";
    } else {
        resultsDiv.innerHTML = html;
    }
}
