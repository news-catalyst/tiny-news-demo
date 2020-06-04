import React from "react"
import addToMailchimp from 'gatsby-plugin-mailchimp'

let state = {
    email: null,
}

const _handleChange = (e) => {
    console.log({
        [`${e.target.name}`]: e.target.value,
    });
    this.setState({
        [`${e.target.name}`]: e.target.value,
    });
}

const _handleSubmit = e => {
    e.preventDefault();
    addToMailchimp(state.email)
    .then(({ msg, result }) => {
        console.log('msg', `${result}: ${msg}`);

        if (result !== 'success') {
            throw msg;
        }
        alert(msg);
    })
    .catch((err) => {
        console.log('err', err);
        alert(err);
    });
}

export default function SignUp(props) {
    return (
        <form onSubmit={_handleSubmit}>
            <div className="field">
                <label className="label" htmlFor="email" id="email-label">Email</label>
                <div className="control">
                    <input aria-labelledby="email-label" aria-label="email" id="email" name="email" className="input" type="email" placeholder="hello@example.com" onChange={_handleChange} />
                </div>
            </div>
            <div className="field is-grouped">
                <div className="control">
                    <button className="button is-link">Submit</button>
                </div>
                <div className="control">
                    <button className="button is-link is-light">Cancel</button>
                </div>
            </div>
        </form>
    )
}