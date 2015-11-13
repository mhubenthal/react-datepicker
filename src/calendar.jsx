var React = require('react');
var Day = require('./day');
var DateUtil = require('./util/date');
var moment = require('moment');

var Calendar = React.createClass({
  mixins: [require('react-onclickoutside')],

  propTypes: {
    weekdays: React.PropTypes.array.isRequired
  },

  handleClickOutside: function() {
    this.props.hideCalendar();
  },

  getInitialState: function() {
    return {
      date: new DateUtil(this.props.selected).safeClone(moment())
    };
  },

  getDefaultProps: function() {
    return {
      weekStart: 1
    };
  },

  componentWillMount: function() {
    this.initializeMomentLocale();
  },

  componentWillReceiveProps: function(nextProps) {
    // When the selected date changed
    if (nextProps.selected !== this.props.selected) {
      this.setState({
        date: new DateUtil(nextProps.selected).clone()
      });
    }
  },

  initializeMomentLocale: function() {
    var weekdays = this.props.weekdays.slice( 0 );
    weekdays = weekdays.concat(weekdays.splice(0, this.props.weekStart));

    moment.locale('en', {
      week: {
        dow: this.props.weekStart
      },
      weekdaysMin : weekdays
    });
  },

  increaseMonth: function() {
    this.setState({
      date: this.state.date.addMonth()
    });
  },

  decreaseMonth: function() {
    this.setState({
      date: this.state.date.subtractMonth()
    });
  },

  weeks: function() {
    return this.state.date.mapWeeksInMonth(this.renderWeek);
  },

  handleDayClick: function(day) {
    this.props.onSelect(day);
  },

  renderWeek: function(weekStart, key) {
    if(! weekStart.weekInMonth(this.state.date)) {
      return;
    }

    return (
      <div key={key}>
        {this.days(weekStart)}
      </div>
    );
  },

  renderDay: function(day, key) {
    var minDate = new DateUtil(this.props.minDate).safeClone(),
        maxDate = new DateUtil(this.props.maxDate).safeClone(),
        disabled = day.isBefore(minDate) || day.isAfter(maxDate);

    return (
      <Day
        key={key}
        day={day}
        date={this.state.date}
        onClick={this.handleDayClick.bind(this, day)}
        selected={new DateUtil(this.props.selected)}
        disabled={disabled} />
    );
  },

  renderPreviousMonthButton: function() {
    if(this.props.minDate) {
      var prevMonth = this.state.date.clone();
      prevMonth = prevMonth.subtractMonth();
      var minDate = new DateUtil(this.props.minDate).safeClone();
      var renderButton = true;
      
      renderButton = (prevMonth.month() >= minDate.month());
      if(prevMonth.month() === 11) {
        if(prevMonth.year() < minDate.year()) {
          renderButton = false;
        }
      }

      if(renderButton) {
        return(
          <a className="datepicker__navigation datepicker__navigation--previous"
              onClick={this.decreaseMonth}>
          </a>
        );
      }
    } else {
      return(
        <a className="datepicker__navigation datepicker__navigation--previous"
            onClick={this.decreaseMonth}>
        </a>
      );
    }
  },

  renderNextMonthButton: function() {
    if(this.props.maxDate) {
      var nextMonth = this.state.date.clone();
      nextMonth = nextMonth.addMonth();
      var maxDate = new DateUtil(this.props.maxDate).safeClone();
      var renderButton = true;

      renderButton = (nextMonth.month() <= maxDate.month());
      if(nextMonth.month() === 0) {
        if(nextMonth.year() > maxDate.year()) {
          renderButton = false;
        }
      }

      if(renderButton) {
        return(
          <a className="datepicker__navigation datepicker__navigation--next"
              onClick={this.increaseMonth}>
          </a>
        );
      }
    } else {
      return(
        <a className="datepicker__navigation datepicker__navigation--next"
            onClick={this.increaseMonth}>
        </a>
      ); 
    }
  },

  days: function(weekStart) {
    return weekStart.mapDaysInWeek(this.renderDay);
  },

  header: function() {
    return moment.weekdaysMin().map(function(day, key) {
      return <div className="datepicker__day" key={key}>{day}</div>;
    });
  },

  render: function() {
    return (
      <div className="datepicker">
        <div className="datepicker__triangle"></div>
        <div className="datepicker__header">
          {this.renderPreviousMonthButton()}
          <span className="datepicker__current-month">
            {this.state.date.format("MMMM YYYY")}
          </span>
          {this.renderNextMonthButton()}
        </div>
        <div className="datepicker__month">
          <div className="datepicker__weekdays">
            {this.header()}
          </div>
          {this.weeks()}
        </div>
      </div>
    );
  }
});

module.exports = Calendar;
