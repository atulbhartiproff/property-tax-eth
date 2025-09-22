// SPDX-License-Identifier: MIT
pragma solidity 0.8.20;

import {Test} from "forge-std/Test.sol";
import {PropertyTax, Property} from "../src/PropertyTax.sol";

contract PropertyTaxTest is Test {
    PropertyTax public propertyTax;

    address public admin = makeAddr("admin");
    address public user = makeAddr("user");

    uint256 public constant TAX_AMOUNT = 1 ether;

    function setUp() public {
        vm.prank(admin);
        propertyTax = new PropertyTax();
        
        vm.prank(admin);
        propertyTax.addProperty("Alice", "123 Main St", 1500, TAX_AMOUNT);
    }

    function test_AdminCanAddProperty() public view {
        Property memory prop = propertyTax.getPropertyDetails(1);
        assertEq(prop.ownerName, "Alice");
        assertEq(prop.taxAmount, TAX_AMOUNT);
        assertEq(prop.isPaid, false);
    }

    function test_UserCanPayTax() public {
        vm.deal(user, 2 ether);
        
        vm.prank(user);
        propertyTax.payTax{value: TAX_AMOUNT}(1);

        Property memory prop = propertyTax.getPropertyDetails(1);
        assertEq(prop.isPaid, true);
        assertEq(address(propertyTax).balance, TAX_AMOUNT);
    }

    function test_RevertWhenPayIncorrectAmount() public {
        // --- THIS IS THE FIX ---
        // Give the user ETH so the transaction doesn't fail due to lack of funds.
        vm.deal(user, 2 ether);
        // -----------------------
        
        vm.prank(user);
        vm.expectRevert(PropertyTax.PropertyTax__IncorrectPayment.selector);
        propertyTax.payTax{value: 0.5 ether}(1);
    }

    function test_AdminCanWithdrawFunds() public {
        vm.deal(user, 2 ether);
        vm.prank(user);
        propertyTax.payTax{value: TAX_AMOUNT}(1);
        
        uint256 adminInitialBalance = admin.balance;
        uint256 contractBalance = address(propertyTax).balance;

        vm.prank(admin);
        propertyTax.withdrawFunds();

        assertEq(address(propertyTax).balance, 0);
        assertEq(admin.balance, adminInitialBalance + contractBalance);
    }
}