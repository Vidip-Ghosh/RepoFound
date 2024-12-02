import ScrollShowbarComponent from "./ScrollShowbarComponent";
import { useLocation } from "react-router";
import { useState, useEffect } from "react";

function ProfileComponent(props) {
  const location = useLocation();
  const { address, name } = location.state;
  const [ongoingProjects, setOngoingProjects] = useState([]);
  const [completedProjects, setCompletedProjects] = useState([]);
  const [userFundedProjects, setUserFundedProjects] = useState([]);

  // Fetch projects created by the user
  async function getProjectList() {
    let res;
    try {
      let indexList = await props.contract.getCreatorProjects(address);
      res = await props.contract.getProjectsDetail(indexList).then((res) => {
        let tmp = [];
        for (const index in res) {
          let {
            cid,
            creatorName,
            projectDescription,
            projectName,
            creationTime,
            duration,
          } = { ...res[index] };
          tmp.push({
            cid,
            creatorName,
            projectDescription,
            projectName,
            creationTime,
            duration,
            index: Number(indexList[index]),
          });
        }
        return tmp;
      });
    } catch (error) {
      console.error(error);
      alert("Error Fetching data: " + error);
      return;
    }

    let currProjects = [];
    let finishedProjects = [];
    const currentTime = Date.now() / 1000;

    // Categorize projects
    for (const index in res) {
      const remainingTime =
        Number(res[index].creationTime) +
        Number(res[index].duration) -
        currentTime;

      if (remainingTime < 0) {
        finishedProjects.push(res[index]);
      } else {
        currProjects.push(res[index]);
      }
    }
    setOngoingProjects(currProjects);
    setCompletedProjects(finishedProjects);
  }

  // Fetch projects funded by the user
  async function getUserFundingList() {
    let res;
    try {
      let fundingList = await props.contract
        .getUserFundings(props.userAddress)
        .then((fundingList) => {
          return fundingList.map((fund) => fund.projectIndex);
        });

      res = await props.contract.getProjectsDetail(fundingList).then((res) => {
        return res.map((project, index) => {
          let { cid, creatorName, projectDescription, projectName } = project;
          return {
            cid,
            creatorName,
            projectDescription,
            projectName,
            index: Number(fundingList[index]),
          };
        });
      });
    } catch (error) {
      console.error(error);
      alert("Error fetching user funding list: " + error);
      return;
    }
    setUserFundedProjects(res);
  }

  useEffect(() => {
    getProjectList();
  }, []);

  useEffect(() => {
    if (props.userAddress === address) {
      getUserFundingList();
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Profile Header */}
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
        <p className="text-gray-600 text-lg">{address}</p>
      </div>

      {/* Ongoing Projects */}
      {ongoingProjects.length > 0 && (
        <div className="mt-8">
          <ScrollShowbarComponent
            recentUploads={ongoingProjects}
            heading="Ongoing Projects"
            emptyMessage="No ongoing projects"
          />
        </div>
      )}

      {/* Completed Projects */}
      {completedProjects.length > 0 && (
        <div className="mt-8">
          <ScrollShowbarComponent
            recentUploads={completedProjects}
            heading="Completed Projects"
            emptyMessage="No completed projects"
          />
        </div>
      )}

      {/* User Funded Projects */}
      {address === props.userAddress && userFundedProjects.length > 0 && (
        <div className="mt-8">
          <ScrollShowbarComponent
            recentUploads={userFundedProjects}
            heading="Projects Funded"
            emptyMessage="No projects funded yet"
          />
        </div>
      )}
    </div>
  );
}

export default ProfileComponent;
