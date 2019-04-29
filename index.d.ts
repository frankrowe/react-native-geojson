declare module "react-native-geojson" {
  import React, { Component } from "react";

  import { FeatureCollection, Feature } from "geojson";

  // =======================================================================
  //  Geojson (default export)
  // =======================================================================

  export interface GeojsonProps {
    geojson: FeatureCollection;
    pinColor?: string;
    strokeWidth?: number;
    strokeColor?: string;
    fillColor?: string;
  }

  export default class Geojson extends Component<GeojsonProps> {}

  // =======================================================================
  //  makeOverlays
  // =======================================================================

  export function makeOverlays(features: Feature[]): any;
}
