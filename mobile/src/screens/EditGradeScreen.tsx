import React, {
  useState
} from "react";

import {
  View,
  Text,
  StyleSheet,
  Alert
} from "react-native";

import {
  useRoute,
  useNavigation
} from "@react-navigation/native";

import { Input }
from "../components/Input";

import { Button }
from "../components/Button";

import { theme }
from "../styles/theme";

import {
  updateGrade
}
from "../services/gradeService";

export function EditGradeScreen() {

  const route = useRoute<any>();

  const navigation =
    useNavigation<any>();

  const { grade } =
    route.params;

  const [nota1, setNota1] =
    useState(
      String(grade.nota1)
    );

  const [nota2, setNota2] =
    useState(
      String(grade.nota2)
    );

  const [loading, setLoading] =
    useState(false);

  async function handleUpdate() {

    try {

      setLoading(true);

      await updateGrade(

        grade.id,

        {
          nota1:
            Number(nota1),

          nota2:
            Number(nota2),
        }
      );

      Alert.alert(
        "Sucesso",
        "Nota atualizada!"
      );

      navigation.goBack();

    } catch (error) {

      console.log(error);

      Alert.alert(
        "Erro",
        "Não foi possível atualizar"
      );

    } finally {

      setLoading(false);
    }
  }

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Editar Nota
      </Text>

      <Text style={styles.label}>
        {grade.aluno}
      </Text>

      <Text style={styles.label}>
        {grade.disciplina}
      </Text>

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
        title="Salvar"
        onPress={handleUpdate}
        loading={loading}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: theme.spacing.lg,
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
    marginBottom: 10,

    color: theme.colors.text,

    fontWeight: "600",
  },
});