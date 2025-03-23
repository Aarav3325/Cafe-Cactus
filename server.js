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


const PORT = process.env.PORT || 5000;

// MongoDB Connection
// mongoose.connect(process.env.MONGO_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// }).then(() => console.log("MongoDB Connected"))
//   .catch(err => console.log(err));


mongoose.connect("mongodb+srv://aaravhalvadia:jWtYWJUkiub4REQo@cluster0.sz2lg.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
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
