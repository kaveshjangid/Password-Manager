export function createId() {
    if (crypto?.randomUUID) {
      return crypto.randomUUID();
    }
  
    return `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}`;
  }
  
  const COMMON_PASSWORDS = new Set([
    "password",
    "password123",
    "123456",
    "12345678",
    "123456789",
    "qwerty",
    "qwerty123",
    "admin",
    "admin123",
    "welcome",
    "letmein",
    "iloveyou",
    "abc123",
    "monkey",
    "dragon",
    "football",
    "login",
    "pass123",
  ]);
  
  export function analyzePassword(password = "") {
    if (!password) {
      return {
        score: 0,
        label: "No password",
        level: "none",
        percentage: 0,
        issues: [],
      };
    }
  
    let score = 0;
    const issues = [];
  
    if (COMMON_PASSWORDS.has(password.toLowerCase())) {
      issues.push("This is a commonly used password.");
      score = 0;
    }
  
    if (password.length < 8) {
      issues.push("Use at least 8 characters.");
    } else {
      score += 1;
    }
  
    if (password.length >= 12) {
      score += 1;
    }
  
    if (password.length >= 16) {
      score += 1;
    }
  
    if (/[A-Z]/.test(password)) {
      score += 1;
    } else {
      issues.push("Add uppercase letters.");
    }
  
    if (/[a-z]/.test(password)) {
      score += 1;
    } else {
      issues.push("Add lowercase letters.");
    }
  
    if (/[0-9]/.test(password)) {
      score += 1;
    } else {
      issues.push("Add numbers.");
    }
  
    if (/[^A-Za-z0-9]/.test(password)) {
      score += 1;
    } else {
      issues.push("Add symbols.");
    }
  
    if (/(.)\1{2,}/.test(password)) {
      issues.push("Avoid repeated characters.");
      score -= 1;
    }
  
    if (
      /(1234|2345|3456|4567|5678|6789|abcd|qwer)/i.test(
        password
      )
    ) {
      issues.push("Avoid predictable sequences.");
      score -= 1;
    }
  
    score = Math.max(0, Math.min(score, 7));
  
    let label = "Very Weak";
    let level = "very-weak";
  
    if (score >= 6) {
      label = "Very Strong";
      level = "very-strong";
    } else if (score >= 5) {
      label = "Strong";
      level = "strong";
    } else if (score >= 3) {
      label = "Moderate";
      level = "moderate";
    } else if (score >= 1) {
      label = "Weak";
      level = "weak";
    }
  
    return {
      score,
      label,
      level,
      percentage: Math.round((score / 7) * 100),
      issues,
    };
  }
  
  export function generatePassword(
    length = 20,
    options = {}
  ) {
    const {
      uppercase = true,
      lowercase = true,
      numbers = true,
      symbols = true,
    } = options;
  
    let characters = "";
  
    if (uppercase) {
      characters += "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    }
  
    if (lowercase) {
      characters += "abcdefghijklmnopqrstuvwxyz";
    }
  
    if (numbers) {
      characters += "0123456789";
    }
  
    if (symbols) {
      characters += "!@#$%^&*()-_=+[]{}";
    }
  
    if (!characters) {
      characters =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    }
  
    const randomValues = new Uint32Array(length);
  
    crypto.getRandomValues(randomValues);
  
    let result = "";
  
    for (let i = 0; i < length; i++) {
      result +=
        characters[randomValues[i] % characters.length];
    }
  
    return result;
  }
  
  export function calculateSecurityStats(passwords) {
    const stats = {
      total: passwords.length,
      weak: 0,
      moderate: 0,
      strong: 0,
      veryStrong: 0,
      reused: 0,
      score: 0,
    };
  
    passwords.forEach((item) => {
      const result = analyzePassword(item.password);
  
      if (
        result.level === "weak" ||
        result.level === "very-weak"
      ) {
        stats.weak++;
      } else if (result.level === "moderate") {
        stats.moderate++;
      } else if (result.level === "strong") {
        stats.strong++;
      } else if (result.level === "very-strong") {
        stats.veryStrong++;
      }
    });
  
    const passwordGroups = {};
  
    passwords.forEach((item) => {
      const password = item.password;
  
      if (!passwordGroups[password]) {
        passwordGroups[password] = [];
      }
  
      passwordGroups[password].push(item.id);
    });
  
    Object.values(passwordGroups).forEach((group) => {
      if (group.length > 1) {
        stats.reused += group.length;
      }
    });
  
    if (!passwords.length) {
      return stats;
    }
  
    let score =
      ((stats.strong + stats.veryStrong) /
        stats.total) *
      100;
  
    score -= stats.moderate * 3;
    score -= stats.weak * 8;
    score -= stats.reused * 5;
  
    stats.score = Math.max(
      0,
      Math.min(100, Math.round(score))
    );
  
    return stats;
  }
  
  export function getSecurityMessage(score) {
    if (score >= 90) {
      return "Excellent security posture.";
    }
  
    if (score >= 75) {
      return "Good security, but a few improvements are available.";
    }
  
    if (score >= 50) {
      return "Your vault needs some security improvements.";
    }
  
    return "Several passwords need your attention.";
  }
  
  export function formatDate(timestamp) {
    if (!timestamp) return "Unknown";
  
    return new Date(timestamp).toLocaleDateString(
      "en-IN",
      {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }
    );
  }
  
  export function getInitials(platform = "") {
    const clean = platform.trim();
  
    if (!clean) return "VX";
  
    return clean
      .split(/\s+/)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  }