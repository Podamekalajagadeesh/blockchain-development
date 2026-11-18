
const crypto = require("crypto");

// 1. Create a transaction
function createTransaction(sender, receiver, amount) {
    return {
        sender: sender,
        receiver: receiver,
        amount: amount
    };
}

// 2. Validate a transaction
function isValidTransaction(transaction) {
    if (!transaction.sender || !transaction.receiver) {
        return false;
    }

    if (transaction.sender === transaction.receiver) {
        return false;
    }

    if (transaction.amount <= 0) {
        return false;
    }

    return true;
}

// 3. Create a transaction pool
let transactionPool = [];

// 4. Add a valid transaction to the pool
function addTransaction(transaction) {
    if (isValidTransaction(transaction)) {
        transactionPool.push(transaction);
        console.log("Transaction added!");
    } else {
        console.log("Invalid transaction!");
    }
}

// 5. Calculate SHA-256 hash
function calculateHash(data) {
    return crypto
        .createHash("sha256")
        .update(data)
        .digest("hex");
}

// 6. Create a block containing transactions
function createBlock(index, transactions, previousHash) {
    const block = {
        index: index,
        timestamp: Date.now(),
        transactions: transactions,
        previousHash: previousHash
    };

    block.hash = calculateHash(JSON.stringify(block));

    return block;
}

// 7. Create transactions
const tx1 = createTransaction("Alice", "Bob", 1);
const tx2 = createTransaction("Bob", "Charlie", 2);
const tx3 = createTransaction("Charlie", "David", 3);
const tx4 = createTransaction("Alice", "Bob", -5);

// 8. Add transactions
addTransaction(tx1);
addTransaction(tx2);
addTransaction(tx3);
addTransaction(tx4);

// 9. Create a block
const genesisBlock = {
    index: 0,
    timestamp: Date.now(),
    transactions: [],
    previousHash: "0"
};

genesisBlock.hash = calculateHash(JSON.stringify(genesisBlock));

const block1 = createBlock(
    1,
    transactionPool,
    genesisBlock.hash
);

// 10. Display results
console.log("\nTRANSACTION POOL:");
console.log(transactionPool);

console.log("\nNEW BLOCK:");
console.log(JSON.stringify(block1, null, 2));

console.log("\nBLOCK HASH:");
console.log(block1.hash);
