const express = require("express");
const cors = require('cors');
const authRoutes = require("./routes/authRoutes");

const app = express();

const PORT = process.env.PORT || 9000;

app.use(express.json());
app.use(cors({ origin : "*", credentials: true}));

app.use("/auth", authRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
