async function main() {
  const Crowdfunding = await ethers.getContractFactory("crowdfunding")
  const crowdfunding = await Crowdfunding.deploy()

  console.log("Crowdfunding deployed to:", crowdfunding.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
