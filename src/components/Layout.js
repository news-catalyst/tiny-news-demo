import React from "react"
import {Helmet} from "react-helmet";
import { GatsbySeo } from 'gatsby-plugin-next-seo';

export default function Layout(props) {
  return (
    <>
      <Helmet>
        <script type="text/javascript" src="/pico.js"/>
      </Helmet>
      <GatsbySeo
      title={props.og_title}
      description={props.og_description}
      openGraph={{
        title: props.og_title,
        description: props.og_description,
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
