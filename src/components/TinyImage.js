import React from 'react';
import '../utils/fontawesome'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

const TinyImage = (props) => {
    return (
      <div className="tile">
        <div className="card">
          <div className="card-header">
            <a className="card-header-title" href={props.document.path} target="_blank" rel="noopener noreferrer">
              {props.document.name}
            </a>
            <a className="card-header-icon" href={props.document.path} target="_blank" rel="noopener noreferrer">
              <FontAwesomeIcon icon="external-link-alt" />
            </a>
          </div>
          <div className="card-image">
            <figure className="image">
              <img src={props.image.source} alt={props.image.title} />
            </figure>
          </div>
          <div className="card-content">
            <p>
              {props.image.title}
            </p>
            <p>
              {props.image.alt}
            </p>
          </div>
        </div>
      </div>
    );
}

export default TinyImage;
