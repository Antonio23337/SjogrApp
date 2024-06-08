import React, { useState, useEffect } from 'react';
import { View, StyleSheet, FlatList, TouchableOpacity, TextInput, Dimensions } from 'react-native';
import { Text, ActivityIndicator, HelperText } from 'react-native-paper';
import { fetchAntecedentesFamiliares } from '../../api/api';

const { height, width } = Dimensions.get('window');

const AntecedentesFamiliaresListScreen = ({ route, navigation }) => {
  const { token } = route.params;
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetchAntecedentesFamiliares(token);
        setData(response);
        setFilteredData(response);
      } catch (error) {
        console.error('Error fetching antecedentes familiares:', error);
        setError('Error al obtener datos de antecedentes familiares');
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [token]);

  const handleSearch = (text) => {
    setSearch(text);
    if (text) {
      const newData = data.filter(item => item.codigo_identificativo.toLowerCase().includes(text.toLowerCase()));
      setFilteredData(newData);
    } else {
      setFilteredData(data);
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('AntecedentesFamiliaresDetailScreen', { token, id: item.id })}
      style={styles.itemContainer}
    >
      <Text style={styles.itemText}>{item.codigo_identificativo}</Text>
    </TouchableOpacity>
  );

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
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Usuarios con antecedentes familiares</Text>
      </View>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar por código identificativo"
        value={search}
        onChangeText={handleSearch}
      />
      {filteredData.length > 0 ? (
        <FlatList
          data={filteredData}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
        />
      ) : (
        <Text style={styles.noDataText}>No hay registros disponibles</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: height * 0.05,
    paddingHorizontal: width * 0.05,
  },
  titleContainer: {
    marginBottom: height * 0.02,
  },
  title: {
    fontSize: width * 0.06,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  loadingText: {
    fontSize: width * 0.045,
    textAlign: 'center',
    marginTop: height * 0.02,
  },
  searchInput: {
    height: height * 0.05,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: width * 0.02,
    marginBottom: height * 0.02,
  },
  list: {
    paddingBottom: height * 0.02,
  },
  itemContainer: {
    padding: height * 0.02,
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: height * 0.01,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 3,
  },
  itemText: {
    fontSize: width * 0.045,
    textAlign: 'center',
    color: '#333',
  },
  noDataText: {
    fontSize: width * 0.045,
    textAlign: 'center',
    color: '#333',
    marginTop: height * 0.02,
  },
});

export default AntecedentesFamiliaresListScreen;