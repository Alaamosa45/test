const express = require("express");
const bcrypt = require("bcrypt");
const app = express();

app.use(express.json());

// كلمة مرور مشفرة (بدلاً من تخزين كلمة المرور العادية، نخزن نسخة مشفرة منها)
const hashedPassword = "$2b$10$ExampleHashedPasswordFromBcrypt123"; // كلمة مرور مشفرة باستخدام bcrypt

// واجهة برمجية للتحقق من كلمة المرور
app.post("/api/authenticate", async (req, res) => {
  const { password } = req.body;

  // تحقق من مطابقة كلمة المرور المدخلة مع كلمة المرور المشفرة
  const isMatch = await bcrypt.compare(password, hashedPassword);

  if (isMatch) {
    res.json({ authenticated: true });
  } else {
    res.status(401).json({ authenticated: false });
  }
});

// بدء الخادم على المنفذ 3000
app.listen(3000, () => {
  console.log("الخادم يعمل على http://localhost:3000");
});
