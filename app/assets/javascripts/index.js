import L from 'leaflet';
window.L = L;

import 'highcharts_config';
import 'vendor/leaflet-side-by-side';
import 'vendor/leaflet-spin';
import 'vendor/leaflet-betterscale';
import 'vendor/leaflet-coordinates';
import 'vendor/leaflet-wmts';
import { Locale } from 'lib/locale';

import React from 'react';
import ReactDOM from 'react-dom';
import LandsatDownload from './components/download/landsat_download';
import Map from './components/map/map';
import Menu from './components/menu/menu';
import RegisteredUsers from './components/users/registered';
import Stats from './components/stats/stats';
import './linkify';

window.React = React;
window.ReactDOM = ReactDOM;

window.LandsatDownload = LandsatDownload;
window.Map = Map;
window.Menu = Menu;
window.RegisteredUsers = RegisteredUsers;
window.Stats = Stats;
window.Locale = Locale;
