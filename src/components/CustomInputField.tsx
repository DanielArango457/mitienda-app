import { useState } from "react";
import { View, TextInput, StyleSheet, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CustomInputFieldProps } from "../types/components";

type Props = CustomInputFieldProps;

export function CustomInputField({
  placeholder,
  value,
  onChangeText,
  secureTextEntry,
  keyboardType,
}: Props) {
  const [hidePassword, setHidePassword] = useState(true);
  const isPassword = secureTextEntry;

  return (
    <View style={styles.container}>
      <TextInput
    style={styles.input}
    placeholder={placeholder}
    placeholderTextColor="#999"
    value={value}
    onChangeText={onChangeText}
    autoCapitalize="none"
    keyboardType={keyboardType}
    secureTextEntry={isPassword ? hidePassword : false}
  />

      {isPassword && (
        <Pressable onPress={() => setHidePassword(!hidePassword)} style={styles.icon}>
          <Ionicons name={hidePassword ? "eye-off" : "eye"} size={22} color="#666" />
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
    position: "relative",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    paddingRight: 40,
  },
  icon: {
  position: "absolute",
  right: 12,
  top: 12,
  width: 26,
  height: 26,
  alignItems: "center",
  justifyContent: "center",
},
});