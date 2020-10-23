import React, { Component } from "react";
import FormContainer from "../../containers/builder/FormContainer";
import {getFormID} from "../../utils";

export default class FormEdit extends Component {

  componentDidMount() {
    // If the schema is empty, then load the schema into the state
    if (!this.state) {
      const formId = getFormID(this.props.params.adminId);
      const callback = (data) => {
        document.title = data.schema.title;
        /*
        // TODO - update an existing form by stripping out the incoming ui fields for the newer definitions
             (retaining the 'md' markdown only)
        // see publishForm for what gets saved
        this.setState({
          schema: data.schema,
          uiSchema: data.uiSchema
        });
        */
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
