import { useState } from "react";
import { storage } from "../firebase"
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

function CreateProjectComponent(props) {
  const [formInput, setFormInput] = useState({
    category: "",
    projectName: "",
    description: "",
    creatorName: "",
    image: "",
    link: "",
    goal: 0.00001,
    duration: 1,
    refundPolicy: "",
  });

  const [inputImage, setInputImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setFormInput({ ...formInput, [name]: value });
  }

  async function handleImageChange(e) {
    setInputImage(e.target.files[0]);
  }

  function getCategoryCode() {
    const categoryCode = {
      "design and tech": 0,
      film: 1,
      arts: 2,
      games: 3,
    };
    return categoryCode[formInput["category"]];
  }

  function getRefundPolicyCode() {
    const refundCode = {
      refundable: 0,
      "non-refundable": 1,
    };
    return refundCode[formInput["refundPolicy"]];
  }

  async function submitProjectData(e) {
    e.preventDefault();
    setUploading(true);

    // Upload image to Firebase Storage
    if (inputImage) {
      try {
        const imageRef = ref(storage, `projects/${inputImage.name}`);
        const uploadTask = uploadBytesResumable(imageRef, inputImage);

        uploadTask.on(
          "state_changed",
          (snapshot) => {
            // You can track upload progress here if needed
          },
          (error) => {
            alert("Uploading file error: " + error.message);
            setUploading(false);
          },
          async () => {
            const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
            formInput["image"] = downloadURL;  // Store the Firebase image URL
            handleSubmitTransaction();
          }
        );
      } catch (error) {
        alert("Uploading file error: " + error);
        setUploading(false);
        return;
      }
    } else {
      handleSubmitTransaction();
    }
  }

  const handleSubmitTransaction = async () => {
    // Convert category and refundPolicy to appropriate codes
    if (!Number.isInteger(formInput["category"])) {
      formInput["category"] = getCategoryCode();
    }

    if (!Number.isInteger(formInput["refundPolicy"])) {
      formInput["refundPolicy"] = getRefundPolicyCode();
    }

    formInput["duration"] = parseFloat(formInput["duration"]);
    formInput["goal"] = parseFloat(formInput["goal"]);

    try {
      const txn = await props.contract.createNewProject(
        formInput["projectName"],
        formInput["description"],
        formInput["creatorName"],
        formInput["link"],
        formInput["image"],  // This will be the Firebase URL
        formInput["goal"],
        formInput["duration"],
        formInput["category"],
        formInput["refundPolicy"]
      );

      await txn.wait();
      alert("Project creation complete!");
      document.getElementsByName("projectForm")[0].reset();
      setUploading(false);
    } catch (error) {
      alert("Error on calling function: " + error);
      setUploading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        method="post"
        onSubmit={submitProjectData}
        name="projectForm"
        className="bg-white p-8 rounded-lg shadow-md w-full max-w-lg"
      >
        <h1 className="text-2xl font-bold text-center mb-6">Create Project</h1>

        <label className="block text-gray-700">Category</label>
        <select
          name="category"
          required
          onChange={handleChange}
          className="block w-full mt-2 mb-4 p-2 border rounded-lg"
        >
          <option value="" disabled hidden>
            Select category
          </option>
          <option value="design and tech">Web 3/Blockchain</option>
          <option value="film">AI/ML</option>
          <option value="arts">Full stack</option>
          <option value="games">Frontend/Backend</option>
        </select>

        <label className="block text-gray-700">Project Name</label>
        <input
          name="projectName"
          placeholder="Enter the project name"
          required
          onChange={handleChange}
          className="block w-full mt-2 mb-4 p-2 border rounded-lg"
        />

        <label className="block text-gray-700">Project Description</label>
        <textarea
          name="description"
          placeholder="Enter project description"
          cols="50"
          rows="5"
          required
          onChange={handleChange}
          className="block w-full mt-2 mb-4 p-2 border rounded-lg"
        ></textarea>

        <label className="block text-gray-700">Creator Name</label>
        <input
          name="creatorName"
          placeholder="Enter Creator Name"
          required
          onChange={handleChange}
          className="block w-full mt-2 mb-4 p-2 border rounded-lg"
        />

        <label className="block text-gray-700">Upload Project Image</label>
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="block w-full mt-2 mb-4"
        />
        <p className="text-sm text-gray-500 mb-4">
          *Image of resolution 1920x1080 is preferred for better display
        </p>

        <label className="block text-gray-700">Project Link</label>
        <input
          type="url"
          name="link"
          placeholder="Enter link to the project"
          onChange={handleChange}
          className="block w-full mt-2 mb-4 p-2 border rounded-lg"
        />

        <label className="block text-gray-700">Funding Goal (Sepolia)</label>
        <input
          type="number"
          step="1"
          name="goal"
          placeholder="Enter the funding goal"
          min="1"
          required
          onChange={handleChange}
          className="block w-full mt-2 mb-4 p-2 border rounded-lg"
        />

        <label className="block text-gray-700">Duration (Minutes)</label>
        <input
          type="number"
          name="duration"
          placeholder="Enter the duration for the funding"
          min="1"
          required
          onChange={handleChange}
          className="block w-full mt-2 mb-4 p-2 border rounded-lg"
        />

        <label className="block text-gray-700">Refund Policy</label>
        <select
          name="refundPolicy"
          required
          onChange={handleChange}
          className="block w-full mt-2 mb-4 p-2 border rounded-lg"
        >
          <option value="" disabled hidden>
            Select Refund type
          </option>
          <option value="refundable">Refundable</option>
          <option value="non-refundable">Non-Refundable</option>
        </select>

        <button
          type="submit"
          className="w-full py-2 bg-blue-500 text-white font-bold rounded-lg hover:bg-blue-600 transition duration-200"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default CreateProjectComponent;
