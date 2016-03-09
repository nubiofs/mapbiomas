class MapCanvas extends React.Component {
  get options() {
    let defaultOptions = {
      format: 'image/png',
      transparent: true,
      opacity: 0.6,
      attribution: "MapBiomas Workspace"
    }
    return _.defaults({}, this.props, defaultOptions);
  }

  setup() {
    let node = this.refs.element;
    this.map = L.map(node).setView([-20, -45], 6);

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="http://cartodb.com/attributions">CartoDB</a>',
    }).addTo(this.map);

    this.backgroundLayer = L.tileLayer('http://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: '&copy; Esri &mdash; Source: Esri, USDA, USGS'
    }).addTo(this.map);

    this.layer = L.tileLayer.wms(
      `${this.props.url}/cgi-bin/mapserv`,
      this.options
    ).addTo(this.map);

    L.tileLayer('http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png')
      .addTo(this.map);

    this.fitTerritory();
  }

  fitTerritory() {
    this.map.fitBounds(this.props.territory.bounds);
  }

  componentDidUpdate(prevProps) {
    if(prevProps.territory.id != this.props.territory.id) {
      this.fitTerritory();
    }

    this.layer.setOpacity(this.props.opacity);

    if(this.props.backgroundLayerActive) {
      this.backgroundLayer.setOpacity(1);
    } else {
      this.backgroundLayer.setOpacity(0);
    }

    this.layer.setParams(this.options);
  }

  componentDidMount() {
    this.setup();
  }

  render() {
    return (
      <div className="map__canvas" ref="element"></div>
    );
  }
}
