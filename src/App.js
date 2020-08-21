import React from 'react';
import logo from './logo.svg';
import './App.css';
import Web3 from 'web3';
import { Component } from 'react';
import AddData from './abis/AddData.json';
import Navbar from './components/Navbar';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Home from './components/Home';
import List from './components/List';
import Search from './components/Search';
import Add from './components/Add';
import SearchEntities from './components/SearchEntities';

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
       
        <BrowserRouter>
        <div>
           <Navbar account={this.state.account}/>
             <Switch>
          <Route path='/LedgerPrototypedApp/homepage' component={Home} />
         
          <Route exact path='/LedgerPrototypedApp' component={Home} />


          <Route exact path="/List" component={List}/>
             <Route exact path="/Search" component={Search}/>
              <Route exact path="/Add" component={Add}/>
               <Route exact path="/SearchEntities" component={SearchEntities}/>
         
        </Switch>
        </div> 
      </BrowserRouter>
      </div>
  );
}
}

export default App;
