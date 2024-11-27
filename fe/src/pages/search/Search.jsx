import { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "antd";
import "./Search.scss";
import { getAllProducts } from "../../utils/axios/Product";

function Search() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `http://localhost:8080/api/products/search`,
        {
          params: { keyword },
        }
      );
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };
  async function fetchCustomers() {
    const fetchedData = await getAllProducts();
    if (fetchedData) {
      setResults(fetchedData);
    }
  }
  useEffect(() => {
    fetchCustomers();
  }, []);

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
    },
    {
      title: "Reviews",
      dataIndex: "reviews",
      key: "reviews",
    },
    {
      title: "Availability",
      dataIndex: "availability",
      key: "availability",
    },
    {
      title: "About It",
      dataIndex: "about_it",
      key: "about_it",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ];

  return (
    <div style={{ padding: 20 }}>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        placeholder="Enter product name..."
      />
      <button onClick={handleSearch}>Search</button>

      <Table
        columns={columns}
        dataSource={results}
        pagination={false}
        bordered
        rowClassName="custom-row"
      />

      <ul>
        {results.map((product) => (
          <li key={product.id}>{product.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default Search;
