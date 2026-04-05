/* eslint-disable */
import React, { useEffect, useState } from "react";
import axios from "axios";
import * as XLSX from "xlsx";
import "./agreement.css";
import { useNavigate } from "react-router-dom";
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js';

import ChartDataLabels from 'chartjs-plugin-datalabels';
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement, ChartDataLabels);



function AgreementData() {
  const [agreement, setAgreement] = useState([]);
  const [filteredAgreement, setFilteredAgreement] = useState([]);
  const [renewalClients, setRenewalClients] = useState([]);
  const [drillDownData, setDrillDownData] = useState(null);
const [selectedCategory, setSelectedCategory] = useState(null);

  const [statusCounts, setStatusCounts] = useState({
    Active: 0,
    "Renewal In Process": 0,
    "Closed Not Persuing": 0,
  });

  const [categoryCounts, setCategoryCounts] = useState({
    Client: 0,
    Vendor: 0,
    "Sub Vendor": 0,
    "BGV Vendor": 0,
    "Interview Vendor": 0,
    "Routing Partner": 0
  });

  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState(null);
  const [editRowId, setEditRowId] = useState(null);
  const [editedData, setEditedData] = useState({});
  const navigate = useNavigate();
  const [allCategories, setAllCategories] = useState([]);
const [allAgreementTypes, setAllAgreementTypes] = useState([]);

  useEffect(() => {
    const fetchAgreement = async () => {
  try {
    const response = await axios.get("https://agreement-application-1.onrender.com/agreement");
    if (response.data.success) {
      const sortedData = response.data.data.sort(
        (a, b) => new Date(b.created_at) - new Date(a.created_at)
      );
      setAgreement(sortedData);
      setFilteredAgreement(sortedData);
      
      // Extract unique categories and types
      const categories = [...new Set(sortedData.map(item => item["Agreement Category"]))];
      const types = [...new Set(sortedData.map(item => item["Agreement Type"]))];
      
      setAllCategories(categories.filter(Boolean)); // Remove any undefined/null
      setAllAgreementTypes(types.filter(Boolean));
    } else {
      setError("No agreement data found.");
    }
  } catch (err) {
    setError("An error occurred while fetching agreement data.");
  }
};
    fetchAgreement();
  }, []);

  useEffect(() => {
    const counts = {
      Client: 0,
      Vendor: 0,
      "Sub Vendor": 0,
      "BGV Vendor": 0,
      "Interview Vendor": 0,
      "Routing Partner": 0
    };

    const statusCounts = {
      Active: 0,
      "Renewal In Process": 0,
      "Closed Not Persuing": 0,
    };

    const now = new Date();
    const renewalList = [];

    agreement.forEach((item) => {
      const category = item["Agreement Category"];
      if (counts[category] !== undefined) {
        counts[category]++;
      }

      const status = item["Agreement Status"];
      if (statusCounts[status] !== undefined) {
        statusCounts[status]++;
      }

      const endDate = new Date(item["end date"]);
      const daysDiff = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      if (daysDiff > 0 && daysDiff <= 60) {
        renewalList.push(item);
      }
    });

    setCategoryCounts(counts);
    setStatusCounts(statusCounts);
    setRenewalClients(renewalList);
  }, [agreement]);

    const getCategoryChartData = () => {
  // Calculate counts for each category
  const counts = {};
  allCategories.forEach(category => {
    counts[category] = agreement.filter(item => 
      item["Agreement Category"] === category
    ).length;
  });

  const getBarChartData = () => {
  const categories = [...new Set(agreement.map(item => item["Agreement Category"]))].filter(Boolean);
  const statuses = ["Active", "Renewal In Process", "Closed Not Persuing"];

  const datasets = statuses.map(status => {
    return {
      label: status,
      data: categories.map(category => {
        return agreement.filter(item => 
          item["Agreement Category"] === category && 
          item["Agreement Status"] === status
        ).length;
      }),
      backgroundColor: 
        status === "Active" ? '#4BC0C0' :
        status === "Renewal In Process" ? '#FFCE56' :
        '#FF6384' // Closed Not Persuing
    };
  });

  return {
    labels: categories,
    datasets: datasets
  };
};
  
  const filteredCategories = [];
  const filteredCounts = [];
  
  allCategories.forEach(category => {
    if (counts[category] > 0) {
      filteredCategories.push(category);
      filteredCounts.push(counts[category]);
    }
  });

  // If no data, return empty dataset
  if (filteredCategories.length === 0) {
    return {
      labels: ['No Data'],
      datasets: [{
        data: [1],
        backgroundColor: ['#cccccc'],
        hoverBackgroundColor: ['#cccccc']
      }]
    };
  }

  return {
    labels: filteredCategories,
    datasets: [{
      data: filteredCounts,
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
        '#9966FF', '#FF9F40', '#8AC24A', '#FF5722'
      ].slice(0, filteredCategories.length),
      hoverBackgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
        '#9966FF', '#FF9F40', '#8AC24A', '#FF5722'
      ].slice(0, filteredCategories.length)
    }]
  };
};

  const handleCategoryClick = (category) => {
  if (selectedCategory === category) {
    setDrillDownData(null);
    setSelectedCategory(null);
    return;
  }
  
  setSelectedCategory(category);
  
  // Filter agreements by selected category
  const filtered = agreement.filter(item => 
    item["Agreement Category"] === category
  );
  
  // Count agreement types for this category
  const typeCounts = {};
  allAgreementTypes.forEach(type => {
    typeCounts[type] = 0;
  });
  
  filtered.forEach(item => {
    const type = item["Agreement Type"];
    if (type && typeCounts[type] !== undefined) {
      typeCounts[type]++;
    }
  });
  
  // Prepare data for chart - only include types with counts > 0
  const chartLabels = [];
  const chartData = [];
  const backgroundColors = [];
  
  // Color palette for types
  const typeColors = {
    'MSA': '#FF6384',
    'SOW': '#36A2EB',
    'NDA': '#FFCE56',
    'FTE': '#4BC0C0',
    // Add more types and colors as needed
  };
  
  Object.entries(typeCounts).forEach(([type, count]) => {
    if (count > 0) {
      chartLabels.push(type);
      chartData.push(count);
      backgroundColors.push(
        typeColors[type] || getRandomColor() // Fallback for unknown types
      );
    }
  });
  
  setDrillDownData({
    labels: chartLabels,
    datasets: [{
      data: chartData,
      backgroundColor: backgroundColors,
      hoverBackgroundColor: backgroundColors
    }]
  });
};

