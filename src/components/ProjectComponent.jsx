import PaymentModal from "./PaymentModal";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Link } from "react-router-dom";
import dummyPic from "../assets/pg1.jpg";

function ProjectComponent(props) {
  const [modalShow, setModalShow] = useState(false);
  const [projectDetails, setProjectDetails] = useState({
    amountRaised: 0,
    cid: "",
    creatorName: "",
    fundingGoal: 0,
    projectDescription: "",
    projectName: "",
    contributors: [],
    creationTime: 0,
    duration: 0,
    projectLink: "",
    amount: [],
    creatorAddress: "",
    category: "",
  });
  const [timerString, setTimerString] = useState("");
  const [isOver, setIsOver] = useState(false);
  const location = useLocation();
  const { index } = location.state;
  const PRECISION = 10 ** 18;

  function updateProgressBar() {
    let progressBar = document.getElementsByClassName("progressBar")[0];
    progressBar.max = projectDetails.fundingGoal / PRECISION;
    progressBar.value = projectDetails.amountRaised / PRECISION;
  }

  async function getProjectDetails() {
    try {
      let res = await props.contract.getProject(parseInt(index)).then((res) => {
        let {
          amountRaised,
          cid,
          creatorName,
          fundingGoal,
          projectDescription,
          projectName,
          contributors,
          creationTime,
          duration,
          projectLink,
          amount,
          creatorAddress,
          refundPolicy,
          category,
          refundClaimed,
          claimedAmount,
        } = { ...res };

        let tmp = [];
        for (const index in contributors) {
          tmp.push({
            contributor: contributors[index],
            amount: amount[index],
            refundClaimed: refundClaimed[index],
          });
        }

        tmp.sort((a, b) => {
          return b.amount - a.amount;
        });

        let contributorsCopy = [];
        let amountCopy = [];
        let refundClaimedCopy = [];
        for (const index in tmp) {
          contributorsCopy.push(tmp[index].contributor);
          amountCopy.push(tmp[index].amount);
          refundClaimedCopy.push(tmp[index].refundClaimed);
        }

        setProjectDetails({
          amountRaised: amountRaised,
          cid: cid,
          creatorName: creatorName,
          fundingGoal: fundingGoal,
          projectDescription: projectDescription,
          projectName: projectName,
          contributors: contributorsCopy,
          creationTime: creationTime * 1,
          duration: duration,
          projectLink: projectLink,
          amount: amountCopy,
          creatorAddress: creatorAddress,
          refundPolicy: refundPolicy,
          category: category,
          refundClaimed: refundClaimedCopy,
          claimedAmount: claimedAmount,
        });
      });
    } catch (error) {
      alert("Error fetching details");
      console.log(error);
    }
  }

  useEffect(() => {
    getProjectDetails();
  }, []);

  useEffect(() => {
    getProjectDetails();
  }, [modalShow]);

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date().getTime() / 1000;
      const remainingTime =
        Number(projectDetails.creationTime) +
        Number(projectDetails.duration) -
        currentTime;
      const days = Math.floor(remainingTime / (60 * 60 * 24));
      const hours = Math.floor((remainingTime % (60 * 60 * 24)) / (60 * 60));
      const minutes = Math.floor((remainingTime % (60 * 60)) / 60);
      const seconds = Math.floor(remainingTime % 60);

      setTimerString(`${days}d ${hours}h ${minutes}m ${seconds}s`);

      if (remainingTime < 0) {
        setTimerString("0d 0h 0m 0s");
        clearInterval(interval);
        if (projectDetails.creationTime > 0) {
          setIsOver(true);
        }
      }
    }, 1000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [projectDetails.creationTime, projectDetails.duration]);

  useEffect(() => {
    updateProgressBar();
  }, [projectDetails]);

  function onClickPayment() {
    setModalShow(true);
  }

  function getCategoryFromCode(val) {
    let categoryCode = ["Design & Tech", "Film", "Arts", "Games"];
    if (val >= 0 && val < 4) return categoryCode[val];
  }

  function displayDate(val) {
    let date = new Date(val * 1000);
    return (
      date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    );
  }

  function isOwner() {
    return props.userAddress === projectDetails.creatorAddress;
  }

  function claimFundCheck() {
    return projectDetails.refundPolicy
      ? projectDetails.amountRaised / PRECISION
      : projectDetails.amountRaised >= projectDetails.fundingGoal;
  }

  async function claimFund() {
    let txn;
    try {
      txn = await props.contract.claimFund(parseInt(index));
      await txn.wait(txn);
      alert("Fund successfully claimed");

      setProjectDetails({
        ...projectDetails,
        claimedAmount: true,
      });
    } catch (error) {
      alert("Error claiming fund: " + error);
      console.log(error);
    }
  }

  function checkIfContributor() {
    let idx = getContributorIndex();
    return idx >= 0;
  }

  function getContributorIndex() {
    return projectDetails.contributors.indexOf(props.userAddress);
  }

  function claimRefundCheck() {
    return projectDetails.refundPolicy
      ? false
      : projectDetails.amountRaised < projectDetails.fundingGoal;
  }

  async function claimRefund() {
    let txn;
    try {
      txn = await props.contract.claimRefund(parseInt(index));
      await txn.wait(txn);
      alert("Refund claimed successfully");

      let refundClaimedCopy = [...projectDetails.refundClaimed];
      refundClaimedCopy[getContributorIndex()] = true;

      setProjectDetails({
        ...projectDetails,
        refundClaimed: refundClaimedCopy,
      });
    } catch (error) {
      alert("Error claiming refund: " + error);
      console.log(error);
    }
  }

  return (
    <div className="max-w-7xl mx-auto py-8">
      <div className="text-3xl font-semibold">{projectDetails.projectName}</div>
      <div className="flex flex-col md:flex-row mt-6">
        <div className="flex-1">
          <img
            className="w-full h-auto rounded-lg"
            src={projectDetails.cid ? "https://" + projectDetails.cid : dummyPic}
            alt="Project"
          />
        </div>
        <div className="flex-1 ml-6">
          <div className="mb-4">
            <progress
              className="w-full h-2 bg-gray-200 rounded-full"
              min="0"
              max="100"
              value={projectDetails.amountRaised / PRECISION}
            ></progress>
          </div>
          <div className="text-xl font-medium">
            {projectDetails.amountRaised / PRECISION} Sepolia
          </div>
          <p className="mt-2 text-sm text-gray-600">
            pledged of{" "}
            <span className="font-semibold">
              {projectDetails.fundingGoal / PRECISION} Sepolia
            </span>{" "}
            goal
          </p>
          <div className="flex items-center mt-2">
            <div className="text-lg font-semibold">{projectDetails.contributors.length}</div>
            <p className="ml-2 text-sm text-gray-600">backers</p>
          </div>
          <div className="mt-2">
            <div className="text-lg font-semibold">
              {!isOver ? timerString : "Funding duration over!!"}
            </div>
            {!isOver && (
              <p className="text-sm text-gray-500">time left for funding</p>
            )}
          </div>
          {!isOver && !isOwner() && (
            <div className="mt-4">
              <button
                className="bg-blue-600 text-white py-2 px-4 rounded-full"
                onClick={onClickPayment}
              >
                Back this project
              </button>
            </div>
          )}
          {isOwner() && claimFundCheck() && !projectDetails.claimedAmount && (
            <div className="mt-4">
              <button
                className="bg-green-600 text-white py-2 px-4 rounded-full"
                onClick={claimFund}
              >
                Claim Fund
              </button>
            </div>
          )}
          {projectDetails.claimedAmount && (
            <h2 className="text-red-600 mt-4">Fund claimed!</h2>
          )}
          {modalShow && (
            <PaymentModal
              setModalShow={setModalShow}
              contract={props.contract}
              index={index}
              projectDetails={projectDetails}
              setProjectDetails={setProjectDetails}
              userAddress={props.userAddress}
            />
          )}
        </div>
      </div>
      <div className="mt-6 text-lg">{projectDetails.projectDescription}</div>
      <div className="mt-4">
        <Link to={projectDetails.projectLink} className="text-blue-500 underline">
          Visit the project
        </Link>
      </div>
    </div>
  );
}

export default ProjectComponent;
