// --- DATASET ---
const categorizedIngredients = {
    "Spices & Tadka (Masala)": ["Salt", "Turmeric (Haldi)", "Red Chilli Powder", "Cumin Seeds (Jeera)", "Mustard Seeds (Rai)", "Garam Masala", "Curry Leaves"],
    "Vegetables (Sabzi)": ["Onion", "Tomato", "Potato", "Green Chillies", "Garlic", "Ginger", "Spinach (Palak)", "Cauliflower", "Coriander Leaves"],
    "Lentils & Grains (Dal/Atta)": ["Basmati Rice", "Toor Dal", "Moong Dal", "Wheat Flour (Atta)", "Poha"],
    "Dairy, Oil & Protein": ["Cooking Oil", "Ghee", "Milk", "Eggs", "Paneer", "Chicken"]
};

const recipes = [
    { name: "Kanda Batata Poha", ingredients: ["Poha", "Onion", "Potato", "Mustard Seeds (Rai)", "Turmeric (Haldi)", "Curry Leaves", "Cooking Oil", "Green Chillies", "Salt"], type: "breakfast" },
    { name: "Egg Bhurji", ingredients: ["Eggs", "Onion", "Tomato", "Green Chillies", "Turmeric (Haldi)", "Cooking Oil", "Salt"], type: "breakfast" },
    { name: "Dal Tadka & Rice", ingredients: ["Toor Dal", "Basmati Rice", "Onion", "Tomato", "Garlic", "Cumin Seeds (Jeera)", "Turmeric (Haldi)", "Ghee", "Salt"], type: "lunch" },
    { name: "Aloo Gobi Sabzi", ingredients: ["Potato", "Cauliflower", "Onion", "Tomato", "Turmeric (Haldi)", "Garam Masala", "Cooking Oil", "Salt"], type: "lunch" },
    { name: "Simple Chicken Curry", ingredients: ["Chicken", "Onion", "Tomato", "Garlic", "Ginger", "Garam Masala", "Red Chilli Powder", "Cooking Oil", "Salt"], type: "dinner" },
    { name: "Palak Paneer", ingredients: ["Spinach (Palak)", "Paneer", "Onion", "Tomato", "Garlic", "Garam Masala", "Ghee", "Salt"], type: "dinner" }
];

let savedIngredients = JSON.parse(localStorage.getItem('myIndianPantry')) || [];
const categoryContainer = document.getElementById('ingredient-categories');

// Helper to check if an ingredient is Non-Veg (for the Zomato dot)
function isVeg(ing) {
    return !["Chicken", "Eggs"].includes(ing);
}

// Render Zomato Style Menu
for (const [category, items] of Object.entries(categorizedIngredients)) {
    const section = document.createElement('div');
    section.className = 'category-section';
    section.innerHTML = `<h3>${category}</h3>`;

    items.forEach(ing => {
        const isAdded = savedIngredients.includes(ing);
        const vegClass = isVeg(ing) ? 'veg' : 'non-veg';
        const btnText = isAdded ? 'ADDED' : 'ADD';
        const btnClass = isAdded ? 'add-btn added' : 'add-btn';

        const itemDiv = document.createElement('div');
        itemDiv.className = 'menu-item';
        
        // Zomato Style HTML Structure
        itemDiv.innerHTML = `
            <div class="item-info">
                <div class="veg-mark ${vegClass}"></div>
                <h4 class="item-name">${ing}</h4>
            </div>
            <div class="item-image-box">
                <div class="img-placeholder">📸</div>
                <button class="${btnClass}" onclick="toggleIngredient('${ing}', this)">${btnText}</button>
            </div>
        `;
        section.appendChild(itemDiv);
    });
    categoryContainer.appendChild(section);
}

// --- LOGIC ---
function toggleIngredient(ingredient, buttonElement) {
    // Check if it's already in our saved array
    const index = savedIngredients.indexOf(ingredient);
    
    if (index === -1) {
        // Not in list, add it
        savedIngredients.push(ingredient);
        buttonElement.innerText = 'ADDED';
        buttonElement.classList.add('added');
    } else {
        // In list, remove it
        savedIngredients.splice(index, 1);
        buttonElement.innerText = 'ADD';
        buttonElement.classList.remove('added');
    }
    
    // Save to phone storage
    localStorage.setItem('myIndianPantry', JSON.stringify(savedIngredients));
}

function setView(size) {
    const container = document.getElementById('ingredient-categories');
    const btnSmall = document.getElementById('btn-view-small');
    const btnBig = document.getElementById('btn-view-big');

    if (size === 'small') {
        container.className = 'view-small pb-safe';
        btnSmall.classList.add('active');
        btnBig.classList.remove('active');
    } else {
        container.className = 'view-big pb-safe';
        btnBig.classList.add('active');
        btnSmall.classList.remove('active');
    }
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
    const items = document.querySelectorAll('.menu-item');

    items.forEach(item => {
        const text = item.querySelector('.item-name').textContent.toLowerCase();
        if (text.includes(searchTerm)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function getAvailableRecipes() {
    const types = [];
    if(document.getElementById('toggle-breakfast').checked) types.push('breakfast');
    if(document.getElementById('toggle-lunch').checked) types.push('lunch');
    if(document.getElementById('toggle-dinner').checked) types.push('dinner');

    return recipes.filter(recipe => {
        if (!types.includes(recipe.type)) return false;
        return recipe.ingredients.every(neededIng => savedIngredients.includes(neededIng));
    });
}

function showOptions() {
    const possibleRecipes = getAvailableRecipes();
    const resultsDiv = document.getElementById('results');
    
    if (possibleRecipes.length === 0) {
        resultsDiv.innerHTML = "<p class='empty-state'>Not enough ingredients! Add more from the Pantry.</p>";
        return;
    }

    let html = "<h3 style='margin-top:0;'>You can make:</h3><ul>";
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
                <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid var(--border);">
                    <span style="display: block; font-size: 12px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">${type}</span>
                    <p style="font-size: 18px; font-weight: 600; margin: 0;">${randomRecipe.name}</p>
                </div>`;
                madePlan = true;
            } else {
                html += `
                <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid var(--border);">
                    <span style="display: block; font-size: 12px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">${type}</span>
                    <p style="color: var(--text-muted); font-weight: normal; margin: 0;">No recipe available</p>
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