// Helper function for random colors
const getRandomColor = () => {
  return `#${Math.floor(Math.random()*16777215).toString(16)}`;
};
const pieChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  onClick: (event, elements) => {
    if (elements.length > 0) {
      const index = elements[0].index;
      const label = getCategoryChartData().labels[index];
      handleCategoryClick(label);
    }
  },
  plugins: {
    legend: {
      position: 'right',
      labels: {
        padding: 2,
        font: { size: 12 },
        boxWidth: 10
      }
    },
    tooltip: {
      callbacks: {
        label: function(context) {
          const label = context.label || '';
          const value = context.raw || 0;
          const total = context.dataset.data.reduce((a, b) => a + b, 0);
          const percentage = Math.round((value / total) * 100);
          return `${label}: ${value} (${percentage}%)`;
        }
      }
    },
    datalabels: {
      formatter: (value, context) => {
        const total = context.chart.data.datasets[0].data.reduce((a, b) => a + b, 0);
        const percentage = Math.round((value / total) * 100);
        return `${value}`;
      },
      color: 'black',
      font: {
        weight: 'bold',
        size: 12
      },
      anchor: 'center',
      align: 'center',
      offset: 0
    }
  }
};

const barChartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
    },
    title: {
      display: true,
      text: 'Agreements by Category and Status'
    },
    datalabels: {
      display: false
    }
  },
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
      beginAtZero: true
    }
  }
};

  const applyFilters = () => {
    let result = agreement;

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter((item) => {
        const valuesMatch = Object.values(item)
          .join(" ")
          .toLowerCase()
          .includes(query);

        const now = new Date();
        const endDate = new Date(item["end date"]);
        const daysDiff = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
        const isRenewalNeeded = daysDiff > 0 && daysDiff <= 60;

        const isRenewed = daysDiff > 60 || endDate < now;

        const renewalNeededMatch =
          query.includes("renewal needed") && isRenewalNeeded;

        const renewedMatch =
          query.includes("renewed") && !isRenewalNeeded;

        return valuesMatch || renewalNeededMatch || renewedMatch;
      });
    }

    if (statusFilter) {
      result = result.filter((item) =>
        (item["Agreement Status"] || "")
          .toLowerCase()
          .includes(statusFilter.toLowerCase())
      );
    }

    setFilteredAgreement(result);
  };

  const renderRenewalStatus = (item, isEditing, isRenewal) => {
    if (!isRenewal) {
      return <span className="renewed-status">Renewed</span>;
    }

    if (isEditing) {
      return <span className="editing-status">Editing...</span>;
    }

    return (
      <span
        className="renewal-needed"
        onClick={() => {
          setEditRowId(item.id);
          setEditedData({ ...item });
        }}
      >
        Renewal Needed
      </span>
    );
  };

  useEffect(() => {
    applyFilters();
  }, [searchQuery, statusFilter, agreement]);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredAgreement);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Agreements");
    XLSX.writeFile(workbook, "agreements.xlsx");
  };

  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toISOString().split("T")[0] : "N/A";
  };

