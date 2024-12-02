import { useEffect } from "react";
import { useNavigate } from "react-router";

export default function CategoryComponent(props) {
  const navigate = useNavigate();

  const onClickFilter = (val) => {
    if (!props.isHome) {
      if (props.filter !== val) {
        props.changeCategory(val);
      } else {
        props.changeCategory(-1);
        document.getElementsByClassName("categoryItem")[val].blur();
      }
    } else {
      navigate("discover", {
        state: {
          selected: val,
        },
      });
    }
  };

  const setSelectedFocus = () => {
    props.filter !== -1 &&
      document.getElementsByClassName("categoryItem")[props.filter]?.focus();
  };

  useEffect(() => {
    setSelectedFocus();
  }, []);

  return (
    <div className="flex justify-center gap-4 mt-4">
      <button
        className={`categoryItem px-4 py-2 rounded-md focus:outline-none transition ${
          props.filter === 0
            ? "bg-blue-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
        tabIndex="1"
        onClick={() => onClickFilter(0)}
      >
        Web3/Blockchain
      </button>
      <button
        className={`categoryItem px-4 py-2 rounded-md focus:outline-none transition ${
          props.filter === 1
            ? "bg-blue-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
        tabIndex="1"
        onClick={() => onClickFilter(1)}
      >
        AI/ML
      </button>
      <button
        className={`categoryItem px-4 py-2 rounded-md focus:outline-none transition ${
          props.filter === 2
            ? "bg-blue-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
        tabIndex="1"
        onClick={() => onClickFilter(2)}
      >
        Full Stack
      </button>
      <button
        className={`categoryItem px-4 py-2 rounded-md focus:outline-none transition ${
          props.filter === 3
            ? "bg-blue-500 text-white"
            : "bg-gray-200 hover:bg-gray-300"
        }`}
        tabIndex="1"
        onClick={() => onClickFilter(3)}
      >
        Frontend/Backend
      </button>
    </div>
  );
}
