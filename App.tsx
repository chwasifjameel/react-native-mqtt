/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  MQTT_USER,
  MQTT_PASSWORD,
  CLIENT_ID,
  PROTOCOL,
  HOST,
  PORT,
  URI,
} from '@env';

import {
  SafeAreaView,
  Button,
  TextInput,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import MQTT, {IMqttClient} from 'sp-react-native-mqtt';

import {Colors} from 'react-native/Libraries/NewAppScreen';

function App(): React.JSX.Element {
  const [inputValue, setInputValue] = useState('');
  const [client, setClient] = useState<IMqttClient | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const submit = () => {
    client?.publish('/hello', inputValue, 0, false);
    setInputValue('');
  };

  useEffect(() => {
    MQTT.createClient({
      user: MQTT_USER,
      pass: MQTT_PASSWORD,
      clientId: CLIENT_ID || '',
      protocol: (PROTOCOL as 'mqtt' | 'tcp' | 'wss' | 'mqtts' | 'ws') || 'mqtt',
      host: HOST,
      port: PORT ? parseInt(PORT) : 1883,
      keepalive: 60,
      clean: true,
      tls: false,
      auth: true,
      uri: URI,
    })
      .then(async function (client) {
        client.on('closed', function (err) {
          console.log('mqtt.event.closed-_--_--_--_--_--_-', err);
        });

        client.on('error', function (msg) {
          console.log('mqtt.event.error ====>', msg);
        });

        client.on('message', function (msg) {
          console.log('mqtt.event.message -+-+-+-+-+-+', msg);
        });

        client.on('connect', function () {
          setIsConnected(true);
          setClient(client);
          client.subscribe('/hello', 0);
          client.publish('/hello', 'Hello from RN', 0, false);
        });
        client.connect();
      })
      .catch(function (err) {
        console.log(err);
      });

    return () => {
      client?.disconnect();
    };
  }, []);
  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <TextInput
        style={styles.input}
        onChangeText={setInputValue}
        value={inputValue}
        placeholder="Type here..."
      />
      <Button title="Submit" onPress={submit} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
  },
  highlight: {
    fontWeight: '700',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
  },
});

export default App;
