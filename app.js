// --- DEFAULT DATASET ---
const defaultData = {
    categories: {
        "Vegetables (Sabzi)": ["Onion", "Tomato", "Potato", "Green Chillies", "Garlic", "Ginger", "Spinach (Palak)", "Cauliflower", "Coriander Leaves", "Curry Leaves"],
        "Dairy, Oil & Protein": ["Cooking Oil", "Ghee", "Milk", "Eggs", "Paneer", "Chicken"],
        "Lentils & Grains (Dal/Atta)": ["Basmati Rice", "Toor Dal", "Moong Dal", "Wheat Flour (Atta)", "Poha"]
    },
    recipes: [
        { name: "Kanda Batata Poha", ingredients: ["Poha", "Onion", "Potato", "Curry Leaves", "Cooking Oil", "Green Chillies"], type: "breakfast" },
        { name: "Egg Bhurji", ingredients: ["Eggs", "Onion", "Tomato", "Green Chillies", "Cooking Oil"], type: "breakfast" },
        { name: "Dal Tadka & Rice", ingredients: ["Toor Dal", "Basmati Rice", "Onion", "Tomato", "Garlic", "Ghee"], type: "lunch" },
        { name: "Aloo Gobi Sabzi", ingredients: ["Potato", "Cauliflower", "Onion", "Tomato", "Cooking Oil"], type: "lunch" },
        { name: "Simple Chicken Curry", ingredients: ["Chicken", "Onion", "Tomato", "Garlic", "Ginger", "Cooking Oil"], type: "dinner" },
        { name: "Palak Paneer", ingredients: ["Spinach (Palak)", "Paneer", "Onion", "Tomato", "Garlic", "Ghee"], type: "dinner" }
    ]
};

// --- STATE MANAGEMENT ---
let appData = JSON.parse(localStorage.getItem('myKitchenData')) || defaultData;
let savedIngredients = JSON.parse(localStorage.getItem('myIndianPantry')) || [];

// --- INITIALIZATION ---
function initApp() {
    renderPantry();
    renderSetupIngredientList();
}

// --- RENDER FUNCTIONS ---
function renderPantry() {
    const container = document.getElementById('ingredient-categories');
    if (!container) return;
    container.innerHTML = ''; 

    for (const [category, items] of Object.entries(appData.categories)) {
        if (items.length === 0) continue; 

        const section = document.createElement('div');
        section.className = 'category-section';
        section.innerHTML = `<h3>${category}</h3>`;

        items.forEach(ing => {
            const isAdded = savedIngredients.includes(ing);
            const btnText = isAdded ? '✓' : '+';
            const btnClass = isAdded ? 'add-btn added' : 'add-btn';

            const itemDiv = document.createElement('div');
            itemDiv.className = 'menu-item';
            itemDiv.innerHTML = `
                <div class="item-main">
                    <div class="img-placeholder">📸</div>
                    <h4 class="item-name">${ing}</h4>
                </div>
                <button class="${btnClass}" onclick="toggleIngredient('${ing}', this)">${btnText}</button>
            `;
            section.appendChild(itemDiv);
        });
        container.appendChild(section);
    }
}

function renderSetupIngredientList() {
    const container = document.getElementById('setup-ingredient-list');
    if (!container) return;
    container.innerHTML = ''; 

    let allIngredients = [];
    for (const items of Object.values(appData.categories)) {
        allIngredients.push(...items);
    }
    allIngredients.sort();

    allIngredients.forEach(ing => {
        const label = document.createElement('label');
        label.innerHTML = `<input type="checkbox" value="${ing}" class="recipe-req-checkbox"> ${ing}`;
        container.appendChild(label);
    });
}

// --- SETUP TAB LOGIC ---
function addNewIngredient() {
    const nameInput = document.getElementById('new-ing-name');
    const categorySelect = document.getElementById('new-ing-category');
    
    const name = nameInput.value.trim();
    const category = categorySelect.value;

    if (name === "") {
        alert("Please enter an ingredient name.");
        return;
    }

    if (appData.categories[category].includes(name)) {
        alert("This ingredient already exists in this category!");
        return;
    }

    appData.categories[category].push(name);
    localStorage.setItem('myKitchenData', JSON.stringify(appData));
    
    renderPantry();
    renderSetupIngredientList();
    
    nameInput.value = "";
    alert(`${name} added to ${category}!`);
}

