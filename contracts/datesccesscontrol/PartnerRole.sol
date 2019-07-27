pragma solidity ^0.4.24;

// Import the library 'Roles'
import "./Roles.sol";

// Define a contract 'PartnerRole' to manage this role - add, remove, check
contract PartnerRole {
  using Roles for Roles.Role;

  // Define 2 events, one for Adding, and other for Removing
  event PartnerAdded(address indexed account);
  event PartnerRemoved(address indexed account);

  // Define a struct 'partners' by inheriting from 'Roles' library, struct Role
  Roles.Role private partners;

  // In the constructor make the address that deploys this contract the 1st Partner
  constructor() public {
    _addPartner(msg.sender);
  }

  // Define a modifier that checks to see if msg.sender has the appropriate role
  modifier onlyPartner() {
    require(isPartner(msg.sender));
    _;
  }

  // Define a function 'isPartner' to check this role
  function isPartner(address account) public view returns (bool) {
    return partners.has(account);
  }

  // Define a function 'addPartner' that adds this role
  function addPartner(address account) public onlyPartner {
    _addPartner(account);
  }

  // Define a function 'renouncePartner' to renounce this role
  function renouncePartner() public {
    _removePartner(msg.sender);

  }

  // Define an internal function '_addPartner' to add this role, called by 'addPartner'
  function _addPartner(address account) internal {
    partners.add(account);
    emit PartnerAdded(account);
  }

  // Define an internal function '_removePartner' to remove this role, called by 'removePartner'
  function _removePartner(address account) internal {
    partners.remove(account);
    emit PartnerRemoved(account);
  }
}