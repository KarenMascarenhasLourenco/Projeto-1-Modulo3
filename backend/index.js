const express = require("express");
const cors = require("cors");
const port = 3000 || process.env.PORT;
const app = express();

app.use(express.json());
app.use(express.urlencoded());
app.use(cors());
app.use("/films", require("./routes/films.routes"));

app.listen(port, () => console.log(`http://localhost:3000`));
