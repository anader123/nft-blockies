const ERC721PayPerMint = artifacts.require("ERC721PayPerMint");

module.exports = async function(deployer) {
  await deployer.deploy(ERC721PayPerMint);
};