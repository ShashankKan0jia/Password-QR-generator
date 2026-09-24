// Smooth scrolling to section when button is clicked
document
  .getElementById("instructionsBtn")
  .addEventListener("click", function () {
    scrollToSection(".instructions");
  });

document
  .getElementById("suggestionsBtn")
  .addEventListener("click", function () {
    scrollToSection(".suggestions");
  });

document.getElementById("aboutBtn").addEventListener("click", function () {
  scrollToSection(".about");
});

function scrollToSection(sectionSelector) {
  const section = document.querySelector(sectionSelector);
  section.scrollIntoView({ behavior: "smooth" });

  section.classList.add("glow");
  setTimeout(() => {
    section.classList.remove("glow");
  }, 200);
}

let copyTooltipTimeout;
const clipboardButton = document.getElementById("clipboard");

clipboardButton.addEventListener("mouseover", function () {
  copyTooltipTimeout = setTimeout(function () {
    clipboardButton.innerText = "Copy to Clipboard";
  }, 500);
});

clipboardButton.addEventListener("mouseout", function () {
  clearTimeout(copyTooltipTimeout);
  clipboardButton.innerText = "📋";
});

clipboardButton.addEventListener("click", function () {
  const password = document.getElementById("result").innerText;
  if (!password) {
    alert("No password to copy!");
    return;
  }

  if (!navigator.clipboard?.writeText) {
    alert("Clipboard access is unavailable. Please copy the password manually.");
    return;
  }

  navigator.clipboard
    .writeText(password)
    .then(() => alert("Password copied to clipboard!"))
    .catch(() => alert("Unable to copy password. Please copy it manually."));
});

document.getElementById("generate").addEventListener("click", function () {
  const length = parseInt(document.getElementById("length").value, 10);

  if (!Number.isInteger(length) || length < 4 || length > 20) {
    alert("Password length must be between 4 and 20 characters.");
    return;
  }

  const hasUpper = document.getElementById("uppercase").checked;
  const hasLower = document.getElementById("lowercase").checked;
  const hasNumber = document.getElementById("numbers").checked;
  const hasSymbol = document.getElementById("symbols").checked;
  document.getElementById("result").innerText = generatePassword(
    hasLower,
    hasUpper,
    hasNumber,
    hasSymbol,
    length
  );
});

document.getElementById("generateQR").addEventListener("click", function () {
  const inputText =
    document.getElementById("result").innerText.trim() ||
    document.getElementById("customInput").value.trim();

  if (!inputText) {
    alert("Please generate a password or enter custom data!");
    return;
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    inputText
  )}`;
  document.getElementById(
    "qrResult"
  ).innerHTML = `<img src="${qrUrl}" alt="QR Code" loading="lazy" />`;
});

function generatePassword(lower, upper, number, symbol, length) {
  const symbols = "!@#$%^&*(){}[]=<>/,.";
  const randomFunc = {
    lower: () => String.fromCharCode(getSecureRandomIndex(26) + 97),
    upper: () => String.fromCharCode(getSecureRandomIndex(26) + 65),
    number: () => String.fromCharCode(getSecureRandomIndex(10) + 48),
    symbol: () => symbols.charAt(getSecureRandomIndex(symbols.length)),
  };
  const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(
    (item) => Object.values(item)[0]
  );

  if (typesArr.length === 0 || !length) {
    return "";
  }

  const generatedPassword = Array.from({ length }, () => {
    const type = typesArr[getSecureRandomIndex(typesArr.length)];
    const funcName = Object.keys(type)[0];
    return randomFunc[funcName]();
  }).join("");

  return generatedPassword;
}

function getSecureRandomIndex(max) {
  const range = 2 ** 32;
  const limit = range - (range % max);
  const randomValues = new Uint32Array(1);

  do {
    crypto.getRandomValues(randomValues);
  } while (randomValues[0] >= limit);

  return randomValues[0] % max;
}
