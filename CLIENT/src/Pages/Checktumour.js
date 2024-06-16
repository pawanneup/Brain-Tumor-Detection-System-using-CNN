// import Layout from "../components/Layout";
// import React from 'react';
// import axios from 'axios';
// import './Checktumor.css';
// import { useState } from 'react';

// function Checktumor() {
//   const [selectedFile, setSelectedFile] = useState(null);

//   const handleFileSelect = (e) => {
//     setSelectedFile(e.target.files[0]);
//   };

//   const handleFileUploadSubmit = async (event) => {
//     event.preventDefault();
//     const formData = new FormData();
//     formData.append('imagefile', selectedFile);

//     try {
//         const response = await axios.post('http://localhost:8000/upload', formData, {
//             headers: {
//                 'Content-Type': 'multipart/form-data'
//             }
//         });
//         console.log(response);
//     } catch (error) {
//         console.error("There was an error uploading the file!", error);
//     }
//   };

//   return (
//     <Layout>
//        <div className="tumor-detection-container">
//       <h1 className="page-title">Check Tumor</h1>
//       <div className="tumor-detection-content">
//         <div className="form-column">
//           <h2 className="section-title">Upload Tumor Image:</h2>
//           <form onSubmit={handleFileUploadSubmit} className="file-upload-form">
//             <input
//               type="file"
//               id="file"
//               accept="image/*"
//               onChange={handleFileSelect}
//               className="file-input"
//             />
//             <label htmlFor="file" className="file-upload-label">
//               Upload Your MRI Image
//             </label>
//             <br />
//             {selectedFile && (
//               <p className="selected-file-path selected-file-box">
//                 {selectedFile.name}
//               </p>
//             )}
//             <button type="submit" className="submit-button white">
//               Click Here to See Result
//             </button>
//           </form>
//         </div>
//         <div className="image-column">
          
//         </div>
//       </div>
//     </div>
//     </Layout>
//   )
// }

// export default Checktumor;


import Layout from "../components/Layout";
import React, { useState } from 'react';
import axios from 'axios';
import './Checktumor.css';

function Checktumor() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState('');
  // const [probability, setProbability] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(false);

  const handleFileSelect = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleFileUploadSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('imagefile', selectedFile);

    try {
      setLoading(true); // Set loading state to true while waiting for response
      const response = await axios.post('http://localhost:8000/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      // Update UI with response data
      setPrediction(response.data.prediction);
      // setProbability(response.data.probability.toFixed(2));
      setStatus(response.data.status);
    } catch (error) {
      console.error("There was an error uploading the file!", error);
      alert("There was an error uploading the file!");
    } finally {
      setLoading(false); // Set loading state back to false after receiving response
    }
  };

  return (
    <Layout>
      <div className="tumor-detection-container">
        <h1 className="page-title">Check Tumor</h1>
        <div className="tumor-detection-content">
          <div className="form-column">
            <h2 className="section-title">Upload Tumor Image:</h2>
            <form onSubmit={handleFileUploadSubmit} className="file-upload-form">
              <input
                type="file"
                id="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="file-input"
              />
              <label htmlFor="file" className="file-upload-label">
                Upload Your MRI Image
              </label>
              <br />
              {selectedFile && (
                <p className="selected-file-path selected-file-box">
                  {selectedFile.name}
                </p>
              )}
              <button type="submit" className="submit-button white" disabled={loading}>
                {loading ? "Processing..." : "Click Here to See Result"}
              </button>
            </form>
          </div>
          <div className="image-column">
            {prediction && (
              <div>
                <h2>Prediction: {prediction}</h2>
                <p>Status: {status}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

export default Checktumor;

