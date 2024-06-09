const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT || 3000;

// Connect to MongoDB
mongoose.connect('mongodb+srv://recipe:recipe@cluster0.ssru1f3.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', (err) => {
    console.log(err);
});
db.once('open', () => {
    console.log("Connected to MongoDB");
});

// Middleware
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the 'public' directory

// Define the Recipe schema
const Schema = mongoose.Schema;

const RecipeSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    ingredients: {
        type: [String],
        required: true
    },
    instructions: {
        type: String,
        required: true
    }
});

const Recipe = mongoose.model('Recipe', RecipeSchema);

// Route for the home page
app.get('/', (req, res) => {
    res.render('login');
  });

// Route for the script file
app.get('/script.js', (req, res) => {
    const fileName = 'script.js';
    const options = {
        root: path.join(__dirname)
    };
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.error('Error sending file:', err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});

// API routes for recipes
app.get('/api/recipe/search', async (req, res) => {
    try {
        const ingredient = req.query.ingredient;
        const recipes = await Recipe.find({ ingredients: { $regex: ingredient, $options: 'i' } });
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.get('/api/recipe/all', async (req, res) => {
    try {
        const recipes = await Recipe.find({});
        res.json(recipes);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

app.post('/api/recipe/add', async (req, res) => {
    const { name, ingredients, instructions } = req.body;
    const recipe = new Recipe({ name, ingredients, instructions });
    try {
        const newRecipe = await recipe.save();
        res.status(201).json(newRecipe);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

app.get('/add.html', (req, res) => {
    const fileName = 'add.html';
    const options = {
        root: path.join(__dirname)
    };
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.error('Error sending file:', err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});
app.get('/show.html', (req, res) => {
    const fileName = 'show.html';
    const options = {
        root: path.join(__dirname)
    };
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.error('Error sending file:', err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});
app.get('/style.css', (req, res) => {
    const fileName = 'show.html';
    const options = {
        root: path.join(__dirname)
    };
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.error('Error sending file:', err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});

app.get('/home', (req, res) => {
    const fileName = 'home.html';
    const options = {
        root: path.join(__dirname)
    };
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.error('Error sending file:', err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});
app.get('/home.html', (req, res) => {
    const fileName = 'home.html';
    const options = {
        root: path.join(__dirname)
    };
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.error('Error sending file:', err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});

app.get('/showsingle.html', (req, res) => {
    const fileName = 'showsingle.html';
    const options = {
        root: path.join(__dirname)
    };
    res.sendFile(fileName, options, function (err) {
        if (err) {
            console.error('Error sending file:', err);
        } else {
            console.log('Sent:', fileName);
        }
    });
});
// Start the server

///new

// Create User Schema
const userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
  });
  
  const User = mongoose.model('User', userSchema);
  
  app.set('view engine', 'ejs');
  app.use(bodyParser.urlencoded({ extended: true }));
  
  // Signup Route
  app.get('/signup', (req, res) => {
    res.render('signup');
  });
  
  app.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;

    try {
        // Check if the email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email already exists' });
        }

        // If the email does not exist, create a new user
        await User.create({ name, email, password });
        res.status(201).json({ message: 'Signup successful' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Signup unsuccessful' });
    }
});
  
    
  
  // Login Route
  app.get('/login', (req, res) => {
    res.render('login', { message: null });
});

app.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const foundUser = await User.findOne({ email: email });

        if (!foundUser) {
            return res.json({ success: false, message: 'Invalid email address.' });
        }

        const isPasswordValid = foundUser.password === password; // Adjust this for hashed passwords
        if (!isPasswordValid) {
            return res.json({ success: false, message: 'Incorrect password.' });
        }

        res.json({ success: true, name: foundUser.name });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false, message: 'Error logging in.' });
    }
});



  // Dashboard Route
  
app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
