import React, { useState } from "react";
import { View, TextInput, Button, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { api_key } from "./keys";

export default function App() {
  const [text, setText] = useState("");
  const [location, setLocation] = useState({
    latitude: 0,
    longitude: 0,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  });

  const handleShow = () => {
    fetch(
      `https://www.mapquestapi.com/geocoding/v1/address?key=${api_key}&location=${text}`
    )
      .then((response) => response.json())
      .then((data) => {
        if (data.results?.[0]?.locations?.[0]?.latLng) {
          setLocation({
            latitude: data.results[0].locations[0].latLng.lat,
            longitude: data.results[0].locations[0].latLng.lng,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        } else {
          Alert.alert("Error", "Osoitetta ei löytynyt.");
        }
      })
      .catch((error) => {
        Alert.alert("Error", error.message);
      });
  };

  return (
    <View style={{ flex: 1 }}>
      {location.latitude !== 0 && location.longitude !== 0 ? (
        <MapView
          style={{ flex: 1 }}
          initialRegion={location}
        >
          <Marker
            coordinate={{
              latitude: location.latitude,
              longitude: location.longitude,
            }}
          />
        </MapView>
      ) : (
        <MapView style={{ flex: 1 }} /> 
      )}
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