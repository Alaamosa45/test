// script.js
const localPassword = "123456"; // كلمة مرور للاستخدام المحلي
let userData = JSON.parse(localStorage.getItem("userData")) || [
  { phoneNumber: "1234567890", count: 5 },
  { phoneNumber: "0987654321", count: 2 },
];

function showNotification(message) {
  const notification = document.getElementById("notification");
  notification.textContent = message;
  notification.style.display = "block";
  setTimeout(() => {
    notification.style.display = "none";
  }, 3000);
}

function verifyPassword() {
  const password = document.getElementById("admin-password").value;
  const notification = document.getElementById("notification");
  const adminContent = document.getElementById("admin-content");

  if (password === "123456") {
    adminContent.style.display = "block";
    notification.textContent = "تم تسجيل الدخول بنجاح!";
    notification.style.color = "green";
  } else {
    notification.textContent = "كلمة المرور غير صحيحة!";
    notification.style.color = "red";
  }
}

function loadAdminPanel() {
  const adminData = document.getElementById("admin-data");

  adminData.innerHTML = "";

  for (const { phoneNumber, count } of userData) {
    const row = `<tr>
                  <td contenteditable="true" oninput="validatePhoneNumber(this)" style="word-wrap: break-word;">${phoneNumber}</td>
                  <td contenteditable="true" oninput="validateRegistrationCount(this)" style="word-wrap: break-word;">${count}</td>
                  <td>
                      <button onclick="deleteRow('${phoneNumber}')">حذف</button>
                  </td>
                </tr>`;
    adminData.innerHTML += row;
  }
}

function deleteRow(phoneNumber) {
  const index = userData.findIndex(user => user.phoneNumber === phoneNumber);
  if (index !== -1) {
    userData.splice(index, 1);
    localStorage.removeItem(`csrf-${phoneNumber}`); // حذف CSRF المرتبط
    localStorage.setItem("userData", JSON.stringify(userData)); // تحديث localStorage
    showNotification(`تم حذف الرقم ${phoneNumber} وجميع البيانات المرتبطة.`);
    loadAdminPanel();
  } else {
    showNotification("الرقم غير موجود.");
  }
}

function validatePhoneNumber(cell) {
  const validNumber = cell.textContent.replace(/[^0-9]/g, "").slice(0, 10);
  if (cell.textContent !== validNumber) {
    cell.textContent = validNumber;
    showNotification(
      "رقم الهاتف يجب أن يكون مكوناً من 10 أرقام فقط ولا يحتوي على رموز أو أحرف."
    );
  }
}

function validateRegistrationCount(cell) {
  const validCount = cell.textContent.replace(/[^0-9]/g, "");
  if (cell.textContent !== validCount) {
    cell.textContent = validCount;
    showNotification("عدد التسجيلات يجب أن يحتوي على أرقام فقط.");
  }
}

// تحديث البيانات عند بدء الصفحة
window.onload = () => {
  try {
    loadAdminPanel();
  } catch (error) {
    showNotification("حدث خطأ أثناء تحميل البيانات: " + error.message);
  }
};
