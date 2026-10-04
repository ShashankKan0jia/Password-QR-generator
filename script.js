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
  if (!section) {
    return;
  }
  section.scrollIntoView({ behavior: "smooth" });

  section.classList.add("glow");
  setTimeout(() => {
    section.classList.remove("glow");
  }, 200);
}

let copyTooltipTimeout;
const clipboardButton = document.getElementById("clipboard");

function showCopyTooltip() {
  clearTimeout(copyTooltipTimeout);
  copyTooltipTimeout = setTimeout(function () {
    clipboardButton.innerText = "Copy to Clipboard";
  }, 500);
}

function hideCopyTooltip() {
  clearTimeout(copyTooltipTimeout);
  clipboardButton.innerText = "📋";
}

clipboardButton.addEventListener("mouseover", showCopyTooltip);
clipboardButton.addEventListener("mouseout", hideCopyTooltip);
clipboardButton.addEventListener("focus", showCopyTooltip);
clipboardButton.addEventListener("blur", hideCopyTooltip);

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

  if (!hasUpper && !hasLower && !hasNumber && !hasSymbol) {
    alert("Select at least one character type.");
    return;
  }

  document.getElementById("result").innerText = generatePassword(
    hasLower,
    hasUpper,
    hasNumber,
    hasSymbol,
    length
  );
});

document.getElementById("generateQR").addEventListener("click", function () {
  const customInput = document.getElementById("customInput");
  const customData = customInput.value.trim();

  const inputText =
    document.getElementById("result").innerText.trim() || customData;

  if (!inputText) {
    alert("Please generate a password or enter custom data!");
    return;
  }

  if (inputText.length > 2000) {
    alert("Custom data must be 2000 characters or fewer.");
    return;
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    inputText
  )}`;
  const qrResult = document.getElementById("qrResult");
  qrResult.replaceChildren();

  const qrImage = document.createElement("img");
  qrImage.src = qrUrl;
  qrImage.alt = "QR Code";
  qrImage.loading = "lazy";
  qrImage.addEventListener("error", () => {
    qrResult.textContent = "Unable to load the QR code. Please try again.";
  });
  qrResult.appendChild(qrImage);
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

  const requiredCharacters = typesArr.map((type) => {
    const funcName = Object.keys(type)[0];
    return randomFunc[funcName]();
  });

  const remainingCharacters = Array.from(
    { length: Math.max(0, length - requiredCharacters.length) },
    () => {
      const type = typesArr[getSecureRandomIndex(typesArr.length)];
      const funcName = Object.keys(type)[0];
      return randomFunc[funcName]();
    }
  );

  const characters = [...requiredCharacters, ...remainingCharacters];

  for (let i = characters.length - 1; i > 0; i -= 1) {
    const swapIndex = getSecureRandomIndex(i + 1);
    [characters[i], characters[swapIndex]] = [
      characters[swapIndex],
      characters[i],
    ];
  }

  return characters.join("");
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
