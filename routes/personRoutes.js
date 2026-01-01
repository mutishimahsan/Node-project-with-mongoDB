const express = require('express');
const router = express.Router();

const Person = require('./../models/Person')
const {jwtAuthMiddleware, generateToken} = require('./../jwt');

// Create User
router.post('/signup', async (req, res) => {
    try {
        const data = req.body

        const newPerson = new Person(data);

        const response = await newPerson.save();
        console.log("data saved");

        const payload = {
            id: response.id,
            username: response.username
        }
        console.log(JSON.stringify(payload));

        const token = generateToken(payload);
        console.log("Token: ", token);

        res.status(200).json({response: response, token: token});
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// Login User
router.post('/login', async(req, res) => {
    try {
        // Extract username and password from request body
        const {username, password} = req.body;

        // Find the user by username
        const user = await Person.findOne({username: username});

        // If user doesn't exist or password does not match, return error
        if (!user || !(await user.comparePassword(password))) {
            res.status(401).json({error: 'Invalid username or password'});
        }

        // generate token
        const payload = {
            id : user.id,
            username: user.username
        }
        const token = generateToken(payload);

        // return token as response
        res.json({token});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
})

// Get Users
router.get('/', jwtAuthMiddleware, async (req, res) => {
    try {
        const data = await Person.find();
        console.log("Users fetched");
        res.status(200).json(data);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
})

// Profile Routes
router.get('/profile', jwtAuthMiddleware, async(req, res) => {
    try {
        const userData = req.user;
        console.log("User data: ", userData);

        const userId = userData.id;
        const user = await Person.findById(userId);

        res.status(200).json({user});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
})

// Parameterized URL
router.get('/:work', async(req, res) => {
    try {
        const workType = req.params.work;

        if (workType == 'chef' || workType == 'manager' || workType == 'waiter') {
            const response = await Person.find({work: workType});

            console.log("response fetched");
            res.status(200).json(response);
        } else {
            res.status(404).json({error: 'Invalid work type'});
        }
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
})

router.put('/:id', async(req, res) => {
    try {
        const personId = req.params.id;
        const updatedPersonData = req.body;

        const response = await Person.findByIdAndUpdate(personId, updatedPersonData, {
            new: true,
            runValidators: true
        })

        if (!response) {
            return res.status(404).json({error: 'Person not found'});
        }

        console.log("Data updated");
        res.status(200).json(response);
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
})

// Delete User
router.delete('/:id', async(req, res) => {
    try {
        const personId = req.params.id;

        const response = await Person.findByIdAndDelete(personId);

        if (!response) {
            return res.status(404).json({error: 'Person not found'});
        }

        console.log("Person deleted");
        res.status(200).json({message: 'Person deleted Successfully'});
    } catch (error) {
        console.log(error);
        res.status(500).json({error: 'Internal server error'});
    }
})

module.exports = router;