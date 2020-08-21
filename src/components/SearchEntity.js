import React, { Component } from 'react';

import Web3 from 'web3';
import AddData from '../abis/AddData.json';
import mylogo from '../mylogo.jpg';
import uulogo from '../uulogo.png';

class SearchEntity extends Component {


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

   
   
  }



  search(txtSearch)
{  
   var title = this.title.value;
    var a=this.props.datas.map((data, key) => {
    if (title===data.identity.toString()) {
           document.getElementById("txtResult").innerHTML= data.jsonvalue;
                 }                     
            })
 }


  render() {
        return (
        <div id="content">
      <div className="form searchBox">      
      <input type="text" placeholder="Search identity.... " className="form-control" id="txtSearch" ref={input => this.title = input}/>
       <button className="btn btn-info form btnSearch" onClick={()=>this.search(this.props.datas)}>
      Search
    </button>
      <p>json file:</p>
     <p id="txtResult" className="resualt">No Data...</p>
     </div>
     <div class="footer fixed">
      <img src={mylogo} alt="" width="200" height="61"/>
      <img src={uulogo} alt="" width="200" height="104"/>
     </div>
            </div>
        );
  }
}


export default SearchEntity;
