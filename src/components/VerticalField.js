import React, {useState} from 'react';

export default function VerticalField(props) {
  console.log(props);

  const [label, setLabel] = useState(props.label)
  const [link, setLink] = useState(props.link);

  const handleChange = e => {
    console.log("handleChange sections: ", props.sections);
    let name = e.target.name;
    if (name === "label") {
      setLabel(e.target.value);
    } else if (name === "link") {
      setLink(e.target.value);
    }
    // let newSections = props.sections.push({[label]: link})
    // console.log("newSections: ", newSections)
  }
  return (
    <div>
      <div className="field">
        <label className="label">Label</label>
        <div className="control">
          <input type="text" name={`label[${props.index}]`} className="input" value={label} name="label" onChange={handleChange} />
        </div>
      </div>
      <div className="field">
        <label className="label">Link</label>
        <div className="control">
          <input type="text" name={`link[${props.index}]`} className="input" value={link} name="link" onChange={handleChange} />
        </div>
      </div>
    </div>
  )
}