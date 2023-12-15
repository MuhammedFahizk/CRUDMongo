const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const PORT = process.env.PORT || 3000;
mongoose.connect('mongodb+srv://admin:4vSCAm7KdBttyWCQ@cluster0.2muyyre.mongodb.net/custData?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((error) => {
        console.error('Error connecting to MongoDB:', error);
    });

const User = mongoose.model('User', {
    name: String,
    age: Number,
    phone: String,
    email: String
});
const Login =mongoose.model('Login',{
    userName:String,
    passward:Number
    
})


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.render('login');
});
app.get('/sign', (req, res) => {
    res.render('signup');
});
app.post('/signup',async (req, res) => {
    try {
        const user = new Login({
            userName: req.body.username,
            passward: req.body.password,
           
        });

        const result = await user.save();

        if (result) {
            console.log('Document inserted successfully:' ,result);
            res.redirect('/home'); // Redirect to the /form route after successful submission
        } else {
            console.error('Failed to insert document.');
            res.status(500).send('login error');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
 
});

app.post('/login', async (req, res) => {
    try {
        const user = new Login({
            userName: req.body.username,
            passward: req.body.password,
        });

        const userData = await Login.findOne({
            userName: user.userName,
            passward: user.passward,
        });

        if (userData) {
            res.redirect('/home');
        } else {
            res.status(200).send('First signup');
        }
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.get('/home', async (req, res) => {
    try {
        const datas = await User.find();
        res.render('home', { datas });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).send('Internal Server Error');
    }
});



app.get('/form', (req, res) => {
    res.render('form');
});

app.post('/submit', async (req, res) => {
    try {
        const users = new User({
            name: req.body.name,
            age: req.body.age,
            phone: req.body.phone,
            email: req.body.email
        });

        const result = await users.save();

        if (result) {
            console.log('Document inserted successfully:');
            res.redirect('/form'); // Redirect to the /form route after successful submission
        } else {
            console.error('Failed to insert document.');
            res.status(500).send('Internal Server Error');
        }
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/edit/:id', async (req, res) => {
    try {
        const userId = req.params.id;

        const result = await User.findById(userId);

        if (result) {
            console.log('User found for edit:', result);
            res.render('editform', { result });
        } else {
            console.error('User not found for edit.');
            res.status(404).send('User Not Found');
        }
    } catch (error) {
        console.error('Error fetching user for edit:', error);
        res.status(500).send('Internal Server Error');
    }
});

app.post('/update/:id', async (req, res) => {
    try {
       const usersId=req.params.id
        const {name,age,phone,email} =req.body
        const result = await User.findByIdAndUpdate(usersId, {
            name,
            age,
            phone,
            email
        }, { new: true });

        if (result) {
            res.redirect('/home')
        } else {
            console.error('User not found for edit.');
            res.status(404).send('User Not Found');
        }
    } catch (error) {
        console.error('Error fetching user for edit:', error);
        res.status(500).send('Internal Server Error');
    }
});
app.get('/delete/:id', async (req, res) => {
    try {
        const userId = req.params.id;
        
        const result = await User.findByIdAndDelete(userId);


        if (result) {
            console.log('User found for edit:', result);
            res.redirect('/home');
        } else {
            console.error('User not found for edit.');
            res.status(404).send('User Not Found');
        }
    } catch (error) {
        console.error('Error fetching user for edit:', error);
        res.status(500).send('Internal Server Error');
    }
});


app.listen(PORT, () => {
    console.log(`Server listening at http://localhost:${PORT}`);
});
