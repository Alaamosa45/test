// حل مشكلة CSRF token invalid

function generateCSRFToken(phoneNumber) {
  const token = crypto.randomUUID();
  const expiryDate = new Date();
  expiryDate.setTime(expiryDate.getTime() + 15 * 60 * 1000); // صلاحية لمدة 15 دقيقة
  document.cookie = `csrf-${phoneNumber}=${token}; Secure; SameSite=Strict; HttpOnly; expires=${expiryDate.toUTCString()}`;
  return token;
}

function validateCSRFToken(phoneNumber, token) {
  const storedToken = getCookie(`csrf-${phoneNumber}`);
  if (!storedToken) {
    showNotification("CSRF token is missing or expired.", "red");
    return false;
  }

  if (storedToken !== token) {
    showNotification("CSRF token is invalid.", "red");
    return false;
  }

  return true;
}

function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(";").shift();
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
    return;
  }

  // If validation passes, perform the desired action
  showNotification("Action performed successfully.", "green");
}
