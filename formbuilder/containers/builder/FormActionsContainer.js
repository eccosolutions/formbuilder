import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import FormActions from "../../components/builder/FormActions";
import * as FieldListActions from "../../actions/fieldlist";
import config from "../../config";


function mapStateToProps(state) {
  return {
    fieldList: config.fieldList,
    schema: state.form.schema,
    importFormDialog: state.form.importFormDialog,
    importFormText: state.form.importFormText
  };
}

function mapDispatchToProps(dispatch) {
  const actionCreators = {...FieldListActions};
  return bindActionCreators(actionCreators, dispatch);
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(FormActions);