function addNewRecipe() {
    const nameInput = document.getElementById('new-recipe-name');
    const typeSelect = document.getElementById('new-recipe-type');
    const checkboxes = document.querySelectorAll('.recipe-req-checkbox:checked');
    
    const name = nameInput.value.trim();
    const type = typeSelect.value;
    const requiredIngredients = Array.from(checkboxes).map(cb => cb.value);

    if (name === "") {
        alert("Please enter a recipe name.");
        return;
    }
    if (requiredIngredients.length === 0) {
        alert("Please select at least one ingredient for this recipe.");
        return;
    }

    appData.recipes.push({ name: name, ingredients: requiredIngredients, type: type });
    localStorage.setItem('myKitchenData', JSON.stringify(appData));

    nameInput.value = "";
    checkboxes.forEach(cb => cb.checked = false);
    alert(`${name} has been added to your recipes!`);
}

// --- STANDARD LOGIC ---
function toggleIngredient(ingredient, buttonElement) {
    const index = savedIngredients.indexOf(ingredient);
    
    if (index === -1) {
        savedIngredients.push(ingredient);
        buttonElement.innerText = '✓';
        buttonElement.classList.add('added');
    } else {
        savedIngredients.splice(index, 1);
        buttonElement.innerText = '+';
        buttonElement.classList.remove('added');
    }
    localStorage.setItem('myIndianPantry', JSON.stringify(savedIngredients));
}

function setView(mode) {
    const container = document.getElementById('ingredient-categories');
    const btnList = document.getElementById('btn-view-list');
    const btnImage = document.getElementById('btn-view-image');

    if (!container || !btnList || !btnImage) return;

    if (mode === 'list') {
        container.className = 'view-list pb-safe';
        btnList.classList.add('active');
        btnImage.classList.remove('active');
    } else if (mode === 'image') {
        container.className = 'view-image pb-safe';
        btnImage.classList.add('active');
        btnList.classList.remove('active');
    }
}

function switchTab(tabId) {
    document.getElementById('pantry-tab').style.display = 'none';
    document.getElementById('meals-tab').style.display = 'none';
    document.getElementById('setup-tab').style.display = 'none';
    
    document.getElementById('btn-pantry').classList.remove('active');
    document.getElementById('btn-meals').classList.remove('active');
    document.getElementById('btn-setup').classList.remove('active');

    document.getElementById(tabId).style.display = 'block';
    if (tabId === 'pantry-tab') document.getElementById('btn-pantry').classList.add('active');
    if (tabId === 'meals-tab') document.getElementById('btn-meals').classList.add('active');
    if (tabId === 'setup-tab') document.getElementById('btn-setup').classList.add('active');
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

    return appData.recipes.filter(recipe => {
        if (!types.includes(recipe.type)) return false;
        return recipe.ingredients.every(neededIng => savedIngredients.includes(neededIng));
    });
}

function showOptions() {
    const possibleRecipes = getAvailableRecipes();
    const resultsDiv = document.getElementById('results');
    
    if (possibleRecipes.length === 0) {
        resultsDiv.innerHTML = "<p class='empty-state'>Not enough core ingredients! Add more from the Pantry.</p>";
        return;
    }

    let html = "<h3 style='margin-top:0;'>You can make:</h3><ul style='padding-left: 20px;'>";
    possibleRecipes.forEach(r => {
        html += `<li style='margin-bottom: 8px;'><strong>${r.name}</strong> <span style="color:var(--text-muted); font-size:12px;">(${r.type})</span></li>`;
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

// Start the app
initApp();

// --- PWA INSTALLATION LOGIC ---
let deferredPrompt;
const installCard = document.getElementById('install-card');
const installBtn = document.getElementById('install-btn');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    if (installCard) installCard.style.display = 'block';
});

if (installBtn) {
    installBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            installCard.style.display = 'none';
        }
        deferredPrompt = null;
    });
}

window.addEventListener('appinstalled', () => {
    if (installCard) installCard.style.display = 'none';
    deferredPrompt = null;
});
