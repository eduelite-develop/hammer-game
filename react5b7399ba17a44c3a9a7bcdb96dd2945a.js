import React from 'react'
import ReactDOM from 'react-dom/client'
import HammerGame from './HammerGame';
import './index.css'

const App = ({data, env, gameLoadedEvent, gameOverEvent, triggerLearningEvent, onUpdateData}) => {
    
   console.log("React version:", React.version);

   const handleLoaded = () => {
    if (gameLoadedEvent) {
      gameLoadedEvent(
      { 
        onCompleteCallback: (gameState)=>{

          console.log("please update game parameters using the result");
          console.log("result:");
          console.log(gameState);

          if(gameState && gameState.lives){
            this.lives = gameState.lives;
          }
  
          if(gameState && gameState.score){
            this.score = gameState.score;
          }          

      }
      
      });
    }
  };

  

    return (
      <>
       <HammerGame gameState={gameState}  gameOverEvent={gameOverEvent} triggerLearningEvent={triggerLearningEvent}/>
      </>
    )
  
}

class Elementreact5b7399ba17a44c3a9a7bcdb96dd2945a extends HTMLElement {
  
  constructor(){
    super();
      this.dataState = null;
      // Bind the setDataState method to ensure `this` refers to the component instance.
      this.setDataState = this.setDataState.bind(this);
      this._gameLoadedEvent = null; // store function here
      this._triggerLearningEvent = null; // store function here
      this._gameOverEvent = null; // store function here
  }

  getDataState(){
    return this.dataState;
  }

  setDataState(dataState){
    this.dataState = dataState;
    console.log("react component set DataState:");
    console.log(this.dataState);
  }
  
  set gameLoadedEvent(fn) {
    this._gameLoadedEvent = fn;
    this._gameLoadedEvent = this._gameLoadedEvent.bind(this);
    console.log('✅ gameLoadedEvent assigned');    
  }

  get gameLoadedEvent() {
    return this._gameLoadedEvent;
  }

  set triggerLearningEvent(fn) {
    this._triggerLearningEvent = fn;
    this._triggerLearningEvent = this._triggerLearningEvent.bind(this);
    console.log('✅ gameLoadedEvent assigned');    
  }

  get triggerLearningEvent() {
    return this._triggerLearningEvent;
  }

  set gameOverEvent(fn) {
    this._gameOverEvent = fn;
    this._gameOverEvent = this._gameOverEvent.bind(this);
    console.log('✅ gameLoadedEvent assigned');    
  }

  get gameOverEvent() {
    return this._gameOverEvent;
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

    console.log("test events from element");
    

    console.log("react component input data");
    console.log(dataJson);

    const container = document.createElement('div');
    container.style.width = '80vw';
    container.style.height = '70vh';
    this.appendChild(container);

    const waitForFn = () => {

      if (this._gameLoadedEvent && this._gameOverEvent && this._triggerLearningEvent) {
       
        const root = ReactDOM.createRoot(container);
        root.render(
        <App 
          data={dataJson} 
          env={envJson} 
          gameLoadedEvent={this._gameLoadedEvent} 
          gameOverEvent={this._gameOverEvent} 
          triggerLearningEvent={this._triggerLearningEvent} 
          onUpdateData={this.setDataState}/>);
        } else {
           requestAnimationFrame(waitForFn); // wait 1 frame, check again
        }

    };
    waitForFn();



    // Expose getReactVersion function to the custom element
    this.getReactVersion = () => React.version;
  }


}

customElements.define('react-react5b7399ba17a44c3a9a7bcdb96dd2945a', Elementreact5b7399ba17a44c3a9a7bcdb96dd2945a);
