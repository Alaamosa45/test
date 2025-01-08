const bcrypt = require("bcrypt");
const express = require("express");
const app = express();

app.use(express.json());

// كلمة مرور مشفرة (قم بإنشاء كلمة مرور باستخدام bcrypt مسبقًا)
const storedHashedPassword = "$2b$10$ExampleHashedPasswordFromBcrypt123";

app.post("/api/authenticate", async (req, res) => {
  const { password } = req.body;
  const isMatch = await bcrypt.compare(password, storedHashedPassword);
  if (isMatch) {
    res.json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

app.listen(3000, () => console.log("Server running on http://localhost:3000"));
