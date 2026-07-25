import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { motion } from 'framer-motion';
import './styles/InfoSection.css';

const infoItems = [
  {
    title: 'Authentic Jerseys',
    description:
      'We bring you 100% authentic football jerseys from top clubs and national teams — crafted for true fans.',
    image: '/images/atc.jpg',
    blobClass: 'blob1'
  },
  {
    title: 'For Every Fan',
    description:
      "Whether you support giants like Real Madrid or rising stars, our collection covers every style and passion.",
    image: '/images/ftf.jpg',
    blobClass: 'blob2'
  },
  {
    title: 'Match-Day Ready',
    description:
      'Gear up for the season with jerseys that let you show your pride on the streets, in the stands, or on the pitch.',
    image: '/images/mdr.jpg',
    blobClass: 'blob3'
  }
];

const InfoSection = () => {
  return (
    <section className="info-section">
      <Container>
        <Row className="text-center justify-content-center">
          {infoItems.map((item, idx) => (
            <Col md={4} key={idx} className="mb-5">
              <motion.div
                className={`image-blob ${item.blobClass}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.6,
                  ease: 'easeOut',
                  delay: idx * 0.2 // stagger effect
                }}
                viewport={{ once: true }}
              >
                <motion.img
                  src={item.image}
                  alt={item.title}
                  className="img-fluid"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.3 }}
                />
              </motion.div>

              <motion.h4
                className="mt-4 fw-bold"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{
                  duration: 0.5,
                  delay: 0.2 + idx * 0.2
                }}
                viewport={{ once: true }}
              >
                {item.title}
              </motion.h4>

              <motion.div
                className="divider mx-auto my-2"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.3 + idx * 0.2
                }}
                viewport={{ once: true }}
              ></motion.div>

              <motion.p
                className="text-muted px-3"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{
                  duration: 0.5,
                  delay: 0.4 + idx * 0.2
                }}
                viewport={{ once: true }}
              >
                {item.description}
              </motion.p>
            </Col>
          ))}
        </Row>
      </Container>
    </section>
  );
};

export default InfoSection;
