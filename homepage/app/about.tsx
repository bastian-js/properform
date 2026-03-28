import { View, Text, StyleSheet, Image, ScrollView, useWindowDimensions } from "react-native";
import { useTheme } from "./ThemeContext";

export default function About() {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const { theme } = useTheme();

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.contentContainer}>
            <View style={styles.header}>
                <View style={[styles.badge, { backgroundColor: theme.badgeBg }]}>
                    <Text style={[styles.badgeText, { color: theme.badgeText }]}>Das Team hinter ProPerform</Text>
                </View>
                <Text style={[styles.title, { color: theme.text }]}>Über uns</Text>
            </View>

            <View style={[styles.missionBox, { backgroundColor: theme.accentBox }]}>
                <Text style={styles.missionTitle}>Unsere Mission</Text>
                <Text style={styles.missionText}>
                    ProPerform wurde entwickelt, um Training einfacher, strukturierter und nachvollziehbarer zu machen.
                    Unser Ziel ist es, eine Plattform zu schaffen, die Athleten und Trainer verbindet und echten Fortschritt sichtbar macht.
                </Text>
            </View>

            <View style={[styles.teamGrid, { flexDirection: isMobile ? 'column' : 'row' }]}>
                <TeamMemberCard name="Can" role="Backend Developer" imageSource={require("../assets/images/can.png")} isMobile={isMobile} theme={theme} />
                <TeamMemberCard name="Basti" role="Frontend Developer" imageSource={require("../assets/images/basti.png")} isMobile={isMobile} theme={theme} />
                <TeamMemberCard name="Ljubo" role="Web Developer" imageSource={require("../assets/images/ljubo.png")} isMobile={isMobile} theme={theme} />
            </View>

            <View style={styles.spacer} />
        </ScrollView>
    );
}

function TeamMemberCard({ name, role, imageSource, isMobile, theme }: any) {
    return (
        <View style={[styles.memberCard, { backgroundColor: theme.card, width: isMobile ? '100%' : '31%' }]}>
            <View style={[styles.imageContainer, { backgroundColor: theme.inputBg }]}>
                <Image source={imageSource} style={styles.image} resizeMode="contain" />
            </View>
            <View style={[styles.infoContainer, { backgroundColor: theme.card }]}>
                <Text style={[styles.name, { color: theme.text }]}>{name}</Text>
                <Text style={[styles.role, { color: theme.subText }]}>{role}</Text>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    contentContainer: {
        alignItems: "center",
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
    },
    missionBox: {
        borderRadius: 30,
        padding: 50,
        width: '100%',
        maxWidth: 1000,
        alignItems: "center",
        marginBottom: 60,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 5,
    },
    missionTitle: {
        color: "white",
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 16,
    },
    missionText: {
        color: "rgba(255,255,255,0.9)",
        textAlign: "center",
        fontSize: 18,
        lineHeight: 28,
        maxWidth: 800,
    },
    teamGrid: {
        width: '100%',
        maxWidth: 1100,
        justifyContent: "space-between",
        gap: 24,
    },
    memberCard: {
        borderRadius: 30,
        overflow: 'hidden',
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.06,
        shadowRadius: 15,
        elevation: 3,
    },
    imageContainer: {
        height: 380,
        width: '100%',
        justifyContent: "flex-end",
        alignItems: "center",
        paddingTop: 30,
    },
    image: {
        height: '100%',
        width: '100%',
    },
    infoContainer: {
        paddingVertical: 24,
        alignItems: 'center',
        width: '100%',
    },
    name: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 6,
    },
    role: {
        fontSize: 16,
        fontWeight: "500",
    },
    spacer: {
        height: 100,
    },
});