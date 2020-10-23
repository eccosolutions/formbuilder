import React from "react";
import FieldListDropdown from "./FieldListDropdown";
import {Button, ButtonToolbar, ButtonGroup, Modal, FormControl} from "react-bootstrap";

// OVERALL FORM BUTTONS/ACTIONS
// actions here call fieldlist.js methods, which then create the action
// which then gets handled in form.js (which also holds the initial_state)

export default function FormActions(props) {
  const onClick = (event) => {
    props.publishForm(({collection, adminToken}) => {
      props.history.pushState(null, `/builder/published/${adminToken}`);
    });
  };

  let saveIconName;
  if (props.status === "pending") {
    saveIconName = "refresh spin";
  } else {
    saveIconName = "save";
  }
  return (
    <div>
      {props.importFormDialog === true &&
        <Modal.Dialog>
          <Modal.Header>
          <Modal.Title>Modal title</Modal.Title>
          </Modal.Header>
          <Modal.Body>
          <p>Copy the form definition here:</p>
            <FormControl as="textarea" placeholder="form definition" value={props.importFormText}
                         onChange={e => props.importFormTextFn(e.target.value)} />
          </Modal.Body>
          <Modal.Footer>
          <Button variant="secondary" onClick={() => props.importFormDialogFn()}>close</Button>
          <Button variant="primary" onClick={() => props.importFormFn()}>import</Button>
          </Modal.Footer>
        </Modal.Dialog>
      }
      <ButtonToolbar className="builder-inner-actions">
        <FieldListDropdown className="pull-right" {...props}>
          <i className="glyphicon glyphicon-plus" />
          Add a field
        </FieldListDropdown>
        <Button bsStyle="info" className={"pull-right"} onClick={() => props.submitAll()}>Submit All</Button>
      </ButtonToolbar>
      <ButtonGroup className="pull-right">
        <Button onClick={() => props.importFormDialogFn()}>
          <i className="glyphicon glyphicon-remove" />
          Import <span className="hidden-xs">schema</span>
        </Button>
        <Button onClick={() => confirm("This action will reset all unsaved changes, Are you sure?") && props.resetForm()}>
          <i className="glyphicon glyphicon-remove" />
          Reset <span className="hidden-xs">form</span>
        </Button>
        <Button bsStyle="success" onClick={onClick}>
          <i className={`glyphicon glyphicon-${saveIconName}`} />
          Save your form
        </Button>
      </ButtonGroup>
    </div>
  );
}
