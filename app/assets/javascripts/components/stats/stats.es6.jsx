import React from 'react';
import _ from 'underscore';
import Select from 'react-select';

import { API } from '../../lib/api';
import { Classifications } from '../../lib/classifications';
import { Territories } from '../../lib/territories';
import { Categories } from '../../lib/categories';

import Chart from './chart';

const INFRA_BUFFER_OPTIONS = [
  { value: '5k', option: 'buffer_5k', label: I18n.t('map.index.infra_levels.buffer.5_k'), param: '5000' },
  { value: '10k', option: 'buffer_10k', label: I18n.t('map.index.infra_levels.buffer.10_k'), param: '10000' },
  { value: '20k', option: 'buffer_20k', label: I18n.t('map.index.infra_levels.buffer.20_k'), param: '20000' }
]

export default class Stats extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedType: this.selectedType,
      selectedTerritories: this.selectedTerritories,
      selectedClassifications: this.selectedClassifications,
      selectedBuffer: this.selectedBuffer,
      availableCategories: [],
      selectedCategories: this.selectedCategories
    };
  }

  get collectionOptions() {
    return [
      { value: 'collection3', label: I18n.t('stats.collections.3') },
      { value: 'collection2', label: I18n.t('stats.collections.2') },
      { value: 'allCollections', label: I18n.t('stats.collections.2_and_3') }
    ]
  }

  get collectionsDataFunctions() {
    return {
      'collection2': this.groupedCoverageCollection2,
      'collection3': this.groupedCoverage,
      'allCollections': this.groupedCoverageAllCollections
    }
  }

  get dataFunction() {
    if (this.state.selectedType.value == 'coverage') {
      return this.collectionsDataFunctions[this.selectedCollection.value];
    } else {
      return this.groupedInfraCoverage;
    }
  }

  get selectedCollection() {
    return this.state.selectedCollection || _.first(this.collectionOptions);
  }

  groupedCoverage(params) {
    return API.groupedCoverage(params);
  }

  groupedCoverageCollection2(params) {
    return API.groupedCoverageCollection2(params);
  }

  groupedCoverageAllCollections(params) {
    return Promise.all([API.groupedCoverage(params), API.groupedCoverageCollection2(params)]);
  }

  groupedInfraCoverage(params) {
    return API.groupedInfraCoverage(params);
  }

  get selectedTerritories() {
    if (this.props.selectedTerritories) {
      if (_.isArray(this.props.selectedTerritories)) {
        return this.props.selectedTerritories;
      }

      return [this.props.selectedTerritories];
    } else {
      return [];
    }
  }

  get selectedClassifications() {
    if (this.props.selectedClassifications) {
      return _.filter(this.classificationsOptions, (c) => {
        return _.contains(this.props.selectedClassifications, c.value);
      });
    } else {
      return [];
    }
  }

  get selectedBuffer() {
    if (this.props.selectedBuffer) {
      return _.find(this.bufferOptions, (b) => b.value == this.props.selectedBuffer.value);
    } else {
      return _.first(this.bufferOptions);
    }
  }

  get selectedType() {
    if (this.props.selectedType && _.isString(this.props.selectedType)) {
      return _.find(this.typeOptions, (t) => t.value == this.props.selectedType);
    } else {
      return _.first(this.typeOptions);
    }
  }

  get selectedCategories() {
    if (this.props.selectedCategories) {
      return this.props.selectedCategories.map((c) => {
        return _.find(this.originalCategoriesOptions, (o) => o.id == c.id);
      });
    } else {
      return [];
    }
  }

  get typeOptions() {
    return [
      { value: 'coverage', label: I18n.t('stats.type.coverage') },
      { value: 'infraCoverage', label: I18n.t('stats.type.infra_coverage') },
      { value: 'carCoverage', label: I18n.t('stats.type.car_coverage') }
    ]
  }

  get classificationsOptions() {
    return new Classifications(this.props.classifications).toOptions();
  }

  get bufferOptions() {
    return INFRA_BUFFER_OPTIONS;
  }

  get originalCategoriesOptions() {
    return new Categories(this.props.categories).toOptions();
  }

  get categoriesOptions() {
    if (_.isEmpty(this.state.availableCategories)) {
      return this.filterCategories();
    } else {
      return this.state.availableCategories;
    }
  }

  get multipleCharts() {
    let coverageValidation = this.state.selectedType.value == 'coverage' && this.state.selectedTerritories.length >1 && this.state.selectedClassifications.length > 1;

    return !this.props.myMapsPage && (coverageValidation || this.state.selectedType.value == 'infraCoverage');
  }

  filterCategories(buffer = this.selectedBuffer) {
    return _.filter(this.originalCategoriesOptions, (c) => c[buffer.option] );
  }

  downloadStatistics(territories) {
    let sortedTerritories = territories.sort((t) => t.id || t.value);

    let params = {
      territory_ids: sortedTerritories.map((t) => t.id || t.value).join(),
      territory_names: sortedTerritories.map((t) => t.name || t.label).join(', '),
      classification_ids: this.state.selectedClassifications.map((c) => c.value).join(',')
    };

    if (this.props.selectedMap) {
      params = {
        ...params,
        grouped: true,
        map_name: this.props.selectedMap.name
      }
    }

    return Routes.download_statistics_path(params);
  }

  onTypeChange(selectedType) {
    this.setState({ selectedType });
  }

  onCollectionChange(selectedCollection) {
    this.setState({ selectedCollection });
  }

  onTerritoryChange(selectedTerritories) {
    this.setState({ selectedTerritories });
  }

  onClassificationChange(selectedClassifications) {
    this.setState({ selectedClassifications });
  }

  onBufferChange(selectedBuffer) {
    this.setState({ selectedBuffer });
  }

  onCategoryChange(selectedCategories) {
    this.setState({ selectedCategories });
  }

  loadTerritories() {
    return (input, callback) => {
      clearTimeout(this.timeoutId);

      if (input) {
        this.timeoutId = setTimeout(() => {
          API.territories({
            name: input.toUpperCase()
          })
          .then((territories) => {
            callback(null, {
              options: new Territories(territories).withCategory()
            });
          });
        }, 500);
      } else {
        callback(null, { options: [] });
      }
    };
  }

  componentDidMount() {
    $('#territories-tooltip').tooltipster({
      theme: 'tooltip-custom-theme',
      content: $(I18n.t('stats.territories.tooltip'))
    });

    $('#classifications-tooltip').tooltipster({
      theme: 'tooltip-custom-theme',
      content: $(I18n.t('stats.classifications.tooltip'))
    });
  }

  renderCharts() {
    let validation = !_.isEmpty(this.state.selectedTerritories) && !_.isEmpty(this.state.selectedClassifications) && (
      this.state.selectedType.value == 'coverage' ||
      (this.state.selectedType.value == 'infraCoverage' && !_.isEmpty(this.state.selectedBuffer) && !_.isEmpty(this.state.selectedCategories))
    )

    if (validation) {
      if (this.multipleCharts) {
        let options = {
          type: this.state.selectedType,
          classifications: this.state.selectedClassifications,
          years: this.props.years.sort(),
          dataFunction: this.dataFunction
        };

        if (this.state.selectedType.value == 'coverage') {
          return this.state.selectedTerritories.map((territory, i) =>
            <Chart
              {...options}
              key={i}
              territories={[territory]}
              downloadUrl={this.downloadStatistics([territory])}
            />
          );
        } else {
          return this.state.selectedTerritories.map((territory, i) => {
            return this.state.selectedCategories.map((category, j) =>
              <Chart
                {...options}
                key={`${i}-${j}`}
                territories={[territory]}
                buffer={this.state.selectedBuffer}
                category={category}
                downloadUrl={this.downloadStatistics([territory])}
              />
            );
          });
        }
      } else {
        return (
          <Chart
            type={this.state.selectedType}
            myMapsPage={this.props.myMapsPage}
            selectedMap={this.props.selectedMap}
            years={this.props.years.sort()}
            territories={this.state.selectedTerritories}
            classifications={this.state.selectedClassifications}
            buffer={this.state.selectedBuffer}
            categories={this.state.selectedCategories}
            dataFunction={this.dataFunction}
            downloadUrl={this.downloadStatistics(this.state.selectedTerritories)}
          />
        );
      }
    }

    return null;
  }

  componentDidUpdate(prevProps, prevState) {
    let newState = {};

    if (!_.isEqual(this.state.selectedClassifications, prevState.selectedClassifications)
        || !_.isEqual(this.state.selectedTerritories, prevState.selectedTerritories)
        || !_.isEqual(this.state.selectedCategories, prevState.selectedCategories)) {
      return
    }

    if (!_.isEmpty(this.props.selectedTerritories)) {
      newState['selectedTerritories'] = prevProps.selectedTerritories;
    }

    if (!_.isEmpty(this.props.selectedClassifications)) {
      newState['selectedClassifications'] = prevProps.selectedClassifications;
    }

    if (!_.isEqual(this.state.selectedBuffer, prevState.selectedBuffer)) {
      newState['availableCategories'] = this.filterCategories(this.state.selectedBuffer);
    }

    if (!_.isEmpty(this.props.selectedCategories)) {
      newState['selectedCategories'] = prevProps.selectedCategories;
    }

    if (!_.isEmpty(newState)) {
      this.setState(newState);
    }
  }

  renderTypeSelect() {
    return (
      <div>
        <label className="stats__label">
          {I18n.t('stats.type.title')}
        </label>

        <Select
          name="type-select"
          value={this.state.selectedType}
          options={this.typeOptions}
          onChange={this.onTypeChange.bind(this)}
          clearable={false}
        />
      </div>
    );
  }

  renderCategoriesSelect() {
    if (this.state.selectedType.value == 'infraCoverage') {
      return (
        <div>
          <label className="stats__label">
            {I18n.t('stats.categories.title')}
          </label>
          <Select
            name="class-select"
            value={this.state.selectedCategories}
            options={this.categoriesOptions}
            onChange={this.onCategoryChange.bind(this)}
            clearable={false}
            ignoreAccents={false}
            noResultsText={false}
            searchingText={I18n.t('stats.index.searching')}
            multi={true}
          />
        </div>
      );
    }

    return null;
  }

  renderBufferSelect() {
    if (this.state.selectedType.value == 'infraCoverage') {
      return (
        <div>
          <label className="stats__label">
            {I18n.t('stats.buffer.title')}
          </label>
          <Select
            name="class-select"
            value={this.state.selectedBuffer}
            options={this.bufferOptions}
            onChange={this.onBufferChange.bind(this)}
            clearable={false}
            ignoreAccents={false}
            noResultsText={false}
            searchingText={I18n.t('stats.index.searching')}
            multi={false}
          />
        </div>
      );
    }

    return null;
  }

  renderTerritoriesSelect() {
    return (
      <div className="stats__filter">
        <label className="stats__label">
          {I18n.t('stats.territories.title')}
          <i id="territories-tooltip"
            className="material-icons tooltip">
            &#xE88E;
          </i>
        </label>

        <Select.Async
          name="territory-select"
          value={this.state.selectedTerritories}
          loadOptions={this.loadTerritories()}
          onChange={this.onTerritoryChange.bind(this)}
          clearable={false}
          ignoreAccents={false}
          noResultsText={false}
          searchingText={I18n.t('stats.index.searching')}
          multi={true}
        />
      </div>
    );
  }

  renderClassificationsSelect() {
    return (
      <div className="stats__filter">
        <label className="stats__label">
          {I18n.t('stats.classifications.title')}
          <i id="classifications-tooltip"
            className="material-icons tooltip">
            &#xE88E;
          </i>
        </label>
        <Select
          name="class-select"
          value={this.state.selectedClassifications}
          options={this.classificationsOptions}
          onChange={this.onClassificationChange.bind(this)}
          clearable={false}
          ignoreAccents={false}
          noResultsText={false}
          searchingText={I18n.t('stats.index.searching')}
          multi={true}
        />
      </div>
    );
  }

  render() {
    return (
      <div className="page__container">
        <h1 className="page__title">{I18n.t('stats.title')}</h1>
        <p>{I18n.t('stats.subtitle')}</p>
        <p>{I18n.t('stats.unit')}</p>

        <div className="stats">
          <div className="stats__filter-box">
            <div className="stats__filter">
              { this.renderTypeSelect() }
              { this.renderCategoriesSelect() }
              { this.renderBufferSelect() }
            </div>

            { this.renderTerritoriesSelect() }
            { this.renderClassificationsSelect() }
          </div>
          <div className="stats__chart-container">
            {this.renderCharts()}
          </div>
        </div>
      </div>
    );
  }
}
