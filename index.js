import React, { Component, PropTypes } from 'react';
import { View } from 'react-native';
import MapView from 'react-native-maps';
import uuid from 'uuid';

const makePoly = (coordinates, feature) => {
  const polygon = {
    coordinates: coordinates[0],
    feature,
    id: feature.id ? feature.id : uuid(),
  };
  if (coordinates.length > 1) {
    polygon.holes = coordinates.slice(1);
  }
  return polygon;
};

export const makeOverlays = features => {
  const overlays = {
    points: [],
    polygons: [],
    lines: [],
  };
  features.filter(f => f.geometry).forEach(feature => {
    switch (feature.geometry.type) {
      case 'Point':
      case 'MultiPoint': {
        const points = makeCoordinates(feature).map(coordinate => ({
          coordinate,
          feature,
          id: feature.id ? feature.id : uuid(),
        }));
        overlays.points = overlays.points.concat(points);
        break;
      }
      case 'Polygon': {
        const coordinates = makeCoordinates(feature);
        const polygon = makePoly(coordinates, feature);
        overlays.polygons = overlays.polygons.concat(polygon);
        break;
      }
      case 'MultiPolygon': {
        const polygons = makeCoordinates(feature).map(c => makePoly(c, feature));
        overlays.polygons = overlays.polygons.concat(polygons);
        break;
      }
      case 'LineString':
      case 'MultiLineString': {
        const lines = makeCoordinates(feature).map(c => ({
          coordinates: c,
          feature,
          id: feature.id ? feature.id : uuid(),
        }));
        overlays.lines = overlays.lines.concat(lines);
        break;
      }
      default:
        break;
    }
  });
  return overlays;
};

const makeCoordinates = feature => {
  const makePoint = c => {
    return { latitude: c[1], longitude: c[0] };
  };
  const makeLine = l => {
    return l.map(makePoint);
  };
  const g = feature.geometry;
  if (g.type === 'Point') {
    return [makePoint(g.coordinates)];
  } else if (g.type === 'MultiPoint') {
    return g.coordinates.map(makePoint);
  } else if (g.type === 'LineString') {
    return [makeLine(g.coordinates)];
  } else if (g.type === 'MultiLineString') {
    return g.coordinates.map(makeLine);
  } else if (g.type === 'Polygon') {
    return g.coordinates.map(makeLine);
  } else if (g.type === 'MultiPolygon') {
    return g.coordinates.map(p => p.map(makeLine));
  } else {
    return [];
  }
};

const Geojson = props => {
  const { points, polygons, lines } = makeOverlays(props.geojson.features);
  return (
    <View>
      {points.map(point => {
        return (
          <MapView.Marker key={point.id} coordinate={point.coordinate} pinColor={props.color} />
        );
      })}
      {polygons.map(p => {
        return (
          <MapView.Polygon
            key={p.id}
            coordinates={p.coordinates}
            holes={p.holes}
            strokeColor={props.strokeColor}
            fillColor={props.fillColor}
            strokeWidth={props.strokeWidth}
          />
        );
      })}
      {lines.map(l => {
        return (
          <MapView.Polyline
            key={l.id}
            coordinates={l.coordinates}
            strokeColor={props.strokeColor}
            strokeWidth={props.strokeWidth}
          />
        );
      })}
    </View>
  );
};

export default Geojson;
