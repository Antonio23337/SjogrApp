import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Text, ActivityIndicator, HelperText, Card, Title, Paragraph, Divider } from 'react-native-paper';
import { fetchAlergiasById } from '../../api/api';

const { height, width } = Dimensions.get('window');

const AlergiasDetailScreen = ({ route }) => {
  const { token, id } = route.params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchAlergiasById(token, id);
        setData(response);
      } catch (error) {
        console.error('Error fetching allergies by ID:', error);
        setError('Error al obtener datos de alergias');
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
          <Title style={styles.title}>Detalles de Alergias</Title>
          <Divider style={styles.divider} />
          <Paragraph style={styles.text}>¿Es alérgico a algún medicamento?: <Text style={styles.boldText}>{data.es_alergico_medicamento ? 'Sí' : 'No'}</Text></Paragraph>
          {data.es_alergico_medicamento && (
            <Paragraph style={styles.text}>Medicamentos: <Text style={styles.boldText}>{data.medicamentos}</Text></Paragraph>
          )}
          <Paragraph style={styles.text}>¿Tiene otras alergias?: <Text style={styles.boldText}>{data.tiene_otras_alergias ? 'Sí' : 'No'}</Text></Paragraph>
          {data.tiene_otras_alergias && (
            <>
              <Paragraph style={styles.text}>Tipo de Alergia: <Text style={styles.boldText}>{data.alergias_tipo}</Text></Paragraph>
              {data.alergias_tipo === 'Otra' && (
                <Paragraph style={styles.text}>Otra Alergia: <Text style={styles.boldText}>{data.otra_alergia}</Text></Paragraph>
              )}
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

export default AlergiasDetailScreen;
