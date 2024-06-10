import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Text, ActivityIndicator, HelperText, Card, Title, Paragraph, Divider } from 'react-native-paper';
import { fetchDiagnosticoSjogrenById } from '../../api/api';

const { height, width } = Dimensions.get('window');

const DiagnosticoSjogrenDetailScreen = ({ route }) => {
  const { token, id } = route.params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchDiagnosticoSjogrenById(token, id);
        setData(response);
      } catch (error) {
        console.error('Error fetching diagnóstico de Sjogren by ID:', error);
        setError('Error al obtener datos del diagnóstico de Sjogren');
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

  const renderCondition = (condition, label) => (
    <Paragraph style={styles.text}>{label}: <Text style={styles.boldText}>{condition ? 'Sí' : 'No'}</Text></Paragraph>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Detalles del Diagnóstico de Sjogren</Title>
          <Divider style={styles.divider} />
          {renderCondition(data.diagnostico_sjogren, '¿Diagnosticado con Síndrome de Sjögren?')}
          {data.diagnostico_sjogren && (
            <>
              <Paragraph style={styles.text}>Año del Diagnóstico: <Text style={styles.boldText}>{data.anio_diagnostico}</Text></Paragraph>
              <Paragraph style={styles.text}>Medicación: <Text style={styles.boldText}>{data.medicacion}</Text></Paragraph>
            </>
          )}
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

export default DiagnosticoSjogrenDetailScreen;