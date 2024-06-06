import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Text, ActivityIndicator, HelperText, Card, Title, Paragraph, Divider } from 'react-native-paper';
import { fetchEstadoMenstrualById } from '../../api/api';

const { height, width } = Dimensions.get('window');

const EstadoMenstrualDetailScreen = ({ route }) => {
  const { token, id } = route.params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchEstadoMenstrualById(token, id);
        setData(response);
      } catch (error) {
        console.error('Error fetching estado menstrual by ID:', error);
        setError('Error al obtener datos del estado menstrual');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token, id]);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator animating={true} size="large" />
        <Text style={styles.loadingText}>Cargando...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <HelperText type="error" visible={true}>
          {error}
        </HelperText>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Detalles del Estado Menstrual</Title>
          <Divider style={styles.divider} />
          <Paragraph style={styles.text}>Edad de la primera menstruación: <Text style={styles.boldText}>{data.edad_primera_menstruacion}</Text></Paragraph>
          <Paragraph style={styles.text}>¿Está embarazada?: <Text style={styles.boldText}>{data.esta_embarazada ? 'Sí' : 'No'}</Text></Paragraph>
          <Paragraph style={styles.text}>¿Está usando anticonceptivos?: <Text style={styles.boldText}>{data.esta_usando_anticonceptivos ? 'Sí' : 'No'}</Text></Paragraph>
          <Paragraph style={styles.text}>¿Tiene trastornos menstruales?: <Text style={styles.boldText}>{data.tiene_trastornos_menstruales ? 'Sí' : 'No'}</Text></Paragraph>
          <Paragraph style={styles.text}>Estado menstrual: <Text style={styles.boldText}>{data.estado_menstrual}</Text></Paragraph>
          {data.estado_menstrual === 'Postmenopausia' && (
            <>
              <Paragraph style={styles.text}>Edad de la última menstruación: <Text style={styles.boldText}>{data.edad_ultima_menstruacion}</Text></Paragraph>
              <Paragraph style={styles.text}>Tipo de menopausia: <Text style={styles.boldText}>{data.menopausia}</Text></Paragraph>
              {data.menopausia === 'Otro' && (
                <Paragraph style={styles.text}>Otra menopausia: <Text style={styles.boldText}>{data.otra_menopausia}</Text></Paragraph>
              )}
            </>
          )}
          <Paragraph style={styles.text}>¿Está usando terapia hormonal?: <Text style={styles.boldText}>{data.esta_usando_terapia_hormonal ? 'Sí' : 'No'}</Text></Paragraph>
        </Card.Content>
      </Card>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: width * 0.05,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: width * 0.05,
    backgroundColor: '#f5f5f5',
  },
  card: {
    borderRadius: 10,
    elevation: 3,
    padding: width * 0.05,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    marginBottom: height * 0.02,
    textAlign: 'center',
    color: '#333',
  },
  text: {
    fontSize: width * 0.045,
    marginBottom: height * 0.01,
    color: '#333',
  },
  boldText: {
    fontWeight: 'bold',
  },
  loadingText: {
    fontSize: width * 0.045,
    textAlign: 'center',
    marginTop: height * 0.02,
    color: '#333',
  },
  divider: {
    marginVertical: height * 0.02,
  },
});

export default EstadoMenstrualDetailScreen;
