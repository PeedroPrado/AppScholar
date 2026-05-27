import React, { useEffect, useState } from "react";
import { ScrollView, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { theme } from "../styles/theme";
import { getStudents } from "../services/studentService";
import { getSubjects } from "../services/subjectService";
import { createGrade } from "../services/gradeService";

export function GradeFormScreen() {

  const [students, setStudents] =
    useState<any[]>([]);

  const [subjects, setSubjects] =
    useState<any[]>([]);

  const [studentId, setStudentId] =
    useState<number | null>(null);

  const [subjectId, setSubjectId] =
    useState<number | null>(null);

  const [nota1, setNota1] =
    useState("");

  const [nota2, setNota2] =
    useState("");

  const [loading, setLoading] =
    useState(false);

  useEffect(() => {

    async function loadData() {

      try {

        const studentsData =
          await getStudents();

        const subjectsData =
          await getSubjects();

        setStudents(studentsData);

        setSubjects(subjectsData);

      } catch (error) {

        console.log(error);
      }
    }

    loadData();

  }, []);

  async function handleSubmit() {

    if (

      studentId === null ||

      subjectId === null ||

      !nota1 ||

      !nota2

    ) {

      Alert.alert(
        "Erro",
        "Preencha todos os campos"
      );

      return;
    }

    try {

      setLoading(true);

      await createGrade({

        alunoId: studentId,

        disciplinaId: subjectId,

        nota1: Number(nota1),

        nota2: Number(nota2),
      });

      Alert.alert(
        "Sucesso 🎓",
        "Nota cadastrada!"
      );

      setStudentId(null);

      setSubjectId(null);

      setNota1("");

      setNota2("");

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Erro",
        "Não foi possível cadastrar nota"
      );

    } finally {

      setLoading(false);
    }
  }

  const selectedStudent =
  students.find(
    student =>
      student.id === studentId
  );

const filteredSubjects =
  selectedStudent

    ? subjects.filter(
        subject =>
          Number(subject.semestre) ===
          Number(selectedStudent.semestre)
      )

    : [];

  return (

    <ScrollView
      style={styles.container}
      contentContainerStyle={{
        padding: theme.spacing.md
      }}
    >

      <Text style={styles.title}>
        Cadastro de Notas
      </Text>

      <Text style={styles.label}>
        Aluno
      </Text>

      {students.map(student => (

        <TouchableOpacity
          key={student.id}
          style={[
            styles.option,

            studentId === student.id &&
            styles.optionSelected
          ]}
          onPress={() =>
            setStudentId(student.id)
          }
        >

          <Text
            style={{
              fontWeight:
                studentId === student.id
                  ? "700"
                  : "400"
            }}
          >
            {student.nome}
          </Text>

        </TouchableOpacity>
      ))}

      <Text style={styles.label}>
        Disciplina
      </Text>

      {filteredSubjects.map(subject => (

        <TouchableOpacity
          key={subject.id}
          style={[
            styles.option,

            subjectId === subject.id &&
            styles.optionSelected
          ]}
          onPress={() =>
            setSubjectId(subject.id)
          }
        >

          <Text>
            {subject.nome}
          </Text>

        </TouchableOpacity>
      ))}

      <Input
        label="Nota 1"
        value={nota1}
        onChangeText={setNota1}
        keyboardType="numeric"
      />

      <Input
        label="Nota 2"
        value={nota2}
        onChangeText={setNota2}
        keyboardType="numeric"
      />

      <Button
        title="Cadastrar Nota"
        onPress={handleSubmit}
        loading={loading}
      />

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor:
      theme.colors.background
  },

  title: {
    fontSize:
      theme.fontSize.xl,
    fontWeight: "700",
    marginBottom: 20,
    color: theme.colors.text,
  },

  label: {
    fontWeight: "700",
    marginTop: 16,
    marginBottom: 8,
    color: theme.colors.text,
  },

  option: {
    backgroundColor:
      theme.colors.surface,
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },

  optionSelected: {
    borderWidth: 2,
    borderColor:
      theme.colors.primary,
  },
});