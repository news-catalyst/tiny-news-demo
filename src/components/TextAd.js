import React from "react"

export default function TextAd(props) {

    return (
        <section className="ad-container text-ad-container">
            <div className="ad-brand">
                <p>Advertisement from {props.ad.brand}</p>
            </div>
            <div>
                <h3>{props.ad.header}</h3>
                <p>{props.ad.body}</p>
                <a href={props.ad.url}>{props.ad.call}</a>
            </div>
        </section>
    )
}