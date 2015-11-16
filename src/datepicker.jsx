var React = require('react');
var Popover = require('./popover');
var DateUtil = require('./util/date');
var Calendar = require('./calendar');
var DateInput = require('./date_input');

var DatePicker = React.createClass({
  propTypes: {
    weekdays: React.PropTypes.arrayOf( React.PropTypes.string ),
    focus: React.PropTypes.bool,
    onFocusChange: React.PropTypes.func,
    onClickOutside: React.PropTypes.func
  },

  getDefaultProps: function() {
    return {
      weekdays: [ "Su", "Mo", "Tu", "We", "Th", "Fr", "Sa" ],
      focus: null,
      onFocusChange: null,
      onClickOutside: null
    };
  },

  getInitialState: function() {
    return {
      focus: this.props.focus
    };
  },

  componentWillReceiveProps: function(nextProps) {
    // Toggle calendar
    if (nextProps.focus !== this.props.focus) {
      this.setState({
        focus: nextProps.focus
      });
    }
  },

  handleFocus: function() {
    if(this.props.onFocusChange){
      this.props.onFocusChange(true);
    } else {
      this.setState({
        focus: true
      });
    }
  },

  handleBlur: function(date) {
    console.log('blurring bro');
    console.log(date);
  },

  hideCalendar: function() {
    if(this.props.onClickOutside){
      setTimeout(function() {
        this.props.onClickOutside();
      }.bind(this), 0);      
    } else {
      setTimeout( function() {
        this.setState( {
          focus: false
        } );
      }.bind( this ), 0 );
    }
  },

  handleSelect: function(date) {
    this.setSelected(date);
    setTimeout(function(){
      this.hideCalendar();
    }.bind(this), 200);
  },

  setSelected: function(date) {
    this.props.onChange(date.moment());
  },

  onInputClick: function() {
    if(this.props.onFocusChange){
      this.props.onFocusChange(true);
    } else {
      this.setState({
        focus: true
      });
    }
  },

  calendar: function() {
    if (this.state.focus) {
      return (
        <Popover>
          <Calendar
            selected={this.props.selected}
            onSelect={this.handleSelect}
            hideCalendar={this.hideCalendar}
            minDate={this.props.minDate}
            maxDate={this.props.maxDate}
            validDates={this.props.validDates}
            weekStart={this.props.weekStart} 
            weekdays={this.props.weekdays} />
        </Popover>
      );
    }
  },

  render: function() {

    return (
      <div>
        <DateInput
          date={this.props.selected}
          dateFormat={this.props.dateFormat}
          focus={this.state.focus}
          onFocus={this.handleFocus}
          onBlur={this.handleBlur}
          handleClick={this.onInputClick}
          handleEnter={this.hideCalendar}
          setSelected={this.setSelected}
          hideCalendar={this.hideCalendar}
          placeholderText={this.props.placeholderText} />
        {this.calendar()}
      </div>
    );
  }
});

module.exports = DatePicker;
