import { useEffect, useState } from "react";
import CategoryComponent from "./Category";
import ScrollShowbarComponent from "./ScrollShowbarComponent";
import { Link } from "react-router-dom";
import dummyPic from "../assets/pg1.jpg";

export default function HomeComponent(props) {
  const PRECISION = 10 ** 18;
  const [stats, setStats] = useState({
    projects: 0,
    fundings: 0,
    contributors: 0,
  });
  const [featuredRcmd, setFeaturedRcmd] = useState([]);
  const [recentUploads, setRecentUploads] = useState([]);

  const getAllProjects = async () => {
    try {
      const res = await props.contract.getAllProjectsDetail().then((res) => {
        const tmp = [];
        let amount = 0,
          contrib = 0;
        for (const index in res) {
          const {
            amountRaised,
            cid,
            creatorName,
            fundingGoal,
            projectDescription,
            projectName,
            totalContributors,
          } = res[index];
          tmp.push({
            amountRaised,
            cid,
            creatorName,
            fundingGoal,
            projectDescription,
            projectName,
            totalContributors,
            index,
          });
          amount += Number(amountRaised / PRECISION);
          contrib += Number(totalContributors);
        }
        setStats({
          projects: tmp.length,
          fundings: amount,
          contributors: contrib,
        });
        return tmp;
      });
      res.sort((a, b) => b.totalContributors - a.totalContributors);
      setFeaturedRcmd(res.slice(0, 4));
      setRecentUploads(res.slice(4, 24));
    } catch (err) {
      alert(err);
      console.error(err);
    }
  };

  const renderRecommendations = (val) =>
    val.map((project, index) => (
      <div
        className="bg-white shadow-md rounded-lg p-4 flex flex-col gap-2"
        key={index}
      >
        <Link to="/project" state={{ index: project.index }}>
          <div
            className="w-full h-32 bg-cover bg-center rounded-lg"
            style={{
              backgroundImage: `url(${
                project.cid ? `https://${project.cid}` : dummyPic
              })`,
            }}
          ></div>
        </Link>
        <div>
          <Link
            to="/project"
            state={{ index: project.index }}
            className="text-lg font-semibold text-blue-500"
          >
            {project.projectName}
          </Link>
        </div>
        <div className="text-sm text-gray-500">
          {((project.amountRaised / project.fundingGoal) * 100).toFixed(2) +
            "% Funded"}
        </div>
        <div className="text-sm text-gray-700">{"By " + project.creatorName}</div>
      </div>
    ));

  useEffect(() => {
    getAllProjects();
  }, []);

  return (
    <div className="px-4 py-8">
      <CategoryComponent isHome={true} />
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">
          Creative work shows us what’s possible.
        </h2>
        <p className="text-lg">Help fund it here.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center mb-8">
        <div>
          <p className="text-4xl font-bold">{stats.projects}</p>
          <p className="text-sm text-gray-500">projects</p>
        </div>
        <div>
          <p className="text-4xl font-bold">{stats.fundings} Sepolia</p>
          <p className="text-sm text-gray-500">towards creative work</p>
        </div>
        <div>
          <p className="text-4xl font-bold">{stats.contributors}</p>
          <p className="text-sm text-gray-500">backings</p>
        </div>
      </div>
      {featuredRcmd.length !== 0 ? (
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div className="md:col-span-1">
            <div className="bg-white shadow-md rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-4">FEATURED PROJECT</h3>
              <Link to="/project" state={{ index: featuredRcmd[0].index }}>
                <div
                  className="w-full h-48 bg-cover bg-center rounded-lg"
                  style={{
                    backgroundImage: `url(${
                      featuredRcmd[0].cid
                        ? `https://${featuredRcmd[0].cid}`
                        : dummyPic
                    })`,
                  }}
                ></div>
              </Link>
              <div className="mt-4">
                <Link
                  to="/project"
                  state={{ index: featuredRcmd[0].index }}
                  className="text-xl font-semibold text-blue-500"
                >
                  {featuredRcmd[0].projectName}
                </Link>
              </div>
              <p className="text-sm text-gray-700 mt-2">
                {featuredRcmd[0].projectDescription}
              </p>
              <p className="text-sm text-gray-500">
                {"By " + featuredRcmd[0].creatorName}
              </p>
            </div>
          </div>
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold mb-4">
              RECOMMENDED FOR YOU
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {renderRecommendations(featuredRcmd.slice(1, 4))}
            </div>
          </div>
        </div>
      ) : (
        <p className="text-center text-gray-500">No projects found</p>
      )}
      <ScrollShowbarComponent
        recentUploads={recentUploads}
        heading={"RECENT UPLOADS"}
        emptyMessage={"No recent uploads"}
      />
    </div>
  );
}
