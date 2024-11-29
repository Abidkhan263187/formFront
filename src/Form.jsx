import React, { useEffect, useState } from "react";
import axios from "axios";



function Form() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    residentialAddress: { street1: "", street2: "" },
    permanentAddress: { street1: "", street2: "" },
    isSameAsResidential: false,
    documents: [{ fileName: "", fileType: "", file: null }],
  });
  const [tableData, setTableData] = useState([]);
  const [flag, setFlag] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prevState) => ({
        ...prevState,
        [parent]: {
          ...prevState[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };



  const handleImageChange = (index, e) => {
    const { name, value } = e.target;
    const updatedImages = [...formData.documents];
    updatedImages[index][name] = value;
    setFormData((prevState) => ({
      ...prevState,
      documents: updatedImages,
    }));
  };



  const handleFileChange = (index, e) => {
    const updatedImages = [...formData.documents];
    updatedImages[index].file = e.target.files[0];
    setFormData((prevState) => ({
      ...prevState,
      documents: updatedImages,
    }));
  };

  const addImageField = () => {
    setFormData((prevState) => ({
      ...prevState,
      documents: [
        ...prevState.documents,
        { fileName: "", fileType: "", file: null },
      ],
    }));
  };

  const removeImageField = (index) => {
    const updatedImages = [...formData.documents];
    updatedImages.splice(index, 1);
    setFormData((prevState) => ({
      ...prevState,
      documents: updatedImages,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.firstName || !formData.lastName || !formData.email) {
      alert("Please fill in all required fields");
      return;
    }

    if (!formData.isSameAsResidential) {
      if (
        !formData.permanentAddress.street1 ||
        !formData.permanentAddress.street2
      ) {
        alert("Please provide permanent address details.");
        return;
      }
    }

    const form = new FormData();
    form.append("firstName", formData.firstName);
    form.append("lastName", formData.lastName);
    form.append("email", formData.email);
    form.append("dateOfBirth", formData.dateOfBirth);
    form.append(
      "residentialAddress",
      JSON.stringify(formData.residentialAddress)
    );
    form.append("permanentAddress", JSON.stringify(formData.permanentAddress));
    form.append("isSameAsResidential", formData.isSameAsResidential);

    formData.documents.forEach((doc) => {
      if (doc.file) {
        form.append("documents", doc.file);
      }
    });

    try {
      const response = await axios.post("https://formbackend-2b7a.onrender.com/submit", form, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        dateOfBirth: "",
        residentialAddress: { street1: "", street2: "" },
        permanentAddress: { street1: "", street2: "" },
        isSameAsResidential: false,
        documents: [{ fileName: "", fileType: "", file: null }],
      });
      console.log("Response:", response.data);
      setTableData(response.data.data);
      alert(response.data.message);
      setFlag(!flag);
    } catch (error) {
      alert(error.response.data.message);
      console.error("Error submitting form:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get("https://formbackend-2b7a.onrender.com/getFormdata");
        console.log("Response:", res.data.data);

        setTableData(Array.isArray(res.data.data) ? res.data.data : []);
      } catch (error) {
        console.error("Error fetching data:", error);
        setTableData([]);
      }
    };

    fetchData();
  }, [flag]);

  return (
    <>
      <h1>MERN STACK MACHINE TEST</h1>
      <form onSubmit={handleSubmit} id="form">
        <div id="first">
          <div id="inner">
            <label>
              First Name <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
            />
          </div>
          <div id="inner">
            <label>
              Last Name <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div id="scnd">
          <div id="inner">
            <label>
              Email <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div id="inner">
            <label>
              Date of Birth <span style={{ color: "red" }}>*</span>
            </label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              required
            />
          </div>
        </div>
        <div id="thrd">
          <div id="checkDiv">
            <label>Is Same as Residential</label>
            <input
              required
              type="checkbox"
              id="checkbox"
              name="isSameAsResidential"
              checked={formData.isSameAsResidential}
              onChange={(e) =>
                setFormData((prevState) => ({
                  ...prevState,
                  isSameAsResidential: e.target.checked,
                }))
              }
            />
          </div>
        </div>

        <div id="frth">
          {" "}
          <div id="inner">
            <label>Residential Address</label>
            <span>
              Street 1 <span style={{ color: "red" }}>*</span>
            </span>

            <input
              required
              type="text"
              name="residentialAddress.street1"
              value={formData.residentialAddress.street1}
              onChange={handleInputChange}
            />
          </div>
          <div id="inner" style={{ marginTop: "20px" }}>
            <label></label>
            <span>
              Street 2 <span style={{ color: "red" }}>*</span>
            </span>
            <input
              required
              type="text"
              name="residentialAddress.street2"
              value={formData.residentialAddress.street2}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div id="fifth">
          {" "}
          <div id="inner">
            <label>Permanent Address</label>
            <span>Street 1</span>

            <input
              required
              type="text"
              name="permanentAddress.street1"
              value={formData.permanentAddress.street1}
              onChange={handleInputChange}
              disabled={formData.isSameAsResidential}
            />
          </div>
          <div id="inner" style={{ marginTop: "20px" }}>
            <label></label>
            <span>Street 2</span>
            <input
              required
              type="text"
              name="permanentAddress.street2"
              value={formData.permanentAddress.street2}
              onChange={handleInputChange}
              disabled={formData.isSameAsResidential}
            />
          </div>
        </div>
        <h3>Upload Documents</h3>
        <div id="sixth">
          {formData.documents.map((doc, index) => (
            <div
              key={index}
              style={{ display: "flex", alignItems: "center", gap: "10px" }}
            >
              <div id="updiv">
                <label>
                  {" "}
                  File Name <span style={{ color: "red" }}>*</span>
                </label>
                <input
                  required
                  type="text"
                  name="fileName"
                  value={doc.fileName}
                  placeholder="File Name"
                  onChange={(e) => handleImageChange(index, e)}
                />
              </div>

              <div id="updiv">
                <label>
                  {" "}
                  File Type <span style={{ color: "red" }}>*</span>
                </label>
                <select
                  required
                  name="fileType"
                  value={doc.fileType}
                  onChange={(e) => handleImageChange(index, e)}
                >
                  <option value="">Select Image Type</option>
                  <option value="jpeg">JPEG</option>
                  <option value="png">PNG</option>
                  <option value="gif">GIF</option>
                  <option value="pdf">PDF</option>
                </select>
              </div>

              <div id="updiv">
                <label>
                  {" "}
                  Upload File <span style={{ color: "red" }}>*</span>
                </label>

                <input
                  required
                  type="file"
                  name="file"
                  onChange={(e) => handleFileChange(index, e)}
                />
              </div>
              {index === 0 && (
                <div style={{ marginTop: "10px" }}>
                  <button type="button" onClick={addImageField}>
                    +
                  </button>
                </div>
              )}
              {index > 0 && (
                <button type="button" onClick={() => removeImageField(index)}>
                  -
                </button>
              )}
            </div>
          ))}
        </div>

        <button id="submit" type="submit">
          Submit
        </button>
      </form>

      <table>
        <thead>
          <tr>
            <th>S.No</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>DOB</th>
            <th>Residential Address</th>
            <th>Permanent Address</th>
            <th>Documents</th>
          </tr>
        </thead>
        <tbody>
          {tableData &&
            tableData.map((row, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{row.firstName}</td>
                <td>{row.lastName}</td>
                <td>{row.dateOfBirth.split("T")[0]}</td>
                <td>{"Amritsar"} </td>
                <td>{"Punjab"} </td>
                <td>
                  {row.documents && row.documents.length > 0
                    ? row.documents.map((doc, docIndex) => (
                        <div key={docIndex}>
                          <a
                            href={`http://localhost:5000${doc.filePath}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {doc.fileName}
                          </a>
                        </div>
                      ))
                    : "No documents available"}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </>
  );
}

export default Form;
