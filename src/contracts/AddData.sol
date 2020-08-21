pragma solidity ^0.5.0;

contract AddData {
    string public name;
    uint public dataCount = 0;
    mapping(uint => Data) public datas;

    struct Data {
        uint id;
        string jsonvalue;
        uint identity;
        address payable publickey;
        bool purchased;
    }

    event DataCreated(
        uint id,
        string jsonvalue,
        uint identity,
        address payable publickey,
        bool purchased
    );


    constructor() public {
        name = "Secure Software Ecosystem";
    }

    function createData(string memory _jsonvalue, uint _identity) public {
        // Require a valid jsonvalue
        require(bytes(_jsonvalue).length > 0);
        // Require a valid identity
        require(_identity > 0);
        // Increment product count
        dataCount ++;
        // Create the product
        datas[dataCount] = Data(dataCount, _jsonvalue, _identity, msg.sender, false);
        // Trigger an event
        emit DataCreated(dataCount, _jsonvalue, _identity, msg.sender, false);
    }

    
}
