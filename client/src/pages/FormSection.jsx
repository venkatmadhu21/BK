import PropTypes from "prop-types";

const FormSection = ({ active, children }) => (
  <>{active && <div className="grid gap-6">{children}</div>}</>
);

FormSection.propTypes = {
  active: PropTypes.bool.isRequired,
  children: PropTypes.node.isRequired,
};

export default FormSection;