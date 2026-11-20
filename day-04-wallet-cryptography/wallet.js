
const crypto = require("crypto");

// 1. Generate a public and private key pair
function createWallet() {
    const { publicKey, privateKey } =
        crypto.generateKeyPairSync("ec", {
            namedCurve: "secp256k1"
        });

    return {
        publicKey,
        privateKey
    };
}

// 2. Create a demo wallet identifier
function getWalletAddress(publicKey) {
    const publicKeyData = publicKey.export({
        type: "spki",
        format: "der"
    });

    const hash = crypto
        .createHash("sha256")
        .update(publicKeyData)
        .digest("hex");

    return "0x" + hash.slice(-40);
}

// 3. Sign a transaction
function signTransaction(transaction, privateKey) {
    const message = JSON.stringify(transaction);

    const signature = crypto.sign(
        "sha256",
        Buffer.from(message),
        privateKey
    );

    return signature.toString("hex");
}

// 4. Verify a transaction signature
function verifyTransaction(transaction, signature, publicKey) {
    const message = JSON.stringify(transaction);

    return crypto.verify(
        "sha256",
        Buffer.from(message),
        publicKey,
        Buffer.from(signature, "hex")
    );
}

// 5. Create two wallets
const alice = createWallet();
const bob = createWallet();

const aliceAddress = getWalletAddress(alice.publicKey);
const bobAddress = getWalletAddress(bob.publicKey);

// 6. Create a transaction
const transaction = {
    from: aliceAddress,
    to: bobAddress,
    amount: 1,
    currency: "ETH"
};

// 7. Alice signs the transaction
const signature = signTransaction(
    transaction,
    alice.privateKey
);

// 8. Verify the transaction
const isValid = verifyTransaction(
    transaction,
    signature,
    alice.publicKey
);

// 9. Display results
console.log("ALICE WALLET:");
console.log(aliceAddress);

console.log("\nBOB WALLET:");
console.log(bobAddress);

console.log("\nTRANSACTION:");
console.log(transaction);

console.log("\nSIGNATURE:");
console.log(signature);

console.log("\nSIGNATURE VALID:", isValid);

// 10. Test transaction tampering
transaction.amount = 100;

const tamperedResult = verifyTransaction(
    transaction,
    signature,
    alice.publicKey
);

console.log("\nAFTER TAMPERING:");
console.log("SIGNATURE VALID:", tamperedResult);
