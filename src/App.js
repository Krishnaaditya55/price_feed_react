import { useState } from "react";
import Papa from "papaparse";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

function App() {
  const [data, setData] = useState([]);
  const [editId, setEditId] = useState(-1);
  const [updatedSKU, setUpdatedSKU] = useState("");
  const [updatedProductName, setUpdatedProductName] = useState("");
  const [updatedPrice, setUpdatedPrice] = useState("");
  const [updatedDate, setUpdatedDate] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [fileUploaded, setFileUploaded] = useState(false);

  const formatDate = (date) => {
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results) => {
        setData(results.data);
        setFileUploaded(true);
        setCurrentPage(1);
      },
    });
  };

  const handleEdit = (id, sku, productName, price, date) => {
    setEditId(id);
    setUpdatedSKU(sku);
    setUpdatedProductName(productName);
    setUpdatedPrice(price);
    setUpdatedDate(date ? new Date(date) : null);
  };

  const handleUpdate = (index) => {
    setData((prevData) => {
      const newData = [...prevData];
      newData[index].SKU = updatedSKU;
      newData[index].ProductName = updatedProductName;
      newData[index].Price = updatedPrice;
      newData[index].Date = formatDate(updatedDate);
      return newData;
    });
    setEditId(-1);
    setUpdatedSKU("");
    setUpdatedProductName("");
    setUpdatedPrice("");
    setUpdatedDate(null);
  };

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when performing a search
  };

  const filteredData = data.filter(
    (row) =>
      row.StoreID.toString().includes(searchQuery) ||
      row.SKU.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.ProductName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      row.Price.toString().includes(searchQuery) ||
      row.Date.toString().includes(searchQuery)
  );

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="container">
      <h1 className="my-4">Price Feed Data (CSV File Processor)</h1>
      <div className="mb-3">
        <input
          type="file"
          accept=".csv"
          className="form-control"
          onChange={handleFileUpload}
        />
      </div>
      {fileUploaded && (
        <>
          <div className="row">
            <div className="col-6">
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearch}
                />
              </div>
            </div>
            <div className="col-6">
              <div className="mb-3">
                <select
                  className="form-select"
                  value={itemsPerPage}
                  onChange={(e) => {
                    setItemsPerPage(parseInt(e.target.value));
                    setCurrentPage(1);
                  }}
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                </select>
              </div>
            </div>
          </div>

          <table className="table">
            <thead>
              <tr>
                <th>Store ID</th>
                <th>SKU</th>
                <th>Product Name</th>
                <th>Price</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentItems.map((row, index) => (
                <tr key={index}>
                  {row.StoreID === editId ? (
                    <>
                      <td>{row.StoreID}</td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={updatedSKU}
                          onChange={(e) => setUpdatedSKU(e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          className="form-control"
                          value={updatedProductName}
                          onChange={(e) =>
                            setUpdatedProductName(e.target.value)
                          }
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          className="form-control"
                          value={updatedPrice}
                          onChange={(e) => setUpdatedPrice(e.target.value)}
                        />
                      </td>
                      <td>
                        <DatePicker
                          className="form-control"
                          selected={updatedDate}
                          onChange={(date) => setUpdatedDate(date)}
                          dateFormat="dd-MMM-yyyy"
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-primary"
                          onClick={() => handleUpdate(index)}
                        >
                          Update
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{row.StoreID}</td>
                      <td>{row.SKU}</td>
                      <td>{row.ProductName}</td>
                      <td>{row.Price}</td>
                      <td>{row.Date}</td>
                      <td>
                        <button
                          className="btn btn-primary me-2"
                          onClick={() =>
                            handleEdit(
                              row.StoreID,
                              row.SKU,
                              row.ProductName,
                              row.Price,
                              row.Date
                            )
                          }
                        >
                          Edit
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
          <div className="pagination justify-content-center">
            {Array.from({ length: totalPages }, (_, index) => (
              <button
                key={index}
                className={`btn mx-1 ${
                  currentPage === index + 1 ? "btn-primary" : "btn-secondary"
                }`}
                onClick={() => paginate(index + 1)}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default App;
