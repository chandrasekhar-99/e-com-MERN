const express = require('express');
const bodyParser = require("body-parser");
const dotenv = require('dotenv')
const cors = require('cors');
const dbConnect = require('./config/config');
const transactionRouter = require('./routes/apiRoutes');

dotenv.config();
dbConnect();

const app = express();
app.use(bodyParser.json());
app.use(cors());


app.get("/", (req, res) => {
    res.json("Hello World e-com MERN backend!");
});

app.use('/api', transactionRouter);


const PORT = process.env.PORT || 8001;

app.listen(PORT, () =>{
    console.log("rox server is running on port", PORT)
})