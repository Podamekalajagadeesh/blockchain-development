
const crypto = require("crypto");

// Mining difficulty
const difficulty = 3;

// 1. Calculate SHA-256 hash
function calculateHash(index, timestamp, data, previousHash, nonce) {
    const blockData =
        index + timestamp + JSON.stringify(data) + previousHash + nonce;

    return crypto
        .createHash("sha256")
        .update(blockData)
        .digest("hex");
}

// 2. Mine a block using Proof of Work
function mineBlock(index, data, previousHash) {
    const timestamp = Date.now();
    let nonce = 0;
    let hash = "";

    const target = "0".repeat(difficulty);

    console.log("Mining block...");

    while (!hash.startsWith(target)) {
        hash = calculateHash(
            index,
            timestamp,
            data,
            previousHash,
            nonce
        );

        if (!hash.startsWith(target)) {
            nonce++;
        }
    }

    console.log("Block mined!");
    console.log("Nonce:", nonce);
    console.log("Hash:", hash);

    return {
        index,
        timestamp,
        data,
        previousHash,
        nonce,
        hash
    };
}

// 3. Create blockchain
let blockchain = [];

// 4. Create Genesis Block
function createGenesisBlock() {
    return mineBlock(0, "Genesis Block", "0");
}

// 5. Add a block
function addBlock(data) {
    const previousBlock = blockchain[blockchain.length - 1];

    const newBlock = mineBlock(
        previousBlock.index + 1,
        data,
        previousBlock.hash
    );

    blockchain.push(newBlock);
}

// 6. Validate blockchain
function isChainValid() {
    const target = "0".repeat(difficulty);

    for (let i = 0; i < blockchain.length; i++) {
        const currentBlock = blockchain[i];

        const recalculatedHash = calculateHash(
            currentBlock.index,
            currentBlock.timestamp,
            currentBlock.data,
            currentBlock.previousHash,
            currentBlock.nonce
        );

        if (currentBlock.hash !== recalculatedHash) {
            return false;
        }

        if (!currentBlock.hash.startsWith(target)) {
            return false;
        }

        if (i > 0) {
            const previousBlock = blockchain[i - 1];

            if (currentBlock.previousHash !== previousBlock.hash) {
                return false;
            }
        } else if (currentBlock.previousHash !== "0") {
            return false;
        }
    }

    return true;
}

// 7. Build blockchain
blockchain.push(createGenesisBlock());

addBlock("Alice sends 1 ETH to Bob");
addBlock("Bob sends 2 ETH to Charlie");

// 8. Display blockchain
console.log("\nMY BLOCKCHAIN:");
console.log(JSON.stringify(blockchain, null, 2));

// 9. Validate blockchain
console.log("\nBlockchain valid:", isChainValid());

// 10. Test tampering
blockchain[1].data = "Alice sends 100 ETH to Bob";

console.log("After tampering:", isChainValid());
