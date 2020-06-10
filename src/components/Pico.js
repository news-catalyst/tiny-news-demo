import React, { Component } from 'react'

class Pico extends Component {
  componentDidMount(){
    const script=document.createElement('script')
    script.id="loadPico"
    script.src="/pico.js"
    script.async=true;
    this.instance.appendChild(script)

    var pageInfo = {
        article: this.props.article,
        post_type: this.props.post_type,
        url: window.location.href
    };
    if (this.props.post_id) {
      pageInfo.post_id = this.props.post_id;
    }
    if (this.props.tags) {
      pageInfo.taxonomies = { tags: this.props.tags };
    }

    document.getElementById("loadPico").addEventListener('load', () => {
      console.log("Pico is loaded");
      console.log(pageInfo);
      window.pico('visit', pageInfo);
    });
  }
  
  render() {
    return (
      <div>
        <button ref={el => (this.instance = el)} className="PicoRule">Open Pico (Test)</button>
      </div>
    )
  }
}

export default Pico;

    
