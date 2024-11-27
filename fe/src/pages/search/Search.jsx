import { useEffect, useState } from "react";
import axios from "axios";
import { 
  Table, Input, Button, Typography, Card, Space, Spin, 
  Empty, notification, Badge, Tag, Tooltip, Statistic, Modal, Rate 
} from "antd";
import { 
  SearchOutlined, 
  ShoppingOutlined, 
  StarFilled, 
  DollarCircleOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import "./Search.scss";
import { getAllProducts } from "../../utils/axios/Product";
import { motion } from "framer-motion";

const { Title, Text } = Typography;

function Search() {
  const [keyword, setKeyword] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0 });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const response = await axios.get(
        `http://localhost:8080/api/products/search`,
        { params: { keyword } }
      );
      setResults(response.data);
      calculateStats(response.data);
      notification.success({
        message: 'Search Completed',
        description: `Found ${response.data.length} products`,
      });
    } catch (error) {
      notification.error({
        message: 'Search Failed',
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
        message: 'Failed to fetch products',
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
      const response = await fetch(`http://localhost:8080/api/products/${record.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch product details');
      }

      const data = await response.json();
      setSelectedProduct(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching product details:', error);
      message.error('Failed to load product details');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      hidden: true
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      render: (text) => (
        <Tooltip title={text}>
          <span className="font-medium text-blue-600 hover:text-blue-800 cursor-pointer">
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
      title: "Rating",
      dataIndex: "rating",
      key: "rating",
      render: (rating) => (
        <Space>
          <StarFilled className="text-yellow-400" />
          <span>{rating}</span>
        </Space>
      ),
    },
    {
      title: "Availability",
      dataIndex: "availability",
      key: "availability",
      render: (status) => (
        <Badge 
          status={status ? "success" : "error"} 
          text={status ? "In Stock" : "Out of Stock"}
        />
      ),
    },
  ].filter(column => !column.hidden);

  const dataSource = results.map(product => ({
    key: product.id,
    id: product.id,
    title: product.title,
    price: product.price,
    rating: product.rating,
    availability: product.availability
  }));

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          className="text-center mb-12"
        >
          <div className="space-y-4">
            <Title 
              level={1} 
              className="!text-transparent !bg-clip-text !bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 !mb-0"
            >
              Product Catalog
            </Title>
            <Text className="text-gray-500 text-lg block">
              Discover and search through our extensive collection
            </Text>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card 
            className="hover:shadow-xl transition-all duration-300 border-2 border-blue-100 bg-white/80 backdrop-blur"
          >
            <Statistic 
              title={
                <span className="text-blue-600 font-semibold">Total Products</span>
              }
              value={stats.total}
              prefix={<ShoppingOutlined className="text-blue-500" />}
              className="!text-blue-700"
            />
          </Card>
          <Card 
            className="hover:shadow-xl transition-all duration-300 border-2 border-purple-100 bg-white/80 backdrop-blur"
          >
            <Button 
              type="primary"
              icon={<ReloadOutlined />}
              onClick={fetchAllProducts}
              block
              size="large"
              className="bg-gradient-to-r from-blue-500 to-purple-500 border-none h-[40px] hover:from-blue-600 hover:to-purple-600"
            >
              Refresh Catalog
            </Button>
          </Card>
        </div>

        <Card 
          className="shadow-2xl rounded-xl backdrop-blur-sm bg-white/90 border-2 border-blue-50"
        >
          <Space direction="vertical" className="w-full mb-8">
            <Input.Search
              placeholder="Search for products..."
              allowClear
              enterButton={
                <Button 
                  type="primary" 
                  className="bg-gradient-to-r from-blue-500 to-purple-500 border-none hover:from-blue-600 hover:to-purple-600"
                >
                  <div className="flex items-center gap-2">
                    <SearchOutlined />
                    <span>Search</span>
                  </div>
                </Button>
              }
              size="large"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              onSearch={handleSearch}
              className="!rounded-lg"
            />
          </Space>

          {loading ? (
            <div className="flex justify-center items-center py-32">
              <Spin size="large" />
            </div>
          ) : results.length === 0 ? (
            <Empty 
              description={
                <span className="text-gray-500 text-lg">No products found</span>
              }
              className="py-32"
            />
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Table
                columns={columns}
                dataSource={dataSource}
                pagination={{ 
                  pageSize: 8,
                  showSizeChanger: true,
                  showTotal: (total) => `Total ${total} items`,
                  className: "!text-blue-600"
                }}
                rowKey="id"
                className="rounded-lg overflow-hidden"
                scroll={{ x: true }}
                rowClassName={() => 
                  "hover:bg-blue-50 transition-colors duration-200"
                }
                onRow={(record) => ({
                  onClick: () => handleRowClick(record),
                  style: { cursor: 'pointer' }
                })}
              />
            </motion.div>
          )}
        </Card>
      </div>

      <Modal
        title="Product Details"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={800}
        confirmLoading={loading}
      >
        {selectedProduct && (
          <div>
            <Title level={3}>{selectedProduct.title}</Title>
            
            <div style={{ marginBottom: 16 }}>
              <Text strong>About: </Text>
              <Text>{selectedProduct.aboutIt}</Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Description: </Text>
              <Text>{selectedProduct.description}</Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Availability: </Text>
              <Tag color={selectedProduct.availability === 'In Stock' ? 'green' : 'red'}>
                {selectedProduct.availability}
              </Tag>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Price: </Text>
              <Tag color="green" icon={<DollarCircleOutlined />}>
                ${Number(selectedProduct.price).toFixed(2)}
              </Tag>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Rating: </Text>
              <Rate disabled defaultValue={parseFloat(selectedProduct.rating)} />
              <Text> ({selectedProduct.reviews} reviews)</Text>
            </div>

            <div style={{ marginBottom: 16 }}>
              <Text strong>Product ID: </Text>
              <Text>{selectedProduct.id}</Text>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}

export default Search;
