import React, { Component } from 'react'

class Coral extends Component {
  componentDidMount(){
    const script=document.createElement('script')
    script.id="loadCoral"
    script.src="/coral.js"
    script.async=true;
    this.instance.appendChild(script)

    document.getElementById("loadCoral").addEventListener('load', () => {
      console.log("Coral is loaded");
    });
  }
  
  render() {
    return (
      <div ref={el => (this.instance = el)} id="coral_thread"></div>
    )
  }
}

export default Coral;