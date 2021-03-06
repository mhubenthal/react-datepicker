var React = require('react');
var DateUtil = require('./util/date');
var moment = require('moment');

var DateInput = React.createClass({
  propTypes: {
    disabled: React.PropTypes.bool
  },

  getDefaultProps: function() {
    return {
      dateFormat: 'YYYY-MM-DD'
    };
  },

  getInitialState: function() {
    return {
      value: this.safeDateFormat(this.props.date)
    };
  },

  componentDidMount: function() {
    this.toggleFocus(this.props.focus);
  },

  componentWillReceiveProps: function(newProps) {
    this.toggleFocus(newProps.focus);

    this.setState({
      value: this.safeDateFormat(newProps.date)
    });
  },

  toggleFocus: function(focus) {
    if (focus) {
      this.refs.input.getDOMNode().focus();
    } else {
      this.refs.input.getDOMNode().blur();
    }
  },

  handleBlur: function() {
    if (this.props.onBlur) {
      this.props.onBlur(this.state.value);
    }
  },

  handleChange: function(event) {
    var date = moment(event.target.value, this.props.dateFormat, true);

    this.setState({
      value: event.target.value
    });

    if (this.isValueAValidDate(event.target.value)) {
      this.props.setSelected(new DateUtil(date));
    }
  },

  safeDateFormat: function(date) {
    return !! date ? date.format(this.props.dateFormat) : null;
  },

  isValueAValidDate: function(value) {
    var date = moment(value, this.props.dateFormat, true);

    var isAvailable = this.props.validDates.filter(function(validDate) {
      return validDate.isSame(date, 'day');
    });
    isAvailable = isAvailable.length > 0;

    return (date.isValid() && isAvailable);
  },

  handleKeyDown: function(event) {
    switch(event.key) {
    case "Enter":
      event.preventDefault();
      this.props.handleEnter();
      break;
    }
  },

  handleClick: function(event) {
    this.props.handleClick(event);
  },

  render: function() {
    return <input
      readOnly
      disabled={this.props.disabled}
      ref="input"
      type="text"
      value={this.state.value}
      onClick={this.handleClick}
      onKeyDown={this.handleKeyDown}
      onFocus={this.props.onFocus}
      onBlur={this.handleBlur}
      onChange={this.handleChange}
      className="datepicker__input"
      placeholder={this.props.placeholderText} />;
  }
});

module.exports = DateInput;
