import React, { Component } from 'react';
import Web3 from 'web3'

import './App.css';
import AddData from '../abis/AddData.json';
import Navbar from './Navbar';
import Main from './Main3';

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
      //window.alert('Non-Ethereum browser detected. You should consider trying MetaMask!')
      
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
      // for (var i = 1; i <= dataCount; i++) {
      //   const data = await adddata.methods.datas(i).call()
      //   this.setState({
      //     datas: [...this.state.datas, data]
      //   })
      // }
      // this.setState({ loading: false})
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
      loading: true,
      searching:false
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


  async search(){

    this.setState({ searching: true})

    var title = this.title.value;

   
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
      //Load datas
      this.setState({datas: []});
      for (var i = 1; i <= dataCount; i++) {
        const data = await adddata.methods.datas(i).call()

        
        if (data.identity==title) {
          this.setState({
          datas: [...this.state.datas, data]
        })

          break

        }
        

        
      }

      this.setState({ searching: false})

      this.setState({ loading: false})
    } else {
      window.alert('The contract not deployed to detected network.')
    }
  
  
}



  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
          <div className="form searchBox">
            <input type="text" placeholder="Search Unique Hash.... " className="form-control" id="txtSearch" ref={input => this.title = input}/>
       <button className="btn btn-info form btnSearch" onClick={()=>this.search()}>
      Search
    </button>
       { this.state.searching
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : null
              }
      </div>
            <main role="main" className="col-lg-12 d-flex">
              { this.state.loading
                ? <div id="loader" className="text-center"></div>
                : <Main
                  datas={this.state.datas}
                                    />
              }
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
