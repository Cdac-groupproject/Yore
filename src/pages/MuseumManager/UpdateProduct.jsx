import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card} from 'react-bootstrap';
import Navbar from '../../components/Navbar';

const UpdateProduct = () => {
  // Dummy existing product data
  const [product, setProduct] = useState({
    image: '',
    name: 'Vintage Sword', // name is not editable
    description: 'A 16th-century ceremonial sword.',
    origin: 'France',
    category: 'Weapons',
    year: '1580',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Updated Product:', product);
    // You can send the updated data to the server here
  };

  return (
    <div>
        <Navbar />
    <Container style={{ backgroundColor: '#fdf6ec', minHeight: '100vh', paddingTop: '40px' }}>
      <Card className="p-4 shadow-lg" style={{ maxWidth: '800px', margin: '0 auto' }}>
        <Card.Title className="text-center mb-4" style={{ fontSize: '24px' }}>
          Update Product Details
        </Card.Title>
        <Form onSubmit={handleSubmit}>
          <Form.Group as={Row} className="mb-3" controlId="formImage">
            <Form.Label column sm={4}>Update Image URL</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                name="image"
                value={product.image}
                onChange={handleChange}
                placeholder="Enter new image URL"
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formName">
            <Form.Label column sm={4}>Product Name</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                name="name"
                value={product.name}
                disabled
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formDescription">
            <Form.Label column sm={4}>Description</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                name="description"
                value={product.description}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formOrigin">
            <Form.Label column sm={4}>Country of Origin</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                name="origin"
                value={product.origin}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3" controlId="formCategory">
            <Form.Label column sm={4}>Category</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="text"
                name="category"
                value={product.category}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-4" controlId="formYear">
            <Form.Label column sm={4}>Year of Manufacture</Form.Label>
            <Col sm={8}>
              <Form.Control
                type="number"
                name="year"
                value={product.year}
                onChange={handleChange}
              />
            </Col>
          </Form.Group>

          <div className="text-center">
            <Button variant="dark" type="submit">
              Save Changes
            </Button>
          </div>
        </Form>
      </Card>
    </Container>
    </div>
  );
};

export default UpdateProduct;
