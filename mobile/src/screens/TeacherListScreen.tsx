import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert, TextInput
} from 'react-native';
import { useData } from '../context/DataContext';
import { useNavigation } from '@react-navigation/native';
import { Teacher } from '../types';
import { theme } from '../styles/theme';
import { useSearch } from '../hooks/useSearch';

// Badge colorido por titulação
const TITLE_COLORS: Record<string, string> = {
  'Graduação':     '#6B7280',
  'Especialização':'#2E86AB',
  'Mestrado':      '#F4A261',
  'Doutorado':     '#2DC653',
  'Pós-Doutorado': '#9333EA',
};

function TeacherCard({
  teacher,
  onDelete,
}: {
  teacher: Teacher;
  onDelete: (id: string) => void;
}) {
  const titleColor = TITLE_COLORS[teacher.title] ?? theme.colors.primary;

  function confirmDelete() {
    Alert.alert(
      'Remover professor',
      `Deseja remover "${teacher.name}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => onDelete(teacher.id) },
      ]
    );
  }

  return (
    <View style={styles.card}>
      <View style={[styles.avatar, { backgroundColor: titleColor }]}>
        <Text style={styles.avatarText}>
          {teacher.name.charAt(0).toUpperCase()}
        </Text>
      </View>

      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{teacher.name}</Text>

        {/* Badge de titulação */}
        <View style={[styles.badge, { backgroundColor: titleColor + '20' }]}>
          <Text style={[styles.badgeText, { color: titleColor }]}>
            {teacher.title}
          </Text>
        </View>

        <Text style={styles.cardSub}>🔬 {teacher.area}</Text>
        <Text style={styles.cardSub}>📧 {teacher.email}</Text>
        <Text style={styles.cardSub}>
          🗓 {teacher.yearsTeaching} ano{teacher.yearsTeaching !== 1 ? 's' : ''} de docência
        </Text>
      </View>

      <TouchableOpacity onPress={confirmDelete} style={styles.deleteBtn}>
        <Text style={styles.deleteIcon}>🗑</Text>
      </TouchableOpacity>
    </View>
  );
}

export function TeacherListScreen() {
  const { teachers, removeTeacher } = useData();
  const navigation = useNavigation<any>();
  const { search, setSearch, filtered } = useSearch(teachers, ['name', 'area', 'title']);

  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Buscar por nome, área ou titulação..."
          placeholderTextColor={theme.colors.textLight}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <Text style={styles.counter}>
        {filtered.length} professor{filtered.length !== 1 ? 'es' : ''} encontrado{filtered.length !== 1 ? 's' : ''}
      </Text>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TeacherCard teacher={item} onDelete={removeTeacher} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>👨‍🏫</Text>
            <Text style={styles.emptyText}>
              {search ? 'Nenhum professor encontrado' : 'Nenhum professor cadastrado ainda'}
            </Text>
            <TouchableOpacity
              style={styles.emptyBtn}
              onPress={() => navigation.navigate('TeacherForm')}
            >
              <Text style={styles.emptyBtnText}>+ Cadastrar primeiro professor</Text>
            </TouchableOpacity>
          </View>
        }
      />

      {teachers.length > 0 && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('TeacherForm')}
          activeOpacity={0.85}
        >
          <Text style={styles.fabText}>+ Novo Professor</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  searchContainer: { padding: theme.spacing.md, paddingBottom: theme.spacing.sm },
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
    marginBottom: 6,
  },
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingVertical: 2,
    paddingHorizontal: 10,
    marginBottom: 6,
  },
  badgeText: { fontSize: 12, fontWeight: '700' },
  cardSub: { fontSize: 13, color: theme.colors.textLight, marginTop: 2 },
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