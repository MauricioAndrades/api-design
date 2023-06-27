const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
const https = require("https");
const fs = require("fs");
const schema = require("./db/schema");
const usersRouter = require("./routes/users/users");
const { pgp, db } = require("./db/db");


const app = express();
const port = 3001;

(async()=>{
  await schema();
})();

// Middleware
app.use(bodyParser.json());
app.use(cors());


app.use("/users", usersRouter);


// HTTPS Configuration
const privateKey = fs.readFileSync('./cert.key', "utf8");
const certificate = fs.readFileSync('./cert.crt', "utf8");
const credentials = { key: privateKey, cert: certificate };

// Create an HTTPS server
const httpsServer = https.createServer(credentials, app);

// Start the server
httpsServer.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
