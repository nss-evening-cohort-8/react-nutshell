import React from 'react';
import PropTypes from 'prop-types';
import './WeatherForm.scss';
import authRequests from '../../helpers/data/authRequests';
import states from '../../helpers/states';

const defaultWeather = {
  uid: '',
  city: '',
  state: 'default',
  isCurrent: false,
};

class WeatherForm extends React.Component {
  static propTypes = {
    onSubmit: PropTypes.func,
  }

  state = {
    newWeather: defaultWeather,
  }

  cityChange = (e) => {
    e.preventDefault();
    const tempWeather = { ...this.state.newWeather };
    tempWeather.city = e.target.value;
    this.setState({ newWeather: tempWeather });
  }

  stateChange = (e) => {
    e.preventDefault();
    const tempWeather = { ...this.state.newWeather };
    tempWeather.state = e.target.value;
    this.setState({ newWeather: tempWeather });
  }

  formSubmit = (e) => {
    e.preventDefault();
    const { onSubmit } = this.props;
    const newWeather = { ...this.state.newWeather };
    newWeather.uid = authRequests.getCurrentUid();
    onSubmit(newWeather);
    this.setState({ newWeather: defaultWeather });
  }

  render() {
    const { newWeather } = this.state;
    const makeStates = states.map((state, index) => <option key={`state${index}`} value={state}>{state}</option>);

    return (
      <div className="weather-form col">
        <form onSubmit={this.formSubmit}>
          <div className="form-group">
            <label htmlFor="cityName">City Name:</label>
            <input
              type="text"
              className="form-control"
              id="cityName"
              aria-describedby="cityName"
              placeholder="Enter city name"
              value={newWeather.city}
              onChange={this.cityChange}
            />
          </div>
          <div className="form-group">
            <label htmlFor="stateName">State:</label>
            <select className="custom-select mb-2 mr-sm-2 mb-sm-0" id="stateName" value={newWeather.state} onChange={this.stateChange}>
              <option value="default" defaultValue>Choose...</option>
              {makeStates}
            </select>
          </div>
          <button className="btn btn-primary col-6 offset-3 submit-button">Save</button>
        </form>
      </div>
    );
  }
}

export default WeatherForm;
