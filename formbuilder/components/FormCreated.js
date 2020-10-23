import React, { Component } from "react";
import ClipboardButton from "react-clipboard.js";
import {getFormID, getFormURL, getFormEditURL, getAdminURL} from "../utils";
import URLDisplay from "./URLDisplay";
import JSONView, {toFormDefinition} from "./builder/JsonView";

export default class FormCreated extends Component {
  constructor(props) {
    super(props);
    this.state = {
      copiedLink: false,
      copiedJson: false
    };
  }

  onClipboardCopiedLink() {
    this.setState({copiedLink: true});
  }
  onClipboardCopiedJson() {
    this.setState({copiedJson: true});
  }

  render() {
    const adminToken = this.props.params.adminToken;
    const formID = getFormID(adminToken);

    const userformURL = getFormURL(formID);
    const userformEditURL = getFormEditURL(adminToken);
    const adminURL = getAdminURL(adminToken);

    return (
      <form>
        <h3>Form definition</h3>
        <div className="form-group">
          <ul className="list-inline">
            <li>
            <ClipboardButton
              className="btn btn-link"
              data-clipboard-text={userformURL}
              onSuccess={this.onClipboardCopiedLink.bind(this)}>
              <i className="glyphicon glyphicon-copy" /> <a>{this.state.copiedLink ? "Copied!" : "Copy to clipboard"}</a>
            </ClipboardButton>
            </li>
          </ul>
          {/* DATA ENTRY <URLDisplay url={userformURL} />*/}
          {/* DATA COLLECTION <URLDisplay url={adminURL} type="admin" />*/}
          <URLDisplay url={userformEditURL} />
          <br/><br/>
          <ul className="list-inline">
            <li>
              <ClipboardButton
                  className="btn btn-link"
                  data-clipboard-text={toFormDefinition(adminURL, this.props.schema, this.props.uiSchema)}
                  onSuccess={this.onClipboardCopiedJson.bind(this)}>
                <i className="glyphicon glyphicon-copy" /> <a>{this.state.copiedJson ? "Copied!" : "Copy to clipboard"}</a>
              </ClipboardButton>
            </li>
          </ul>

          <JSONView adminUrl={adminURL} schema={this.props.schema} uiSchema={this.props.uiSchema}/>
        </div>
      </form>
    );
  }
}
