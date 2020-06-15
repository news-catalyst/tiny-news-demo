import React from "react"

export default function TextAd(props) {

    return (
        <section className="ad-container">
            <div className="ad-brand">
                <p>Advertisement from {props.ad.brand}</p>
            </div>
            <div>
                <a href={props.ad.url}><img src={props.ad.image.url} className="ad-banner" alt={props.ad.image.alt} /></a>
            </div>
        </section>
    )
}