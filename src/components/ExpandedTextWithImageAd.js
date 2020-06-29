import React from "react"

export default function ExpandedTextWithImageAd(props) {

    return (
        <section className="text-ad-container">
            <div className="ad-container">
                <div className="ad-brand">
                    <p>Advertisement from {props.ad.brand}</p>
                </div>
                <div className="media">
                    <div className="media-left ad-img-container">
                        <img src={props.ad.image.url} className="ad-img" alt={props.ad.image.alt} />
                    </div>
                    <div className="media-content ad-text-container" >
                        <h3>{props.ad.header}</h3>
                        <div>{props.ad.body}</div> {/* According to the whereby.us docs, the expanded body text can include multiple links, paragraphs */}
                    </div>
                </div>
            </div>
        </section>
    )
}