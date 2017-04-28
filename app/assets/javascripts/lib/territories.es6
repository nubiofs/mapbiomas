import _ from 'underscore';

export class Territories {
  constructor(territories) {
    this.territories = territories;
  }

  withCategory() {
    return this.territories.reduce((acc, territory) => {
      if(!territory) return acc;
      
      return [
        ...acc, {
          label: `${territory.name} (${territory.category})`,
          value: territory.id
        }
      ];
    }, []);
  }

  withOptions() {
    return this.territories.reduce((acc, territory) => {
      if(!territory) return acc;
      
      return [
        ...acc, {
          ...territory,
          label: territory.name,
          value: territory.id
        }
      ];
    }, []);
  }
}
