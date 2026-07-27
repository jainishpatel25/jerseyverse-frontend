
import React, { useState, useRef, useEffect } from 'react';
import { Container, Row, Col, Button } from 'react-bootstrap';
import './styles/Productlist.css';
import { FaArrowLeft, FaArrowRight, FaStar } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { setSelectedProduct } from '../redux/productSlice';

const ProductCarouselSection = () => {
  const [products, setProducts] = useState([]);
  const carouselRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const API = process.env.REACT_APP_API_URL;

  // Fetch real products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get('/api/v1/products/latest'); // adjust endpoint if needed
        console.log('latest products: ',res.data);
        setProducts(res.data); // show latest 10 products in carousel
      } catch (err) {
        console.error('Failed to fetch products:', err);
      }
    };
    fetchProducts();
  }, []);

  const handleScroll = (direction) => {
    const container = carouselRef.current;
    const scrollAmount = container.offsetWidth / 1.2;
    if (direction === 'left') {
      container.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleScroll('right');
    }, 3000); // Auto-scroll every 7 seconds

    return () => clearInterval(interval);
  }, []);

  const handleSelect = (product) => {
    dispatch(setSelectedProduct(product));
    navigate(`/product/${product.id}`);
  };

  return (
    <motion.section className="product-carousel"
     initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: 'easeOut' }}
      viewport={{ once: true }}
    >
      <Container>
        <Row className="mb-4">
          <h1 className="text-center">Products</h1>
          <Col>
            <h2>Latest Arrivals</h2>
            <p className="text-muted">
              Discover the newest football jerseys and exclusive fan collections.
            </p>
          </Col>
          <Col className="text-end d-none d-md-block">
            <Button variant="link" className="seeallbtn" onClick={() => navigate('/shop')}>
              See all →
            </Button>
          </Col>
        </Row>

        <div className="carousel-wrapper">
          <Button className="carousel-nav left" onClick={() => handleScroll('left')}>
            <FaArrowLeft />
          </Button>

          <div className="carousel-inner" ref={carouselRef}>
            {products?.map((item,index) => (
              <motion.div
                key={item.id}
                className="product-card"
                onClick={() => handleSelect(item)}
                style={{ cursor: 'pointer' }}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <img
                  // src={`${API}/uploads/${item.image}`}  //node backend
                  src={`${API}${item.imageUrl}`} //java backend
                  alt={item.name}
                  className="product-image"
                />
                <h6 className="mt-3 fw-semibold">{item.name}</h6>
                <div className="rating">
                  {[...Array(5)].map((_, i) => (
                    <FaStar key={i} className="text-warning" />
                  ))}
                  <span className="text-muted ms-2">(0)</span>
                </div>
                <p className="fw-bold">₹ {item.price.toLocaleString('en-IN')}.00</p>
              </motion.div>
            ))}
          </div>

          <Button className="carousel-nav right" onClick={() => handleScroll('right')}>
            <FaArrowRight />
          </Button>
        </div>
      </Container>
    </motion.section>
  );
};

export default ProductCarouselSection;
