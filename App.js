import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import { StyleSheet, Text, View, TextInput, Pressable } from "react-native";
import MapView, { Marker } from "react-native-maps";

export default function App() {
  const [address, setAddress] = useState("");
  const [coords, setCoords] = useState({
    latitude: 0.0,
    longitude: 0.0,
  });
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  const handleSearch = async () => {
    if (!address.trim()) {
      setError("Please enter an address first");
      setShowMap(false);
      return;
    }

    const API_KEY = process.env.EXPO_PUBLIC_GEOCODING_API_SECRET_KEY;
    const url = `https://geocode.maps.co/search?q=${encodeURIComponent(
      address,
    )}&api_key=${API_KEY}`;

    try {
      if (!API_KEY) {
        throw new Error("Missing EXPO_PUBLIC_GEOCODING_API_SECRET_KEY");
      }
      setLoading(true);
      setError("");
      setShowMap(false);
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();

      if (data?.length > 0) {
        setCoords({
          latitude: Number(data[0].lat),
          longitude: Number(data[0].lon),
        });
        setTitle(data[0].name);
        setShowMap(true);
      } else {
        setError("Address not found");
      }
    } catch (err) {
      setError(err?.message || "Failed to fetch coordinates");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {showMap ? (
        <MapView
          style={{ width: "80%", height: "70%" }}
          region={{
            latitude: coords.latitude,
            longitude: coords.longitude,
            latitudeDelta: 0.0322,
            longitudeDelta: 0.0221,
          }}
        >
          <Marker coordinate={coords} title={title} />
        </MapView>
      ) : null}
      <TextInput
        value={address}
        onChangeText={setAddress}
        placeholder="Give an address"
        onSubmitEditing={handleSearch}
      ></TextInput>
      <Pressable style={styles.button} onPress={handleSearch}>
        <Text style={styles.buttonText}>SHOW</Text>
      </Pressable>
      {loading ? <Text>Loading...</Text> : null}
      {error ? <Text>{error}</Text> : null}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    gap: "5",
  },
  button: {
    backgroundColor: "rgb(0, 121, 194)",
    paddingBottom: "6",
    paddingTop: "6",
    paddingRight: "24",
    paddingLeft: "24",
  },
  buttonText: {
    color: "#F7F7F7",
  },
});
