import React from "react"
import { Router } from "@reach/router"
import Layout from "../components/Layout"
import Publish from "./cms/publish"
import GoogleLogin from "../components/GoogleLogin"

const Cms = () => {
  return (
    <Layout>
      <Router basepath="/cms">
        <Publish path="/list" />
        <GoogleLogin path="/login" />
      </Router>
    </Layout>
  )
}

export default Cms