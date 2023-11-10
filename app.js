// app.js

const searchInput = document.getElementById('searchInput');
const searchResults = document.getElementById('searchResults');
const favoritesLink = document.getElementById('favoritesLink');
const favoritesSection = document.getElementById('favorites');

let allMeals = [];
let favoriteMeals = [];

// Function to fetch and display search results
function searchMeals(query) {
    fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`)
        .then(response => response.json())
        .then(data => {
            allMeals = data.meals;
            displayMeals(allMeals, searchResults);
        });
}

// Function to display meals
function displayMeals(meals, container) {
    container.innerHTML = '';
    meals.forEach(meal => {
        const mealCard = createMealCard(meal);
        container.appendChild(mealCard);
    });
}

// Function to fetch and display meal details
function getMealDetails(mealId) {
    fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`)
        .then(response => response.json())
        .then(data => {
            const mealDetails = data.meals[0];
            displayMealDetails(mealDetails);
        });
}

// Function to display meal details
function displayMealDetails(meal) {
    alert(`Meal Name: ${meal.strMeal}\nCategory: ${meal.strCategory}\nInstructions: ${meal.strInstructions}`);
}

// Function to create a meal card
function createMealCard(meal) {
    const mealCard = document.createElement('div');
    mealCard.className = 'meal-card';
    mealCard.innerHTML = `
        <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
        <h3>${meal.strMeal}</h3>
        <button class="favorite-button" onclick="toggleFavorite('${meal.idMeal}')">&#10084;</button>
        <button class="details-button" onclick="getMealDetails('${meal.idMeal}')">Details</button>
    `;

    return mealCard;
}

// Function to toggle favorite status
function toggleFavorite(mealId) {
    const meal = allMeals.find(favMeal => favMeal.idMeal === mealId);
    if (meal) {
        const index = allMeals.indexOf(meal);
        if (index !== -1) {
            const favoriteIndex = favoriteMeals.findIndex(favMeal => favMeal.idMeal === mealId);
            if (favoriteIndex === -1) {
                favoriteMeals.push(meal);
            } else {
                favoriteMeals.splice(favoriteIndex, 1);
            }
            updateFavoritesUI();
        }
    }
}

// Function to update the favorites section in the UI
function updateFavoritesUI() {
    displayMeals(favoriteMeals, favoritesSection);
}

// Event listener for the search input
searchInput.addEventListener('input', () => {
    const query = searchInput.value;
    searchMeals(query);
});

// Event listener for the "Favorites" link
favoritesLink.addEventListener('click', () => {
    favoritesSection.style.display = 'block';
    searchResults.style.display = 'none';
    updateFavoritesUI();
});

// Initially, you can call a default search like "Chicken" to display some meals when the page loads.
searchMeals('Chicken');
