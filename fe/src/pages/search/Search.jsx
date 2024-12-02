import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import {
  Table,
  Input,
  Button,
  Typography,
  Card,
  Space,
  Spin,
  Empty,
  notification,
  Badge,
  Tag,
  Tooltip,
  Statistic,
  Modal,
  message,
  Rate,
} from "antd";
import {
  SearchOutlined,
  ShoppingOutlined,
  StarFilled,
  DollarCircleOutlined,
  ReloadOutlined,
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import "./Search.scss";
import { getAllProducts } from "../../utils/axios/Product";
import { useNavigate } from "react-router-dom";

const { Title, Text } = Typography;

function Search() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("user"));
  const navigate = useNavigate();
  const isVip = localStorage.getItem("isVip") === "true";
  const [translatedText, setTranslatedText] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const handleLoginClick = () => {
    navigate("/login");
  };

  const onClose = () => {
    setIsModalOpen(false);
    setSelectedProduct(null); // Đặt lại sản phẩm được chọn
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("isVip");
    setIsLoggedIn(false);
    message.success("Logged out successfully");
    window.location.reload();
  };

  const handleSearch = async () => {
    setLoading(true);
    try {
      let response;
      if (isVip) {
        // VIP users use Natural Language Query search
        response = await axios.post(
          `http://localhost:8080/api/products/searchByNLQ`,
          {
            vietnameseText: keyword,
            targetLanguage: "en"
          }
        );
        
        // Get translation for display
        const translationResponse = await axios.post(
          "http://localhost:8080/api/translate/google/googleTranslate",
          {
            vietnameseText: keyword,
            targetLanguage: "en",
          }
        );
        setTranslatedText(translationResponse.data.translated);
      } else {
        // Regular users use normal search
        response = await axios.get(
          `http://localhost:8080/api/products/search`,
          { params: { keyword } }
        );
      }
      
      setResults(response.data);
      calculateStats(response.data);

      notification.success({
        message: "Search Completed",
        description: `Found ${response.data.length} products`,
      });
    } catch (error) {
      notification.error({
        message: "Search Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const total = data.length;
    setStats({ total });
  };

  const fetchAllProducts = async () => {
    setLoading(true);
    try {
      const fetchedData = await getAllProducts();
      if (fetchedData) {
        setResults(fetchedData);
        calculateStats(fetchedData);
      }
    } catch (error) {
      notification.error({
        message: "Failed to fetch products",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllProducts();
  }, []);

  const handleRowClick = async (record) => {
    try {
      setLoading(true);
      const response = await fetch(
        `http://localhost:8080/api/products/${record.id}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch product details");
      }

      const data = await response.json();
      setSelectedProduct(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching product details:", error);
      message.error("Failed to load product details");
    } finally {
      setLoading(false);
    }
  };

  const handleTableChange = (pagination) => {
    setCurrentPage(pagination.current);
  };

  const columns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text, record) => (
        <Tooltip title="Click to view description">
          <span
            className="title-cell"
            style={{ cursor: "pointer", color: "#1890ff" }}
            onClick={() => handleDescriptionClick(record)}
          >
            {text.length > 30 ? `${text.substring(0, 30)}...` : text}
          </span>
        </Tooltip>
      ),
    },
    {
      title: "Price",
      dataIndex: "price",
      key: "price",
      render: (price) => (
        <Tag color="green" icon={<DollarCircleOutlined />}>
          ${Number(price).toFixed(2)}
        </Tag>
      ),
    },
    {
      title: "Availability",
      dataIndex: "availability",
      key: "availability",
      render: (status) => (
        <Badge
          status={status == "In Stock" ? "success" : status == "Not Available" ? "error" : "default"}
          text={status == "In Stock" ? "In Stock" : status == "Not Available" ? "Not Available" : status}
        />
      ),
    },
    {
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (
        <Space>
          <StarFilled className="rating-icon" />
          <span>{rating}</span>
        </Space>
      ),
    },
  ];

  const handleDescriptionClick = (record) => {
    setSelectedProduct(record); // Gán sản phẩm được chọn
    setIsModalOpen(true); // Hiển thị modal
  };

  const dataSource = results.map((product) => ({
    key: product.id,
    id: product.id,
    title: product.title,
    price: product.price,
    reviews: product.reviews,
    rating: product.rating,
    availability: product.availability,
    description: product.description,
  }));

  return (
    <div className="search-container">
      {/* Header */}
      <div className="header">
        {isLoggedIn && (
          <div className={`user-status ${isVip ? "vip" : "normal"}`}>
            {isVip ? (
              <>
                <StarFilled />
                <span>VIP Member</span>
              </>
            ) : (
              <>
                <UserOutlined />
                <span>Normal Member</span>
              </>
            )}
          </div>
        )}

        {isLoggedIn ? (
          <Button
            type="primary"
            danger
            icon={<LogoutOutlined />}
            onClick={handleLogout}
          >
            Logout
          </Button>
        ) : (
          <Button
            type="primary"
            icon={<LoginOutlined />}
            onClick={handleLoginClick}
          >
            Login
          </Button>
        )}
      </div>
      {/* Main Content */}
      <div className="content">
        <Title level={1}>Product Catalog</Title>
        <Text>Discover and search through our extensive collection</Text>

        {/* Search Bar */}
        <div className="searchbar-container">
          <div className="search">
            <Input
              className="search-input"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder="Enter product name..."
              onPressEnter={handleSearch}
            />
            <Button
              type="primary"
              icon={<SearchOutlined />}
              className="search-button"
              onClick={handleSearch}
            >
              Search
            </Button>
          </div>

          {/* Statistics */}
          <div className="stats">
            <Card>
              <Statistic
                title="Total Products"
                value={stats.total}
                prefix={<ShoppingOutlined />}
              />
            </Card>
          </div>
        </div>

        <div className="translate-container">
          {/* VIP Translation Section */}
          <div className="translate">
            {isVip && translatedText && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="vip-translation"
              >
                <Card
                  className="vip-translation-card"
                  title={
                    <div className="vip-title">
                      <StarFilled className="vip-icon" />
                      <span>VIP Translation</span>
                    </div>
                  }
                >
                  <div className="vip-content">
                    <div className="vip-section">
                      <Text strong className="label">
                        Original Text:
                      </Text>
                      <Text className="content">{keyword}</Text>
                    </div>
                    <div className="vip-section">
                      <Text strong className="label">
                        English Translation:
                      </Text>
                      <Text className="content">{translatedText}</Text>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
          </div>

          <div className="refresh">
            <Button
              type="primary"
              icon={<ReloadOutlined />}
              onClick={fetchAllProducts}
            >
              Refresh Catalog
            </Button>
          </div>
        </div>

        <div className="table-container">
          {/* Table */}
          {loading ? (
            <Spin />
          ) : results.length === 0 ? (
            <Empty description="No products found" />
          ) : (
            <Table
              columns={columns}
              dataSource={dataSource}
              pagination={{
                pageSize: 8,
                current: currentPage,
                onChange: setCurrentPage,
              }}
              onRow={(record) => ({
                onClick: () => handleRowClick(record),
              })}
            />
          )}

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            {/* Nội dung modal */}
            <Modal
              title={null}
              open={isModalOpen}
              onCancel={onClose}
              footer={null}
              width={1000}
              className="custom-modal"
            >
              {selectedProduct && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="modal-card"
                >
                  <div className="modal-header">
                    <Title className="modal-title" level={3} >
                      {selectedProduct.title}
                    </Title>
                  </div>
                  <div className="modal-body">
                    <div className="modal-details">
                      <div>
                        <Text strong>Price:</Text>{" "}
                        <Tag color="green" icon={<DollarCircleOutlined />}>
                          ${Number(selectedProduct.price).toFixed(2)}
                        </Tag>
                      </div>
                      <div>
                        <Text strong>Availability:</Text>{" "}
                        <Badge
                          status={
                            selectedProduct.availability ? "success" : "error"
                          }
                          text={
                            selectedProduct.availability
                              ? "In Stock"
                              : "Out of Stock"
                          }
                        />
                      </div>
                      <div>
                        <Text strong>Rating:</Text>{" "}
                        <Rate
                          disabled
                          defaultValue={parseFloat(selectedProduct.rating)}
                        />
                      </div>
                    </div>
                    <div className="modal-description">
                      <Text className="about-it" strong>About It:</Text>
                      <p>
                        {selectedProduct.aboutIt ||
                          "No additional information available."}
                      </p>
                    </div>

                    <div className="modal-section">
                      <Text className="description" strong>Description: </Text>
                      <p>{selectedProduct.description}</p>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <Button type="primary" onClick={onClose}>
                      Close
                    </Button>
                  </div>
                </motion.div>
              )}
            </Modal>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Search;
