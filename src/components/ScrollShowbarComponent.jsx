import { Link } from "react-router-dom";
import { BsArrowLeftCircle, BsArrowRightCircle } from "react-icons/bs";
import dummyPic from "../assets/pg1.jpg";

export default function ScrollShowbarComponent(props) {
  const scroll = (val) => {
    document.getElementsByClassName("recentUploadsContainer")[0].scrollLeft += val;
  };

  const renderCards = () => {
    return props.recentUploads.map((project, index) => (
      <div
        className="flex flex-col bg-white shadow-md rounded-lg overflow-hidden w-64 flex-shrink-0 mx-2"
        key={index}
      >
        <Link to="/project" state={{ index: project.index }}>
          <div
            className="h-40 bg-cover bg-center"
            style={{
              backgroundImage: `url(${
                project.cid ? `https://${project.cid}` : dummyPic
              })`,
            }}
          ></div>
        </Link>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-blue-500 truncate">
            <Link to="/project" state={{ index: project.index }}>
              {project.projectName}
            </Link>
          </h3>
          <p className="text-sm text-gray-600 mt-2 truncate">
            {project.projectDescription}
          </p>
          <p className="text-sm text-gray-500 mt-2">{"By " + project.creatorName}</p>
        </div>
      </div>
    ));
  };

  return (
    <div className="my-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">{props.heading}</h2>
        {props.recentUploads.length ? (
          <div className="flex gap-2">
            <BsArrowLeftCircle
              className="text-gray-500 cursor-pointer hover:text-blue-500 transition"
              size={24}
              onClick={() => scroll(-300)}
            />
            <BsArrowRightCircle
              className="text-gray-500 cursor-pointer hover:text-blue-500 transition"
              size={24}
              onClick={() => scroll(300)}
            />
          </div>
        ) : null}
      </div>

      <div
        className={`recentUploadsContainer flex overflow-x-auto gap-4 ${
          props.recentUploads.length ? "py-4" : "py-8"
        }`}
        style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
      >
        {props.recentUploads.length ? (
          renderCards()
        ) : (
          <p className="text-center text-gray-500">{props.emptyMessage}</p>
        )}
      </div>
    </div>
  );
}
