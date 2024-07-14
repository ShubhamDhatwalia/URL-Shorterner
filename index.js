const express = require("express");
const app = express();
const URL = require("./models/url")
const path = require("path");



const {connectMongoDB} = require('./connect');
connectMongoDB('mongodb://localhost:27017/short-url')
.then(()=> console.log("MongoDB connected"));


app.set("view engine", "ejs");
app.set("views", path.resolve("./view"));


app.use(express.json());
app.use(express.urlencoded({extended: false}));

const staticRouter = require('./routes/staticRouter');
app.use('/', staticRouter);


const urlRoute = require('./routes/url');
app.use("/url", urlRoute);




app.get('/url/:shortId', async (req, res) => {
    const shortId = req.params.shortId;
    const entry = await URL.findOneAndUpdate({
        shortId },
    {
        $push: {
            visitHistory: { timestamp: Date.now()}
        }
    })

    console.log(entry);
    res.redirect(entry.redirectURL);
});

app.listen(8080, ()=> console.log("Server Connected"));