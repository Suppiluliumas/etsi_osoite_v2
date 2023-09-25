import React, { useState, useEffect } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { api_key } from "./keys";
import * as Location from "expo-location";

export default function App() {
  const [text, setText] = useState("");
  const [coordinates, setCoordinates] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });
  const [locationRegion, setLocationRegion] = useState();
  const [location, setLocation] = useState();

  const handleShow = () => {
    fetch(
      `https://www.mapquestapi.com/geocoding/v1/address?key=${api_key}&location=${text}`
    )
      .then((response) => response.json())
      .then((data) => {
        data.results[0].locations[0].latLng;
        setCoordinates({
          latitude: data.results[0].locations[0].latLng.lat,
          longitude: data.results[0].locations[0].latLng.lng,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        });
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  useEffect(() => {
    const region = {
      latitude: coordinates.latitude,
      longitude: coordinates.longitude,
      latitudeDelta: coordinates.latitudeDelta,
      longitudeDelta: coordinates.longitudeDelta,
    };
    setLocationRegion(region);
  }, [coordinates]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("No permission to get location");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setCoordinates({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.0922,
        longitudeDelta: 0.0421,
      });
    })();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <MapView style={{ flex: 1 }} region={coordinates}>
        <Marker
          coordinate={{
            latitude: coordinates.latitude,
            longitude: coordinates.longitude,
          }}
        />
      </MapView>

      <View>
        <TextInput
          onChangeText={(newText) => setText(newText)}
          value={text}
          placeholder="Syötä osoite"
        />
        <Button title="Show" onPress={handleShow} />
      </View>
    </View>
  );
}