import S from "string";

import {
  FIELD_ADD,
  FIELD_SWITCH,
  FIELD_REMOVE,
  FIELD_UPDATE,
  FIELD_UI_UPDATE,
  FIELD_INSERT,
  FIELD_SWAP,
  FORM_SUBMITALL,
  FORM_IMPORT_DIALOG,
  FORM_IMPORT_TEXT,
  FORM_IMPORT,
  FORM_RESET,
  FORM_UPDATE_TITLE,
  FORM_UPDATE_DESCRIPTION,
} from "../actions/fieldlist";

import {SCHEMA_RETRIEVAL_DONE} from "../actions/server";

// initial state of form
const INITIAL_STATE = {
  error: null,
  schema: {
    type: "object",
    title: "Untitled form",
    description: "Enter some description for your form here",
    properties: {}
  },
  uiSchema: {
    "ui:order": [],
    submitAll: false
  },
  formData: {},
  // global counter
  currentIndex: 0,
  importFormDialog: false,
  importFormText: ""
};

/**
 * Our own 'form definition' schema wraps the formbuilder schema.
 * This method exports our form definition.
 */
export function toFormDefinition(adminUrl, schemaIn, uiSchemaIn) {
  const schema = cleanFormBuilder(schemaIn, uiSchemaIn);
  const schemaFmt = JSON.stringify(schema, null, 2);
  return `{"meta": {"label": "json-schema-form-layout", "version": "1", "formbuilder": "${adminUrl}"}, "schema": ${schemaFmt}}`;
}

/**
 * Our own 'form definition' schema wraps the formbuilder schema.
 * This method imports our form definition.
 */
export function fromFormDefinition(formDefinition) {
  const fd = JSON.parse(formDefinition);
  return cleanFormBuilder(fd.schema.schema, fd.schema.uiSchema);
}

/**
 * Clean the formbuilder schema.
 * This is good when we've exported dodgy fields in the past.
 * Dodgy data is due to us passing data needed to render the fields through the form definition data itself (specifically uiSchema)
 * which is because we pass the fields to the react-json-schema itself to render so have little access outside this data.
 * The export however includes this dodgy data - which can then change the functionality of the fields, for instance 'submitAll'
 * can already be set to true but the default is false (EditField.js), so clicking 'submit all' doesn't change anything.
 * NB We can use this 'clean' therefore to stripp out the incoming ui fields for any newer definitions of the ui data
 * - being careful to retain the 'md' markdown.
 */
export function cleanFormBuilder(schema, uiSchema) {
  delete uiSchema.submitAll;
  const existing = Object.keys(schema.properties);
  existing.forEach(i => {
    delete uiSchema[i].editSchema.submitAll;
    //console.log("sa submitAll json: "+i+": " + JSON.stringify(formDefinition.schema.uiSchema[i].editSchema));
  });
  return {schema: schema, uiSchema: uiSchema};
}

function slugify(string) {
  return S(string).slugify().replace("-", "_").s;
}

function clone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function unique(array) {
  return Array.from(new Set(array));
}

function addField(state, field) {
  // Generating a usually temporary random, unique field name.
  state.currentIndex += 1;
  const name = `Question ${state.currentIndex}`;
  const _slug = slugify(name);

  const existingSlugs = Object.keys(state.schema.properties);
  if (existingSlugs.indexOf(_slug) !== -1) {
    // Field name already exists, we can't update state
    const error = `Duplicate field name "${_slug}", operation aborted.`;
    return {...state, error};
  }

  state.schema.properties[_slug] = {...field.jsonSchema, title: name};
  state.uiSchema[_slug] = field.uiSchema;
  state.uiSchema["ui:order"] = (state.uiSchema["ui:order"] || []).concat(_slug);
  return state;
}

function switchField(state, propertyName, newField) {
  state.schema.properties[propertyName] = {...newField.jsonSchema};
  state.uiSchema[propertyName] = newField.uiSchema;

  return state;
}

function removeField(state, name) {
  const requiredFields = state.schema.required || [];
  delete state.schema.properties[name];
  delete state.uiSchema[name];
  state.uiSchema["ui:order"] = state.uiSchema["ui:order"].filter(
    (field) => field !== name);
  state.schema.required = requiredFields
    .filter(requiredFieldName => name !== requiredFieldName);
  if (state.schema.required.length === 0) {
    delete state.schema.required;
  }
  return {...state, error: null};
}

