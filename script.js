// Smooth scrolling to section when button is clicked
// Toggle the navigation actions from the menu button.
const menuButton = document.getElementById("menuBtn");
const navbarButtons = document.querySelector(".navbar-buttons");

if (menuButton && navbarButtons) {
  navbarButtons.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.addEventListener("click", () => {
    const isExpanded = menuButton.getAttribute("aria-expanded") === "true";
    navbarButtons.hidden = isExpanded;
    menuButton.setAttribute("aria-expanded", String(!isExpanded));
    menuButton.setAttribute("aria-label", isExpanded ? "Open menu" : "Close menu");
  });
}

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !menuButton || !navbarButtons || navbarButtons.hidden) {
    return;
  }

  navbarButtons.hidden = true;
  menuButton.setAttribute("aria-expanded", "false");
  menuButton.setAttribute("aria-label", "Open menu");
  menuButton.focus();
});

document
  .getElementById("instructionsBtn")
  ?.addEventListener("click", function () {
    scrollToSection(".instructions");
  });

document
  .getElementById("suggestionsBtn")
  ?.addEventListener("click", function () {
    scrollToSection(".suggestions");
  });

document.getElementById("aboutBtn")?.addEventListener("click", function () {
  scrollToSection(".about");
});

navbarButtons?.addEventListener("click", (event) => {
  if (!event.target.closest("button")) {
    return;
  }

  navbarButtons.hidden = true;
  menuButton?.setAttribute("aria-expanded", "false");
  menuButton?.setAttribute("aria-label", "Open menu");
  menuButton?.focus();
});

const glowTimeouts = new WeakMap();

function scrollToSection(sectionSelector) {
  const section = document.querySelector(sectionSelector);
  if (!section) {
    return;
  }
  const prefersReducedMotion =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  section.scrollIntoView({
    behavior: prefersReducedMotion ? "auto" : "smooth",
  });

  section.classList.add("glow");
  clearTimeout(glowTimeouts.get(section));
  const timeoutId = setTimeout(() => {
    section.classList.remove("glow");
    glowTimeouts.delete(section);
  }, 200);
  glowTimeouts.set(section, timeoutId);
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

clipboardButton?.addEventListener("mouseover", showCopyTooltip);
clipboardButton?.addEventListener("mouseout", hideCopyTooltip);
clipboardButton?.addEventListener("focus", showCopyTooltip);
clipboardButton?.addEventListener("blur", hideCopyTooltip);

clipboardButton?.addEventListener("click", function () {
  const resultElement = document.getElementById("result");
  if (!resultElement) {
    alert("Password result is unavailable. Please reload the page.");
    return;
  }
  const password = resultElement.innerText;
  if (!password) {
    alert("No password to copy!");
    return;
  }

  if (!navigator.clipboard?.writeText) {
    if (copyPasswordWithFallback(password)) {
      alert("Password copied to clipboard!");
    } else {
      alert("Unable to copy password. Please copy it manually.");
    }
    return;
  }

  navigator.clipboard
    .writeText(password)
    .then(() => alert("Password copied to clipboard!"))
    .catch(() => {
      if (!copyPasswordWithFallback(password)) {
        alert("Unable to copy password. Please copy it manually.");
        return;
      }
      alert("Password copied to clipboard!");
    });
});

function copyPasswordWithFallback(password) {
  const previousFocus = document.activeElement;
  const temporaryInput = document.createElement("textarea");
  temporaryInput.value = password;
  temporaryInput.setAttribute("readonly", "");
  temporaryInput.style.position = "fixed";
  temporaryInput.style.opacity = "0";
  document.body.appendChild(temporaryInput);
  temporaryInput.select();

  let copied = false;
  try {
    copied = document.execCommand("copy");
  } catch (error) {
    copied = false;
  } finally {
    temporaryInput.remove();
    previousFocus?.focus();
  }

  return copied;
}

document.getElementById("generate")?.addEventListener("click", function () {
  const lengthInput = document.getElementById("length");
  if (!lengthInput) {
    alert("Password length input is unavailable. Please reload the page.");
    return;
  }
  const length = Number(lengthInput.value);

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

  const resultElement = document.getElementById("result");
  if (!resultElement) {
    alert("Password result is unavailable. Please reload the page.");
    return;
  }

  try {
    resultElement.innerText = generatePassword(
      hasLower,
      hasUpper,
      hasNumber,
      hasSymbol,
      length
    );
    // A password-based QR code must not keep displaying an older password.
    if (!document.getElementById("customInput")?.value.trim()) {
      document.getElementById("qrResult")?.replaceChildren();
    }
  } catch (error) {
    console.error("Password generation failed:", error);
    alert(
      "Secure password generation is unavailable in this browser. Please try a supported browser."
    );
  }
});

// Do not leave a QR code visible after its source data has changed.
document.getElementById("customInput")?.addEventListener("input", function () {
  document.getElementById("qrResult")?.replaceChildren();
});

document.getElementById("generateQR")?.addEventListener("click", function () {
  const customInput = document.getElementById("customInput");
  if (!customInput) {
    alert("Custom data input is unavailable. Please reload the page.");
    return;
  }
  const customData = customInput.value.trim();

  const resultElement = document.getElementById("result");
  if (!resultElement) {
    alert("Password result is unavailable. Please reload the page.");
    return;
  }
  const inputText = customData || resultElement.innerText.trim();

  if (!inputText) {
    alert("Please generate a password or enter custom data!");
    return;
  }

  if (inputText.length > 2000) {
    alert("Custom data must be 2000 characters or fewer.");
    return;
  }

  const confirmationMessage = customData
    ? "This will send your custom data to an external QR service. Continue only if you trust that service with this data."
    : "This will send the generated password to an external QR service. Continue only if you trust that service with this password.";

  if (!window.confirm(confirmationMessage)) {
    return;
  }

  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(
    inputText
  )}`;
  const qrResult = document.getElementById("qrResult");
  if (!qrResult) {
    alert("QR code display is unavailable. Please reload the page.");
    return;
  }
  qrResult.replaceChildren();

  const qrImage = document.createElement("img");
  qrImage.src = qrUrl;
  qrImage.alt = "QR code for the generated password or custom data";
  qrImage.loading = "lazy";
  qrImage.width = 150;
  qrImage.height = 150;
  qrImage.referrerPolicy = "no-referrer";
  qrImage.addEventListener("error", () => {
    // An older image request must not replace a newer QR code or status.
    if (!qrResult.contains(qrImage)) {
      return;
    }
    qrResult.replaceChildren();
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
  if (!Number.isInteger(max) || max <= 0) {
    throw new RangeError("Random index range must be a positive integer.");
  }

  const range = 2 ** 32;
  const limit = range - (range % max);
  const randomValues = new Uint32Array(1);

  if (!globalThis.crypto?.getRandomValues) {
    throw new Error("Secure randomness is unavailable in this browser.");
  }

  do {
    globalThis.crypto.getRandomValues(randomValues);
  } while (randomValues[0] >= limit);

  return randomValues[0] % max;
}
