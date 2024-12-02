import CategoryComponent from "./Category";
import { useEffect, useState } from "react";
import dummyPic from "../assets/pg1.jpg";
import { Link, useLocation } from "react-router";

export default function DiscoverComponent(props) {
  const location = useLocation();
  const [filter, setFilter] = useState(
    location?.state?.selected >= 0 ? location.state.selected : -1
  );
  const [projects, setProjects] = useState([]);

  const changeFilter = (val) => {
    setFilter(val);
  };

  const getAllProjects = async () => {
    try {
      let res = await props.contract.getAllProjectsDetail().then((res) => {
        return res.map((project, index) => ({
          ...project,
          index,
        }));
      });

      if (filter !== -1) {
        res = res.filter((project) => project.category === filter);
      }

      setProjects(res);
    } catch (err) {
      alert(err);
      console.log(err);
    }
  };

  const renderCards = () => {
    return projects.map((project, index) => (
      <Link to="/project" state={{ index: project.index }} key={index}>
        <div className="bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform hover:scale-105">
          <div
            className="h-48 bg-cover bg-center"
            style={{
              backgroundImage: project.cid
                ? `url(${"https://" + project.cid})`
                : `url(${dummyPic})`,
            }}
          ></div>
          <div className="p-4">
            <h3 className="text-lg font-bold text-gray-900">
              {project.projectName}
            </h3>
            <p className="text-sm text-gray-600 mt-2">
              {project.projectDescription}
            </p>
            <p className="text-sm text-gray-500 mt-2">
              <strong>Creator:</strong> {project.creatorName}
            </p>
          </div>
        </div>
      </Link>
    ));
  };

  useEffect(() => {
    getAllProjects();
  }, [filter]);

  return (
    <div className="min-h-screen bg-gray-100">
      <CategoryComponent
        filter={filter}
        changeCategory={(val) => changeFilter(val)}
      />
      <div className="text-center text-2xl font-bold text-gray-800 mt-8 mb-4">
        Discover
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
        {projects.length !== 0 ? (
          renderCards()
        ) : (
          <div className="text-center text-gray-500 col-span-full">
            No projects found
          </div>
        )}
      </div>
    </div>
  );
}
