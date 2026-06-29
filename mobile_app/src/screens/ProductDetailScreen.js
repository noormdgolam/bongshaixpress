import React, { useState } from 'react';
import { View, Text, StyleSheet, SafeAreaView, ScrollView, TouchableOpacity, Alert } from 'react-native';
import api from '../api';

export default function ProductDetailScreen({ route, navigation }) {
  const { product } = route.params;
  const attrs = product.attributes || {};
  const price = attrs['product.price'] || 0;

  const handleAddToCart = async () => {
    try {
      // For a basic cart, Aimeos jsonapi requires sending product info to the basket endpoint
      // This is a simplified version. A real implementation will need proper CSRF token and session handling
      Alert.alert("Success", "Added to cart!");
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Could not add to cart");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.imagePlaceholder}>
          <Text style={styles.placeholderText}>Product Image</Text>
        </View>
        <View style={styles.details}>
          <Text style={styles.title}>{attrs['product.label'] || 'Unnamed Product'}</Text>
          <Text style={styles.price}>${parseFloat(price).toFixed(2)}</Text>
          <Text style={styles.description}>
            {attrs['product.text'] || 'No description available for this product.'}
          </Text>
        </View>
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity style={styles.button} onPress={handleAddToCart}>
          <Text style={styles.buttonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    paddingBottom: 24,
  },
  imagePlaceholder: {
    width: '100%',
    height: 300,
    backgroundColor: '#eee',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    color: '#aaa',
    fontSize: 18,
  },
  details: {
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  price: {
    fontSize: 20,
    color: '#d32f2f',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
  },
  footer: {
    padding: 16,
    borderTopWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007BFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  }
});
