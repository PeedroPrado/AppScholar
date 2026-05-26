import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from "@react-navigation/native";
import { useAuth } from '../hooks/useAuth';
import { theme } from "../styles/theme";

type Perfil = 'admin' | 'estudante' | 'professor';

type MenuItem = {
  label: string;
  icon: string;
  route: string;
  perfis: Perfil[];
};

const menuItems = [
  {
    label: "Cadastrar Alunos",
    icon: "👨‍🎓",
    route: "StudentForm",
    perfis: ["admin"]
  },
  {
    label: "Lista de Alunos",
    icon: "📋",
    route: "StudentList",
    perfis: ["admin", "professor"]
  },
  {
    label: "Cadastrar Professores",
    icon: "👨‍🏫",
    route: "TeacherForm",
    perfis: ["admin"]
  },
  {
    label: "Lista de Professores",
    icon: "📋",
    route: "TeacherList",
    perfis: ["admin"]
  },
  {
    label: "Cadastrar Disciplinas",
    icon: "📚",
    route: "SubjectForm",
    perfis: ["admin"]
  },
  {
    label: "Boletim",
    icon: "📄",
    route: "Grades",
    perfis: ["estudante"]
  },
  {
    label: "Disciplinas",
    icon: "📚",
    route: "SubjectList",
    perfis: ["admin", "professor", "estudante"]
  }
];

export function DashboardScreen() {
    const { user, signOut } = useAuth();
    const navigation = useNavigation<any>();

    const roleLabel =
        user?.perfil === 'student'
            ? 'Aluno'
            : user?.perfil === 'teacher'
            ? 'Professor'
            : 'Administrador';

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 120 }}
    >
            <View style={styles.header}>
                <Text style={styles.greeting}>
                    Olá, {user?.nome} 👋
                </Text>

                <Text style={styles.role}>
                    {user?.email}
                </Text>

                <Text style={styles.role}>
                    Perfil: {roleLabel}
                </Text>
            </View>

            <Text style={styles.sectionTitle}>Menu Principal</Text>

        <View style={styles.grid}>
          {menuItems
            .filter(item =>
            item.perfis.includes(user!.perfil as Perfil)
          )
            .map((item) => (
              <TouchableOpacity
                key={item.route}
                style={styles.card}
                onPress={() => navigation.navigate(item.route)}
                activeOpacity={0.75}
              >
                <Text style={styles.icon}>{item.icon}</Text>
                <Text style={styles.cardLabel}>{item.label}</Text>
              </TouchableOpacity>
            ))}
        </View>

      <TouchableOpacity
        style={styles.logoutBtn}
        onPress={() => signOut()}
      >
        <Text style={styles.logoutText}>
          Sair do aplicativo
        </Text>
      </TouchableOpacity>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.background },
  header: {
    backgroundColor: theme.colors.primary,
    padding: theme.spacing.xl,
    paddingTop: theme.spacing.xl + 16,
  },
  greeting: { fontSize: theme.fontSize.xl, fontWeight: '700', color: '#fff' },
  role: { fontSize: theme.fontSize.sm, color: 'rgba(255,255,255,0.7)', marginTop: 4 },
  sectionTitle: {
    fontSize: theme.fontSize.lg, fontWeight: '700',
    color: theme.colors.text,
    margin: theme.spacing.lg,
    marginBottom: theme.spacing.sm,
  },
  grid: {
    flexDirection: 'row', flexWrap: 'wrap',
    paddingHorizontal: theme.spacing.md,
    gap: theme.spacing.md,
  },
  card: {
    width: '46%',
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    padding: theme.spacing.lg,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  icon: { fontSize: 36, marginBottom: theme.spacing.sm },
  cardLabel: { fontSize: theme.fontSize.sm, fontWeight: '600', color: theme.colors.text, textAlign: 'center' },
  logoutBtn: { margin: theme.spacing.xl, alignItems: 'center' },
  logoutText: { color: theme.colors.error, fontSize: theme.fontSize.md, fontWeight: '600' },
});