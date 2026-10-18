const STORAGE_KEY = "vaultx_encrypted_vault";

const encoder = new TextEncoder();
const decoder = new TextDecoder();

function bufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);

  let binary = "";

  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }

  return btoa(binary);
}

function base64ToBuffer(base64) {
  const binary = atob(base64);

  const bytes = new Uint8Array(
    binary.length
  );

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }

  return bytes.buffer;
}

async function deriveKey(password, salt) {
  const passwordKey =
    await crypto.subtle.importKey(
      "raw",
      encoder.encode(password),
      "PBKDF2",
      false,
      ["deriveKey"]
    );

  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt,
      iterations: 250000,
      hash: "SHA-256",
    },
    passwordKey,
    {
      name: "AES-GCM",
      length: 256,
    },
    false,
    ["encrypt", "decrypt"]
  );
}

async function encryptVault(vault, key) {
  const iv = crypto.getRandomValues(
    new Uint8Array(12)
  );

  const encoded = encoder.encode(
    JSON.stringify(vault)
  );

  const encrypted =
    await crypto.subtle.encrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      encoded
    );

  return {
    iv: bufferToBase64(iv),
    data: bufferToBase64(encrypted),
  };
}

async function decryptVault(data, key) {
  const iv = new Uint8Array(
    base64ToBuffer(data.iv)
  );

  const encrypted = base64ToBuffer(
    data.data
  );

  const decrypted =
    await crypto.subtle.decrypt(
      {
        name: "AES-GCM",
        iv,
      },
      key,
      encrypted
    );

  return JSON.parse(
    decoder.decode(decrypted)
  );
}

export function vaultExists() {
  return Boolean(
    localStorage.getItem(STORAGE_KEY)
  );
}

export async function createVault(
  masterPassword
) {
  const salt = crypto.getRandomValues(
    new Uint8Array(16)
  );

  const key = await deriveKey(
    masterPassword,
    salt
  );

  const vault = {
    passwords: [],
    notes: [],
    deleted: [],
    settings: {
      autoLock: 5,
      theme: "light",
    },
  };

  const encrypted = await encryptVault(
    vault,
    key
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: 1,
      salt: bufferToBase64(salt),
      ...encrypted,
    })
  );

  return {
    key,
    vault,
  };
}

export async function unlockVault(
  masterPassword
) {
  const stored = localStorage.getItem(
    STORAGE_KEY
  );

  if (!stored) {
    throw new Error("Vault does not exist.");
  }

  const data = JSON.parse(stored);

  if (
    !data.salt ||
    !data.iv ||
    !data.data
  ) {
    throw new Error(
      "Vault data is invalid."
    );
  }

  const salt = new Uint8Array(
    base64ToBuffer(data.salt)
  );

  const key = await deriveKey(
    masterPassword,
    salt
  );

  try {
    const vault = await decryptVault(
      data,
      key
    );

    return {
      key,
      vault,
    };
  } catch {
    throw new Error(
      "Incorrect master password."
    );
  }
}

export async function saveVault(
  vault,
  key
) {
  const stored = localStorage.getItem(
    STORAGE_KEY
  );

  if (!stored) {
    throw new Error("Vault not found.");
  }

  const existing = JSON.parse(stored);

  const encrypted = await encryptVault(
    vault,
    key
  );

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify({
      version: existing.version || 1,
      salt: existing.salt,
      ...encrypted,
    })
  );
}

export function deleteVault() {
  localStorage.removeItem(STORAGE_KEY);
}

export function getRawBackup() {
  return localStorage.getItem(
    STORAGE_KEY
  );
}

export function downloadBackup() {
  const data = getRawBackup();

  if (!data) {
    throw new Error("No vault available.");
  }

  const blob = new Blob([data], {
    type: "application/json",
  });

  const url = URL.createObjectURL(blob);

  const link =
    document.createElement("a");

  link.href = url;
  link.download = `vaultx-backup-${new Date()
    .toISOString()
    .slice(0, 10)}.json`;

  document.body.appendChild(link);

  link.click();

  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function importBackup(file) {
  return new Promise(
    (resolve, reject) => {
      const reader = new FileReader();

      reader.onload = () => {
        try {
          const data = JSON.parse(
            reader.result
          );

          if (
            !data ||
            data.version !== 1 ||
            !data.salt ||
            !data.iv ||
            !data.data
          ) {
            throw new Error(
              "Invalid VaultX backup."
            );
          }

          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify(data)
          );

          resolve();
        } catch (error) {
          reject(error);
        }
      };

      reader.onerror = () => {
        reject(
          new Error(
            "Could not read backup."
          )
        );
      };

      reader.readAsText(file);
    }
  );
}