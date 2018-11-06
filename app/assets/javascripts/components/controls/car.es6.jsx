import React, { Component } from 'react';
import _ from 'underscore';
import Toggle from 'react-toggle';

class CarControl extends Component {
  handleCarLayerChange() {
    this.props.onCarLayerChange();
  }

  render() {
    return (
      <div className="map-panel__content">
        <ul className="toggles-list">
          <li key='car-layer' className="toggle">
            <label>{I18n.t('map.index.car.layer')}</label>
            <Toggle
              className='custom-toggle'
              defaultChecked={this.props.showCarLayer}
              icons={false}
              onChange={this.handleCarLayerChange.bind(this)}
            />
          </li>

          <hr/>
          <li>
            <p>{I18n.t("map.index.car.description")}</p>
          </li>
        </ul>
      </div>
    );
  }
}

export default CarControl;
