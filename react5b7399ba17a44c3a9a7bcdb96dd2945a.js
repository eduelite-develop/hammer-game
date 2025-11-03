import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'

const App = ({data, env, onUpdateData}) => {
    
   console.log("React version:", React.version);

    return (
      <>
        <div>develop the react component</div>
      </>
    )
  
}

class Elementreact5b7399ba17a44c3a9a7bcdb96dd2945a extends HTMLElement {
  
  constructor(){
    super();
    this.dataState = null;
      // Bind the setDataState method to ensure `this` refers to the component instance.
      this.setDataState = this.setDataState.bind(this);
  }

  getDataState(){
    return this.dataState;
  }

  setDataState(dataState){
    this.dataState = dataState;
    console.log("react component set DataState:");
    console.log(this.dataState);
  }
  
  connectedCallback() {
   
    let data = this.getAttribute("data");
    let env = this.getAttribute("env");

    let dataJson = null;
    let envJson = null;
    if(data==null){
      //Test Mode
      dataJson={
  "component" : {
    "componentTemplateId" : "f95f24c8-7b74-4364-ae9c-4d9ad3293b2f",
    "templateDeployId" : null,
    "content" : {
      "title" : "Dodge React"
    },
    "ui" : { },
    "scores" : [ ]
  },
  "runtime" : {
    "data" : { }
  }
};
    }
    else{
      dataJson = JSON.parse(data);
    }

    if(env==null){
      envJson={        
        header:{
          'Content-Type': 'application/json',  // Example header
          'component-api-key': 'eyJhbGciOiJIUzI1NiJ9.eyJvd25lciI6ImVkdWVsaXRlLmRldmVsb3BAZ21haWwuY29tIiwicm9sZSI6IlNlbGZUZWFjaGVyIiwib3duZXJOYW1lIjoibHRkcmVhbS5kZXZlbG9wIiwibWVtYmVyc2hpcCI6InJlYWN0NWI3Mzk5YmExN2E0NGMzYTlhN2JjZGI5NmRkMjk0NWEiLCJleHAiOjE3NTc3NDYxNjMsIm9wZXJhdG9yTmFtZSI6Imx0ZHJlYW0uZGV2ZWxvcCIsImlhdCI6MTc1Nzc0MjU2Mywib3BlcmF0b3IiOiJlZHVlbGl0ZS5kZXZlbG9wQGdtYWlsLmNvbSJ9.aXwBPSsb7M_5NkB3UMYQfvwEzRDUqpDIUFzq7VvjuI8'
        }        
      }
    }
    else{
      envJson=JSON.parse(env);
    }

    console.log(this.gameLoadedEvent);

    console.log("react component input data");
    console.log(dataJson);
    const root = ReactDOM.createRoot(this);
    root.render(<App data={dataJson} env={envJson} onUpdateData={this.setDataState}/>);

    // Expose getReactVersion function to the custom element
    this.getReactVersion = () => React.version;
  }


}

customElements.define('react-react5b7399ba17a44c3a9a7bcdb96dd2945a', Elementreact5b7399ba17a44c3a9a7bcdb96dd2945a);
