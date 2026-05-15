import pkg from 'hardhat';
const { ethers } = pkg;

async function main() {
    const EHRContract = await ethers.getContractFactory("EHRContract");
    const ehrContract = await EHRContract.deploy();

    await ehrContract.deployed();
    console.log("Contract deployed to:", ehrContract.address);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
