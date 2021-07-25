import React, {Component} from 'react';

import Carousel from 'react-bootstrap/Carousel';

import './home.css';
import ResponsivePlayer from "../video/ResponsivePlayer";
import {Container} from "react-bootstrap";
import Row from "react-bootstrap/Row";

class Home extends Component {
  render() {

    return (
      <>
        <Container fluid="md" className="homeBackground">
          <Row>
            <Carousel>
              <Carousel.Item>
                <ResponsivePlayer url='https://www.youtube.com/watch?v=LExAtvVhLXM'/>
              </Carousel.Item>
              <Carousel.Item>
                <ResponsivePlayer url='https://www.youtube.com/watch?v=xSAIT-VE9VU'/>
              </Carousel.Item>
              <Carousel.Item>
                  <ResponsivePlayer url='https://www.youtube.com/watch?v=bTS9XaoQ6mg'/>
              </Carousel.Item>
            </Carousel>
          </Row>
        </Container>
      </>
    )
  }
}

export default Home;
