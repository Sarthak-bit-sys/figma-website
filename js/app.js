/**
 * Wilyer Authentication System - JavaScript Core Logic
 * Handles interactive screen switching, validation, eye toggles, OTP handling, and notifications.
 */

document.addEventListener("DOMContentLoaded", () => {
  // Navigation & Screen Management
  const demoNavBtns = document.querySelectorAll(".demo-nav-btn");
  const screens = document.querySelectorAll(".auth-screen");
  const illustrationSvgs = document.querySelectorAll(".screen-illustration");
  const illustrationTitle = document.getElementById("illustrationTitle");
  const illustrationDesc = document.getElementById("illustrationDesc");

  // Screen Context Descriptions & Illustrations
  const screenMetaData = {
    login: {
      title: "Seamless Workspace Access",
      desc: "Manage your digital signage, displays, and media content centrally with enterprise-grade security.",
    },
    signup: {
      title: "Join Wilyer Platform",
      desc: "Create your workspace account in minutes and start managing smart digital screens worldwide.",
    },
    forgot: {
      title: "Account Recovery",
      desc: "Don't worry! We will help you securely verify your identity and recover your account access.",
    },
    otp: {
      title: "Two-Factor Verification",
      desc: "We take security seriously. Please check your inbox for the 6-digit confirmation code.",
    },
    reset: {
      title: "Create New Password",
      desc: "Set a strong, unique password to ensure your Wilyer administration dashboard stays safe.",
    },
  };

  /**
   * Switch Active Screen
   * @param {string} screenId
   */
  function navigateToScreen(screenId) {
    // Update Demo Bar Buttons
    demoNavBtns.forEach((btn) => {
      if (btn.dataset.screen === screenId) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    // Update Form Screens
    screens.forEach((screen) => {
      if (screen.id === `${screenId}Screen`) {
        screen.classList.add("active");
      } else {
        screen.classList.remove("active");
      }
    });

    // Update Left Panel Illustration
    illustrationSvgs.forEach((svg) => {
      if (svg.dataset.illustration === screenId) {
        svg.style.display = "block";
      } else {
        svg.style.display = "none";
      }
    });

    // Update Illustration Captions
    if (screenMetaData[screenId]) {
      if (illustrationTitle)
        illustrationTitle.textContent = screenMetaData[screenId].title;
      if (illustrationDesc)
        illustrationDesc.textContent = screenMetaData[screenId].desc;
    }

    // Reset inline error tooltips and field errors
    clearAllErrors();
  }

  // Bind Demo Navigation Bar
  demoNavBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const screenId = btn.dataset.screen;
      if (screenId) navigateToScreen(screenId);
    });
  });

  // Bind In-Form Screen Transition Links
  document.querySelectorAll("[data-target-screen]").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetScreen = link.dataset.targetScreen;
      if (targetScreen) navigateToScreen(targetScreen);
    });
  });

  // Password Visibility Eye Toggle
  document.querySelectorAll(".toggle-password-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const targetInputId = btn.dataset.for;
      const input = document.getElementById(targetInputId);
      if (input) {
        const isPassword = input.type === "password";
        input.type = isPassword ? "text" : "password";
        btn.classList.toggle("showing", isPassword);
        btn.setAttribute(
          "aria-label",
          isPassword ? "Hide password" : "Show password",
        );
      }
    });
  });

  // Password Strength Meter Listener (for Sign Up and Reset Password)
  function initPasswordStrength(inputId, meterId, textId) {
    const passwordInput = document.getElementById(inputId);
    const meterSegments = document.querySelectorAll(
      `#${meterId} .strength-segment`,
    );
    const textLabel = document.getElementById(textId);

    if (!passwordInput || !meterSegments.length) return;

    passwordInput.addEventListener("input", () => {
      const val = passwordInput.value;
      let score = 0;

      if (val.length >= 8) score++;
      if (/[A-Z]/.test(val)) score++;
      if (/[0-9]/.test(val)) score++;
      if (/[^A-Za-z0-9]/.test(val)) score++;

      // Reset
      meterSegments.forEach((seg) => (seg.style.background = "#e2e8f0"));

      if (val.length === 0) {
        if (textLabel) textLabel.textContent = "";
        return;
      }

      const colors = ["#ef4444", "#f59e0b", "#3b82f6", "#10b981"];
      const labels = ["Weak", "Fair", "Good", "Strong"];

      for (let i = 0; i < score; i++) {
        if (meterSegments[i])
          meterSegments[i].style.background = colors[score - 1];
      }

      if (textLabel) {
        textLabel.textContent = labels[score - 1] || "Weak";
        textLabel.style.color = colors[score - 1] || "#ef4444";
      }
    });
  }

  initPasswordStrength(
    "signupPassword",
    "signupStrengthMeter",
    "signupStrengthText",
  );
  initPasswordStrength(
    "resetPassword",
    "resetStrengthMeter",
    "resetStrengthText",
  );

  // OTP 6-Digit Code Input Handler
  const otpBoxes = document.querySelectorAll(".otp-box");
  otpBoxes.forEach((box, index) => {
    box.addEventListener("input", (e) => {
      const value = e.target.value;
      if (value.length >= 1) {
        e.target.value = value[0]; // limit to single digit
        if (index < otpBoxes.length - 1) {
          otpBoxes[index + 1].focus();
        }
      }
    });

    box.addEventListener("keydown", (e) => {
      if (e.key === "Backspace" && !box.value && index > 0) {
        otpBoxes[index - 1].focus();
      }
    });

    box.addEventListener("paste", (e) => {
      e.preventDefault();
      const pasteData = (e.clipboardData || window.clipboardData)
        .getData("text")
        .trim();
      if (/^\d{6}$/.test(pasteData)) {
        pasteData.split("").forEach((char, i) => {
          if (otpBoxes[i]) otpBoxes[i].value = char;
        });
        otpBoxes[otpBoxes.length - 1].focus();
      }
    });
  });

  // OTP Resend Countdown Timer
  let timerInterval = null;
  function startOtpTimer() {
    let secondsLeft = 60;
    const timerDisplay = document.getElementById("otpTimerDisplay");
    const resendBtn = document.getElementById("resendOtpBtn");

    if (!timerDisplay || !resendBtn) return;

    resendBtn.style.pointerEvents = "none";
    resendBtn.style.opacity = "0.5";

    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      secondsLeft--;
      timerDisplay.textContent = `${secondsLeft}s`;

      if (secondsLeft <= 0) {
        clearInterval(timerInterval);
        timerDisplay.textContent = "0s";
        resendBtn.style.pointerEvents = "auto";
        resendBtn.style.opacity = "1";
      }
    }, 1000);
  }

  const resendBtn = document.getElementById("resendOtpBtn");
  if (resendBtn) {
    resendBtn.addEventListener("click", (e) => {
      e.preventDefault();
      showToast("New OTP code sent to your registered email!", "success");
      startOtpTimer();
    });
  }

  // Toast Notification System
  function showToast(message, type = "error") {
    const container = document.getElementById("toastContainer");
    if (!container) return;

    const toast = document.createElement("div");
    toast.className = `toast-alert ${type}`;

    const iconSymbol = type === "error" ? "!" : "✓";

    toast.innerHTML = `
      <div class="toast-content">
        <span class="toast-icon">${iconSymbol}</span>
        <span>${message}</span>
      </div>
      <button class="toast-close-btn" aria-label="Close notification">&times;</button>
      <div class="toast-progress"></div>
    `;

    container.appendChild(toast);

    const closeBtn = toast.querySelector(".toast-close-btn");
    closeBtn.addEventListener("click", () => {
      toast.style.animation = "toastSlideIn 0.2s reverse forwards";
      setTimeout(() => toast.remove(), 200);
    });

    setTimeout(() => {
      if (toast.parentNode) {
        toast.style.animation = "toastSlideIn 0.2s reverse forwards";
        setTimeout(() => toast.remove(), 200);
      }
    }, 4000);
  }

  // Account Credentials Store with Passwords and Old Passwords History
  const DEFAULT_ACCOUNTS = [
    { email: "admin@wilyer.com", pass: "Admin123!", oldPasses: [] },
    { email: "user@wilyer.com", pass: "User123!", oldPasses: [] },
    { email: "test@wilyer.com", pass: "Test123!", oldPasses: [] },
    { email: "gaurav@wilyer.com", pass: "Gaurav123!", oldPasses: [] },
    { email: "9876543210", pass: "Phone123!", oldPasses: [] },
  ];

  function getAccountsMap() {
    try {
      const stored = localStorage.getItem("wilyer_user_accounts");
      if (stored) {
        try {
          return JSON.parse(stored);
        } catch (e) {
          // if primary data corrupted, try backup
          const backup = localStorage.getItem("wilyer_user_accounts_backup");
          if (backup) {
            try {
              return JSON.parse(backup);
            } catch (e2) {
              // fall through to defaults
            }
          }
        }
      }
    } catch (e) {}
    return DEFAULT_ACCOUNTS;
  }

  function saveAccountsMap(accounts) {
    try {
      const payload = JSON.stringify(accounts);
      // save primary
      localStorage.setItem("wilyer_user_accounts", payload);
      // also save a backup copy to recover from accidental corruption
      localStorage.setItem("wilyer_user_accounts_backup", payload);
    } catch (e) {
      // best-effort persistence — if localStorage is unavailable, there's not much we can do here
      console.error("Failed to save accounts map", e);
    }
  }

  function findAccount(identifier) {
    if (!identifier) return null;
    const accounts = getAccountsMap();
    const cleanId = identifier.trim().toLowerCase();
    return accounts.find((a) => a.email.toLowerCase() === cleanId) || null;
  }

  function registerNewAccount(identifier, password) {
    if (!identifier) return;
    const accounts = getAccountsMap();
    const cleanId = identifier.trim().toLowerCase();
    const existing = accounts.find((a) => a.email.toLowerCase() === cleanId);
    if (existing) {
      if (existing.pass !== password) {
        if (!existing.oldPasses) existing.oldPasses = [];
        if (!existing.oldPasses.includes(existing.pass)) {
          existing.oldPasses.push(existing.pass);
        }
        existing.pass = password;
      }
    } else {
      accounts.push({ email: cleanId, pass: password, oldPasses: [] });
    }
    saveAccountsMap(accounts);

    // Keep registered users list synced
    const regList = getRegisteredUsers();
    if (!regList.some((u) => u.toLowerCase() === cleanId)) {
      regList.push(cleanId);
      localStorage.setItem("wilyer_registered_users", JSON.stringify(regList));
    }
  }

  function updateAccountPassword(identifier, newPassword) {
    if (!identifier) return false;
    const accounts = getAccountsMap();
    const cleanId = identifier.trim().toLowerCase();
    const account = accounts.find((a) => a.email.toLowerCase() === cleanId);
    if (account) {
      if (!account.oldPasses) account.oldPasses = [];
      if (!account.oldPasses.includes(account.pass)) {
        account.oldPasses.push(account.pass);
      }
      account.pass = newPassword;
      saveAccountsMap(accounts);
      return true;
    }
    accounts.push({ email: cleanId, pass: newPassword, oldPasses: [] });
    saveAccountsMap(accounts);
    return true;
  }

  // Registered Users Registry with LocalStorage Persistence
  function getRegisteredUsers() {
    const accounts = getAccountsMap();
    return accounts.map((a) => a.email);
  }

  function isUserRegistered(identifier) {
    if (!identifier) return false;
    const cleanId = identifier.trim().toLowerCase();
    const accounts = getAccountsMap();
    return accounts.some((a) => a.email.toLowerCase() === cleanId);
  }

  function registerUser(identifier) {
    if (!identifier) return;
    registerNewAccount(identifier, "Password123!");
  }

  // Regex Helpers for Validation
  function isValidEmail(email) {
    if (!email) return false;
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return re.test(email.trim());
  }

  function isValidPhone(phone) {
    if (!phone) return false;
    const re = /^[0-9+\s()-]{7,15}$/;
    return re.test(phone.trim());
  }

  // Clear All Validation Errors
  function clearAllErrors() {
    document
      .querySelectorAll(".form-tooltip-error")
      .forEach((el) => el.remove());
    document.querySelectorAll(".field-error-msg").forEach((el) => el.remove());
    document.querySelectorAll(".auth-input").forEach((input) => {
      input.classList.remove("is-invalid");
    });
  }

  // Set Inline Field Error Message under Input
  function setFieldError(inputElement, message) {
    if (!inputElement) return;
    inputElement.classList.add("is-invalid");

    const formGroup = inputElement.closest(".form-group");
    if (!formGroup) return;

    let errorEl = formGroup.querySelector(".field-error-msg");
    if (!errorEl) {
      errorEl = document.createElement("div");
      errorEl.className = "field-error-msg";
      formGroup.appendChild(errorEl);
    }
    errorEl.innerHTML = `<span class="error-icon">⚠️</span> <span>${message}</span>`;
  }

  // Clear Single Field Error
  function clearFieldError(inputElement) {
    if (!inputElement) return;
    inputElement.classList.remove("is-invalid");
    const formGroup = inputElement.closest(".form-group");
    if (formGroup) {
      const errorEl = formGroup.querySelector(".field-error-msg");
      if (errorEl) {
        errorEl.remove();
      }
    }
  }

  // Clear errors dynamically as the user types
  document.querySelectorAll(".auth-input").forEach((input) => {
    input.addEventListener("input", () => {
      clearFieldError(input);
    });
  });

  // Handle Login Form Submit with Invalidated Old Password & Incorrect Password Checks
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearAllErrors();

      const emailOrPhone = document.getElementById("emailOrPhone");
      const password = document.getElementById("loginPassword");
      const btn = loginForm.querySelector(".auth-btn-primary");

      let isValid = true;
      let firstErrorInput = null;

      // 1. Email or Phone validation & Registration Check
      const val = emailOrPhone ? emailOrPhone.value.trim() : "";
      if (!val) {
        setFieldError(
          emailOrPhone,
          "Please enter your email address or phone number.",
        );
        isValid = false;
        if (!firstErrorInput) firstErrorInput = emailOrPhone;
      } else if (val.includes("@") || /[a-zA-Z]/.test(val)) {
        if (!isValidEmail(val)) {
          setFieldError(emailOrPhone, "Please enter a valid email address.");
          isValid = false;
          if (!firstErrorInput) firstErrorInput = emailOrPhone;
        } else if (!isUserRegistered(val)) {
          setFieldError(
            emailOrPhone,
            "Email address is not registered. Please Sign Up to create an account.",
          );
          showToast(
            "Email address is not registered. Please Sign Up to create an account.",
            "error",
          );
          isValid = false;
          if (!firstErrorInput) firstErrorInput = emailOrPhone;
        }
      } else if (!isValidPhone(val)) {
        setFieldError(
          emailOrPhone,
          "Please enter a valid email or phone number.",
        );
        isValid = false;
        if (!firstErrorInput) firstErrorInput = emailOrPhone;
      } else if (!isUserRegistered(val)) {
        setFieldError(
          emailOrPhone,
          "Phone number is not registered. Please Sign Up to create an account.",
        );
        showToast(
          "Phone number is not registered. Please Sign Up to create an account.",
          "error",
        );
        isValid = false;
        if (!firstErrorInput) firstErrorInput = emailOrPhone;
      }

      // 2. Password validation & Correctness / Invalidation Verification
      const passVal = password ? password.value : "";
      if (!passVal) {
        setFieldError(password, "Please enter your password.");
        isValid = false;
        if (!firstErrorInput) firstErrorInput = password;
      } else if (isValid && isUserRegistered(val)) {
        const account = findAccount(val);
        if (account) {
          if (account.pass === passVal) {
            // Valid active password
          } else if (account.oldPasses && account.oldPasses.includes(passVal)) {
            // Old invalidated password used!
            setFieldError(
              password,
              "This password is no longer valid. Please use your new password.",
            );
            showToast(
              "This password is no longer valid. Please use your new password.",
              "error",
            );
            isValid = false;
            if (!firstErrorInput) firstErrorInput = password;
          } else {
            // Incorrect password
            setFieldError(password, "Incorrect password. Please try again.");
            showToast("Incorrect password. Please try again.", "error");
            isValid = false;
            if (!firstErrorInput) firstErrorInput = password;
          }
        }
      }

      // Block navigation if invalid
      if (!isValid) {
        if (firstErrorInput) firstErrorInput.focus();
        return;
      }

      localStorage.setItem("wilyer_logged_in_user", val);

      // Trigger Loading State & Authentication Response
      if (btn) {
        btn.classList.add("is-loading");
        btn.disabled = true;
      }

      setTimeout(() => {
        if (btn) {
          btn.classList.remove("is-loading");
          btn.disabled = false;
        }
        showToast("Login successful! Redirecting to workspace...", "success");
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 600);
      }, 700);
    });
  }

  // Handle Sign Up Form Submit with Credentials Persistence
  const signupForm = document.getElementById("signupForm");
  if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearAllErrors();

      const fullName = document.getElementById("signupName");
      const email = document.getElementById("signupEmail");
      const phone = document.getElementById("signupPhone");
      const pass = document.getElementById("signupPassword");
      const confirm = document.getElementById("signupConfirmPassword");
      const terms = document.getElementById("termsCheckbox");
      const btn = signupForm.querySelector(".auth-btn-primary");

      let isValid = true;
      let firstErrorInput = null;

      // 1. Full Name
      if (!fullName || !fullName.value.trim()) {
        setFieldError(fullName, "Please enter your full name.");
        isValid = false;
        if (!firstErrorInput) firstErrorInput = fullName;
      }

      // 2. Email Address (Mandatory, Format Check & Already Registered Check)
      const emailVal = email ? email.value.trim() : "";
      if (!emailVal) {
        setFieldError(email, "Please enter your email address.");
        isValid = false;
        if (!firstErrorInput) firstErrorInput = email;
      } else if (!isValidEmail(emailVal)) {
        setFieldError(email, "Please enter a valid email address.");
        isValid = false;
        if (!firstErrorInput) firstErrorInput = email;
      } else if (isUserRegistered(emailVal)) {
        setFieldError(
          email,
          "Email address is already registered. Please Log In to your account instead.",
        );
        showToast(
          "Email address is already registered. Please Log In instead.",
          "error",
        );
        isValid = false;
        if (!firstErrorInput) firstErrorInput = email;
      }

      // 3. Phone Number
      const phoneVal = phone ? phone.value.trim() : "";
      if (!phoneVal) {
        setFieldError(phone, "Please enter your phone number.");
        isValid = false;
        if (!firstErrorInput) firstErrorInput = phone;
      } else if (!isValidPhone(phoneVal)) {
        setFieldError(phone, "Please enter a valid phone number.");
        isValid = false;
        if (!firstErrorInput) firstErrorInput = phone;
      } else if (isUserRegistered(phoneVal)) {
        setFieldError(
          phone,
          "Phone number is already registered. Please Log In to your account instead.",
        );
        showToast(
          "Phone number is already registered. Please Log In instead.",
          "error",
        );
        isValid = false;
        if (!firstErrorInput) firstErrorInput = phone;
      }

      // 4. Password (Mandatory & Min 8 Characters)
      const passVal = pass ? pass.value : "";
      if (!passVal) {
        setFieldError(pass, "Please enter a password.");
        isValid = false;
        if (!firstErrorInput) firstErrorInput = pass;
      } else if (passVal.length < 8) {
        setFieldError(pass, "Password must be at least 8 characters.");
        isValid = false;
        if (!firstErrorInput) firstErrorInput = pass;
      }

      // 5. Confirm Password (Mandatory & Match Check)
      const confirmVal = confirm ? confirm.value : "";
      if (!confirmVal) {
        setFieldError(confirm, "Please confirm your password.");
        isValid = false;
        if (!firstErrorInput) firstErrorInput = confirm;
      } else if (confirmVal !== passVal) {
        setFieldError(confirm, "Passwords do not match.");
        isValid = false;
        if (!firstErrorInput) firstErrorInput = confirm;
      }

      // 6. Terms Checkbox
      if (!terms || !terms.checked) {
        showToast(
          "You must agree to the Terms of Service to create an account.",
          "error",
        );
        isValid = false;
      }

      // Block form submission & keep user on screen if invalid
      if (!isValid) {
        if (firstErrorInput) firstErrorInput.focus();
        return;
      }

      // Register new user credentials with provided password
      registerNewAccount(emailVal, passVal);
      if (phoneVal) registerNewAccount(phoneVal, passVal);

      if (btn) {
        btn.classList.add("is-loading");
        btn.disabled = true;
      }

      setTimeout(() => {
        if (btn) {
          btn.classList.remove("is-loading");
          btn.disabled = false;
        }
        showToast(
          "Account created successfully! Redirecting to workspace...",
          "success",
        );
        localStorage.setItem("wilyer_logged_in_user", emailVal);
        setTimeout(() => {
          window.location.href = "dashboard.html";
        }, 700);
      }, 900);
    });
  }

  // Handle Forgot Password Form Submit
  const forgotForm = document.getElementById("forgotForm");
  if (forgotForm) {
    forgotForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearAllErrors();

      const email = document.getElementById("forgotEmail");
      const btn = forgotForm.querySelector(".auth-btn-primary");

      const val = email ? email.value.trim() : "";
      if (!val) {
        setFieldError(email, "Please enter your email address or phone.");
        return;
      }

      // Store target account being reset
      sessionStorage.setItem("wilyer_reset_target_email", val);

      if (btn) {
        btn.classList.add("is-loading");
        btn.disabled = true;
      }

      setTimeout(() => {
        if (btn) {
          btn.classList.remove("is-loading");
          btn.disabled = false;
        }
        showToast("Verification OTP has been sent to your email!", "success");
        navigateToScreen("otp");
        startOtpTimer();
        // Auto-fill sample OTP for convenient testing
        const sampleDigits = ["1", "2", "3", "4", "5", "6"];
        otpBoxes.forEach((box, i) => {
          box.value = sampleDigits[i];
        });
      }, 800);
    });
  }

  // Handle OTP Form Submit
  const otpForm = document.getElementById("otpForm");
  if (otpForm) {
    otpForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearAllErrors();

      const enteredOtp = Array.from(otpBoxes)
        .map((b) => b.value)
        .join("");
      const btn = otpForm.querySelector(".auth-btn-primary");

      if (enteredOtp.length < 6) {
        showToast("Please enter the full 6-digit OTP code", "error");
        return;
      }

      if (btn) {
        btn.classList.add("is-loading");
        btn.disabled = true;
      }

      setTimeout(() => {
        if (btn) {
          btn.classList.remove("is-loading");
          btn.disabled = false;
        }
        showToast("OTP verified successfully!", "success");
        navigateToScreen("reset");
      }, 800);
    });
  }

  // Handle Reset Password Form Submit & Previous Password Reuse Check
  const resetForm = document.getElementById("resetForm");
  if (resetForm) {
    resetForm.addEventListener("submit", (e) => {
      e.preventDefault();
      clearAllErrors();

      const pass = document.getElementById("resetPassword");
      const confirm = document.getElementById("resetConfirmPassword");
      const btn = resetForm.querySelector(".auth-btn-primary");

      const passVal = pass ? pass.value : "";
      const confirmVal = confirm ? confirm.value : "";

      let isValid = true;
      let firstErrorInput = null;

      if (!passVal || passVal.length < 8) {
        setFieldError(pass, "Password must be at least 8 characters.");
        isValid = false;
        if (!firstErrorInput) firstErrorInput = pass;
      }

      if (confirmVal !== passVal) {
        setFieldError(confirm, "Passwords do not match.");
        isValid = false;
        if (!firstErrorInput) firstErrorInput = confirm;
      }

      // Check if trying to reuse previous or current password
      const targetEmail =
        sessionStorage.getItem("wilyer_reset_target_email") ||
        "admin@wilyer.com";
      const account = findAccount(targetEmail);
      if (account && passVal) {
        if (
          account.pass === passVal ||
          (account.oldPasses && account.oldPasses.includes(passVal))
        ) {
          setFieldError(
            pass,
            "Your new password cannot be the same as your previous password. Please choose a different password.",
          );
          showToast(
            "Your new password cannot be the same as your previous password. Please choose a different password.",
            "error",
          );
          isValid = false;
          if (!firstErrorInput) firstErrorInput = pass;
        }
      }

      if (!isValid) {
        if (firstErrorInput) firstErrorInput.focus();
        return;
      }

      // Update password for account and push old password into invalidated history
      updateAccountPassword(targetEmail, passVal);

      if (btn) {
        btn.classList.add("is-loading");
        btn.disabled = true;
      }

      setTimeout(() => {
        if (btn) {
          btn.classList.remove("is-loading");
          btn.disabled = false;
        }
        showToast(
          "Password reset successful! Please log in using your new password.",
          "success",
        );
        const loginEmail = document.getElementById("emailOrPhone");
        if (loginEmail) loginEmail.value = targetEmail;
        navigateToScreen("login");
      }, 800);
    });
  }
});
