import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView, useWindowDimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from './ThemeContext';

export default function Home() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const { theme } = useTheme();

  return (
      <ScrollView style={[styles.mainContainer, { backgroundColor: theme.bg }]} contentContainerStyle={styles.contentContainer}>
        <View style={[styles.heroSection, { flexDirection: isMobile ? 'column' : 'row' }]}>
          <View style={[styles.heroText, isMobile && styles.centerContent]}>
            <View style={[styles.badge, { backgroundColor: theme.badgeBg }]}>
              <Text style={[styles.badgeText, { color: theme.badgeText }]}>ProPerform App</Text>
            </View>
            <Text style={[styles.mainTitle, { color: theme.text }, isMobile && styles.textCenter]}>
              Werde stärker.{"\n"}Trainiere smarter.
            </Text>
            <Text style={[styles.subText, { color: theme.subText }, isMobile && styles.textCenter]}>
              Die All-in-One Plattform für Athleten und Trainer. Optimiere dein Training mit maßgeschneiderten Plänen und Live-Tracking.
            </Text>
            <TouchableOpacity style={styles.primaryButton} onPress={() => router.push('/download' as any)}>
              <Text style={styles.primaryButtonText}>Jetzt herunterladen</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.heroImages}>
            <Image source={require('../assets/images/phone-pro.png')} style={[styles.heroImgMain, isMobile && styles.mobileImg]} resizeMode="contain" />
          </View>
        </View>

        <View style={[styles.quickFeaturesGrid, { flexDirection: isMobile ? 'column' : 'row' }]}>
          <FeatureCard title="Individuelle Pläne" icon="🏋️" desc="Passe jedes Workout auf deine Ziele an." isMobile={isMobile} theme={theme} />
          <FeatureCard title="Live Tracking" icon="📈" desc="Erfasse Sets und Reps in Echtzeit." isMobile={isMobile} theme={theme} />
          <FeatureCard title="Trainer-Link" icon="🤝" desc="Verbinde dich für direktes Feedback." isMobile={isMobile} theme={theme} />
        </View>

        <View style={styles.testimonialSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>Was unsere Nutzer sagen</Text>
          <View style={[styles.testimonialGrid, { flexDirection: isMobile ? 'column' : 'row' }]}>
            <TestimonialCard text="Als Trainer habe ich endlich einen perfekten Überblick über alle meine Athleten." theme={theme} />
            <TestimonialCard text="Ich sehe genau meine Schwächen und Fortschritte. Das Tracking ist genial einfach." theme={theme} />
          </View>
        </View>

        <View style={styles.spacer} />
      </ScrollView>
  );
}

function FeatureCard({ title, icon, desc, isMobile, theme }: any) {
  return (
      <View style={[styles.featureCard, { backgroundColor: theme.card, width: isMobile ? '100%' : '31%' }]}>
        <Text style={styles.featureIcon}>{icon}</Text>
        <Text style={[styles.featureTitle, { color: theme.text }]}>{title}</Text>
        <Text style={[styles.featureDesc, { color: theme.subText }]}>{desc}</Text>
      </View>
  );
}

function TestimonialCard({ text, theme }: any) {
  return (
      <View style={[styles.testimonialCard, { backgroundColor: theme.accentBox }]}>
        <Image source={require('../assets/images/profile.png')} style={styles.testimonialImg} />
        <Text style={styles.testimonialText}>"{text}"</Text>
      </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  contentContainer: {
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroSection: {
    width: '100%',
    maxWidth: 1100,
    paddingVertical: 80,
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 40,
  },
  heroText: {
    flex: 1,
    alignItems: 'flex-start',
  },
  centerContent: {
    alignItems: 'center',
    textAlign: 'center',
  },
  badge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 20,
  },
  badgeText: {
    fontWeight: "bold",
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: 'bold',
    lineHeight: 56,
    marginBottom: 20,
  },
  textCenter: {
    textAlign: 'center',
  },
  subText: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 32,
    maxWidth: 500,
  },
  primaryButton: {
    backgroundColor: '#F97316',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    shadowColor: "#F97316",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 4,
  },
  primaryButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  heroImages: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImgMain: {
    width: 300,
    height: 500,
    borderRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  mobileImg: {
    width: 250,
    height: 450,
  },
  quickFeaturesGrid: {
    width: '100%',
    maxWidth: 1100,
    justifyContent: 'space-between',
    gap: 20,
    marginBottom: 80,
  },
  featureCard: {
    padding: 30,
    borderRadius: 24,
    alignItems: 'center',
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  featureDesc: {
    textAlign: 'center',
    lineHeight: 22,
  },
  testimonialSection: {
    width: '100%',
    maxWidth: 1100,
    alignItems: 'center',
    marginBottom: 60,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    textAlign: 'center',
  },
  testimonialGrid: {
    width: '100%',
    gap: 20,
    justifyContent: 'center',
  },
  testimonialCard: {
    flex: 1,
    padding: 30,
    borderRadius: 24,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 20,
  },
  testimonialImg: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  testimonialText: {
    flex: 1,
    color: 'white',
    fontSize: 16,
    fontStyle: 'italic',
    lineHeight: 24,
  },
  spacer: {
    height: 80,
  },
});