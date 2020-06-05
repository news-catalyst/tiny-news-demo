import React from "react"
import { Formik, Form, Field } from 'formik'

export default function HomepageSearchPanel(props) {
  return (
    <nav className="panel">
      <p className="panel-heading">
        {props.metadata.labels.search}
      </p>
      <div className="panel-block">
        <div className="control">
          <Formik
            initialValues={{ query: props.query }}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(false);
              window.location.href = `/search?query=${values.query}`;
            }}
          >
            <Form>
              <Field name="query" className="input" />
            </Form>
          </Formik>
        </div>
      </div>
    </nav>
  )
}