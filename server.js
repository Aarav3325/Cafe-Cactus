require('dotenv').config({ path: './.env/mongo.env' }); // ✅ Correct path
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
console.log("JWT Secret Key:", process.env.JWT_SECRET);
const app = express();
app.use(express.json());
app.use(cors());

const authRoutes = require("./js/routes/auth");
app.use("/auth", authRoutes);
const menuRoutes = require("./js/routes/menuRoutes");
app.use("/api", menuRoutes);

const orderRoutes = require('./js/routes/orders');
// Routes
app.use('/orders', orderRoutes);



const PORT = process.env.PORT || 5000;

// MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log(err));


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('✅ MongoDB Connected...');
}).catch(err => {
    console.error('❌ MongoDB Connection Failed:', err);
});


// Default Route
app.get("/", (req, res) => {
    res.send("Cafe Cactus Backend is running...");
});


app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
