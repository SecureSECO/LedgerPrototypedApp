import React, { Component } from 'react';
import Web3 from 'web3'
import AddData from '../abis/AddData.json';


class Main extends Component {

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
      Validataion:true,
      checking:false,
      btnStatus:true,
      requestMetamask:false
    }

    this.createData = this.createData.bind(this)
   
  }

  createData(jsonvalue, identity) {

    var jsonvalue = this.jsonvalue.value;
    var resualt=this.IsValidJSONString(jsonvalue)
    //alert(resualt)

    if(this.state.Validataion == true && resualt==true && this.state.requestMetamask == false){

       this.setState({ loading: true })
    this.state.adddata.methods.createData(jsonvalue, identity).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
    this.setState({ requestMetamask: true })

    }
    else if(this.state.Validataion == false){

      alert('Unique Hash is already taken. Try another')


    }
      else if(resualt == false){

      alert('Json Value is invalid')


    }

     if (this.state.requestMetamask === true) {
            window.location.href = "/LedgerPrototypedApp"
        }

   
  }


  IsValidJSONString(item) {
     item = typeof item !== "string"
        ? JSON.stringify(item)
        : item;

    try {
        item = JSON.parse(item);
    } catch (e) {
        return false;
    }

    if (typeof item === "object" && item !== null) {
        return true;
    }

    return false;
}


   async validate(){

    this.setState({ checking: true })
    this.setState({ btnStatus: true })

    var identity = this.identity.value;

   
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
       this.setState({ Validataion: true })
      this.setState({datas: []});
      for (var i = 1; i <= dataCount; i++) {
        const data = await adddata.methods.datas(i).call()

        
        if (data.identity==identity) {
           this.setState({ Validataion: false })

           alert('Unique Hash is already taken. Try another')
           break
          
        }
                
      }

      if (this.state.Validataion==true) {

         this.setState({ btnStatus: false })

      }

      

      this.setState({ checking: false })
      

      this.setState({ loading: false})
    } 
    else {
      window.alert('The contract not deployed to detected network.')
    }
  
  
}

  render() {
    return (
      <div id="content">
        
      <h3 className="title center">Add New Entities</h3>
        <form onSubmit={(event) => {
          event.preventDefault()
          const jsonvalue = this.jsonvalue.value
          const identity = this.identity.value
          this.createData(jsonvalue, identity)
        }}>
            <div className="form-group form">
            <input
              id="identity"
              type="text"
              ref={(input) => { this.identity = input }}
              className="form-control"
              placeholder="Unique Hash"
              onBlur={()=>this.validate()}
              required />
          </div>


           { this.state.checking
                ? <div id="loader" className="text-center"><p className="text-center">Loading...</p></div>
                : null
              }




          <div className="form-group form">
            <textarea 
              id="jsonvalue"
              type="text"
              ref={(input) => { this.jsonvalue = input }}
              className="form-control"
              placeholder="Json String"
              required />
          </div>
          <button type="submit" className="btn btn-info form" disabled={this.state.btnStatus}>Add</button>
        </form>
       
      </div>
    );
  }
}

export default Main;
