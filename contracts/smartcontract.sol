pragma solidity ^0.4.24;

contract TronLuckyShop {

    // role info
    address private owner;

    struct AssistantInfo {
        address addr;
        uint256 deposit;
        bytes32 hash;
    }
    AssistantInfo public assistant;

    // gloabal info
    uint256 public status;
    // status
    // 0: announce the last winner & can begin to buy
    // 1: be buying
    // 2: can begin to draw
    // 3: be drawing

    uint256 public round;
    uint256 public endBuyBlockNum;
    uint256 public totalCoin;
    uint256 public price;

    // round info
    struct LuckyInfo {
        address addr;
        uint256 bonus;
        bool withdraw;
    }
    mapping(uint256 => LuckyInfo) public roundLucky;

    mapping(uint256 => mapping(address => uint256)) public roundBuyer;
    mapping(uint256 => address[]) public roundBuyerList;
    mapping(uint256 => bool) public roundDoRefund;
    mapping(uint256 => mapping(address => bool)) public roundBuyerRefund;

    // fee info
    uint256 private developerLaborFee;
    struct AssistantLaborFeeInfo {
        address addr;
        uint256 laborFee;
        bool withdraw;
    }
    mapping(uint256 => AssistantLaborFeeInfo) public roundAssistantLaborFee;

    // constant info
    uint64 constant private maxBuyUserCnt = 2000; // need !
    uint64 constant private onceMinBuy = 10 * 1000000; // 10 TRX
    uint64 constant private userMaxBuy = 5000 * 1000000; // 5000 TRX, now NOT USED
    uint64 constant private developerLaborFeeNumerator = 4; // 4 / 100
    uint64 constant private assistantLaborFeeNumerator = 1; // 1 / 100
    uint64 constant private denominator = 100;
    uint64 constant public defaultPrice = 50 * 1000000; // 50 TRX
    uint64 constant public minPrice = 1000 * 1000000; // 1000 TRX
    uint64 constant public trustedBlockCnt = 14;
    uint64 constant public refundMultiple = 2;

    constructor () public {
        // status = 0;
        // round = 0;
        owner = msg.sender;
        initRoundData();
        status = 1;
    }

    function initRoundData() private {
        // require(status == 0 || status == 4 || status == 5,
        //     "status != 0 && status != 4 && status != 5"); // can delete
        endBuyBlockNum = 0;
        totalCoin = 0;
        price = defaultPrice;
        round ++;
    }

    function () public payable {} // need !

    modifier onlyOwner {
        require(msg.sender == owner, "msg.sender != owner");
        _;
    }

    modifier onlyAssistant {
        require(msg.sender == assistant.addr, "msg.sender != assistant");
        _;
    }

    // later, everyone can be the assistant
    function setAssistant(address addr) public onlyOwner {
        // otherwise, owner can change assistant when gaming,
        // so transfer to himself the assistant labor fee
        require(status == 1, "status != 1");
        require(addr > 0, "addr <= 0");
        assistant = AssistantInfo(addr, 0, 0);
    }

    function updatePrice(uint256 newPrice) public onlyOwner {
        require(status == 1, "status != 1"); // need ! in status 5, use this price
        require(newPrice <= maxBuyUserCnt * onceMinBuy, "newPrice > maxBuyUserCnt * onceMinBuy");
        require(newPrice % onceMinBuy == 0, "newPrice % onceMinBuy != 0");
        require(newPrice >= minPrice, "newPrice < minPrice");
        price = newPrice;
    }

    // later, everyone can be the assistant
    function commitDeposit() public payable onlyAssistant {
        require(status == 1, "status != 1"); // can delete ?
        require(assistant.deposit + msg.value >= price * (refundMultiple - 1),
            "assistant.deposit + msg.value < price * (refundMultiple - 1)");
        assistant.deposit += msg.value;
    }

    // later, everyone can be the assistant,
    // combine the commitDeposit function and commitHash function
    function commitHash(bytes32 hash) public onlyAssistant {
        // 1. avoid assistant's misoperation
        // 2. the assistant mustn't modify the hash when gaming!
        require(status == 1, "status != 1");
        require(assistant.deposit >= price * (refundMultiple - 1),
            "assistant.deposit < price * (refundMultiple - 1)"); // need !
        assistant.hash = hash;
        status = 2;
    }

    // when nobody calls, it's OK
    // when one person calls, it's OK (the only one will pay the fee...)
    // when two persons  call, it's OK
    // when many persons  call, it's OK
    // when the same person calls many times, it's OK
    function doBuy() public payable returns (bool ret) {

        require(status == 2, "status != 2");
        require(msg.value >= onceMinBuy, "msg.value < onceMinBuy");
        require(msg.value % onceMinBuy == 0, "msg.value % onceMinBuy != 0");
        require(totalCoin + msg.value <= price, "totalCoin + msg.value > price");

        if (roundBuyer[round][msg.sender] == 0) {
            roundBuyerList[round].push(msg.sender);
            require(roundBuyerList[round].length <= maxBuyUserCnt,
                "roundBuyerList[round].length > maxBuyUserCnt");
        }
        roundBuyer[round][msg.sender] += msg.value;
        totalCoin += msg.value;

        if (totalCoin == price) {
            endBuyBlockNum = block.number;
            status = 3;
        }

        return true;
    }

    // when nobody calls, it's changing to doRefund, the assistant will lost deposit
    // when one person calls, it's OK
    // when two persons  call, it's OK
    // when many persons  call, it's OK
    // when the same person calls many times, it's OK
    // will it be hunged ? NO
    // can be called by everyone who has the secret which the assistant hold
    function doLucky(bytes32 secret) public returns (bool ret) {
        require(status == 3, "status != 3");
        uint256 curBlockNum = block.number;
        require(curBlockNum - endBuyBlockNum > trustedBlockCnt,
            "curBlockNum - endBuyBlockNum <= trustedBlockCnt");
        require(curBlockNum - endBuyBlockNum <= 2 * trustedBlockCnt,
            "curBlockNum - endBuyBlockNum > 2 * trustedBlockCnt");
        require(assistant.hash == keccak256(secret));

        uint256 buyerCnt = roundBuyerList[round].length;
        uint256[] memory userEndPosition = new uint256[](buyerCnt);
        uint256 curBegin = 0;
        uint256 interval = 0;
        uint256 i;
        for(i = 0; i < buyerCnt; i++) {
            address curBuyer = roundBuyerList[round][i];
            interval = roundBuyer[round][curBuyer] / onceMinBuy;
            userEndPosition[i] = curBegin + interval - 1;
            curBegin = curBegin + interval;
        }

        // can be delete ?
        require(curBegin == totalCoin / onceMinBuy, "curBegin != totalCoin / onceMinBuy");

        uint256 random = generateRandom(blockhash(endBuyBlockNum), secret);
        uint256 luckyPosition = random % curBegin;

        for(i = 0; i < buyerCnt; i++) {
            if (luckyPosition <= userEndPosition[i]) {
                break;
            }
        }

        // can be delete ?
        require(i < userEndPosition.length, "i >= userEndPosition.length");

        // SafeMath !
        uint256 curDeveloperLaborFee = totalCoin * developerLaborFeeNumerator / denominator;
        developerLaborFee += curDeveloperLaborFee;

        // SafeMath !
        uint256 curAssistantLaborFee = totalCoin * assistantLaborFeeNumerator / denominator;
        roundAssistantLaborFee[round] = AssistantLaborFeeInfo(assistant.addr,
            curAssistantLaborFee, false);

        // SafeMath !
        uint256 luckyBonus = totalCoin - curDeveloperLaborFee - curAssistantLaborFee;
        roundLucky[round] = LuckyInfo(roundBuyerList[round][i], luckyBonus, false);

        // status = 4;
        initRoundData();
        status = 1;
        return true;
    }

    // do send after change status
    // TODO modify
    function sendBonusAndFee(uint256 r) public {
        luckyWithdraw(r);
        assistantFeeWithdraw(r);
    }

    function generateRandom(bytes32 blockHash, bytes32 secret) private returns (uint256 r) {

        bytes32 xorResult = 0;
        assembly {
            xorResult := xor(blockHash, secret)
        }
        return uint256(keccak256(xorResult)); // need keccak256 ?
    }

    // when nobody calls, it's called by the buyers or owner !
    // when one person calls, it's OK
    // when two persons  call, it's OK
    // when many persons  call, it's OK
    // when the same person calls many times, it's OK
    // will be hung ? maybe, but the buyers will call
    // can be called by everyone
    function doRefund() public returns (bool ret) {
        require(status == 3, "status != 3");
        uint256 curBlockNum = block.number;
        require(curBlockNum - endBuyBlockNum > 2 * trustedBlockCnt,
            "curBlockNum - endBuyBlockNum <= 2 * trustedBlockCnt");

        assistant.deposit -= price;
        roundDoRefund[round] = true;

        // status = 5;
        initRoundData();
        status = 1;
        return true;
    }

    // too expensive, DO NOT call
    function sendRefund(uint256 r) public returns (bool ret) {
        require(roundDoRefund[r] == true, "roundDoRefund[r] != true");

        for(uint256 i = 0; i < roundBuyerList[r].length; i++) {
            address u = roundBuyerList[r][i];
            if (roundBuyerRefund[r][u] == true) {
                continue;
            }
            uint256 refund = roundBuyer[r][u] * refundMultiple;
            bool success = u.send(refund); // it's send, will not be re-entrancy attack
            if (success) {
                roundBuyerRefund[r][u] == true;
            }
        }

        return true;
    }


    // when nobody calls, it's called by the lucky or owner
    // when one person calls, it's OK
    // when two persons  call, it's OK
    // when the same person calls many times, it's OK
    function luckyWithdraw(uint256 r) public returns(bool) {

        address lucky = roundLucky[r].addr;
        uint256 bonus = roundLucky[r].bonus;
        bool withdraw = roundLucky[r].withdraw;

        require(withdraw == false, "withdraw != false");
        require(bonus > 0, "bonus <= 0");

        roundLucky[r].withdraw = true;
        bool success = lucky.send(bonus);
        if (!success) {
            revert();
        }

        return true;
    }

    // when nobody calls, it's called by Buyers or owner !
    // when one person calls, it's OK
    // when two persons  call, it's OK
    // when the same person calls many times, it's OK
    function refundWithdraw(uint256 r, address u) public returns(bool) {
        require(roundDoRefund[r] == true, "roundDoRefund[r] != true");
        require(roundBuyerRefund[r][u] == false,
            "roundBuyerRefund[r][u] != false");
        uint256 refund = roundBuyer[r][u] * refundMultiple;
        roundBuyerRefund[r][u] = true;
        bool success = u.send(refund);
        if (!success) {
            revert();
        }

        return true;
    }

    // when nobody calls, it's called by owner
    // when one person calls, it's OK
    // when two persons  call, it's OK
    // when the same person calls many times, it's OK
    function developerFeeWithdraw() public returns(bool) {
        require(developerLaborFee > 0, "developerLaborFee <= 0");
        uint256 developerLaborFeeForSend = developerLaborFee;
        developerLaborFee = 0;
        bool success = owner.send(developerLaborFeeForSend);
        if (!success) {
            revert();
        }
        return true;
    }

    // when nobody calls, it's called by the assistant or owner !
    // when one person calls, it's OK
    // when two persons  call, it's OK
    // when the same person calls many times, it's OK
    function assistantFeeWithdraw(uint256 r) public returns(bool) {
        address addr = roundAssistantLaborFee[r].addr;
        uint256 laborFee = roundAssistantLaborFee[r].laborFee;
        bool withdraw = roundAssistantLaborFee[r].withdraw;

        require(withdraw == false, "withdraw != false");
        require(laborFee > 0, "laborFee <= 0");

        roundAssistantLaborFee[r].withdraw = true;
        bool success = addr.send(laborFee);
        if (!success) {
            revert();
        }

        return true;
    }


    // when nobody calls, it's OK or it's called by assistant
    // when one person calls, it's OK
    // when two persons  call, it's OK
    // when the same person calls many times, it's OK
    // later, before change assistant, the older assistant must call this function !
    function assistantDepositWithdraw() public returns(bool) {
        require(status == 1, "status != 1");
        uint256 curDeposit = assistant.deposit;
        require(curDeposit > 0, "curDeposit <= 0");
        assistant.deposit = 0;
        bool success = assistant.addr.send(curDeposit);
        if (!success) {
            revert();
        }

        return true;
    }
}
