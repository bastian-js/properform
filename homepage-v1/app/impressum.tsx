import { ScrollView, Text, StyleSheet, Linking } from "react-native";
import { useTheme } from "./ThemeContext";

export default function Impressum() {
    const { theme } = useTheme();

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.content}>
            <Text style={[styles.title, { color: theme.text }]}>Impressum</Text>
            <Text style={[styles.text, { color: theme.text }]}>Informationen und Offenlegung gemäß §5 (1) ECG, § 25 MedienG, § 63 GewO und § 14 UGB</Text>
            <Text style={[styles.text, { color: theme.text }]}><Text style={styles.bold}>Webseitenbetreiber:</Text> Bastian Brugger</Text>
            <Text style={[styles.text, { color: theme.text }]}><Text style={styles.bold}>Anschrift:</Text> Karl-Vogt-Straße 21, 5700 Zell am See</Text>
            <Text style={[styles.text, { color: theme.text }]}><Text style={styles.bold}>Kontaktdaten:</Text></Text>
            <Text style={[styles.text, { color: theme.text }]}>Email: contact@properform.app</Text>
            <Text style={[styles.text, { color: theme.text }]}>
                <Text style={styles.bold}>Anwendbare Rechtsvorschrift:</Text>{" "}
                <Text style={[styles.link, { color: theme.badgeText }]} onPress={() => Linking.openURL("https://www.ris.bka.gv.at")}>www.ris.bka.gv.at</Text>
            </Text>
            <Text style={[styles.text, { color: theme.text }]}>
                <Text style={styles.bold}>Online Streitbeilegung:</Text>{" "}
                Verbraucher können Probleme über die Plattform lösen:{" "}
                <Text style={[styles.link, { color: theme.badgeText }]} onPress={() => Linking.openURL("https://ec.europa.eu/consumers/odr")}>https://ec.europa.eu/consumers/odr</Text>
            </Text>
            <Text style={[styles.text, { color: theme.text }]}><Text style={styles.bold}>Urheberrecht:</Text> Inhalte dieser Webseite sind geschützt.</Text>
            <Text style={[styles.text, { color: theme.text }]}><Text style={styles.bold}>Haftungsausschluss:</Text> Keine Haftung für externe Links.</Text>
            <Text style={[styles.text, { color: theme.text }]}>
                Quelle:{" "}
                <Text style={[styles.link, { color: theme.badgeText }]} onPress={() => Linking.openURL("https://fairesrecht.at/kostenlos-impressum-erstellen-generator.php")}>Impressum Generator</Text>{" "}
                in Kooperation mit{" "}
                <Text style={[styles.link, { color: theme.badgeText }]} onPress={() => Linking.openURL("https://rechtsanwaltwien.com/baurecht")}>Rechtsanwalt Baurecht Wien</Text>
            </Text>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    content: {
        padding: 40,
        maxWidth: 900,
        alignSelf: "center",
    },
    title: {
        fontSize: 36,
        fontWeight: "bold",
        marginBottom: 20,
    },
    text: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 12,
    },
    bold: {
        fontWeight: "bold",
    },
    link: {
        textDecorationLine: "underline",
    },
});