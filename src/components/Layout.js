import React from "react"
import { GatsbySeo } from 'gatsby-plugin-next-seo';

export default function Layout(props) {
  return (
    <>
      <GatsbySeo
      title={props.og_title}
      description={props.og_description}
      openGraph={{
        title: props.title,
        description: props.description,
        images: [
          {
            url: props.og_image_url,
            width: 800,
            height: 600,
            alt: props.og_image_alt,
          },
        ],
      }}
      twitter={{
        handle: props.tw_handle,
        site: props.tw_site,
        cardType: props.tw_cardType,
      }}

    />

    <main>
      <div className="container">
        {props.children}
      </div>
    </main>
    </>
  )
}