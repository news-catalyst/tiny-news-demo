import React from "react"
import { Formik, Form, Field } from 'formik'

export default function SearchPanel(props) {
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
              props.setQuery(values.query)
              setSubmitting(false)
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