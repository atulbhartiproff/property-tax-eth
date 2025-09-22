// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract PropertyTax {
    struct Property {
        uint256 id;
        string ownerName;
        string location;
        uint256 area; // in sq ft
        uint256 taxAmount;
        bool isPaid;
    }

    uint256 public propertyCount = 0;
    mapping(uint256 => Property) public properties;
    mapping(address => uint256[]) public ownerProperties;

    address public admin;

    constructor() {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this");
        _;
    }

    function addProperty(
        string memory ownerName,
        string memory location,
        uint256 area,
        uint256 taxAmount
    ) public onlyAdmin {
        propertyCount++;
        properties[propertyCount] = Property({
            id: propertyCount,
            ownerName: ownerName,
            location: location,
            area: area,
            taxAmount: taxAmount,
            isPaid: false
        });
    }

    function payTax(uint256 propertyId) public payable {
        Property storage prop = properties[propertyId];
        require(msg.value == prop.taxAmount, "Incorrect tax amount");
        require(!prop.isPaid, "Tax already paid");

        prop.isPaid = true;
        ownerProperties[msg.sender].push(propertyId);
    }

    function getProperty(uint256 propertyId) public view returns (Property memory) {
        return properties[propertyId];
    }

    function withdraw() public onlyAdmin {
        payable(admin).transfer(address(this).balance);
    }
}
