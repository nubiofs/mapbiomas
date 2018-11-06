import React from 'react';
import _ from 'underscore';
import Select from 'react-select';
import CoverageLineChart from '../../charts/coverage/line';
import CoveragePieChart from '../../charts/coverage/pie';

export default class CoverageMenu extends React.Component {
  constructor(props) {
    super(props);
  }

  renderTerritoryName() {
    let label;

    if (this.props.myMapsPage && this.props.map) {
      return (
        <label>{ I18n.t('map.index.chart.map', { map: this.props.map.name }) }</label>
      );
    }

    if (!this.props.myMapsPage) {
      return (
        <label>{ I18n.t('map.index.chart.territory', { territory: _.first(this.props.territory).name }) }</label>
      );
    }

    return null;
  };

  renderInfraBufferInfo() {
    if (this.props.coverageMode.value == 'infraCoverage') {
      return (
        <label>{ I18n.t('map.index.chart.buffer', { buffer: this.props.infraBuffer.label }) }</label>
      );
    }

    return null;
  }

  renderInfraLevelsInfo() {
    if (this.props.coverageMode.value == 'infraCoverage') {
      if (_.isEmpty(this.props.infraLevels)) {
        return null;
      } else {
        let infraLevels = _.map(this.props.infraLevels, 'name').join(', ');

        return (
          <label>{ I18n.t('map.index.chart.category', { category: infraLevels }) }</label>
        );
      }
    }
  }

  renderInstructions() {
    if (this.props.coverageMode.value == 'infraCoverage' && (this.props.infraBuffer.value == 'none' || _.isEmpty(this.props.infraLevels))) {
      return (
        <label className="chart-tooltip">{I18n.t('map.index.chart.tooltip.infra_coverage')}</label>
      );
    }

    return (
      <label className="chart-tooltip">{I18n.t('map.index.chart.tooltip.coverage')}</label>
    );
  }

  renderPieChart() {
    if (this.props.coverageMode.value == 'infraCoverage' && (this.props.infraBuffer.value == 'none' || _.isEmpty(this.props.infraLevels))) {
      return null;
    }

    return (
      <CoveragePieChart
        coverageMode={this.props.coverageMode}
        availableClassifications={this.props.availableClassifications}
        defaultClassifications={this.props.defaultClassifications}
        territory={this.props.territory}
        infraLevels={this.props.infraLevels}
        infraBuffer={this.props.infraBuffer}
        year={this.props.year}
        viewOptionsIndex={this.props.viewOptionsIndex}
      />
    );
  }

  renderLineChart() {
    if (this.props.coverageMode.value == 'infraCoverage' && (this.props.infraBuffer.value == 'none' || _.isEmpty(this.props.infraLevels))) {
      return null;
    }

    return (
      <CoverageLineChart
        coverageMode={this.props.coverageMode}
        availableYears={this.props.availableYears}
        availableClassifications={this.props.availableClassifications}
        defaultClassifications={this.props.defaultClassifications}
        territory={this.props.territory}
        infraLevels={this.props.infraLevels}
        infraBuffer={this.props.infraBuffer}
        year={this.props.year}
        viewOptionsIndex={this.props.viewOptionsIndex}
      />
    );
  }

  renderDetailsButton() {
    if (
      (this.props.coverageMode.value == 'infraCoverage' && (this.props.infraBuffer.value == 'none' || _.isEmpty(this.props.infraLevels))) ||
      this.props.coverageMode.value == 'carCoverage') {
      return null;
    }

    return (
      <button className="primary" onClick={this.props.onExpandModal}>
        {I18n.t('map.index.coverage.details')}
      </button>
    );
  }

  render() {
    return (
      <div>
        <h3 className="map-control__header">
          {I18n.t('map.index.coverage.analysis')}
        </h3>

        <label>{I18n.t('stats.type.title')}</label>
        <Select
          value={this.props.coverageMode}
          options={ this.props.coverageModes }
          clearable={false}
          onChange={this.props.onCoverageModeChange}
        />

        <div>
          { this.renderInstructions() }
          <label>{I18n.t('map.index.chart.year', {year: this.props.year})}</label>
          { this.renderTerritoryName() }
          { this.renderInfraBufferInfo() }
          { this.renderInfraLevelsInfo() }
        </div>

        { this.renderPieChart() }
        { this.renderLineChart() }
        { this.renderDetailsButton() }
      </div>
    );
  }
}
