// Enhanced CSRF Token Handling
function generateCSRFToken(phoneNumber) {
  const token = crypto.randomUUID();
  const expiryDate = new Date();
  expiryDate.setTime(expiryDate.getTime() + 15 * 60 * 1000); // صلاحية لمدة 15 دقيقة

  // ضبط الكوكيز مع دعم SameSite=Lax
  document.cookie = `csrf-${phoneNumber}=${token}; SameSite=Lax; expires=${expiryDate.toUTCString()}`;

  console.log("CSRF Token Generated:", token);
  return token;
}

function validateCSRFToken(phoneNumber, token) {
  const storedToken = getCookie(`csrf-${phoneNumber}`);

  if (!storedToken) {
    console.error("CSRF token missing or expired");
    showNotification("CSRF token is missing or expired.", "red");
    return false;
  }

  if (storedToken !== token) {
    console.error("CSRF token mismatch", { storedToken, token });
    showNotification("CSRF token is invalid.", "red");
    return false;
  }

  console.log("CSRF token validation successful");
  return true;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
  return null;
}

function showNotification(message, color = "black") {
  const notification = document.getElementById("notification");
  if (notification) {
    notification.textContent = message;
    notification.style.color = color;
    notification.style.display = "block";
    setTimeout(() => (notification.style.display = "none"), 3000);
  }
}

// Example usage during login or any CSRF-protected operation
function performActionWithCSRF(phoneNumber, actionToken) {
  if (!validateCSRFToken(phoneNumber, actionToken)) {
    return; // التحقق فشل
  }

  // إذا نجح التحقق، تنفيذ الإجراء المطلوب
  console.log("Action authorized successfully.");
  showNotification("Action performed successfully.", "green");
}

// Test CSRF functionality
window.onload = () => {
  try {
    const phoneNumber = "1234567890"; // مثال رقم الهاتف
    const token = generateCSRFToken(phoneNumber);

    // مثال للتحقق
    setTimeout(() => {
      console.log("Testing CSRF validation...");
      performActionWithCSRF(phoneNumber, token);
    }, 1000);
  } catch (error) {
    showNotification("Error occurred: " + error.message, "red");
    console.error("Error during CSRF initialization", error);
  }
};
