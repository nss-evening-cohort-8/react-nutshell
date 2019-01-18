import React from 'react';
import PropTypes from 'prop-types';

import weatherShape from '../../helpers/propz/weatherShape';

import './WeatherItem.scss';

class WeatherItem extends React.Component {
  static propTypes = {
    weather: weatherShape.weatherShape,
    deleteSingleWeather: PropTypes.func,
    onWeatherSelection: PropTypes.func,
  }

  deleteWeather = (e) => {
    e.preventDefault();
    const { deleteSingleWeather, weather } = this.props;
    deleteSingleWeather(weather.id);
  }

  patchIsCurrent = (e) => {
    e.preventDefault();
    const { updateIsCurrent, weather } = this.props;
    updateIsCurrent(weather.id);
  }

  weatherClick = (e) => {
    e.stopPropagation();
    const { weather, onWeatherSelection } = this.props;
    onWeatherSelection(weather.id);
  }

  render() {
    const { weather } = this.props;
    const currentButton = () => {
      const buttonColor = `btn border-dark ${weather.isCurrent ? 'btn-warning' : 'btn-default'}`;
      return (
        <button className={buttonColor} onClick={this.patchIsCurrent}><i className="fas fa-star"></i></button>
      );
    };

    return (
      <li className="weather-item">
        <span className="col-8" onClick={this.weatherClick}>{weather.city}, {weather.state}</span>
        <span className="col-4">
          <button className="btn border-dark btn-danger" onClick={this.deleteWeather}><i className="fas fa-trash-alt"></i></button>
          {currentButton()}
        </span>
      </li>
    );
  }
}

export default WeatherItem;
