import React from "react"

export default function ExpandedTextAd(props) {

    return (
        <section className="ad-container text-ad-container">
            <div className="ad-brand">
                <p>Advertisement from {props.ad.brand}</p>
            </div>
            <div>
                <h3>{props.ad.header}</h3>
                <p>{props.ad.body}</p> {/* According to the whereby.us docs, the expanded body text can include multiple links, paragraphs */}
            </div>
        </section>
    )
}