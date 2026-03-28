import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from "react-native";
import { useRouter } from "expo-router";

export default function Footer() {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  return (
    <View style={styles.footerContainer}>
      <View
        style={[
          styles.contentWrapper,
          {
            flexDirection: isMobile ? "column" : "row",
            gap: isMobile ? 40 : 20,
          },
        ]}
      >
        <View
          style={[styles.brandColumn, { width: isMobile ? "100%" : "30%" }]}
        >
          <Text style={styles.brandName}>ProPerform</Text>
          <View style={styles.decorativeLine} />
          <Text style={styles.brandDescription}>
            Die All-in-One Plattform für Athleten und Trainer. Werde stärker,
            trainiere smarter und verfolge deinen Fortschritt.
          </Text>
        </View>

        {/* LINKS & NAVIGATION */}
        <View
          style={[
            styles.linksWrapper,
            {
              flexDirection: isMobile ? "column" : "row",
              width: isMobile ? "100%" : "65%",
            },
          ]}
        >
          <View style={styles.column}>
            <Text style={styles.title}>Entdecken</Text>
            <TouchableOpacity onPress={() => router.push("/")}>
              <Text style={styles.link}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/features")}>
              <Text style={styles.link}>Features</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/download")}>
              <Text style={styles.link}>Download</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => router.push("/about")}>
              <Text style={styles.link}>Über uns</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.column}>
            <Text style={styles.title}>Portal</Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.link}>Trainer Login</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.column}>
            <Text style={styles.title}>Rechtliches</Text>
            <TouchableOpacity onPress={() => router.push("/impressum")}>
              <Text style={styles.link}>Impressum</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.column}>
            <Text style={styles.title}>Kontakt</Text>
            <Text style={styles.textElement}>Karl-Vogt-Straße 21</Text>
            <Text style={styles.textElement}>5700 Zell am See</Text>
            <Text style={styles.textElement}>Österreich</Text>
            <Text style={styles.textElement}>contact@properform.app</Text>
          </View>
        </View>
      </View>

      <View style={styles.bottomBar}>
        <Text style={styles.copyrightText}>
          © {new Date().getFullYear()} ProPerform. Alle Rechte vorbehalten.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: "#0F172A",
    width: "100%",
    alignItems: "center",
    paddingTop: 60,
  },
  contentWrapper: {
    width: "100%",
    maxWidth: 1200,
    paddingHorizontal: 30,
    justifyContent: "space-between",
    paddingBottom: 40,
  },
  brandColumn: {
    alignItems: "flex-start",
  },
  brandName: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  decorativeLine: {
    height: 3,
    width: 40,
    backgroundColor: "#F97316",
    borderRadius: 2,
    marginBottom: 16,
  },
  brandDescription: {
    color: "#94A3B8",
    lineHeight: 24,
  },
  linksWrapper: {
    justifyContent: "space-between",
    gap: 30,
  },
  column: {
    flex: 1,
    minWidth: 120,
  },
  title: {
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
    fontSize: 18,
  },
  link: {
    color: "#94A3B8",
    marginBottom: 12,
    fontSize: 15,
    fontWeight: "500",
  },
  textElement: {
    color: "#94A3B8",
    marginBottom: 6,
    fontSize: 14,
    lineHeight: 20,
  },
  bottomBar: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.1)",
    paddingVertical: 20,
    alignItems: "center",
  },
  copyrightText: {
    color: "#64748B",
    fontSize: 14,
    textAlign: "center",
  },
});
