import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Text, ActivityIndicator, HelperText, Card, Title, Paragraph, Divider } from 'react-native-paper';
import { fetchHabitosNocivosById } from '../../api/api';

const { height, width } = Dimensions.get('window');

const HabitosNocivosDetailScreen = ({ route }) => {
  const { token, id } = route.params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchHabitosNocivosById(token, id);
        setData(response);
      } catch (error) {
        console.error('Error fetching hábitos nocivos by ID:', error);
        setError('Error al obtener datos de hábitos nocivos');
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
          <Title style={styles.title}>Detalles de Hábitos Nocivos</Title>
          <Divider style={styles.divider} />
          <Paragraph style={styles.text}>¿Actualmente fumas?: <Text style={styles.boldText}>{data.actualmente_fumas ? 'Sí' : 'No'}</Text></Paragraph>
          {data.actualmente_fumas && (
            <>
              <Paragraph style={styles.text}>Cigarrillos por día: <Text style={styles.boldText}>{data.cigarrillos_por_dia}</Text></Paragraph>
              <Paragraph style={styles.text}>Edad de inicio de fumar: <Text style={styles.boldText}>{data.edad_inicio_fumar}</Text></Paragraph>
            </>
          )}
          <Paragraph style={styles.text}>¿Has fumado antes?: <Text style={styles.boldText}>{data.has_fumado_antes ? 'Sí' : 'No'}</Text></Paragraph>
          {data.has_fumado_antes && (
            <>
              <Paragraph style={styles.text}>¿Cuándo comenzaste?: <Text style={styles.boldText}>{data.cuando_comenzaste}</Text></Paragraph>
              <Paragraph style={styles.text}>Cigarrillos por día antes: <Text style={styles.boldText}>{data.cigarrillos_por_dia_antes}</Text></Paragraph>
              <Paragraph style={styles.text}>¿Cuándo dejaste?: <Text style={styles.boldText}>{data.cuando_dejaste}</Text></Paragraph>
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

export default HabitosNocivosDetailScreen;