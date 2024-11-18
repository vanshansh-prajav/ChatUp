const sodium = require('libsodium-wrappers');

// Function to generate a random encryption key
async function generateKey() {
    await sodium.ready; // Ensure sodium is initialized
    const key = sodium.randombytes_buf(sodium.crypto_secretbox_KEYBYTES);
    return sodium.to_base64(key);
}

// Function to encrypt text
async function encrypt(key, text) {
    await sodium.ready; // Ensure sodium is initialized
    const keyBuffer = sodium.from_base64(key); // Decode the base64 key
    const nonce = sodium.randombytes_buf(sodium.crypto_secretbox_NONCEBYTES); // Generate a random nonce

    // Encrypt the message
    const cipherText = sodium.crypto_secretbox_easy(text, nonce, keyBuffer);

    return {
        cipherText: sodium.to_base64(cipherText), // Return as base64 for easy transport
        nonce: sodium.to_base64(nonce), // Nonce is required for decryption
    };
}

// Function to decrypt text
async function decrypt(key, { cipherText, nonce }) {
    await sodium.ready; // Ensure sodium is initialized
    const keyBuffer = sodium.from_base64(key); // Decode the base64 key
    const nonceBuffer = sodium.from_base64(nonce); // Decode the base64 nonce
    const cipherTextBuffer = sodium.from_base64(cipherText); // Decode the base64 ciphertext

    // Decrypt the message
    const decrypted = sodium.crypto_secretbox_open_easy(cipherTextBuffer, nonceBuffer, keyBuffer);
    return sodium.to_string(decrypted);
}

// Main function to demonstrate encryption and decryption
/* async function main() {
    const key = await generateKey();

    // Test data
    const text1 = "test";
    const encryptedData1 = await encrypt(key, text1);
    console.log("Encrypted Text 1:", encryptedData1.cipherText);
    console.log("Decrypted Text 1:", await decrypt(key, encryptedData1));

    const text2 = "hello I’m Sneha";
    const encryptedData2 = await encrypt(key, text2);
    console.log("Encrypted Text 2:", encryptedData2.cipherText);
    console.log("Decrypted Text 2:", await decrypt(key, encryptedData2));
}

main().catch(console.error); */

module.exports = {
    encrypt,
    decrypt
}