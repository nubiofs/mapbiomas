import _ from 'underscore';
import lodash from 'lodash';

export class Categories {
  constructor(categories) {
    this.categories = categories;
  }

  extractCategories(subcategories = this.categories, result = []) {
    _.each(subcategories, (s) => {
      if (_.isEmpty(s.sub)) {
        result = [...result, s];
      } else {
        result = this.extractCategories(s.sub, result);
      }
    });

    return result;
  }

  toOptions() {
    let categories = this.extractCategories();

    return _.map(categories, (c) => {
      return {
        ...c,
        label: c.name,
        value: c.id
      }
    });
  }
}