const handleSave = async () => {
  try {
    const formatDateForBackend = (date) => {
      if (!date) return null;
      const d = new Date(date);
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    const formattedData = {
      id: editedData.id, // Ensure ID is passed if needed
      "Agreement Status": editedData["Agreement Status"],
      "Agreement Category": editedData["Agreement Category"],
      "Agreement Type": editedData["Agreement Type"],
      "Line Of Business": editedData["Line Of Business"],
      "Payment Term": editedData["Payment Term"],
      "Remarks": editedData["Remarks"],
      "Counter Sign Status": editedData["Counter Sign Status"],
      "Action": editedData["Action"],
      "start date": formatDateForBackend(editedData["start date"]),
      "end date": formatDateForBackend(editedData["end date"]),
      "SBU Head": editedData["SBU Head"],
      "Action Taken Date": formatDateForBackend(editedData["Action Taken Date"]),
      "Final Status": editedData["Final Status"],
      "Final Status Date": formatDateForBackend(editedData["Final Status Date"]),
      "Final Status Remark": editedData["Final Status Remark"],
      "created_at": formatDateForBackend(editedData["Created at"]), // fixed
      "SBU unit": editedData["SBU unit"],
      "Account Manager": editedData["Account Manager"],
      "Agreement Detail": editedData["Agreement Detail"]
    };

    console.log('Sending data to backend:', formattedData);

    const response = await axios.put(
      `https://agreement-application-1.onrender.com/agreement/${editedData.id}`,
      formattedData
    );

    if (response.data.success) {
      const updated = agreement.map((ag) =>
        ag.id === editedData.id ? { ...ag, ...formattedData } : ag
      );
      setAgreement(updated);
      setEditRowId(null);
      calculateRenewalStatus(updated);
    } else {
      alert("Failed to save data: " + response.data.message);
    }
  } catch (err) {
    console.error("Error saving data:", err);
    alert("Failed to save data. Check console for details.");
  }
};


  const calculateRenewalStatus = (data) => {
    const now = new Date();
    const renewalList = data.filter(item => {
      const endDate = new Date(item["end date"]);
      const daysDiff = Math.ceil((endDate - now) / (1000 * 60 * 60 * 24));
      return daysDiff > 0 && daysDiff <= 60;
    });
    setRenewalClients(renewalList);
  };

  const handleCancel = () => {
    setEditRowId(null);
  };

  const sbuHeadOptions = [
    "Archana Gupta",
    "Subikash Ghosh",
    "Santu Ghosh",
    "Suneel Talikoti",
    "Kushagra Dhar",
    "Rajesh NB"
  ];

  // Replace hardcoded options with these:
const agreementStatusOptions = [...new Set(agreement.map(item => item["Agreement Status"]).filter(Boolean))];
const agreementCategoryOptions = allCategories;
const agreementTypeOptions = allAgreementTypes;
  const lineOfBusinessOptions = [
    "India Staffing",
    "US Staffing",
    "Managed Staffing"
  ];

  const counterSignStatusOptions = ["Yes", "No"];

  const finalStatusOptions = [
    "Renewed",
    "On hold",
    "Not moving Forward"
  ];

  const renderEditableCell = (item, field, isEditing) => {
    if (!isEditing) {
      return item[field] || "N/A";
    }

    const dateFields = [
      "start date",
      "end date",
      "Action Taken Date",
      "Final Status Date",
      "Created at"
    ];

    if (dateFields.includes(field)) {
      return (
        <input
          type="date"
          className="edit-input"
          value={editedData[field] || ""}
          onChange={(e) =>
            setEditedData({ ...editedData, [field]: e.target.value })
          }
        />
      );
    }

    switch (field) {
      case "SBU Head":
        return (
          <select
            className="edit-select"
            value={editedData[field] || ""}
            onChange={(e) =>
              setEditedData({ ...editedData, [field]: e.target.value })
            }
          >
            <option value="">Select SBU Head</option>
            {sbuHeadOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case "Agreement Status":
        return (
          <select
            className="edit-select"
            value={editedData[field] || ""}
            onChange={(e) =>
              setEditedData({ ...editedData, [field]: e.target.value })
            }
          >
            <option value="">Select Agreement Status</option>
            {agreementStatusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case "Agreement Category":
        return (
          <select
            className="edit-select"
            value={editedData[field] || ""}
            onChange={(e) =>
              setEditedData({ ...editedData, [field]: e.target.value })
            }
          >
            <option value="">Select Agreement Category</option>
            {agreementCategoryOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case "Agreement Type":
        return (
          <select
            className="edit-select"
            value={editedData[field] || ""}
            onChange={(e) =>
              setEditedData({ ...editedData, [field]: e.target.value })
            }
          >
            <option value="">Select Agreement Type</option>
            {agreementTypeOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case "Line Of Business":
        return (
          <select
            className="edit-select"
            value={editedData[field] || ""}
            onChange={(e) =>
              setEditedData({ ...editedData, [field]: e.target.value })
            }
          >
            <option value="">Select Line Of Business</option>
            {lineOfBusinessOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case "Counter Sign Status":
        return (
          <select
            className="edit-select"
            value={editedData[field] || ""}
            onChange={(e) =>
              setEditedData({ ...editedData, [field]: e.target.value })
            }
          >
            <option value="">Select Counter Sign Status</option>
            {counterSignStatusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      case "Final Status":
        return (
          <select
            className="edit-select"
            value={editedData[field] || ""}
            onChange={(e) =>
              setEditedData({ ...editedData, [field]: e.target.value })
            }
          >
            <option value="">Select Final Status</option>
            {finalStatusOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        );

      default:
        return (
          <input
            className="edit-input"
            value={editedData[field] || ""}
            onChange={(e) =>
              setEditedData({ ...editedData, [field]: e.target.value })
            }
          />
        );
    }
  };

  return (
    <div className="agreements-container">
      <div className="header-section">
        <h1 className="agreements-title">ALCHEMY AGREEMENT</h1>

        
        <button
          className="logout-button"
          onClick={() => navigate("/")}
          style={{
            padding: "8px 16px",
            marginLeft: "20px",
            backgroundColor: "#dc3545",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          Logout
        </button>

   

        <div className="controls">
          <button className="add-button" onClick={() => navigate("/AddData")}>Add New Agreement</button>
          <button className="export-button" onClick={exportToExcel}>Export to Excel</button>
          <div className="search-container">
            <input
              className="search-input"
              type="text"
              placeholder="Search agreements..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button className="search-button" onClick={applyFilters}>Search</button>
          </div>
          <div className="filter-container">
            <select
              className="filter-dropdown"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="">All Status</option>
              <option value="Active">Active</option>
              <option value="Renewal In Process">Renewal In Process</option>
              <option value="Closed Not Persuing">Closed Not Persuing</option>
            </select>
          </div>
          
        </div>
        <div className="renewal-card">
      <span>Agreements up for Renewal: </span>
      <span className="renewal-count">{renewalClients.length}</span>
    </div>
      </div>

<div className="dashboard-container">
  <div className="chart-row">
    {/* Left Chart - Categories */}
    <div className="chart-container left-chart">
      <h3>Agreement Categories</h3>
      {allCategories.length > 0 ? (
        <div className="chart-wrapper">
          <Pie 
            data={getCategoryChartData()} 
            options={pieChartOptions}
            plugins={[ChartDataLabels]}
          />
        </div>
      ) : (
        <p>No agreement categories found</p>
      )}
    </div>

    {/* Right Chart - Types */}
    <div className="chart-container right-chart">
      {selectedCategory ? (
        <>
          <h3>{selectedCategory} Agreement Types</h3>
          {drillDownData?.labels?.length > 0 ? (
            <div className="chart-wrapper">
              <Pie 
                data={drillDownData} 
                options={{
                  ...pieChartOptions,
                  onClick: null
                }}
                plugins={[ChartDataLabels]}
              />
            </div>
          ) : (
            <p>No types data for {selectedCategory}</p>
          )}
        </>
      ) : (
        <div className="empty-state">
          <p>Click a category to view types</p>
        </div>
      )}
    </div>
  </div>
</div>
      <div className="status-dashboard">
        <div className="status-card">Active: {statusCounts.Active}</div>
        <div className="status-card">Renewal In Process: {statusCounts["Renewal In Process"]}</div>
        <div className="status-card">Closed Not Persuing: {statusCounts["Closed Not Persuing"]}</div>
      </div>

      <div className="table-wrapper">
        <table className="agreements-table">
          <thead>
            <tr>
              <th>Renewal Status</th>
              <th>Category</th>
              <th>Type</th>
              <th>Client/Vendor name</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>End date Remark</th>
              <th>Status</th>
              <th>SBU unit</th>
              <th>SBU Head</th>
              <th>Account Manager</th>
              <th>Payment Term</th>
              <th>Counter Sign Status</th>
              <th>Remarks</th>
              <th>Created At</th>
              <th>Action</th>
              <th>Action Taken Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAgreement.map((item) => {
              const isEditing = editRowId === item.id;
              const isRenewal = renewalClients.some(client => client.id === item.id);

              return (
                <tr key={item.id}>
                  <td>
                    {renderRenewalStatus(item, isEditing, isRenewal)}
                  </td>

                  <td>
                    {renderEditableCell(item, "Agreement Category", isEditing)}
                  </td>

                  <td>
                    {renderEditableCell(item, "Agreement Type", isEditing)}
                  </td> 

                  <td>
                    {renderEditableCell(item, "Agreement Detail", isEditing)}
                  </td> 

                  <td>
                    {isEditing ? (
                      renderEditableCell(item, "start date", isEditing)
                    ) : (
                      formatDate(item["start date"])
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      renderEditableCell(item, "end date", isEditing)
                    ) : (
                      formatDate(item["end date"])
                    )}
                  </td> 

                  <td>
                    {renderEditableCell(item, "Final Status Remark", isEditing)}
                  </td>

                  <td>
                    {renderEditableCell(item, "Agreement Status", isEditing)}
                  </td> 

                  <td>
                    {renderEditableCell(item, "SBU unit", isEditing)}
                  </td> 

                  <td>
                    {renderEditableCell(item, "SBU Head", isEditing)}
                  </td> 

                  <td>
                    {renderEditableCell(item, "Account Manager", isEditing)}
                  </td>

                  <td>
                    {renderEditableCell(item, "Payment Term", isEditing)}
                  </td>

                  <td>
                    {renderEditableCell(item, "Counter Sign Status", isEditing)}
                  </td>

                  <td>
                    {renderEditableCell(item, "Remarks", isEditing)}
                  </td> 

                  <td>
                    {isEditing ? (
                      renderEditableCell(item, "Created at", isEditing)
                    ) : (
                      formatDate(item["Created at"])
                    )}
                  </td>

                  <td>
                    {renderEditableCell(item, "Action", isEditing)}
                  </td>

                  <td>
                    {isEditing ? (
                      renderEditableCell(item, "Action Taken Date", isEditing)
                    ) : (
                      formatDate(item["Action Taken Date"])
                    )}
                  </td>

                  <td>
                    {isEditing ? (
                      <div className="edit-actions">
                        <button className="save-button" onClick={handleSave}>
                          Save
                        </button>
                        <button className="cancel-button" onClick={handleCancel}>
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button 
                        className="edit-button" 
                        onClick={() => {
                          setEditRowId(item.id);
                          setEditedData({ ...item });
                        }}
                      >
                        Edit
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {error && <p className="error-message">{error}</p>}
      {filteredAgreement.length === 0 && !error && <p>Loading agreement data...</p>}
    </div>
  );
}

export default AgreementData;