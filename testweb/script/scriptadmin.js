let userData = JSON.parse(localStorage.getItem("userData")) || [
  { phoneNumber: "1234567890", count: 5 },
  { phoneNumber: "0987654321", count: 2 },
];

function showNotification(message, color = "black") {
  const notification = document.getElementById("notification");
  if (notification) {
    notification.textContent = message;
    notification.style.color = color;
    notification.style.display = "block";
    setTimeout(() => (notification.style.display = "none"), 3000);
  }
}

function generateCSRFToken(phoneNumber) {
  const token = crypto.randomUUID();
  document.cookie = `csrf-${phoneNumber}=${token}; Secure; SameSite=Strict; HttpOnly`;
  return token;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

function validateCSRFToken(phoneNumber, token) {
  const storedToken = getCookie(`csrf-${phoneNumber}`);
  return storedToken === token;
}

function sanitizeInput(input) {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}

// Function for server-side authentication simulation
async function verifyPassword(password) {
  try {
    const response = await fetch('http://localhost:3000/api/authenticate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      const result = await response.json();
      if (result.authenticated) {
        document.getElementById('admin-content').style.display = 'block';
        showNotification('تم تسجيل الدخول بنجاح!', 'green');
      } else {
        showNotification('كلمة المرور غير صحيحة!', 'red');
      }
    } else {
      showNotification('فشل التحقق من كلمة المرور.', 'red');
    }
  } catch (error) {
    showNotification('خطأ في الاتصال بالخادم: ' + error.message, 'red');
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
    document.cookie = `csrf-${phoneNumber}=; Secure; SameSite=Strict; HttpOnly; expires=Thu, 01 Jan 1970 00:00:00 UTC;`;
    localStorage.setItem("userData", JSON.stringify(userData));
    showNotification(`تم حذف الرقم ${phoneNumber} وجميع البيانات المرتبطة.`, "green");
    loadAdminPanel();
  } else {
    showNotification("الرقم غير موجود.", "red");
  }
}

function validatePhoneNumber(cell) {
  const validNumber = sanitizeInput(cell.textContent.replace(/[^0-9]/g, "").slice(0, 10));
  if (cell.textContent !== validNumber) {
    cell.textContent = validNumber;
    showNotification("رقم الهاتف يجب أن يكون مكوناً من 10 أرقام فقط ولا يحتوي على رموز أو أحرف.", "red");
  }
}

function validateRegistrationCount(cell) {
  const validCount = sanitizeInput(cell.textContent.replace(/[^0-9]/g, ""));
  if (cell.textContent !== validCount) {
    cell.textContent = validCount;
    showNotification("عدد التسجيلات يجب أن يحتوي على أرقام فقط.", "red");
  }
}

window.onload = () => {
  try {
    loadAdminPanel();
  } catch (error) {
    showNotification("حدث خطأ أثناء تحميل البيانات: " + error.message, "red");
  }
};
