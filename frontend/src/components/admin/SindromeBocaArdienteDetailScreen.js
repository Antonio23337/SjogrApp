import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, ScrollView } from 'react-native';
import { Text, ActivityIndicator, HelperText, Card, Title, Paragraph, Divider } from 'react-native-paper';
import { fetchSindromeBocaArdienteById } from '../../api/api';

const { height, width } = Dimensions.get('window');

const SindromeBocaArdienteDetailScreen = ({ route }) => {
  const { token, id } = route.params;
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchSindromeBocaArdienteById(token, id);
        setData(response);
      } catch (error) {
        console.error('Error fetching síndrome de la boca ardiente by ID:', error);
        setError('Error al obtener datos del síndrome de la boca ardiente');
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

  const renderSymptoms = () => (
    <>
      <Paragraph style={styles.text}>Síntomas: <Text style={styles.boldText}>{data.sintomas}</Text></Paragraph>
      <Paragraph style={styles.text}>Duración de los síntomas: <Text style={styles.boldText}>{data.duracion_sintomas}</Text></Paragraph>
      <Paragraph style={styles.text}>Atribución de los síntomas: <Text style={styles.boldText}>{data.atribucion_sintomas}</Text></Paragraph>
      <Paragraph style={styles.text}>Aparición de los síntomas: <Text style={styles.boldText}>{data.aparicion_sintomas}</Text></Paragraph>
      <Paragraph style={styles.text}>Intensidad de la sintomatología: <Text style={styles.boldText}>{data.intensidad_sintomatologia}</Text></Paragraph>
      <Paragraph style={styles.text}>Factor desencadenante: <Text style={styles.boldText}>{data.factor_desencadenante}</Text></Paragraph>
    </>
  );

  const renderTasteAlterations = () => (
    <>
      <Paragraph style={styles.text}>Tipo de alteración del gusto: <Text style={styles.boldText}>{data.tipo_alteracion_gusto}</Text></Paragraph>
      <Paragraph style={styles.text}>Intensidad de la alteración del gusto: <Text style={styles.boldText}>{data.intensidad_alteracion_gusto}</Text></Paragraph>
    </>
  );

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <Card style={styles.card}>
        <Card.Content>
          <Title style={styles.title}>Detalles del Síndrome de la Boca Ardiente</Title>
          <Divider style={styles.divider} />
          <Paragraph style={styles.text}>
            ¿Tiene síntomas?: <Text style={styles.boldText}>{data.tiene_sintomas ? 'Sí' : 'No'}</Text>
          </Paragraph>
          {data.tiene_sintomas && renderSymptoms()}
          <Paragraph style={styles.text}>
            ¿Tiene alteraciones del gusto?: <Text style={styles.boldText}>{data.alteraciones_gusto ? 'Sí' : 'No'}</Text>
          </Paragraph>
          {data.alteraciones_gusto && renderTasteAlterations()}
          <Paragraph style={styles.text}>
            ¿Siente cuerpo extraño en la boca?: <Text style={styles.boldText}>{data.cuerpo_extraño_boca ? 'Sí' : 'No'}</Text>
          </Paragraph>
          <Paragraph style={styles.text}>
            ¿Tiene ulceraciones en la boca?: <Text style={styles.boldText}>{data.ulceraciones_boca ? 'Sí' : 'No'}</Text>
          </Paragraph>
          <Paragraph style={styles.text}>
            ¿Tiene intolerancia a la prótesis?: <Text style={styles.boldText}>{data.intolerancia_protesis ? 'Sí' : 'No'}</Text>
          </Paragraph>
          <Paragraph style={styles.text}>
            ¿Tiene halitosis?: <Text style={styles.boldText}>{data.halitosis ? 'Sí' : 'No'}</Text>
          </Paragraph>
          <Paragraph style={styles.text}>
            Dificultad al comer/beber: <Text style={styles.boldText}>{data.comer_beber}</Text>
          </Paragraph>
          <Paragraph style={styles.text}>
            Dificultad al hablar: <Text style={styles.boldText}>{data.hablar}</Text>
          </Paragraph>
          <Paragraph style={styles.text}>
            Dificultad con la higiene dental: <Text style={styles.boldText}>{data.higiene_dental}</Text>
          </Paragraph>
          <Paragraph style={styles.text}>
            Dificultad al dormir/relajarse: <Text style={styles.boldText}>{data.dormir_relajarse}</Text>
          </Paragraph>
          <Paragraph style={styles.text}>
            Dificultad al mostrar sonrisa: <Text style={styles.boldText}>{data.mostrar_sonrisa}</Text>
          </Paragraph>
          <Paragraph style={styles.text}>
            Estado emocional: <Text style={styles.boldText}>{data.estado_emocional}</Text>
          </Paragraph>
          <Paragraph style={styles.text}>
            Dificultad al realizar trabajo habitual: <Text style={styles.boldText}>{data.realizar_trabajo_habitual}</Text>
          </Paragraph>
          <Paragraph style={styles.text}>
            Dificultad al disfrutar relaciones sociales: <Text style={styles.boldText}>{data.disfrutar_relaciones_sociales}</Text>
          </Paragraph>
          {data.lengua && (
            <Paragraph style={styles.text}>Lengua: <Text style={styles.boldText}>{data.lengua}</Text></Paragraph>
          )}
          {data.mucosa_yugal && (
            <Paragraph style={styles.text}>Mucosa yugal: <Text style={styles.boldText}>{data.mucosa_yugal}</Text></Paragraph>
          )}
          {data.labios && (
            <Paragraph style={styles.text}>Labios: <Text style={styles.boldText}>{data.labios}</Text></Paragraph>
          )}
          {data.encia && (
            <Paragraph style={styles.text}>Encía: <Text style={styles.boldText}>{data.encia}</Text></Paragraph>
          )}
          {data.paladar && (
            <Paragraph style={styles.text}>Paladar: <Text style={styles.boldText}>{data.paladar}</Text></Paragraph>
          )}
          {data.extraoral && (
            <Paragraph style={styles.text}>Extraoral: <Text style={styles.boldText}>{data.extraoral}</Text></Paragraph>
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

export default SindromeBocaArdienteDetailScreen;
