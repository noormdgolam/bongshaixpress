import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, Image, TouchableOpacity, SafeAreaView, ActivityIndicator } from 'react-native';
import axios from 'axios';

// Replace this with your computer's local IP address if running on a physical Android phone via Expo Go.
// Example: 'http://192.168.1.100:8000/jsonapi'
// 'http://10.0.2.2:8000/jsonapi' works for Android Emulator
const API_URL = 'http://10.0.2.2:8000/jsonapi';

export default function App() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      // Fetching products from Aimeos JSON:API
      const response = await axios.get(`${API_URL}/product?include=media,price,text`);
      
      // Aimeos returns data in JSON:API format (data array + included metadata)
      setProducts(response.data.data || []);
      setError(null);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Could not connect to the backend. Please check API_URL and ensure Laravel is running.');
      // Fallback dummy data for preview if backend is not running yet
      setProducts([
        { id: '1', attributes: { 'product.label': 'Dummy Product 1' }, meta: { price: '$10.00' } },
        { id: '2', attributes: { 'product.label': 'Dummy Product 2' }, meta: { price: '$20.00' } },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const renderProduct = ({ item }) => {
    // Extracting basic info from JSON:API structure
    const name = item.attributes?.['product.label'] || 'Unknown Product';
    
    return (
      <View style={styles.productCard}>
        <View style={styles.productImagePlaceholder}>
          <Text style={styles.imageText}>No Image</Text>
        </View>
        <Text style={styles.productName}>{name}</Text>
        <TouchableOpacity style={styles.addButton}>
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>BongshaiXpress</Text>
      </View>
      
      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#e63946" />
        </View>
      ) : (
        <FlatList
          data={products}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderProduct}
          contentContainerStyle={styles.listContainer}
          ListEmptyComponent={<Text style={styles.emptyText}>No products found.</Text>}
        />
      )}
      
      {error && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#e63946',
    padding: 20,
    paddingTop: 50,
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    padding: 16,
  },
  productCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  productImagePlaceholder: {
    height: 150,
    backgroundColor: '#e9ecef',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  imageText: {
    color: '#adb5bd',
  },
  productName: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#212529',
  },
  addButton: {
    backgroundColor: '#457b9d',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  emptyText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#6c757d',
  },
  errorContainer: {
    backgroundColor: '#ffe3e6',
    padding: 12,
    margin: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ffc1c7',
  },
  errorText: {
    color: '#d90429',
    textAlign: 'center',
  },
});
