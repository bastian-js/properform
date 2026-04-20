import { View, Text, StyleSheet, Image, ScrollView, useWindowDimensions } from 'react-native';
import { useTheme } from './ThemeContext';

export default function Features() {
    const { width } = useWindowDimensions();
    const isMobile = width < 768;
    const { theme } = useTheme();

    return (
        <ScrollView style={[styles.container, { backgroundColor: theme.bg }]} contentContainerStyle={styles.contentContainer}>
            <View style={styles.hero}>
                <View style={[styles.badge, { backgroundColor: theme.badgeBg }]}>
                    <Text style={[styles.badgeText, { color: theme.badgeText }]}>Unsere Funktionen</Text>
                </View>
                <Text style={[styles.title, { color: theme.text }]}>Alles, was du für dein{"\n"}Training brauchst</Text>
                <Text style={[styles.subtitle, { color: theme.subText }]}>
                    ProPerform kombiniert smarte Trainingspläne mit präzisem Tracking, damit du dich voll auf deine Leistung konzentrieren kannst.
                </Text>
            </View>

            <FeatureModule isMobile={isMobile} title="Smarte Trainingspläne" description="Erstelle deine eigenen Trainingspläne." imageSource={require('../assets/images/feature1.jpeg')} imageSource2={require('../assets/images/feature4.jpeg')} reverse={false} theme={theme} />
            <FeatureModule isMobile={isMobile} title="Live Workout Tracking" description="Hake deine Sets live ab, verfolge deine Wiederholungen und behalte den Timer im Blick. Kein Papierkram mehr, nur noch reiner Fokus." imageSource={require('../assets/images/feature2.jpeg')} reverse={true} theme={theme} />
            <FeatureModule isMobile={isMobile} title="Erfolge & Streaks" description="Bleib motiviert! Verfolge deine wöchentlichen Ziele, sammle Streaks für aktive Tage und sieh deinen Fortschritt auf einen Blick." imageSource={require('../assets/images/feature3.jpeg')} reverse={false} theme={theme} />

            <View style={styles.spacer} />
        </ScrollView>
    );
}

function FeatureModule({ isMobile, title, description, imageSource, imageSource2, reverse, theme }: any) {
    return (
        <View style={[styles.moduleContainer, { backgroundColor: theme.card, flexDirection: isMobile ? 'column' : (reverse ? 'row-reverse' : 'row') }]}>
            <View style={[styles.textContainer, isMobile && styles.textContainerMobile]}>
                <Text style={[styles.moduleTitle, { color: theme.text }]}>{title}</Text>
                <Text style={[styles.moduleDescription, { color: theme.subText }]}>{description}</Text>
                <View style={styles.decorativeLine} />
            </View>
            <View style={[styles.imageContainer, isMobile && styles.imageContainerMobile]}>
                <Image source={imageSource} style={styles.featureImage} resizeMode="contain" />
                {imageSource2 && <Image source={imageSource2} style={[styles.featureImage, styles.imageOffset]} resizeMode="contain" />}
            </View>
        </View>
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
    hero: {
        alignItems: "center",
        paddingTop: 60,
        paddingBottom: 40,
        textAlign: 'center',
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
        fontSize: 36,
        fontWeight: "bold",
        textAlign: "center",
        lineHeight: 44,
        marginBottom: 16,
    },
    subtitle: {
        fontSize: 16,
        textAlign: "center",
        maxWidth: 600,
        lineHeight: 24,
    },
    moduleContainer: {
        borderRadius: 30,
        padding: 40,
        width: '100%',
        maxWidth: 1000,
        marginBottom: 40,
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 40,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 15,
        elevation: 2,
    },
    textContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-start',
    },
    textContainerMobile: {
        alignItems: 'center',
        textAlign: 'center',
    },
    moduleTitle: {
        fontSize: 28,
        fontWeight: "bold",
        marginBottom: 16,
    },
    moduleDescription: {
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 20,
        textAlign: 'left',
    },
    decorativeLine: {
        height: 4,
        width: 60,
        backgroundColor: "#F97316",
        borderRadius: 2,
    },
    imageContainer: {
        flex: 1,
        position: 'relative',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: 300,
    },
    imageContainerMobile: {
        width: '100%',
        minHeight: 250,
    },
    featureImage: {
        width: 250,
        height: 350,
        borderRadius: 20,
    },
    imageOffset: {
        position: 'absolute',
        top: 40,
        left: 40,
        zIndex: -1,
        opacity: 0.9,
    },
    spacer: {
        height: 80,
    },
});