import React, { Component } from 'react';
import _ from 'underscore';
import cx from 'classnames';
import Toggle from 'react-toggle.jsx';
import tooltipster from 'tooltipster';
import Scrollable from '../scrollable';

const buildTree = _.memoize((nodes, idProp = 'id', parentIdProp = 'parentId') => {
  const { _tree, _map } = _.reduce(nodes, (acc, node) => {
   const obj = {...node, children: {}};
    acc._tree[node[idProp]] = obj;
    acc._map[node[idProp]] = obj;
    return acc;
  }, { _tree: {}, _map: {} });

  _.each(_map, (node, id) => {
    if(node[parentIdProp]) {
      delete _tree[node[idProp]];
      if(_map[node[parentIdProp]]) {
        _map[node[parentIdProp]].children[node[idProp]] = node;
      }
    }
  });

  return _tree;
});

class ClassificationControl extends Component {
  get ids() {
    return this.props.options.map((c) => c.id);
  }

  isChecked(id) {
    return this.ids.indexOf(id) != -1;
  }

  handleCheck(id, checked) {
    let ids = this.ids;

    if(checked) {
      ids.push(id);
    } else {
      ids = _.without(this.ids, id);
    }

    this.props.onChange(ids);
  }

  renderNode(node, index, parentSummary) {
    const checked = this.isChecked(node.id);
    const summary = parentSummary ? `${parentSummary}.${index}` : index;
    let childrenIndex = 1;

    return (
      <li key={node.id}>
        <div className="classification-control__node">
          <i style={{ color: node.color }}
            onClick={(e) => {
              this.handleCheck(node.id, !checked);
            }}
            className={cx(
              'classification-control__node-icon',
              'fa', {
                'fa-circle': checked,
                'fa-circle-o': !checked
              }
            )}
          />
          <div className="classification-control__node-label">
            {`${summary} ${node.name}`}
          </div>
        </div>
        {(!_.isEmpty(node.children)) && (
          <ul className="classification-control__children-tree">
            {_.map(node.children, (node) => this.renderNode(node, childrenIndex++, summary))}
          </ul>
        )}
      </li>
    );
  }

  render() {
    const parsedOptions = _.map(this.props.availableOptions, (item) => ({
      ...item,
      parentId: (
        item.l3 !== item.id ? item.l3 : (
          item.l2 !== item.id ? item.l2 : (
            item.l1 !== item.id ? item.l1 : (
              null
            )
          )
        )
      )
    }));

    const tree = _.indexBy(buildTree(parsedOptions), 'id');
    let index = 1;

    return (
      <div className={this.props.className}>
        <Scrollable calcMaxHeight={this.props.calcMaxHeight}>
          <ul className="classification-control__inner">
            {_.map(tree, (node) => this.renderNode(node, index++))}
          </ul>
        </Scrollable>
      </div>
    );
  }
}

export default ClassificationControl;