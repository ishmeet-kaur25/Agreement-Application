import React, { useState } from "react";
import "./AddData.css";


function AddData() {
  const [formData, setFormData] = useState({
    agreementCategory: "",
    agreementType: "",
    agreementStatus: "",
    paymentTerm: "",
    remarks: "",
    counterSignStatus: "",
    action: "",
    startDate: "",
    endDate: "", 
    sbuHead: "", 
    actionTakenDate: "", 
    finalStatusDate: "", 
    remark: "",
    sbuunit: "", 
    accountManager: "", 
    agreementDetail: "",
  });

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const clientTypes = ["C2H", "FTE", "SOW", "NDA"];
  const vendorTypes = ["BGV", "Routing", "Sub Vendor", "Technical Pomel", "Admin", "Others"];

  const showAgreementDetail =
    (formData.agreementCategory === "Vendor" && vendorTypes.includes(formData.agreementType)) ||
    (formData.agreementCategory === "Client" && formData.agreementType !== "");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:5000/agreement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Agreement successfully submitted!");
        setFormData({
          agreementCategory: "",
          agreementType: "",
          agreementStatus: "",
          paymentTerm: "",
          remarks: "",
          counterSignStatus: "",
          action: "",
          startDate: "",
          endDate: "", 
          sbuHead: "", 
          actionTakenDate: "", 
          finalStatusDate: "", 
          remark: "", 
          sbuunit: "", 
          accountManager: "",
          agreementDetail: "",
        });
      } else {
        const errorData = await response.json();
        setMessage(`Error: ${errorData.message || "Submission failed."}`);
      }
    } catch (error) {
      setMessage("Error: Unable to connect to the server.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <h1 className="form-title">Add New Agreement</h1>
      {message && <p className="form-message">{message}</p>}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="agreementCategory" className="form-label">Category:</label>
          <select
            id="agreementCategory"
            name="agreementCategory"
            value={formData.agreementCategory}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select Category</option>
            <option value="Client">Client</option>
            <option value="Vendor">Vendor</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="agreementType" className="form-label">Type:</label>
          <select
            id="agreementType"
            name="agreementType"
            value={formData.agreementType}
            onChange={handleChange}
            className="form-select"
            disabled={!formData.agreementCategory}
          >
            <option value="">Select Type</option>
            {formData.agreementCategory === "Client" &&
              clientTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            {formData.agreementCategory === "Vendor" &&
              vendorTypes.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
          </select>
        </div>

        {showAgreementDetail && (
          <div className="form-group">
            <label htmlFor="agreementDetail" className="form-label">Client/Vendor name:</label>
            <input
              id="agreementDetail"
              type="text"
              name="agreementDetail"
              value={formData.agreementDetail || ""}
              onChange={handleChange}
              placeholder="Enter Agreement Detail"
              className="form-input"
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="startDate" className="form-label">Start Date:</label>
          <input id="startDate" type="date" name="startDate" value={formData.startDate} onChange={handleChange} className="form-input" />
        </div>

        <div className="form-group">
          <label htmlFor="endDate" className="form-label">End Date:</label>
          <input id="endDate" type="date" name="endDate" value={formData.endDate} onChange={handleChange} className="form-input" />
        </div>

        <div className="form-group">
          <label htmlFor="remark" className="form-label">End date Remark:</label>
          <input
            id="finalStatusRemark"
            type="text"
            name="finalStatusRemark"
            value={formData.finalStatusRemark}
            onChange={handleChange}
            placeholder="Enter Remark"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="agreementStatus" className="form-label">Status:</label>
          <select id="agreementStatus" name="agreementStatus" value={formData.agreementStatus} onChange={handleChange} className="form-select">
            <option value="">Select Status</option>
            <option value="Active">Active</option>
            <option value="Renewal In Process">Renewal In Process</option>
            <option value="Closed Not Persuing">Closed Not Persuing</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="sbuunit" className="form-label">SBU unit:</label>
          <select
            id="sbuunit"
            name="sbuunit"
            value={formData.sbuunit}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select SBU Unit</option>
            <option value="Tower - 1 K2">Tower - 1 K2</option>
            <option value="Tower - 2 ATLAS">Tower - 2 ATLAS</option>
            <option value="Tower - 3 EVEREST">Tower - 3 EVEREST</option>
            <option value="Tower - 4">Tower - 4</option>
            <option value="Tower - 6 KAILASH">Tower - 6 KAILASH</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="sbuHead" className="form-label">SBU Head:</label>
          <select
            id="sbuHead"
            name="sbuHead"
            value={formData.sbuHead}
            onChange={handleChange}
            className="form-select"
          >
            <option value="">Select SBU Head</option>
            <option value="Archana Gupta">Archana Gupta</option>
            <option value="Subikash Ghosh">Subikash Ghosh</option>
            <option value="Santu Ghosh">Santu Ghosh</option>
            <option value="Suneel Talikoti">Suneel Talikoti</option>
            <option value="Kushagra Dhar">Kushagra Dhar</option>
            <option value="Rajesh NB">Rajesh NB</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="accountManager" className="form-label">Account Manager:</label>
          <input
            id="accountManager"
            type="text"
            name="accountManager"
            value={formData.accountManager}
            onChange={handleChange}
            placeholder="Enter Account Manager"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="paymentTerm" className="form-label">Payment Term:</label>
          <input id="paymentTerm" type="text" name="paymentTerm" value={formData.paymentTerm} onChange={handleChange} placeholder="Enter Payment Term" className="form-input" />
        </div>

        <div className="form-group">
          <label htmlFor="counterSignStatus" className="form-label">Counter Sign Status:</label>
          <select 
            id="counterSignStatus" 
            name="counterSignStatus" 
            value={formData.counterSignStatus} 
            onChange={handleChange} 
            className="form-select"
          >
            <option value="">Select Counter Sign Status</option>
            <option value="Yes">Yes</option>
            <option value="No">No</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="remarks" className="form-label">Remarks:</label>
          <input id="remarks" type="text" name="remarks" value={formData.remarks} onChange={handleChange} placeholder="Enter Remarks" className="form-input" />
        </div>

        <div className="form-group">
          <label htmlFor="action" className="form-label">Action Taken:</label>
          <input
            id="action"
            type="text"
            name="action"
            value={formData.action}
            onChange={handleChange}
            placeholder="Enter Action Taken"
            className="form-input"
          />
        </div>

        <div className="form-group">
          <label htmlFor="actionTakenDate" className="form-label">Action Taken Date:</label>
          <input id="actionTakenDate" type="date" name="actionTakenDate" value={formData.actionTakenDate} onChange={handleChange} className="form-input" />
        </div>

        <button type="submit" className="submit-button" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}

export default AddData;
