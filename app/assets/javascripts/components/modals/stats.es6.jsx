import React from 'react';
import { MapModal } from './modal';
import Stats from '../stats/stats';

const StatsModal = ({
  categories,
  classifications,
  myMapsPage,
  onClose,
  selectedMap,
  selectedClassifications,
  selectedTerritories,
  selectedType,
  selectedBuffer,
  selectedCategories,
  years
}) => {
  return (
    <MapModal
      title={I18n.t('stats.title')}
      showCloseButton={true}
      showOkButton={false}
      onClose={onClose}
      overlay={true}
    >
      <div className="stats-modal">
        <Stats
          myMapsPage={myMapsPage}
          classifications={classifications}
          selectedMap={selectedMap}
          selectedClassifications={selectedClassifications}
          selectedTerritories={selectedTerritories}
          selectedType={selectedType}
          selectedBuffer={selectedBuffer}
          categories={categories}
          selectedCategories={selectedCategories}
          years={years}
        />
      </div>
    </MapModal>
  );
}

export default StatsModal;
