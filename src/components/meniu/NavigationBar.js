import React from 'react';
import { NavLink } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import styled from 'styled-components';
import "../../css/NavBar.css";

const Styles = styled.div`
  .navbar {
    background-color: #222;
  }

  .navbar-brand, .navbar-nav .nav-link {
    color: #bbb;

    &:hover {
      color: white;
    }
  }
`;

export default function NavigationBar() {
  return (
    <Styles>
      <Navbar expand="lg">
        <Navbar.Brand>Smart Contract Governance</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav"/>
        <Navbar.Collapse id="basiv-navbar-nav">
          <Nav className="ml-auto">
            <Nav.Item className="meniu-btn-box"><NavLink to="/" className="meniu-button">Home</NavLink></Nav.Item>
            <Nav.Item><NavLink to="/ContractPage" className="meniu-button">Smart Contract</NavLink></Nav.Item>
            <Nav.Item><NavLink to="/GovernorPage" className="meniu-button">Governor</NavLink></Nav.Item>

          </Nav>
        </Navbar.Collapse>
      </Navbar>
    </Styles>
  );
}
