import React from "react";

export function formDefinition(adminUrl, schema, uiSchema) {
  const wrapperPrefix = "{\"meta\": {\"label\": \"json-schema-form-layout\", \"version\": \"1\", " +
      "\"formbuilder\": \""+ adminUrl + "\"}, \"schema\": {";
  const schemaFmt = JSON.stringify(schema, null, 2);
  const uiSchemaFmt = JSON.stringify(uiSchema, null, 2);
  const wrapperPostfix = "}}";
  return wrapperPrefix + "\"schema\": " + schemaFmt + ", \"uiSchema\": " + uiSchemaFmt + wrapperPostfix;
}

export default function JSONView(props) {
  return (
      <div className="form-group">
        <textarea
          className="form-control"
          readOnly=""
          rows="20"
          style={{fontFamily: "monospace"}}
          value={formDefinition(props.adminUrl, props.schema, props.uiSchema)}
          onChange={() => {}} />
      </div>
  );
}
