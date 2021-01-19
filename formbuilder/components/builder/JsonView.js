import React from "react";
import {toFormDefinition} from "../../reducers/form";

export default function JSONView(props) {
  return (
      <div className="form-group">
        <textarea
          className="form-control"
          readOnly=""
          rows="20"
          style={{fontFamily: "monospace"}}
          value={toFormDefinition(props.adminUrl, props.schema, props.uiSchema)}
          onChange={() => {}} />
      </div>
  );
}
