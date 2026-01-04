import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Plus, Clock, AlertCircle, Calendar } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { trpc } from '@/lib/trpc';

export default function MedicationScreen() {
  const router = useRouter();
  const { data: medications, isLoading, error, refetch } = trpc.medications.list.useQuery();

  const handleAddMedication = () => {
    router.push('/add-medication');
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>A carregar medicações...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <AlertCircle size={48} color={Colors.danger} />
        <Text style={styles.errorTitle}>Ocorreu um erro</Text>
        <Text style={styles.errorMessage}>{error.message}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
          <Text style={styles.retryButtonText}>Tentar novamente</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Medicações</Text>
        <TouchableOpacity 
          style={styles.addButton}
          onPress={handleAddMedication}
        >
          <Plus size={24} color={Colors.background} />
        </TouchableOpacity>
      </View>

      {medications && medications.length > 0 ? (
        <FlatList
          data={medications}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.medicationCard}
              onPress={() => {
                // In a real app, you would navigate to a detail screen
                // router.push(`/medication/${item.id}`);
              }}
            >
              <View style={styles.medicationHeader}>
                <Text style={styles.medicationName}>{item.name}</Text>
                <View style={styles.dosageContainer}>
                  <Text style={styles.dosageText}>{item.dosage}</Text>
                </View>
              </View>
              
              <View style={styles.medicationDetails}>
                <View style={styles.detailItem}>
                  <Clock size={16} color={Colors.primary} />
                  <Text style={styles.detailText}>
                    {item.frequency}
                    {item.time ? ` às ${item.time}` : ''}
                  </Text>
                </View>
                
                {item.instructions && (
                  <View style={styles.detailItem}>
                    <AlertCircle size={16} color={Colors.primary} />
                    <Text style={styles.detailText}>{item.instructions}</Text>
                  </View>
                )}
                
                {item.startDate && (
                  <View style={styles.detailItem}>
                    <Calendar size={16} color={Colors.primary} />
                    <Text style={styles.detailText}>
                      Início: {item.startDate}
                      {item.endDate ? ` até ${item.endDate}` : ''}
                    </Text>
                  </View>
                )}
              </View>
              
              {item.purpose && (
                <Text style={styles.purposeText}>{item.purpose}</Text>
              )}
            </TouchableOpacity>
          )}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyTitle}>Sem medicações</Text>
          <Text style={styles.emptyMessage}>
            Ainda não tem medicações registadas. Clique no botão + para adicionar.
          </Text>
          <TouchableOpacity 
            style={styles.emptyAddButton}
            onPress={handleAddMedication}
          >
            <Text style={styles.emptyAddButtonText}>Adicionar Medicação</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.text,
  },
  addButton: {
    backgroundColor: Colors.primary,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  listContent: {
    padding: 16,
    paddingBottom: 40,
  },
  medicationCard: {
    backgroundColor: Colors.secondary,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  medicationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.text,
  },
  dosageContainer: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  dosageText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 12,
  },
  medicationDetails: {
    marginBottom: 12,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  detailText: {
    marginLeft: 8,
    color: Colors.text,
    fontSize: 14,
  },
  purposeText: {
    fontSize: 14,
    color: Colors.textLight,
    fontStyle: 'italic',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.text,
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
    padding: 24,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.text,
    marginBottom: 8,
  },
  emptyMessage: {
    fontSize: 16,
    color: Colors.textLight,
    textAlign: 'center',
    marginBottom: 24,
  },
  emptyAddButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  emptyAddButtonText: {
    color: Colors.background,
    fontWeight: 'bold',
    fontSize: 16,
  },
});