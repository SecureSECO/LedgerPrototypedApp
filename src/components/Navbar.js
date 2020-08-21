import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

class Navbar extends Component {

   

  render() {
    return (
        <nav className="navbar navbar-expand-lg fixed-top bg-dark flex-md-nowrap p-0 shadow">
  <span className="navbar-brand col-sm-3 col-md-2 mr-0">       
          <span className="title1">Secure Software Ecosystem</span>
        </span>
  <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
    <span className="navbar-toggler-icon"></span>
  </button>
  <div className="collapse navbar-collapse" id="navbarText">
    <ul className="navbar-nav mr-auto marginleft">
      <li className="nav-item active">        
        <Link to="/LedgerPrototypedApp" className="nav-link">Home<span className="sr-only">(current)</span></Link>
      </li>
      <li className="nav-item">        
         <Link to="/Add" className="nav-link">Add new entities</Link>
      </li>
       <li className="nav-item">        
         <Link to="/SearchEntities" className="nav-link">Search an entity</Link>
      </li>
       <li className="nav-item">        
         <Link to="/List" className="nav-link">Show all entities</Link>
      </li>
          </ul>
    <span className="navbar-text">
       <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
            <small className="text-white"><span className="bold">{this.props.account == ''? <span>You need to install MataMask</span>: <span>Public Key</span> }</span> <span id="account">{this.props.account}</span></small>
          </li>          
        </ul>
    </span>
  </div>
</nav>
    );
  }
}

export default Navbar;
