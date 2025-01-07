function generateCSRFToken() {
  const token = btoa(Date.now().toString());
  localStorage.setItem("csrfToken", token);
  return token;
}

function validateCSRFToken(token) {
  const storedToken = localStorage.getItem("csrfToken");
  return storedToken === token;
}

function showNotification(message) {
  const notification = document.getElementById("notification");
  if (notification) {
    notification.textContent = message;
    notification.style.display = "block";
    setTimeout(() => (notification.style.display = "none"), 3000);
  }
}

function sanitizeInput(input) {
  const div = document.createElement("div");
  div.textContent = input;
  return div.innerHTML;
}

function checkUserVisit() {
  const savedPhoneNumber = localStorage.getItem("phoneNumber");
  const lastPointTime = localStorage.getItem("lastPointTime");
  const now = new Date().getTime();

  if (savedPhoneNumber && lastPointTime && isWithinAllowedTime()) {
    const timeDifference = now - parseInt(lastPointTime, 10);
    const oneHourInMilliseconds = 60 * 60 * 1000;

    if (timeDifference >= oneHourInMilliseconds) {
      localStorage.setItem("lastPointTime", now);
      showThankYouMessage(savedPhoneNumber);
    } else {
      showNotification(
        "لقد حصلت على نقطة بالفعل خلال هذه الفترة. حاول مرة أخرى لاحقًا."
      );
    }
  } else if (savedPhoneNumber) {
    showNotification("التسجيل متاح فقط في اوقات الصلاة");
  } else {
    const registrationForm = document.getElementById("registration-form");
    if (registrationForm) registrationForm.style.display = "block";
  }
}

function showThankYouMessage(phoneNumber) {
  let userData = JSON.parse(localStorage.getItem("userData")) || {};

  if (!userData[phoneNumber]) {
    userData[phoneNumber] = 1;
  } else {
    userData[phoneNumber]++;
  }

  localStorage.setItem("userData", JSON.stringify(userData));

  const thankYouMessage = document.getElementById("thank-you-message");
  const pointsElement = document.getElementById("points");
  const instagramLink = document.getElementById("instagram-link");

  if (thankYouMessage) thankYouMessage.style.display = "block";
  if (pointsElement) {
    pointsElement.style.display = "block";
    pointsElement.textContent = `${userData[phoneNumber]} نقطة`;
  }
  if (instagramLink) instagramLink.style.display = "block";
}

function isWithinAllowedTime() {
  const now = new Date();
  const currentHours = now.getHours();
  const currentMinutes = now.getMinutes();
  const timeInMinutes = currentHours * 60 + currentMinutes;

  const allowedTimes = [
    { start: 290, end: 360 },
    { start: 690, end: 780 },
    { start: 855, end: 915 },
    { start: 1005, end: 1065 },
    { start: 1090, end: 1150 },
  ];

  return allowedTimes.some(
    time => timeInMinutes >= time.start && timeInMinutes <= time.end
  );
}

function registerPhoneNumber() {
  if (!isWithinAllowedTime()) {
    showNotification("التسجيل مسموح فقط خلال اوقات الصلاة.");
    return;
  }

  const csrfTokenElement = document.getElementById("csrf-token");
  if (!csrfTokenElement) {
    showNotification("CSRF token element is missing.");
    return;
  }

  const csrfToken = csrfTokenElement.value;
  if (!validateCSRFToken(csrfToken)) {
    showNotification("CSRF token is invalid.");
    return;
  }

  const phoneNumberInput = document.getElementById("phone-number");
  if (!phoneNumberInput) {
    showNotification("Phone number input is missing.");
    return;
  }

  const phoneNumber = sanitizeInput(phoneNumberInput.value);

  if (!/^[0-9]{10,}$/.test(phoneNumber)) {
    showNotification("يرجى إدخال رقم هاتف صالح مكون من 10 أرقام على الأقل.");
    return;
  }

  try {
    const encryptedPhone = CryptoJS.AES.encrypt(
      phoneNumber,
      "secret-key"
    ).toString();
    localStorage.setItem("phoneNumber", encryptedPhone);
    localStorage.setItem("lastPointTime", new Date().getTime());
    showThankYouMessage(phoneNumber);

    const registrationForm = document.getElementById("registration-form");
    if (registrationForm) registrationForm.style.display = "none";
  } catch (error) {
    showNotification("خطأ في تخزين البيانات: " + error.message);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const csrfTokenElement = document.getElementById("csrf-token");
  if (csrfTokenElement) csrfTokenElement.value = generateCSRFToken();
  checkUserVisit();
});
