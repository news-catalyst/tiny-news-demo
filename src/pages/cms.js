import React from "react"
import { Router } from "@reach/router"
import Layout from "../components/Layout"
import Publish from "./cms/publish"

const Cms = () => {
  return (
    <Layout>
      <Router basepath="/cms">
        <Publish path="/publish" />
      </Router>
    </Layout>
  )
}

export default Cms