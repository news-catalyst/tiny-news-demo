import React from "react"

export default function ExpandedTextAd(props) {

    return (
        <section className="text-ad-container">
            <div className="ad-container">
                <div className="ad-brand">
                    <p>Advertisement from {props.ad.brand}</p>
                </div>
                <div>
                    <h3>{props.ad.header}</h3>
                    <div>{props.ad.body}</div> {/* According to the whereby.us docs, the expanded body text can include multiple links, paragraphs */}
                </div>
            </div>
        </section>
    )
}