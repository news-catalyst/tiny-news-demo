import React, {useState} from 'react';

export default function VerticalField(props) {
  console.log(props);

  const [label, setLabel] = useState(props.label)
  const [link, setLink] = useState(props.link);

  const handleChange = e => {
    let newSections = props.sections;
    let index = e.target.getAttribute("data-vertical-index");
    let name = e.target.name;
    if (name === "label") {
      setLabel(e.target.value);
      newSections[index].label = e.target.value;
    } else if (name === "link") {
      setLink(e.target.value);
      newSections[index].link = e.target.value;
    }
    props.updateSections(newSections)
  }
  return (
    <div className="columns">
      <div className="column is-half">
        <div className="field">
          <label className="label">Label</label>
          <div className="control">
            <input type="text" data-vertical-index={props.index} className="input" value={label} name="label" onChange={handleChange} />
          </div>
        </div>
      </div>
      <div className="column is-half">
        <div className="field">
          <label className="label">Link</label>
          <div className="control">
            <input type="text" data-vertical-index={props.index} className="input" value={link} name="link" onChange={handleChange} />
          </div>
        </div>
      </div>
    </div>
  )
}