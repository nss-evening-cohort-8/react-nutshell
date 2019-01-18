import React from 'react';
import weatherShape from '../../helpers/propz/weatherShape';
import weatherbitRequests from '../../helpers/data/weatherbitRequests';
import './WeatherForcast.scss';

class WeatherForcast extends React.Component {
  static propTypes = {
    weather: weatherShape.weatherOptionalShape,
  };

  state={
    forcast: {
      city_name: '',
      state_code: '',
      weather: {
        icon: '',
      },
    },
  }

  componentDidUpdate(prevProps) {
    if (prevProps !== this.props) {
      const { weather } = this.props;
      weatherbitRequests.getForecast(weather.city, weather.state)
        .then((forcast) => {
          this.setState({ forcast });
        })
        .catch(err => console.error('error getting weatherbit forcast'));
    }
  }

  render() {
    const { weather } = this.props;
    const { forcast } = this.state;
    let weatherIcon = '';
    if (weather.nope || forcast.city_name === '') {
      return (
        <div className="weather-forcast col">
          <h1 className="unknown-forcast">
            <span className="glyphicon glyphicon-arrow-left" /> Select a city to see the weather
          </h1>
        </div>
      );
    }

    if (forcast.weather) {
      weatherIcon = `https://www.weatherbit.io/static/img/icons/${forcast.weather.icon}.png`;
    }

    return (
      <div className="weather-forcast col">
        <div className="card">
          <img src={weatherIcon} className="card-img-top" alt="..."/>
          <div className="card-body">
            <h3 className="card-text">{forcast.temp} &#176; F</h3>
            <h5 className="card-title">{forcast.city_name}, {forcast.state_code}</h5>
            <p className="card-text">{forcast.weather ? forcast.weather.description : ''}</p>
          </div>
        </div>
      </div>
    );
  }
}

export default WeatherForcast;
