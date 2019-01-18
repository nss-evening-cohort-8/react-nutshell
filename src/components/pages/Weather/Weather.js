import React from 'react';
import './Weather.scss';

import weatherRequests from '../../../helpers/data/weatherRequests';
import authRequests from '../../../helpers/data/authRequests';
import WeatherItem from '../../WeatherItem/WeatherItem';
import WeatherForm from '../../WeatherForm/WeatherForm';
import WeatherForcast from '../../WeatherForcast/WeatherForcast';

class Weather extends React.Component {
  state={
    weather: [],
    selectedWeatherId: '-1',
  };

  getAllWeather() {
    const uid = authRequests.getCurrentUid();
    weatherRequests.getWeather(uid)
      .then((weather) => {
        const isCurrentWeather = weather.find(x => x.isCurrent);
        const isCurrentWeatherId = isCurrentWeather ? isCurrentWeather.id : '-1';
        this.setState({ weather, selectedWeatherId: isCurrentWeatherId });
      })
      .catch(err => console.error('error in getWeather', err));
  }

  componentDidMount() {
    this.getAllWeather();
  }

  selectWeatherEvent = (id) => {
    this.setState({
      selectedWeatherId: id,
    });
  }

  deleteSingleWeather = (weatherId) => {
    weatherRequests.deleteWeather(weatherId)
      .then(() => {
        this.getAllWeather();
      })
      .catch(err => console.error('error with delete single', err));
  }

  updateIsCurrent = (newCurrentId) => {
    const uid = authRequests.getCurrentUid();
    weatherRequests.getIsCurrent(uid).then((currentWeather) => {
      if (!currentWeather) {
        weatherRequests.patchIsCurrent(newCurrentId, true).then(() => {
          this.getAllWeather();
        });
      } else {
        weatherRequests.patchIsCurrent(currentWeather.id, false).then(() => {
          weatherRequests.patchIsCurrent(newCurrentId, true).then(() => {
            this.getAllWeather();
          });
        });
      }
    })
      .catch(err => console.error('error with delete single', err));
  }

  formSubmitEvent = (newWeather) => {
    weatherRequests.postRequest(newWeather)
      .then(() => {
        this.getAllWeather();
      })
      .catch(err => console.error('error with weather post', err));
  }

  render() {
    const { weather, selectedWeatherId } = this.state;
    const selectedWeather = weather.find(w => w.id === selectedWeatherId) || { nope: 'nope' };

    const weatherItemComponents = weather.map(w => (
      <WeatherItem
        weather={w}
        key={w.id}
        deleteSingleWeather={this.deleteSingleWeather}
        updateIsCurrent={this.updateIsCurrent}
        onWeatherSelection={this.selectWeatherEvent}
      />
    ));

    return (
      <div className="Weather text-center col">
        <h1>Weather</h1>
        <div className="row">
          <div className="col">
            <h3>New Location</h3>
            <hr/>
            <WeatherForm onSubmit={this.formSubmitEvent} />
          </div>
          <div className="col">
            <h3>Saved Weather</h3>
            <hr/>
            <ul>{weatherItemComponents}</ul>
          </div>
          <div className="col">
            <h3>View Location</h3>
            <hr/>
            <WeatherForcast weather={selectedWeather}/>
          </div>
        </div>
      </div>
    );
  }
}

export default Weather;
