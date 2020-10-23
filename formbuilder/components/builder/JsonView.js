import React from "react";

export function toFormDefinition(adminUrl, schema, uiSchema) {
  const wrapperPrefix = "{\"meta\": {\"label\": \"json-schema-form-layout\", \"version\": \"1\", " +
      "\"formbuilder\": \""+ adminUrl + "\"}, \"schema\": {";
  const schemaFmt = JSON.stringify(schema, null, 2);
  const uiSchemaFmt = JSON.stringify(uiSchema, null, 2);
  const wrapperPostfix = "}}";
  return wrapperPrefix + "\"schema\": " + schemaFmt + ", \"uiSchema\": " + uiSchemaFmt + wrapperPostfix;
}

export function fromFormDefinition(formDefinition) {
  const fd = JSON.parse(formDefinition);
  return fd.schema;
}

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
