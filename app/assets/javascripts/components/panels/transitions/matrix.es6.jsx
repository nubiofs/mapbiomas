import React from 'react';
import _ from 'underscore';
import classNames from 'classnames';
import Highcharts from 'highcharts';

class TransitionsMatrix extends React.Component {
  get colSpan() {
    return this.props.classifications.length;
  }

  get rowSpan() {
    return this.props.classifications.length;
  }

  startDownload() {
    window.location.href = this.props.downloadUrl;
  }

  renderToClassifications() {
    return this.props.classifications.map((c) => {
      let transition = this.props.transitions.find((t) => t.to == c.id);

      let classes = classNames(
        'to-classification',
        {
          highlight: !!transition
        }
      );

      return (
        <td key={`to-${c.id}`} className={classes}>
          {c.name}
        </td>
      );
    });
  }

  renderTotalRow() {
    return this.props.classifications.map((c, i) => {
      let data = _.find(this.props.toTotalData, (d) => d.to == c.id);
      let key;

      if (data) {
        let key = `transition-${data.to}-${data.from}`;
      } else {
        let key = `transition-${c.id}-${i}`;
      }

      return(
        <td key={key} className="transition-total-value highlight">
          {Highcharts.numberFormat(data && data.area, 0, '.')} ha
        </td>
      );
    });
  }

  renderTotalSum() {
    let sum = _.reduce(
      this.props.toTotalData, (mem, num) => {return mem + num.area}, 0
    )

    return (
      <td className="total-sum-value highlight">
        {Highcharts.numberFormat(sum, 0, '.')} ha
      </td>
    );
  }

  renderToTotalData() {
    return(
      <tr>
        <td></td>
        <td className="to-total-classification highlight">
          {I18n.t('map.index.transitions.matrix.total')}
        </td>

        {this.renderTotalRow()}
        {this.renderTotalSum()}
      </tr>
    );
  }

  renderFromTotalData(fromClassification) {
    let data = _.first(
      _.where(this.props.fromTotalData, {from: fromClassification.id})
    );

    return(
      <td className="transition-total-value highlight">
        {Highcharts.numberFormat(data && data.area, 0, '.')} ha
      </td>
    );
  }

  renderFromClassifications() {
    return this.props.classifications.map((c, i) => {
      let transition = this.props.transitions.find((t) => t.from == c.id);

      let classes = classNames(
        'from-classification',
        {
          highlight: !!transition
        }
      );

      if(i == 0) {
        var fromYearColumn = (
          <td rowSpan={this.rowSpan} className="from-year">
            {this.props.years[0]}
          </td>
        );
      }

      return (
        <tr key={`from-${c.id}`}>
          {fromYearColumn}
          <td className={classes}>
            {c.name}
          </td>
          {this.renderData(c)}
          {this.renderFromTotalData(c)}
        </tr>
      );
    });
  }

  renderData(fromClassification) {
    return this.props.classifications.map((toClassification) => {
      let transition = this.props.transitions.find((t) => {
        return t.to == toClassification.id && t.from == fromClassification.id;
      });
      let key = `transition-${toClassification.id}-${fromClassification.id}`;

      if(transition) {
        return (
          <td key={key} className="transition-value highlight">
            {Highcharts.numberFormat(transition.area, 0, '.')} ha
          </td>
        );
      } else {
        return <td key={key} className="transition-value">--</td>
      }
    });
  }

  render() {
    return (
      <div className="transitions-matrix__container">
        <div className="transitions-matrix">
          <table>
            <tbody>
              <tr>
                <td></td>
                <td></td>
                <td colSpan={this.colSpan} className="to-year">
                  {this.props.years[1]}
                </td>
              </tr>
              <tr>
                <td></td>
                <td></td>
                {this.renderToClassifications()}
                <td className="from-total-classification highlight">
                  {I18n.t('map.index.transitions.matrix.total')}
                </td>
              </tr>
              {this.renderFromClassifications()}
              <tr></tr>
              {this.renderToTotalData()}
            </tbody>
          </table>
        </div>

        <div>
          <button className="map-modal__download primary" onClick={this.startDownload.bind(this)}>
            {I18n.t('map.index.transitions.matrix.download')}
          </button>
        </div>
      </div>
    );
  }
}

export default TransitionsMatrix;
