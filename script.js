let copyTooltipTimeout;
const clipboardButton = document.getElementById("clipboard");

clipboardButton.addEventListener("mouseover", function () {
  copyTooltipTimeout = setTimeout(function () {
    clipboardButton.innerText = "Copy to Clipboard";
  }, 2000); // 2000 milliseconds = 2 seconds
});

clipboardButton.addEventListener("mouseout", function () {
  clearTimeout(copyTooltipTimeout);
  clipboardButton.innerText = "📋"; // Reverting back to clipboard icon
});

clipboardButton.addEventListener("click", function () {
  const password = document.getElementById("result").innerText;
  if (!password) {
    alert("No password to copy!");
    return;
  }
  navigator.clipboard
    .writeText(password)
    .then(() => alert("Password copied to clipboard!"));
});

document.getElementById("generate").addEventListener("click", function () {
  const length = parseInt(document.getElementById("length").value);
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
  ).innerHTML = `<img src="${qrUrl}" alt="QR Code" />`;

  // Retain custom input text
  if (!document.getElementById("result").innerText.trim()) {
    document.getElementById("customInput").value = inputText;
  }
});

function generatePassword(lower, upper, number, symbol, length) {
  const randomFunc = {
    lower: () => String.fromCharCode(Math.floor(Math.random() * 26) + 97),
    upper: () => String.fromCharCode(Math.floor(Math.random() * 26) + 65),
    number: () => String.fromCharCode(Math.floor(Math.random() * 10) + 48),
    symbol: () => "!@#$%^&*(){}[]=<>/,.".charAt(Math.floor(Math.random() * 14)),
  };
  const typesArr = [{ lower }, { upper }, { number }, { symbol }].filter(
    (item) => Object.values(item)[0]
  );
  if (typesArr.length === 0) return "";

  let password = "";
  for (let i = 0; i < length; i++) {
    const type = typesArr[Math.floor(Math.random() * typesArr.length)];
    const funcName = Object.keys(type)[0];
    password += randomFunc[funcName]();
  }
  return password;
}
