var TeamBootcampToken = artifacts.require("./TeamBootcampToken.sol");

module.exports = function(deployer) {
  deployer.deploy(TeamBootcampToken);
};