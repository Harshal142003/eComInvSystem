import express from 'express';
import Order from '../models/Orders.js'; 
import Users from '../models/Users.js';
const router = express.Router();

// GET A USER'S ORDER HISTORY
// GET /api/users/:id/orders
router.get('/:id/orders', async (req, res) => {
  try {
    const { id } = req.params;

    const orders = await Order.find({ user_id: id });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: "No orders found for this user." });
    }

    // Format the response
    const response = orders.map(order => ({
      id: order._id,
      user_id: order.user_id,
      total: order.total,
      status: order.status,
      created_at: order.createdAt
    }));

    res.status(200).json(response);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.get('/', async (req, res) => {
    try {
        const allUsers = await Users.find();
        res.status(200).json(allUsers);
    } catch (err) {
        console.error("Error fetching users:", err);
        res.status(500).json({ message: "An error occurred on the server." });
    }
});

router.post('/', async (req, res) => {
    try {
        const { name, password, email } = req.body;

        // 1. Validate input
        if (!name || !password || !email) {
            return res.status(400).json({ message: 'Please provide a name, email, and password.' });
        }

        // 2. Check if user already exists in the database
        const existingUser = await Users.findOne({ email: email.toLowerCase() });
        if (existingUser) {
            return res.status(409).json({ message: 'A user with that email already exists.' });
        }

        // 4. Create a new user instance
        const newUser = new Users({
            name,
            email: email.toLowerCase(),
            password: password
        });

        // 5. Save the user to the database
        await newUser.save();

        // 6. Prepare the response object (never send the password back)
        const userResponse = newUser.toObject();
        delete userResponse.password;

        console.log('New user created and saved to DB:', userResponse);
        res.status(201).json(userResponse);

    } catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ message: "An error occurred on the server." });
    }
});

export default router;
