import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Text, ActivityIndicator, HelperText, Card, Title, Paragraph, Divider } from 'react-native-paper';
import { fetchXerostomiaById } from '../../api/api';

const { height, width } = Dimensions.get('window');

const XerostomiaDetailScreen = ({ route }) => {
  const { token, id } = route.params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchXerostomiaById(token, id);
        setData(response);
      } catch (error) {
        console.error('Error fetching xerostomia by ID:', error);
        setError('Error al obtener datos de xerostomía');
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
          <Title style={styles.title}>Detalles de la Xerostomía</Title>
          <Divider style={styles.divider} />
          <Paragraph style={styles.text}>Intensidad de la sequedad: <Text style={styles.boldText}>{data.sequedad_intensidad}</Text></Paragraph>
          <Paragraph style={styles.text}>Frecuencia de la sequedad: <Text style={styles.boldText}>{data.sequedad_frecuencia}</Text></Paragraph>
          <Paragraph style={styles.text}>Calidad de la saliva: <Text style={styles.boldText}>{data.calidad_saliva}</Text></Paragraph>
          <Paragraph style={styles.text}>Sabor de la saliva: <Text style={styles.boldText}>{data.sabor_saliva}</Text></Paragraph>
          <Paragraph style={styles.text}>Necesidad de humedecer la boca: <Text style={styles.boldText}>{data.necesidad_humedecer}</Text></Paragraph>
          <Paragraph style={styles.text}>Despertar para beber: <Text style={styles.boldText}>{data.despertar_beber}</Text></Paragraph>
          <Paragraph style={styles.text}>Dificultad para hablar: <Text style={styles.boldText}>{data.dificultad_hablar}</Text></Paragraph>
          <Paragraph style={styles.text}>Dificultad para masticar o tragar: <Text style={styles.boldText}>{data.dificultad_masticar_tragar}</Text></Paragraph>
          <Paragraph style={styles.text}>Labios secos: <Text style={styles.boldText}>{data.labios_secos}</Text></Paragraph>
          <Paragraph style={styles.text}>Nariz seca: <Text style={styles.boldText}>{data.nariz_seca}</Text></Paragraph>
          <Paragraph style={styles.text}>Ojos secos: <Text style={styles.boldText}>{data.ojos_secos}</Text></Paragraph>
          <Paragraph style={styles.text}>Perturbación en actividades: <Text style={styles.boldText}>{data.perturbacion_actividades}</Text></Paragraph>
          <Paragraph style={styles.text}>Calidad de vida afectada por la sequedad: <Text style={styles.boldText}>{data.calidad_vida_sequedad}</Text></Paragraph>
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

export default XerostomiaDetailScreen;
