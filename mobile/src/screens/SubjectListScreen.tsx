import React, {
  useState,
  useEffect
} from 'react';

import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, Alert, TextInput
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Subject } from '../types';
import { theme } from '../styles/theme';
import { useAuth } from '../hooks/useAuth';
import { useSearch } from '../hooks/useSearch';
import {
  getSubjects,
  deleteSubject
} from '../services/subjectService';

function SubjectCard({
  subject,
  onDelete,
}: {
  subject: Subject;
  onDelete: (id: string) => void;
}) {
  function confirmDelete() {
    Alert.alert(
      'Remover disciplina',
      `Deseja remover "${subject.nome}"?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Remover', style: 'destructive', onPress: () => onDelete(subject.id) },
      ]
    );
  }

  return (
    <View style={styles.card}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {subject.nome.charAt(0).toUpperCase()}
        </Text>
      </View>

<View style={styles.cardInfo}>

  <Text style={styles.cardName}>
    {subject.nome}
  </Text>

  <Text style={styles.cardSub}>
    📚 {subject.curso}
  </Text>

  <Text style={styles.cardSub}>
    🗓 {subject.semestre}º semestre
  </Text>

  <Text style={styles.cardSub}>
    ⏱ {subject.cargaHoraria}h
  </Text>

  <Text style={styles.cardSub}>
    👨‍🏫 {subject.professor}
  </Text>

</View>

      <TouchableOpacity onPress={confirmDelete} style={styles.deleteBtn}>
        <Text style={styles.deleteIcon}>🗑</Text>
      </TouchableOpacity>
    </View>
  );
}

export function SubjectListScreen() {
 
  const navigation = useNavigation<any>();
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const { search, setSearch, filtered } = useSearch(subjects, ['nome', 'curso']);

  useEffect(() => {

  async function loadSubjects() {

    try {

      const data =
        await getSubjects();

      console.log(data);

      setSubjects(data);

    } catch (error) {

      console.log(error);
    }
  }

  loadSubjects();

}, []);

async function handleDelete(
  id: string
) {

  try {

    await deleteSubject(id);

    setSubjects(prev =>
      prev.filter(subject =>
        subject.id !== id
      )
    );

  } catch (error) {

    console.log(error);

    Alert.alert(
      "Erro",
      "Não foi possível remover disciplina"
    );
  }
}

   const { user } = useAuth();   


  return (
    <View style={styles.container}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="🔍 Buscar disciplina..."
          placeholderTextColor={theme.colors.textLight}
          value={search}
          onChangeText={setSearch}
        />
      </View>

      <Text style={styles.counter}>
        {filtered.length} disciplina{filtered.length !== 1 ? 's' : ''} encontrada{filtered.length !== 1 ? 's' : ''}
      </Text>

      <FlatList
        data={filtered}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <SubjectCard subject={item} onDelete={handleDelete} />
        )}
        contentContainerStyle={styles.list}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>📚</Text>
            <Text style={styles.emptyText}>
              {search ? 'Nenhuma disciplina encontrada' : 'Nenhuma disciplina cadastrada'}
            </Text>

            {user?.perfil === 'admin' && (
              <TouchableOpacity
                style={styles.emptyBtn}
                onPress={() => navigation.navigate('SubjectForm')}
              >
                <Text style={styles.emptyBtnText}>
                  + Cadastrar primeira disciplina
                </Text>
              </TouchableOpacity>
            )}
          </View>
        }
      />

      {subjects.length > 0 && user?.perfil === 'admin' && (
        <TouchableOpacity
          style={styles.fab}
          onPress={() => navigation.navigate('SubjectForm')}
          activeOpacity={0.85}
        >
          <Text style={styles.fabText}>+ Nova Disciplina</Text>
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
  emptyBtnText: { color: '#fff', fontWeight: '700' },
  fab: {
    position: 'absolute',
    bottom: theme.spacing.xl,
    right: theme.spacing.lg,
    backgroundColor: theme.colors.primary,
    borderRadius: 28,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: theme.spacing.lg,
  },
  fabText: { color: '#fff', fontWeight: '700' },
});