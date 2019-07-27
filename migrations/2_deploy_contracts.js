// migrating the appropriate contracts
var FarmerRole = artifacts.require("../contracts/datesccesscontrol/FarmerRole.sol");
var PartnerRole = artifacts.require("../contracts/datesccesscontrol/PartnerRole.sol");
var ConsumerRole = artifacts.require("../contracts/datesccesscontrol/ConsumerRole.sol");
var SupplyChain = artifacts.require("../contracts/datesbase/SupplyChain.sol");

module.exports = function(deployer) {
  deployer.deploy(FarmerRole);
  deployer.deploy(PartnerRole);
  deployer.deploy(ConsumerRole);
  deployer.deploy(SupplyChain);
};
