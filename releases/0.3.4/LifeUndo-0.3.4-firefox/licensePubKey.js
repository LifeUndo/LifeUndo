// LifeUndo VIP License Public Key (ECDSA P-256)
// This is the public key used to verify .lifelic license files
// The private key is kept secure and used only for signing licenses

export const LICENSE_PUB_KEY_JWK = {
  "kty": "EC",
  "crv": "P-256",
  "x": "MKBCTNIcKUSDii11ySs3526iDZ8AiTo7Tu6KPAqv7D4",
  "y": "4Etl6SRW2YiLUrN5vfvVHuhp7x8PxltmWWlbbM4IFyM"
};

// Make it globally available for verifyLicense.js
window.LICENSE_PUB_KEY_JWK = LICENSE_PUB_KEY_JWK;