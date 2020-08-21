import React, { Component } from 'react';
import Web3 from 'web3'

import './App.css';
import AddData from '../abis/AddData.json'
import Navbar from './Navbar'

import bg1 from '../bg2.png';
import mylogo from '../mylogo.jpg';
import uulogo from '../uulogo.png';
import { Link } from 'react-router-dom';

class App extends Component {

  async componentWillMount() {
   if (window.web3 || window.ethereum) {
       await this.loadWeb3()
       await this.loadBlockchainData()
    }
  }

  async loadWeb3() {
    if (window.ethereum) {
      window.web3 = new Web3(window.ethereum)
      await window.ethereum.enable()
    }
    else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
     // window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
    }
  }

  async loadBlockchainData() {
    const web3 = window.web3
    // Load account
    const accounts = await web3.eth.getAccounts()
    const myaccount=accounts[0]
    this.setState({ account:  myaccount })
    const networkId = await web3.eth.net.getId()
    const networkData = AddData.networks[networkId]
    if(networkData) {
      const adddata = web3.eth.Contract(AddData.abi, networkData.address)
      this.setState({ adddata })
      const dataCount = await adddata.methods.dataCount().call()
      this.setState({ dataCount })
      // Load datas
      for (var i = 1; i <= dataCount; i++) {
        const data = await adddata.methods.datas(i).call()
        this.setState({
          datas: [...this.state.datas, data]
        })
      }
      this.setState({ loading: false})
    } else {
      window.alert('The contract not deployed to detected network.')
    }
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      dataCount: 0,
      datas: [],
      loading: true
     
    }

    this.createData = this.createData.bind(this)

     
  }

  createData(jsonvalue, identity) {
    this.setState({ loading: true })
    this.state.adddata.methods.createData(jsonvalue, identity).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }



  render() {
    return (
      <div>
        <Navbar account={this.state.account}/>
         <img src={bg1} alt="" className="bg"/>
           <div className="form">
           <p className="font">SecureSECO Ledger - is a distributed ledger maintained by its participants, consisting of software engineers, software producing organizations, and academic partners. SecureSECO stores data about a software’s lifecycle, from source code to executable, with the goal of increasing trust in the worldwide software ecosystem.
            SecureSECO participants maintain the network, by running clients that perform node confirmations. </p>
            <p className="font">
            The underlying structure of SecureSECO is a Merkle Directed Acyclic Graph, i.e., where each node is a hashed increment of its parents. Nodes are confirmed by participants in the network. The data is stored in a distributed manner, using a platform-agnostic approach. Currently, the platforms on which data is stored are trusted third parties (Utrecht University, SurfSARA, AWS, later also DANS)
             and these data are replicated amongst clients.
            </p>
            <Link to="/Add" className="btn btn-info form linkbutton">Add new entities</Link>
            <Link to="/SearchEntities" className="btn btn-info form linkbutton">Search an entity</Link>
            <Link to="/List" className="btn btn-info form linkbutton">Show all entities</Link>
            </div>
           <div className="footer">
      <img src={mylogo} alt="" width="200" height="61"/>
      <img src={uulogo} alt="" width="200" height="104"/>
     </div>
          </div>
     );
  }
}

export default App;
