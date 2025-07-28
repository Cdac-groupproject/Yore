import React, { useEffect } from "react";
import { DiCelluloid } from "react-icons/di";
import Navbar from "../../components/Navbar";
import { Card, Button, Row, Col, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { loadBootstrap, unloadBootstrap } from "../../utils/loadBootStrap";

const ProductList = () => {
  useEffect(() => {
    loadBootstrap(); // Load Bootstrap CSS
    return () => {
      unloadBootstrap(); // Remove it on unmount
    };
  }, []);
  const products = [
    {
      id: 1,
      name: "Ancient Vase",
      category: "Pottery",
      year: "1200 BC",
      description: "A clay vase from the ancient Greek period.",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/fc/Amphora_met_38.11.13.jpg/800px-Amphora_met_38.11.13.jpg",
    },
    {
      id: 2,
      name: "Medieval Sword",
      category: "Weaponry",
      year: "1300 AD",
      description: "A knight’s broadsword used during the Crusades.",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/db/Sword_of_saint_peter.jpg/800px-Sword_of_saint_peter.jpg",
    },
  ];

  const navigate = useNavigate();
  const handleUpdate = (product) => {
    navigate("/update-product", { state: { product } });
  };

  return (
    <div>
      <Navbar />
      <h1>All Products</h1>
      <Container style={{ backgroundColor: "#fdf6ec", padding: "40px" }}>
        <h2 className="mb-4 text-center">Museum Product List</h2>
        {products.map((product) => (
          <Card key={product.id} className="mb-4 shadow-sm">
            <Row className="g-0">
              <Col md={4}>
                <Card.Img
                  src={product.image}
                  alt={product.name}
                  style={{ height: "100%", objectFit: "cover" }}
                />
              </Col>
              <Col md={8}>
                <Card.Body>
                  <Card.Title>{product.name}</Card.Title>
                  <Card.Text>
                    <strong>Category:</strong> {product.category} <br />
                    <strong>Year:</strong> {product.year} <br />
                    <strong>Description:</strong> {product.description}
                  </Card.Text>
                  <div className="d-flex gap-2">
                    <Button
                      variant="warning"
                      onClick={() => handleUpdate(product)}
                    >
                      Update
                    </Button>
                    <Button variant="danger">Delete</Button>
                    <Button variant="success">Auction Away</Button>
                  </div>
                </Card.Body>
              </Col>
            </Row>
          </Card>
        ))}
      </Container>
    </div>
  );
};

export default ProductList;
