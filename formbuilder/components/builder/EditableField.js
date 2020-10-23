import React, { Component } from "react";
import { Draggable, Droppable } from "react-drag-and-drop";
import Form from "react-jsonschema-form";
import SchemaField from "react-jsonschema-form/lib/components/fields/SchemaField";
import { ButtonToolbar, Button } from "react-bootstrap";
import FieldListDropdown from "./FieldListDropdown";
import {RIETextArea} from "riek";

/**
 * Recopies the keys listed in "source" using the values in the "target"
 * object, excluding keys listed in the "excludedKey" argument.
 **/
function pickKeys(source, target, excludedKeys) {
  const result = {};

  let isExcluded;
  for (let key in source) {
    isExcluded = excludedKeys.indexOf(key) !== -1;
    if (isExcluded) {
      continue;
    }
    result[key] = target[key];
  }
  return result;
}

function shouldHandleDoubleClick(node) {
  // disable doubleclick on number input, so people can use inc/dec arrows
  if (node.tagName === "INPUT" &&
      node.getAttribute("type") === "number") {
    return false;
  }
  return true;
}

/**
 * Determine how to render the field - because markdown isn't a capability of react-jsonschema-form (although we use the schema).
 * Find the editor to use inside the field's editSchema, which is passed with the schema.
 * Its a handy way to pass data (which SHOULD be stripped out upon saving) when react-jsonschema-form is in control of the rendering.
 * NB EditableField.js is passed as 'SchemaField' to react-jsonschema-form to render the fields - see FormContainer.js
 */
function renderer(uiSchema) {
  return uiSchema.editSchema && uiSchema.editSchema.editor || "react-jsonschema-form";
}

class FieldPropertiesEditor extends Component {
  constructor(props) {
    super(props);
    this.state = {
      editedSchema: props.schema,
      editedUiSchema: props.uiSchema
    };
  }

  onChange({formData}) {
    this.setState({editedSchema: formData});
  }

  onChangeUi(uiSchema) {
    this.setState({editedUiSchema: uiSchema});
  }

  render() {
    const {schema, name, required, uiSchema, onCancel, onUpdate, onUpdateUi, onDelete} = this.props;
    const formData = {
      ...schema,
      required,
      ...this.state.editedSchema,
      name: this.state.name
    };

    const uiSchemaUpdated = {
      ...uiSchema,
      ...this.state.editedUiSchema
    };

    return (
      <div className="panel panel-default field-editor">
        <div className="panel-heading clearfix">
            <strong className="panel-title">Edit {name}</strong>

            <ButtonToolbar className="pull-right">
              <FieldListDropdown bsStyle="link" {...this.props}>
                change field <i className="glyphicon glyphicon-cog"/>
              </FieldListDropdown>
              <Button bsStyle="link" onClick={onDelete}>
                delete <i className="glyphicon glyphicon-trash"/>
              </Button>
              <Button bsStyle="link" name="close-btn" onClick={onCancel}>
                close <i className="glyphicon glyphicon-remove-sign"/>
              </Button>
            </ButtonToolbar>
        </div>
        <div className="panel-body">
          {renderer(uiSchema) === "markdown"
            ?
              <div>
                <RIETextArea
                    className="edit-in-place"
                    classEditing="edit-in-place-active"
                    propName="md"
                    value={this.state.editedUiSchema.md || ""}
                    change={(v) => this.setState({editedUiSchema: v})}
                />
                <Button bsStyle="info" className={"pull-right"} onClick={() => onUpdateUi(uiSchemaUpdated)}>Submit</Button>
              </div>
            :
              <Form
                  schema={uiSchema.editSchema}
                  formData={formData}
                  onChange={this.onChange.bind(this)}
                  onSubmit={onUpdate}>
                <button type="submit" className="btn btn-info pull-right">Submit</button>
              </Form>
          }
        </div>
      </div>
    );
  }
}

function DraggableFieldContainer(props) {
  const {
    children,
    dragData,
    onEdit,
    onDelete,
    onDoubleClick,
    onDrop
  } = props;
  return (
    <Draggable type="moved-field" data={dragData}>
      <Droppable types={["field", "moved-field"]}
        onDrop={onDrop}>
        <div className="row editable-field" onDoubleClick={onDoubleClick}>
          <div className="col-sm-9">
            {children}
          </div>
          <div className="col-sm-3 editable-field-actions">
            <Button bsStyle="link" onClick={onEdit}>
              edit <i className="glyphicon glyphicon-edit"/>
            </Button>
            <Button bsStyle="link" onClick={onDelete}>
              delete <i className="glyphicon glyphicon-trash"/>
            </Button>
          </div>
        </div>
      </Droppable>
    </Draggable>
  );
}

export default class EditableField extends Component {
  constructor(props) {
    super(props);
    this.state = {edit: true,
      schema: props.schema,
      uiSchema: props.uiSchema
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      schema: nextProps.schema,
      uiSchema: nextProps.uiSchema
    });
  }

  handleEdit(event) {
    event.preventDefault();
    if (shouldHandleDoubleClick(event.target)) {
      this.setState({edit: true});
    }
  }

  handleUpdate({formData}) {
    // Exclude the "type" key when picking the keys as it is handled by the
    // SWITCH_FIELD action.
    const updated = pickKeys(this.props.schema, formData, ["type"]);
    const schema = {...this.props.schema, ...updated};
    this.setState({edit: false, schema});
    this.props.updateField(
      this.props.name, schema, formData.required, formData.title);
  }

  handleUpdateUi(uiSchema) {
    this.setState({edit: false, uiSchema});
    this.props.updateFieldUi(
        this.props.name, uiSchema, this.props.name);
  }

  handleDelete(event) {
    event.preventDefault();
    if (confirm("Are you sure you want to delete this field?")) {
      this.props.removeField(this.props.name);
    }
  }

  handleCancel(event) {
    event.preventDefault();
    this.setState({edit: false});
  }

  handleDrop(data) {
    const {name, swapFields, insertField} = this.props;
    if ("moved-field" in data && data["moved-field"]) {
      if (data["moved-field"] !== name) {
        swapFields(data["moved-field"], name);
      }
    } else if ("field" in data && data.field) {
      insertField(JSON.parse(data.field), name);
    }
  }

  render() {
    const props = this.props;

    if (this.state.edit) {
      return (
        <FieldPropertiesEditor
          {...props}
          onCancel={this.handleCancel.bind(this)}
          onUpdate={this.handleUpdate.bind(this)}
          onUpdateUi={this.handleUpdateUi.bind(this)}
          onDelete={this.handleDelete.bind(this)} />
      );
    }

    if (props.schema.type === "object") {
      if (!props.name) {
        // This can only be the root form object, returning a regular SchemaField.
        return <SchemaField {...props} idSchema={{$id: props.name}} />;
      }
    }

    return (
      <DraggableFieldContainer
        draggableType="moved-field"
        droppableTypes={["moved-field", "field"]}
        dragData={props.name}
        onEdit={this.handleEdit.bind(this)}
        onDelete={this.handleDelete.bind(this)}
        onDoubleClick={this.handleEdit.bind(this)}
        onDrop={this.handleDrop.bind(this)}>
        {renderer(props.uiSchema) === "markdown"
            ?
              <div>{this.state.uiSchema.md}</div>
            :
              <SchemaField {...props}
                           schema={this.state.schema}
                           idSchema={{$id: props.name}} />
        }
      </DraggableFieldContainer>
    );
  }
}
