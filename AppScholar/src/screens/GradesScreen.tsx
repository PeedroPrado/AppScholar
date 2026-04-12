import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';
import { Grade } from '../types';
import { theme } from '../style/theme';

const MOCK_GRADES: Grade [] = [
    { id: '1', subjectName: 'Programação Mobile I', grade1: 8.5, grade2: 9.0, average: 8.75, status: 'Aprovado' },
  { id: '2', subjectName: 'Banco de Dados',       grade1: 6.0, grade2: 7.5, average: 6.75, status: 'Aprovado' },
  { id: '3', subjectName: 'Laboratório de Desenvolvimento Web',grade1: 4.0, grade2: 5.5, average: 4.75, status: 'Reprovado' },
  { id: '4', subjectName: 'Redes de Computadores', grade1: 7.0, grade2: 8.0, average: 7.50, status: 'Em andamento' },
];

function GradeCard({ item }: {item: Grade }) {
    const statusColor =
        item.status === 'Aprovado' ? theme.colors.sucess :
        item.status === 'Reprovado' ? theme.colors.error :
        theme.colors.accent;

    return (
    <View style={styles.card}>
      <Text style={styles.subjectName}>{item.subjectName}</Text>
      <View style={styles.row}>
        <View style={styles.gradeBox}>
          <Text style={styles.gradeLabel}>Nota 1</Text>
          <Text style={styles.gradeValue}>{item.grade1.toFixed(1)}</Text>
        </View>
        <View style={styles.gradeBox}>
          <Text style={styles.gradeLabel}>Nota 2</Text>
          <Text style={styles.gradeValue}>{item.grade2.toFixed(1)}</Text>
        </View>
        <View style={styles.gradeBox}>
          <Text style={styles.gradeLabel}>Média</Text>
          <Text style={[styles.gradeValue, { color: statusColor }]}>{item.average.toFixed(1)}</Text>
        </View>
      </View>
      <View style={[styles.statusBadge, { backgroundColor: statusColor + '22' }]}>
        <Text style={[styles.statusText, { color: statusColor }]}>{item.status}</Text>
      </View>
    </View>
  );
}

export function GradesScreen() {
  const [grades, setGrades] = useState<Grade[]>([]);
  const [loading, setLoading] = useState(true);

  // useEffect simula o carregamento dos dados (delay de 1s)
  useEffect(() => {
    const timer = setTimeout(() => {
      setGrades(MOCK_GRADES);
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer); // cleanup do useEffect
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Carregando boletim...</Text>
      </View>
    );
  }

  return (
    <FlatList
      style={styles.container}
      data={grades}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <GradeCard item={item} />}
      ListHeaderComponent={<Text style={styles.title}>Meu Boletim</Text>}
      contentContainerStyle={{ padding: theme.spacing.md }}
    />
  );
}
const styles = StyleSheet.create({
  container: { backgroundColor: theme.colors.background },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: theme.colors.textLight },
  title: { fontSize: theme.fontSize.xl, fontWeight: '800', color: theme.colors.text, marginBottom: theme.spacing.md },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    elevation: 3,
  },
  subjectName: { fontSize: theme.fontSize.md, fontWeight: '700', color: theme.colors.text, marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-around', marginBottom: 12 },
  gradeBox: { alignItems: 'center' },
  gradeLabel: { fontSize: 11, color: theme.colors.textLight, fontWeight: '600' },
  gradeValue: { fontSize: theme.fontSize.lg, fontWeight: '700', color: theme.colors.text, marginTop: 4 },
  statusBadge: { borderRadius: 20, paddingVertical: 4, paddingHorizontal: 12, alignSelf: 'flex-start' },
  statusText: { fontSize: 12, fontWeight: '700' },
});