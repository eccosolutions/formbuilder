import React, { Component } from "react";
import FormContainer from "../../containers/builder/FormContainer";
import {getFormID} from "../../utils";

export default class FormEdit extends Component {

  componentDidMount() {
    // If the schema is empty, then load the schema into the state
    if (!this.state) {
      const formId = getFormID(this.props.params.adminId);
      // callback after SCHEMA_RETRIEVAL_DONE is dispatched in server.js
      const callback = (data) => {
        document.title = data.schema.title;
      };
      this.props.loadSchema(formId, callback, this.props.params.adminId);
    }
  }

  render() {
    return (<div className="narrow">
        <FormContainer {...this.props}/>
    </div>
  );
  }
}
