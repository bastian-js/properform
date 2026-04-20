import { useState } from "react";
import { useRouter } from "expo-router";
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet,
  ActivityIndicator, useWindowDimensions
} from "react-native";
import { useTheme } from "./ThemeContext";

const API_BASE_URL = "https://api.properform.app";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { width } = useWindowDimensions();
  const { theme } = useTheme();

  const handleLogin = async () => {
    if (!email || !password) return alert("Bitte alles ausfüllen!");

    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/auth/trainers/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("trainerToken", data.token);
        localStorage.setItem("trainerId", data.tid.toString());

        setTimeout(() => {
          router.replace("/dashboard" as any);
        }, 10);
      } else {
        alert(data.message || "Login fehlgeschlagen");
      }
    } catch (error) {
      alert("Verbindung zum Server nicht möglich.");
    } finally {
      setLoading(false);
    }
  };

  return (
      <View style={[styles.mainContainer, { backgroundColor: theme.bg }]}>
        <View style={[styles.loginCard, { backgroundColor: theme.card, width: width > 500 ? 450 : '90%' }]}>
          <View style={[styles.badge, { backgroundColor: theme.badgeBg }]}>
            <Text style={[styles.badgeText, { color: theme.badgeText }]}>ProPerform Admin</Text>
          </View>

          <Text style={[styles.title, { color: theme.text }]}>Willkommen zurück</Text>
          <Text style={[styles.subText, { color: theme.subText }]}>Logge dich ein, um deine Athleten zu verwalten.</Text>

          <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text }]}
              placeholder="E-Mail Adresse"
              placeholderTextColor={theme.subText}
              value={email}
              onChangeText={setEmail}
          />

          <TextInput
              style={[styles.input, { backgroundColor: theme.inputBg, color: theme.text }]}
              placeholder="Passwort"
              placeholderTextColor={theme.subText}
              secureTextEntry
              value={password}
              onChangeText={setPassword}
          />

          <TouchableOpacity
              style={styles.primaryButton}
              onPress={handleLogin}
              disabled={loading}
          >
            {loading ? (
                <ActivityIndicator color="white" />
            ) : (
                <Text style={styles.buttonText}>Anmelden</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  badgeText: {
    fontWeight: "bold",
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  input: {
    borderRadius: 15,
    marginBottom: 15,
    padding: 16,
    width: '100%',
  },
  loginCard: {
    alignItems: 'center',
    borderRadius: 30,
    elevation: 5,
    padding: 40,
    shadowColor: "#1E3A8A",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  mainContainer: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
  },
  primaryButton: {
    alignItems: 'center',
    backgroundColor: '#F97316',
    borderRadius: 15,
    marginTop: 10,
    paddingVertical: 16,
    width: '100%',
  },
  subText: {
    fontSize: 16,
    marginBottom: 30,
    textAlign: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});