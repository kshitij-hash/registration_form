const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')

const app = express()
app.use(express.static(__dirname + '/pages'))
dotenv.config();

const port = process.env.PORT || 3000
const user = process.env.MONGODB_USER
const password = process.env.MONGODB_PASSWORD

const uri = `mongodb+srv://${user}:${password}@userdetails.pe9w1mz.mongodb.net/registrationFormDB`
const connectDB = async () => {
    try {
        await mongoose.connect(uri, {
            useNewUrlParser: true
        })
        console.log("mongodb connected");
    } catch (error) {
        console.log(error.message);
    }
}
connectDB()

const registrationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    }
});

const Registration = mongoose.model("Registration", registrationSchema);
app.use(bodyParser.urlencoded({extended: true}))
app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html")
})

app.post("/register", async (req, res) => {
    try {
        const {name, email, password} = req.body;

        const existingUser = await Registration.findOne({email: email});

        if(!existingUser) {
            const registrationData = new Registration({
                name,
                email,
                password
            });
            await registrationData.save();
            res.redirect("/success");
        } else {
            console.log("user already exists")
            res.redirect("/error")
        }
    } catch (error) {
        console.log(error.message);
        res.redirect("/error");
    }
})

app.get("/success", (req, res) => {
    res.sendFile(__dirname + "/pages/success.html")
})

app.get("/error", (req, res) => {
    res.sendFile(__dirname + "/pages/error.html")
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
})