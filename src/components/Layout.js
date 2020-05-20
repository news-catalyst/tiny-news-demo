import React from "react"
import { GatsbySeo } from 'gatsby-plugin-next-seo';

export default function Layout(props) {
  return (
    <>
      <GatsbySeo
      title={props.title}
      description={props.description}
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
    />

    <div className="container">
      {props.children}
    </div>
    </>
  )
}