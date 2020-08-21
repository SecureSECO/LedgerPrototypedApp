import React, { Component } from 'react';



class Main2 extends Component {
  render() {
       return (
        <div id="content">
            <div className="form searchBox">
            <p>json file:</p>
          { this.props.datas.map((data, key) => {
              return(
                <span key={key}>
                   <p id="txtResult" className="resualt">{data.jsonvalue}</p>                                       
                </span>
              )
            })}
     </div>
          </div>
        );
  }
}


export default Main2;
