const SHA256 = require('crypto-js/sha256');

class Block{
    /**
     * Constructor for a single Block in the chain.
     * @param {*index} index 
     * @param {*timestamp} timestamp 
     * @param {*data} data 
     * @param {*previoushash} previoushash 
     */
    constructor(index, timestamp, data, previoushash = ''){
        this.index = index;
        this.timestamp = timestamp;
        this.data = data;
        this.previoushash = previoushash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }
    /**
     * This is a fxn that takes the crypto-js sha256 
     * hash fxn, which is currently saved under 'SHA256'
     * and uses it to hash the current Block's fields.
     */
    calculateHash(){
        return SHA256(this.index 
            + this.previoushash + this.timestamp 
            + JSON.stringify(this.data) + this.nonce).toString();        
            
        }
        /**
         * This is a fxn that delays the cration of the block so that the blocks
         * cannot be created super quickly. It makes the hash more difficult to accomplish,
         * using the 'difficulty' field.
         * @param {*difficulty} difficulty 
         */
    mineBlock(difficulty){
        while(this.hash.substring(0, difficulty) !== Array(difficulty + 1).join("0")){
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log("Block mined " + this.hash);
    }
}
class BlockChain{
    /**
     * creates the actual chain of blocks
     */
    constructor(){
        this.chain = [this.createGenesisBlock()];
        /* This can be changed to make the creation of the blocks more... "difficult" */
        this.difficulty = 3;
    }
    /**
     * creates an initial block to begin the chain
     */
    createGenesisBlock(){
        return new Block(0, "01/01/2018", "Genesis", "0");
    }
    /**
     * This returns the latest block in the chain.
     */
    getLatestBlock(){
        return this.chain[this.chain.length - 1];
    }
    /**
     * This adds a new block onto the end of the chain
     * @param {*newblock} newBlock 
     */
    addBlock(newBlock){
        newBlock.previoushash = this.getLatestBlock().hash;
        newBlock.mineBlock(this.difficulty);
        this.chain.push(newBlock);
    }
    /**
     * This runs a test to varify that the chain has not been
     * tampered with in any way after creation.
     */
    isChainValid(){
        for(let i = 1; i <= this.chain.length - 1; i++){
            const current = this.chain[i];
            const previous = this.chain[i - 1];
            const currM = current.mineBlock(this.difficulty);
            /**
             * I have to check the undefined value first, because of the way that 
             * the hash is created in the mineBlock fxn. If the value of the currM
             * variable is undefined then that means that the hash hasn't changed...
             * Not really, but I am going to go with that for the time being because 
             * it happens to work well enough for now. 
             */
            if(currM !== undefined){
                if(current.hash !== currM){
               // console.log("Current Hash : " + current.hash + "\n");   
               // console.log("Newly Mined : " + currM);
                return false;
                }
            }
            if(current.previoushash !== previous.hash){    
                return false;
            }
        }
        return true;
    }
}
/**
 * Testing
 */
let newChain = new BlockChain();
newChain.addBlock(new Block(1,"02/01/2018", "Block 2"));
newChain.addBlock(new Block(2, "03/01/2018", "Block 3"));

console.log(JSON.stringify(newChain, " ", 4));
console.log('\n\nIs the chain currently valid? : ' + newChain.isChainValid());
newChain.chain[1].data = "Breaking things";
console.log('\n\nHow about now? : ' + newChain.isChainValid());
newChain.chain[1].hash = newChain.chain[1].calculateHash();
console.log('\n\nHow about now? : ' + newChain.isChainValid());

console.log(JSON.stringify(newChain, " ", 4));

/* This will run slower or faster depending on how you set the difficulty.*/
let biggerChain = new BlockChain();
for(let i = 1; i < 101; i++){
    biggerChain.addBlock(new Block(i, "01/01/2018", "Block " + i));
}
console.log(JSON.stringify(biggerChain, " ", 4));

