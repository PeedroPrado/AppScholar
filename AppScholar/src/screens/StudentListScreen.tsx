import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert, TextInput
} from 'react-native';
import { useData } from '../context/DataContext';
import { useNavigation } from '@react-navigation/native';
import { Student } from '../types';
import { theme } from '../styles/theme'
import { useAuth } from '../hooks/useAuth';
import { useSearch } from '../hooks/useSearch';

function StudentCard({
  student,
  onDelete,
}: {
  student: Student;
  onDelete: (id: string) => void;
}) {
  function confirmDelete() {
    Alert.alert(
      'Remover aluno',
      `Deseja remover "${student.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => onDelete(student.id) },
      ]
    );
  }

  return (
    <View style={styles.card}>
      {/* Avatar com inicial do nome */}
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {student.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{student.name}</Text>
        <Text style={styles.cardSub}>🎓 {student.enrollment}</Text>
        <Text style={styles.cardSub}>📚 {student.course}</Text>
        <Text style={styles.cardSub}>📧 {student.email}</Text>
        <Text style={styles.cardSub}>📍 {student.city} - {student.state}</Text>
      </View>

      <TouchableOpacity onPress={confirmDelete} style={styles.deleteBtn}>
        <Text style={styles.deleteIcon}>🗑</Text>
      </TouchableOpacity>
    </View>
  );
}

export function StudentListScreen() {
  const { students, removeStudent } = useData();
  const navigation = useNavigation<any>();
  const { search, setSearch, filtered } = useSearch(students, ['name', 'enrollment']);
  
  return (
    <View style={styles.container}>
      {/* Barra de busca */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Buscar por nome ou matrícula..."
          placeholderTextColor={theme.colors.textLight}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      {/* Contador */}
      <Text style={styles.counter}>
        {filtered.length} aluno{filtered.length !== 1 ? 's' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
      </Text>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <StudentCard student={item} onDelete={removeStudent} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>🎓</Text>
            <Text style={styles.emptyText}>
              {search ? 'Nenhum aluno encontrado' : 'Nenhum aluno cadastrado ainda'}
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => navigation.navigate('StudentForm')}
            >
              <Text style={styles.emptyBtnText}>+ Cadastrar primeiro aluno</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {/* Botão flutuante para novo cadastro */}
      {students.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('StudentForm')}
          activeOpacity={0.85}
        >
          <Text style={styles.fabText}>+ Novo Aluno</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  searchContainer: {
    padding: theme.spacing.md,
    paddingBottom: theme.spacing.sm,
  },
  searchInput: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.sm,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm + 2,
    fontSize: theme.fontSize.md,
    color: theme.colors.text,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  counter: {
    fontSize: 12,
    color: theme.colors.textLight,
    paddingHorizontal: theme.spacing.md,
    marginBottom: theme.spacing.sm,
  },
  list: { padding: theme.spacing.md, paddingTop: 0, paddingBottom: 100 },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    flexDirection: 'row',
    alignItems: 'flex-start',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: { color: '#fff', fontSize: theme.fontSize.lg, fontWeight: '700' },
  cardInfo: { flex: 1 },
  cardName: {
    fontSize: theme.fontSize.md,
    fontWeight: '700',
    color: theme.colors.text,
    marginBottom: 4,
  },
  cardSub: {
    fontSize: 13,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  deleteBtn: { padding: theme.spacing.xs },
  deleteIcon: { fontSize: 18 },
  empty: { alignItems: 'center', paddingTop: 60 },
  emptyIcon: { fontSize: 56, marginBottom: theme.spacing.md },
  emptyText: {
    fontSize: theme.fontSize.md,
    color: theme.colors.textLight,
    marginBottom: theme.spacing.lg,
  },
  emptyBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: theme.spacing.sm + 2,
    paddingHorizontal: theme.spacing.xl,
    borderRadius: theme.borderRadius.sm,
  },
  emptyBtnText: { color: '#fff', fontWeight: '700', fontSize: theme.fontSize.md },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderRadius: 28,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  fabText: { color: '#fff', fontWeight: '700', fontSize: theme.fontSize.md },
});