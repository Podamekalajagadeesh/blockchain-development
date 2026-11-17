
const crypto = require("crypto");

// 1. Generate SHA-256 hash
function calculateHash(data) {
    return crypto
        .createHash("sha256")
        .update(data)
        .digest("hex");
}

// 2. Create a block
function createBlock(index, data, previousHash) {
    const block = {
        index: index,
        timestamp: Date.now(),
        data: data,
        previousHash: previousHash
    };

    block.hash = calculateHash(
        JSON.stringify(block)
    );

    return block;
}

// 3. Create the blockchain
let blockchain = [];

// 4. Create Genesis Block
function createGenesisBlock() {
    return createBlock(0, "Genesis Block", "0");
}

// 5. Add a new block
function addBlock(data) {
    const previousBlock = blockchain[blockchain.length - 1];

    const newBlock = createBlock(
        previousBlock.index + 1,
        data,
        previousBlock.hash
    );

    blockchain.push(newBlock);
}

// 6. Validate the blockchain
function isChainValid() {
    for (let i = 1; i < blockchain.length; i++) {
        const currentBlock = blockchain[i];
        const previousBlock = blockchain[i - 1];

        const recalculatedHash = calculateHash(
            JSON.stringify({
                index: currentBlock.index,
                timestamp: currentBlock.timestamp,
                data: currentBlock.data,
                previousHash: currentBlock.previousHash
            })
        );

        if (currentBlock.hash !== recalculatedHash) {
            return false;
        }

        if (currentBlock.previousHash !== previousBlock.hash) {
            return false;
        }
    }

    return true;
}

// 7. Build our blockchain
blockchain.push(createGenesisBlock());

addBlock("Alice sends 1 ETH to Bob");
addBlock("Bob sends 0.5 ETH to Charlie");

// 8. Display blockchain
console.log("MY BLOCKCHAIN:");
console.log(JSON.stringify(blockchain, null, 2));

// 9. Validate blockchain
console.log("Is blockchain valid?", isChainValid());

// 10. Test tampering
blockchain[1].data = "Alice sends 100 ETH to Bob";

console.log("After tampering:");
console.log("Is blockchain valid?", isChainValid());
