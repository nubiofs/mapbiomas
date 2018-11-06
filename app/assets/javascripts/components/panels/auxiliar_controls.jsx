import React from 'react';
import _ from 'underscore';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

import CarControl from '../controls/car';
import ClassificationControl from '../controls/classification';
import InfrastructureControl from '../controls/infrastructure/infrastructure';
import TogglesControl from '../controls/toggles';

import TransitionsLabels from '../panels/transitions/labels';
import QualityLabels from '../panels/quality/labels';

import Scrollable from 'lib/scrollable';

class AuxiliarControls extends React.Component {
  get baseMapsOptions() {
    return _.filter(this.props.availableBaseMaps, (m) => !m.data);
  }

  get firstTabTitle() {
    return I18n.t('map.index.classifications.title');
  }

  renderFirstTab() {
    if (this.props.mode == 'coverage') {
      return (
        <ClassificationControl
          className="map-panel__content"
          defaultClassificationsTree={this.props.defaultClassificationsTree}
          options={this.props.classifications}
          availableOptions={this.props.availableClassifications}
          onChange={this.props.handleClassificationsChange}
          calcMaxHeight={() => (
            $('#auxiliar-controls').height() - 55
          )}
        />
      );
    } else if (this.props.mode == 'transitions') {
      return (
        <TransitionsLabels
          transition={this.props.transition}
          transitionsLayers={this.props.transitionsLayers}
          classifications={this.props.classifications}
          availableTransitionsLayers={this.props.availableTransitionsLayers}
          handleTransitionReset={this.props.handleTransitionReset}
          handleTransitionsLayersChange={this.props.handleTransitionsLayersChange}
        />
      );
    } else {
      return (
        <div className="map-panel-can-hide" id="quality-labels">
          <QualityLabels />
        </div>
      );
    }
  }

  render() {
    return (
      <div className="map-panel__grow map-panel-can-hide auxiliar-controls" id="auxiliar-controls">
        <Tabs className="map-panel__action-panel map-panel__tab-panel">
          <TabList>
            <Tab>{this.firstTabTitle}</Tab>
            <Tab>{I18n.t('map.index.base_maps.title')}</Tab>
            <Tab>{I18n.t('map.index.layers.title')}</Tab>
            <Tab>{I18n.t('map.index.infra_levels.title')}</Tab>
            <Tab>{I18n.t('map.index.car.title')}</Tab>
          </TabList>
          <TabPanel>
            {this.renderFirstTab()}
          </TabPanel>
          <TabPanel>
            <TogglesControl
              className="map-panel__content"
              options={this.props.baseMaps}
              description={I18n.t('map.index.base_maps.description')}
              availableOptions={this.baseMapsOptions}
              onChange={this.props.handleBaseMapsChange}
            />
          </TabPanel>
          <TabPanel>
            <TogglesControl
              className="map-panel__content"
              options={this.props.layers}
              description={I18n.t('map.index.layers.description')}
              availableOptions={this.props.availableLayers}
              onChange={this.props.handleLayersChange}
            />
          </TabPanel>
          <TabPanel>
            <InfrastructureControl
              className="map-panel__content"
              mode={this.props.mode}
              infraLevels={this.props.infraLevels}
              infraBuffer={this.props.infraBuffer}
              infraBufferOptions={this.props.infraBufferOptions}
              availableInfraLevels={this.props.availableInfraLevels}
              calcMaxHeight={() => (
                $('#auxiliar-controls').height() - 55
              )}
              onInfraLevelsChange={this.props.handleInfraLevelsChange}
              onInfraBufferChange={this.props.handleInfraBufferChange}
            />
          </TabPanel>
          <TabPanel>
            <Scrollable calcMaxHeight={() => (
              $('#auxiliar-controls').height() - 55
            )}>
              <CarControl
                mode={this.props.mode}
                showCarLayer={this.props.showCarLayer}
                onCarLayerChange={this.props.handleCarLayerChange}
              />
          </Scrollable>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default AuxiliarControls;
