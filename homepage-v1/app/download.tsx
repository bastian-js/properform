import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, Linking, useWindowDimensions } from "react-native";
import { useTheme } from "./ThemeContext";

export default function Download() {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const { theme } = useTheme();

    const openStore = () => {
        Linking.openURL("https://apps.apple.com");
    };

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
                <View style={[styles.badge, { backgroundColor: theme.badgeBg }]}>
                    <Text style={[styles.badgeText, { color: theme.badgeText }]}>Hol dir die App</Text>
                </View>
                <Text style={[styles.title, { color: theme.text }]}>Bereit für dein{"\n"}nächstes Level?</Text>
            </View>

            <View style={[styles.downloadCard, { backgroundColor: theme.card, flexDirection: isMobile ? 'column' : 'row' }]}>
                <View style={styles.imageWrapper}>
                    <Image source={require("../assets/images/phone-pro.png")} style={styles.phoneImage} resizeMode="contain" />
                </View>

                <View style={[styles.textArea, isMobile && styles.textCenter]}>
                    <Text style={[styles.headline, { color: theme.text }, isMobile && styles.textCenter]}>
                        ProPerform für iOS
                    </Text>
                    <Text style={[styles.description, { color: theme.subText }, isMobile && styles.textCenter]}>
                        Lade dir die App jetzt im App Store herunter und starte dein erstes strukturiertes Workout.
                    </Text>

                    <TouchableOpacity style={styles.button} onPress={openStore}>
                        <Text style={styles.buttonText}>Im App Store laden</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.spacer} />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    header: {
        alignItems: "center",
        paddingTop: 80,
        paddingBottom: 40,
    },
    badge: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 20,
        marginBottom: 16,
    },
    badgeText: {
        fontWeight: "bold",
        fontSize: 14,
    },
    title: {
        fontSize: 44,
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: 52,
    },
    downloadCard: {
        borderRadius: 40,
        padding: 40,
        width: '100%',
        maxWidth: 900,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        gap: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.05,
        shadowRadius: 20,
        elevation: 5,
    },
    imageWrapper: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    phoneImage: {
        width: 220,
        height: 440,
    },
    textArea: {
        flex: 1,
        alignItems: 'flex-start',
        justifyContent: 'center',
        maxWidth: 400,
    },
    textCenter: {
        alignItems: 'center',
        textAlign: 'center',
    },
    headline: {
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 16,
    },
    description: {
        fontSize: 18,
        lineHeight: 28,
        marginBottom: 32,
    },
    button: {
        backgroundColor: '#F97316',
        paddingHorizontal: 36,
        paddingVertical: 18,
        borderRadius: 30,
        shadowColor: "#F97316",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 10,
        elevation: 4,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 18,
    },
    spacer: {
        height: 100,
    },
});