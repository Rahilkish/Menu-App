// --- PREMIUM INDIAN DATASET (Core vs Optional Logic) ---
const defaultData = {
    categories: {
        "Vegetables & Fresh (Sabzi)": [
            "Onion", "Tomato", "Potato", "Green Chillies", "Garlic", "Ginger", 
            "Spinach (Palak)", "Cauliflower", "Coriander Leaves", "Curry Leaves", 
            "Capsicum", "Peas", "Carrot", "Lemon"
        ],
        "Dairy & Protein": [
            "Ghee", "Butter", "Milk", "Curd (Dahi)", "Fresh Cream", 
            "Eggs", "Paneer", "Chicken"
        ],
        "Lentils & Grains (Dal/Atta)": [
            "Basmati Rice", "Toor Dal", "Moong Dal", "Chana Dal", "Urad Dal", 
            "Rajma", "Chickpeas (Chole)", "Wheat Flour (Atta)", "Poha", "Besan", "Semolina (Suji)"
        ]
    },
    recipes: [
        // --- BREAKFAST ---
        { name: "Kanda Batata Poha", coreIngredients: ["Poha", "Onion", "Potato"], optionalIngredients: ["Curry Leaves", "Green Chillies", "Lemon"], type: "breakfast" },
        { name: "Masala Egg Bhurji", coreIngredients: ["Eggs", "Onion", "Tomato"], optionalIngredients: ["Green Chillies", "Coriander Leaves"], type: "breakfast" },
        { name: "Besan Cheela", coreIngredients: ["Besan", "Onion", "Tomato"], optionalIngredients: ["Green Chillies", "Coriander Leaves"], type: "breakfast" },
        { name: "Vegetable Upma", coreIngredients: ["Semolina (Suji)", "Onion"], optionalIngredients: ["Green Chillies", "Curry Leaves", "Carrot"], type: "breakfast" },
        { name: "Paneer Paratha", coreIngredients: ["Wheat Flour (Atta)", "Paneer"], optionalIngredients: ["Green Chillies", "Coriander Leaves", "Ghee"], type: "breakfast" },
        { name: "Aloo Paratha", coreIngredients: ["Wheat Flour (Atta)", "Potato"], optionalIngredients: ["Green Chillies", "Coriander Leaves", "Ghee"], type: "breakfast" },

        // --- LUNCH / DINNER (Main Meals Pool) ---
        { name: "Dal Tadka & Rice", coreIngredients: ["Toor Dal", "Basmati Rice", "Onion", "Tomato"], optionalIngredients: ["Garlic", "Ghee", "Coriander Leaves"], type: "lunch" },
        { name: "Punjabi Chole", coreIngredients: ["Chickpeas (Chole)", "Onion", "Tomato"], optionalIngredients: ["Garlic", "Ginger"], type: "lunch" },
        { name: "Rajma Chawal", coreIngredients: ["Rajma", "Basmati Rice", "Onion", "Tomato"], optionalIngredients: ["Garlic", "Ginger", "Ghee"], type: "lunch" },
        { name: "Aloo Gobi Masala", coreIngredients: ["Potato", "Cauliflower", "Onion", "Tomato"], optionalIngredients: ["Ginger"], type: "lunch" },
        { name: "Lemon Rice", coreIngredients: ["Basmati Rice", "Lemon"], optionalIngredients: ["Green Chillies", "Curry Leaves"], type: "lunch" },
        { name: "Chicken Pulao", coreIngredients: ["Chicken", "Basmati Rice", "Onion"], optionalIngredients: ["Tomato", "Curd (Dahi)", "Ghee"], type: "lunch" },
        { name: "Paneer Bhurji", coreIngredients: ["Paneer", "Onion", "Tomato"], optionalIngredients: ["Green Chillies"], type: "lunch" },
        { name: "Aloo Matar Sabzi", coreIngredients: ["Potato", "Peas", "Onion", "Tomato"], optionalIngredients: ["Garlic"], type: "lunch" },
        { name: "Authentic Chicken Biryani", coreIngredients: ["Chicken", "Basmati Rice", "Onion", "Curd (Dahi)"], optionalIngredients: ["Garlic", "Ginger", "Coriander Leaves", "Ghee"], type: "dinner" },
        { name: "Restaurant Style Butter Chicken", coreIngredients: ["Chicken", "Tomato", "Butter"], optionalIngredients: ["Garlic", "Ginger", "Fresh Cream"], type: "dinner" },
        { name: "Homestyle Chicken Curry", coreIngredients: ["Chicken", "Onion", "Tomato"], optionalIngredients: ["Garlic", "Ginger"], type: "dinner" },
        { name: "Dal Makhani", coreIngredients: ["Urad Dal", "Rajma", "Tomato"], optionalIngredients: ["Garlic", "Ginger", "Butter", "Fresh Cream"], type: "dinner" },
        { name: "Palak Paneer", coreIngredients: ["Spinach (Palak)", "Paneer", "Onion", "Tomato"], optionalIngredients: ["Garlic", "Ghee"], type: "dinner" },
        { name: "Kadai Paneer", coreIngredients: ["Paneer", "Capsicum", "Onion", "Tomato"], optionalIngredients: ["Garlic"], type: "dinner" },
        { name: "Matar Paneer", coreIngredients: ["Paneer", "Peas", "Onion", "Tomato"], optionalIngredients: ["Garlic"], type: "dinner" },
        { name: "Egg Curry", coreIngredients: ["Eggs", "Onion", "Tomato"], optionalIngredients: ["Garlic", "Ginger"], type: "dinner" },
        { name: "Jeera Rice & Moong Dal", coreIngredients: ["Basmati Rice", "Moong Dal", "Onion", "Tomato"], optionalIngredients: ["Garlic", "Ghee"], type: "dinner" }
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

            const imgFileName = ing.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '.jpg';

            const itemDiv = document.createElement('div');
            itemDiv.className = 'menu-item';
            
            itemDiv.innerHTML = `
                <div class="item-main">
                    <div class="img-box">
                        <img src="images/${imgFileName}" class="real-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                        <div class="fallback-icon" style="display:none;">📸</div>
                    </div>
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
        alert("Please select at least one core ingredient for this recipe.");
        return;
    }

    // User added recipes treat all selected ingredients as Core.
    appData.recipes.push({ 
        name: name, 
        coreIngredients: requiredIngredients, 
        optionalIngredients: [], 
        type: type 
    });
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
        const isBreakfast = recipe.type === 'breakfast';
        const isMainMeal = recipe.type === 'lunch' || recipe.type === 'dinner';

        let typeMatch = false;
        if (isBreakfast && types.includes('breakfast')) typeMatch = true;
        if (isMainMeal && (types.includes('lunch') || types.includes('dinner'))) typeMatch = true;

        if (!typeMatch) return false;
        
        // ONLY check if the user has all the core (must-have) ingredients
        return recipe.coreIngredients.every(neededIng => savedIngredients.includes(neededIng));
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
        const displayType = r.type === 'breakfast' ? 'Breakfast' : 'Lunch / Dinner';
        html += `<li style='margin-bottom: 8px;'><strong>${r.name}</strong> <span style="color:var(--text-muted); font-size:12px;">(${displayType})</span></li>`;
    });
    html += "</ul>";
    resultsDiv.innerHTML = html;
}

function decideForMe() {
    const possibleRecipes = getAvailableRecipes();
    const resultsDiv = document.getElementById('results');
    
    const byType = { breakfast: [], main: [] };
    possibleRecipes.forEach(r => {
        if (r.type === 'breakfast') {
            byType.breakfast.push(r);
        } else {
            byType.main.push(r); 
        }
    });

    let html = "";
    let madePlan = false;

    ['breakfast', 'lunch', 'dinner'].forEach(type => {
        if (document.getElementById(`toggle-${type}`).checked) {
            const pool = (type === 'breakfast') ? byType.breakfast : byType.main;
            
            if (pool.length > 0) {
                const randomIndex = Math.floor(Math.random() * pool.length);
                const randomRecipe = pool[randomIndex];
                
                html += `
                <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid var(--border);">
                    <span style="display: block; font-size: 12px; color: var(--text-muted); text-transform: uppercase; font-weight: 700; margin-bottom: 4px;">${type}</span>
                    <p style="font-size: 18px; font-weight: 600; margin: 0;">${randomRecipe.name}</p>
                </div>`;
                madePlan = true;
                
                if (type !== 'breakfast') {
                    pool.splice(randomIndex, 1);
                }
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

// --- PWA INSTALL MODAL LOGIC ---
let deferredPrompt;
const installModal = document.getElementById('install-modal');
const modalInstallBtn = document.getElementById('modal-install-btn');
const closeModalBtn = document.getElementById('close-modal-btn');

let hasDismissedPrompt = sessionStorage.getItem('dismissedInstall');

window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    if (installModal && !hasDismissedPrompt) {
        installModal.style.display = 'flex';
    }
});

if (modalInstallBtn) {
    modalInstallBtn.addEventListener('click', async () => {
        if (!deferredPrompt) return;
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
            installModal.style.display = 'none';
        }
        deferredPrompt = null;
    });
}

if (closeModalBtn) {
    closeModalBtn.addEventListener('click', () => {
        installModal.style.display = 'none';
        sessionStorage.setItem('dismissedInstall', 'true');
    });
}

window.addEventListener('appinstalled', () => {
    if (installModal) installModal.style.display = 'none';
    deferredPrompt = null;
});
