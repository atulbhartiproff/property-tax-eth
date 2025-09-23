// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

struct Property {
    uint256 id;
    string ownerName;
    string location;
    uint256 area;
    uint256 taxAmount;
    bool isPaid;
}

contract PropertyTax {
    // --- State Variables ---
    address public immutable I_ADMIN;
    uint256 private propertyCounter;
    mapping(uint256 => Property) private properties;
    mapping(address => uint256[]) private paidPropertiesByUser;

    // --- Events ---
    event PropertyAdded(uint256 indexed propertyId, string ownerName, uint256 taxAmount);
    event TaxPaid(uint256 indexed propertyId, address indexed payer, uint256 amount);
    event FundsWithdrawn(address indexed to, uint256 amount);

    // --- Errors ---
    error PropertyTax__NotAdmin();
    error PropertyTax__PropertyNotFound();
    error PropertyTax__IncorrectPayment();
    error PropertyTax__AlreadyPaid();
    error PropertyTax__NoFundsToWithdraw();


    constructor() {
        I_ADMIN = msg.sender;
    }

    // --- Modifiers ---
    modifier onlyAdmin() {
        if (msg.sender != I_ADMIN) {
            revert PropertyTax__NotAdmin();
        }
        _;
    }

    function addProperty(
        string memory _ownerName,
        string memory _location,
        uint256 _area,
        uint256 _taxAmountInWei
    ) external onlyAdmin {
        propertyCounter++;
        uint256 propertyId = propertyCounter;
        properties[propertyId] = Property({
            id: propertyId,
            ownerName: _ownerName,
            location: _location,
            area: _area,
            taxAmount: _taxAmountInWei,
            isPaid: false
        });
        emit PropertyAdded(propertyId, _ownerName, _taxAmountInWei);
    }

    function payTax(uint256 _propertyId) external payable {
        Property storage property = properties[_propertyId];

        if (property.id == 0) revert PropertyTax__PropertyNotFound();
        if (property.isPaid) revert PropertyTax__AlreadyPaid();
        if (msg.value != property.taxAmount) revert PropertyTax__IncorrectPayment();

        property.isPaid = true;
        paidPropertiesByUser[msg.sender].push(_propertyId);
        emit TaxPaid(_propertyId, msg.sender, msg.value);
    }

    function withdrawFunds() external onlyAdmin {
        uint256 balance = address(this).balance;
        if (balance == 0) revert PropertyTax__NoFundsToWithdraw();
        
        (bool success, ) = I_ADMIN.call{value: balance}("");
        require(success, "Failed to send funds");
        
        emit FundsWithdrawn(I_ADMIN, balance);
    }

    // --- View Functions ---
    function getPropertyDetails(uint256 _propertyId) external view returns (Property memory) {
        if (properties[_propertyId].id == 0) revert PropertyTax__PropertyNotFound();
        return properties[_propertyId];
    }

    function getPaidPropertiesByUser(address _user) external view returns (uint256[] memory) {
        return paidPropertiesByUser[_user];
    }
}