function updateField(state, name, schema, required, newLabel) {

  const existing = Object.keys(state.schema.properties);
  const newName = slugify(newLabel);
  // if we've been created, but not yet renamed
  const allowRenameField = name.indexOf("question_") === 0;

  if (allowRenameField && name !== newName && existing.indexOf(newName) !== -1) {
    // Field name already exists, we can't update state
    const error = `Duplicate field name "${newName}", operation aborted.`;
    return {...state, error};
  }

  const requiredFields = state.schema.required || [];
  state.schema.properties[name] = schema;
  if (required) {
    // Ensure uniquely required field names
    state.schema.required = unique(requiredFields.concat(name));
  } else {
    state.schema.required = requiredFields
      .filter(requiredFieldName => name !== requiredFieldName);
  }

  if (allowRenameField && (newName !== name)) {
    return renameField(state, name, newName);
  }

  return {...state, error: null};
}

function updateFieldUi(state, name, uiSchema) {
  state.uiSchema[name] = uiSchema;
  return {...state, error: null};
}

function renameField(state, name, newName) {
  const schema = clone(state.schema.properties[name]);
  const uiSchema = clone(state.uiSchema[name]);
  const order = state.uiSchema["ui:order"];
  const required = state.schema.required;
  delete state.schema.properties[name];
  delete state.uiSchema[name];
  state.schema.properties[newName] = schema;
  state.schema.required = required.map(fieldName => {
    return fieldName === name ? newName : fieldName;
  });
  state.uiSchema[newName] = uiSchema;
  state.uiSchema["ui:order"] = order.map(fieldName => {
    return fieldName === name ? newName : fieldName;
  });
  return {...state, error: null};
}

function submitAll(state) {
  const existing = Object.keys(state.schema.properties);
  existing.forEach(i => {
    state.uiSchema[i].editSchema.submitAll = true;
    //console.log("sa submitAll json: "+i+": " + JSON.stringify(state.uiSchema[i].editSchema));
  });
  return {...state};
}

function insertField(state, field, before) {
  const insertedState = addField(state, field);
  const order = insertedState.uiSchema["ui:order"];
  const added = order[order.length - 1];
  const idxBefore = order.indexOf(before);
  const newOrder = [].concat(
    order.slice(0, idxBefore),
    added,
    order.slice(idxBefore, order.length - 1)
  );
  insertedState.uiSchema["ui:order"] = newOrder;
  return {...insertedState, error: null};
}

function swapFields(state, source, target) {
  const order = state.uiSchema["ui:order"];
  const idxSource = order.indexOf(source);
  const idxTarget = order.indexOf(target);
  order[idxSource] = target;
  order[idxTarget] = source;
  return {...state, error: null};
}

function updateFormTitle(state, {title}) {
  state.schema.title = title;
  return {...state, error: null};
}

function updateFormDescription(state, {description}) {
  state.schema.description = description;
  return {...state, error: null};
}

function setSchema(state, data) {
  state.schema = data.schema;
  state.uiSchema = data.uiSchema;
  return {...state, error: null};
}

function importDialog(state) {
  return {...state, importFormDialog: !state.importFormDialog};
}

function importText(state, text) {
  return {...state, importFormText: text};
}

function importForm(state) {
  const schema = fromFormDefinition(state.importFormText);
  const stateWithoutImport = {...state, importFormText: "", importFormDialog: false};
  return setSchema(stateWithoutImport, schema);
}

// state here is a subset, state.form - see FormContainer.js
export default function form(state = INITIAL_STATE, action) {
  switch(action.type) {
  case FIELD_ADD:
    return addField(clone(state), action.field);
  case FIELD_SWITCH:
    return switchField(clone(state), action.property, action.newField);
  case FIELD_REMOVE:
    return removeField(clone(state), action.name);
  case FIELD_UPDATE:
    const {name, schema, required, newName} = action;
    return updateField(clone(state), name, schema, required, newName);
  case FIELD_UI_UPDATE:
    return updateFieldUi(clone(state), action.name, action.uiSchema, action.newName);
  case FIELD_INSERT:
    return insertField(clone(state), action.field, action.before);
  case FIELD_SWAP:
    return swapFields(clone(state), action.source, action.target);
  case FORM_SUBMITALL:
    return submitAll(clone(state));
  case FORM_IMPORT_DIALOG:
    return importDialog(state);
  case FORM_IMPORT_TEXT:
    return importText(clone(state), action.text);
  case FORM_IMPORT:
    return importForm(clone(state));
  case FORM_RESET:
    return INITIAL_STATE;
  case FORM_UPDATE_TITLE:
    return updateFormTitle(clone(state), action.title);
  case FORM_UPDATE_DESCRIPTION:
    return updateFormDescription(clone(state), action.description);
  case SCHEMA_RETRIEVAL_DONE:
    return setSchema(clone(state), cleanFormBuilder(action.data));
  default:
    return state;
  }
}
