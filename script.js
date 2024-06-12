async function searchRecipe() {
    let recipeInput = document.getElementById('recipeInput').value.trim(); // Trim to remove leading/trailing whitespace

    if (!recipeInput) {
        // If input is blank, display an alert message
        alert('Please enter a recipe name to search.');
        return;
    }

    
    try {
        const response = await fetch(`/api/recipe/search?ingredient=${encodeURIComponent(recipeInput)}`);
        if (response.ok) {
            const recipes = await response.json();
            const recipesDiv = document.getElementById('recipes');
            recipesDiv.innerHTML = '<h2>Search Results</h2>';
            if (recipes.length > 0) {
                recipes.forEach(recipe => {
                 //   if (!recipe.ingredients.toLowerCase().includes("teaspoon")) { 
                        const recipeElement = document.createElement('div');
                        recipeElement.innerHTML = `<strong>Name:</strong> ${recipe.name}<br>`;
                        recipesDiv.appendChild(recipeElement);
                    
                });
            } else {
                recipesDiv.innerHTML += '<p>No recipes found with the given ingredient.</p>';
               
            }
        } else {
            alert('Failed to search recipes');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while searching for recipes');
    }
}


async function showAllRecipes() {
    try {
        const response = await fetch('/api/recipe/all');
        if (response.ok) {
            const recipes = await response.json();
            const recipesDiv = document.getElementById('recipes');
            recipesDiv.innerHTML = '<h2>All Recipes</h2>';
            recipes.forEach(recipe => {
                const recipeElement = document.createElement('div');
                recipeElement.innerHTML = `<strong>Name:</strong> ${recipe.name}<br><strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}<br><strong>Instructions:</strong> ${recipe.instructions}<br><br>`;
                recipesDiv.appendChild(recipeElement);
            });
        } else {
            alert('Failed to fetch recipes');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching recipes');
    }
}

async function addRecipe() {
    //const name = document.getElementById('newRecipeName').value;
    const name = document.getElementById('newRecipeName').value.trim(); // Trim to remove leading/trailing whitespace
    
    const ingredients = document.getElementById('newRecipeIngredients').value.split(',').map(ingredient => ingredient.trim());
    const instructions = document.getElementById('newRecipeInstructions').value;
    const recipesDiv = document.getElementById('recipes');
            
    
    if (!name || !ingredients.length || !instructions) {
        recipesDiv.innerHTML = '<h4>       Please fill in all the fields<h4>';
        return;
    }

    const recipe = { name, ingredients, instructions };

   const response = await fetch('/api/recipe/all');
        if (response.ok) {
            const recipes = await response.json();
            const recipesDiv = document.getElementById('recipes');
           
            const isDuplicate = recipes.some(existingRecipe => 
                existingRecipe.name.toLowerCase() === name.toLowerCase()
            );
            if (isDuplicate) {
                alert('Duplicate:Recipe Already exists');
               document.getElementById('newRecipeName').value = '';
               document.getElementById('newRecipeIngredients').value = '';
               document.getElementById('newRecipeInstructions').value = '';
             

                return;
            }
            else{
                try {
                    const response = await fetch('/api/recipe/add', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(recipe)
                    });
            
                    if (response.ok) {
                        alert('Recipe added successfully!');
                        document.getElementById('newRecipeName').value = '';
                        document.getElementById('newRecipeIngredients').value = '';
                        document.getElementById('newRecipeInstructions').value = '';
                        //showAllRecipes();
                    } else {
                        alert('Failed to add recipe');
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('An error occurred while adding the recipe');
                }
            }
           

            
        } else {
            alert('Failed to fetch recipes');
        }
return;
   
}
async function displayRecipe() {
    try {
        const recipeInput = document.getElementById('recipeInput').value.trim().toLowerCase(); // Trim to remove leading/trailing whitespace and convert to lowercase
        const response = await fetch('/api/recipe/all');
        const recipesDiv = document.getElementById('recipes');

        if (response.ok) {
            const recipes = await response.json();

            let recipeFound = false;
            recipesDiv.innerHTML = '';

            recipes.forEach(recipe => {
                if (recipe.name.toLowerCase().includes(recipeInput)) {
                    if (!recipeFound) {
                        recipesDiv.innerHTML = '<h2>Recipes found:</h2>';
                    }
                    const recipeElement = document.createElement('div');
                    recipeElement.innerHTML = `
                        <strong>Name:</strong> ${recipe.name}<br>
                        <strong>Ingredients:</strong> ${recipe.ingredients.join(', ')}<br>
                        <strong>Instructions:</strong> ${recipe.instructions}<br><br>`;
                    recipesDiv.appendChild(recipeElement);
                    recipeFound = true;
                }
            });

            if (!recipeFound) {
                recipesDiv.innerHTML = '<h2>No recipes found</h2>';
            }
        } else {
            recipesDiv.innerHTML = '<h2>No recipes found</h2>';
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching recipes');
    }
}



function handleSignup(event) {
    event.preventDefault();
    // Simulate a successful signup process
    document.getElementById('success-message').style.display = 'block';
}
async function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    try {
        const response = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const result = await response.json();

        if (result.success) {
            const userName = result.name;
           ch=userName;
            alert('Login successful!');
        } else {
            alert(result.message);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred during login');
    }
}



document.addEventListener('DOMContentLoaded', () => {
    const userName = localStorage.getItem('userName');
    if (userName) {
        document.getElementById('id').textContent = `${userName}`;
    }
}
);
