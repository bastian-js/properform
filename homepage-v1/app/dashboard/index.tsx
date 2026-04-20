import { useState, useEffect } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Modal,
  ActivityIndicator,
} from "react-native";
import { useTheme } from "../ThemeContext";

const API_BASE_URL = "https://api.properform.app";

export default function Dashboard() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const router = useRouter();

  const { isDarkMode, toggleTheme, theme } = useTheme();

  const [athletes, setAthletes] = useState([
    { uid: "1", firstname: "Max", email: "Profi • Mustermann" },
    { uid: "2", firstname: "Anna", email: "Fortgeschritten • Schmidt" },
    { uid: "3", firstname: "Lukas", email: "Anfänger • Weber" },
  ]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [videos, setVideos] = useState<any[]>([
    { id: "v1", name: "🏀 Basic Dribbling Tutorial.mp4" },
  ]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeModal, setActiveModal] = useState<
    "exercise" | "videoManager" | "videoUpload" | "videoAssign" | "kick" | null
  >(null);
  const [selectedAthlete, setSelectedAthlete] = useState<any>(null);
  const [selectedVideo, setSelectedVideo] = useState<any>(null);
  const [selectedAthleteIds, setSelectedAthleteIds] = useState<string[]>([]);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("trainerToken");
    if (!token) {
      router.replace("/login");
      return;
    }
    fetchExercises(token);
  }, []);

  const fetchExercises = async (token: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/exercises?limit=100`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setExercises(data?.exercises || []);
    } catch (error) {
      console.error("Fehler:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    router.replace("/login");
  };

  const confirmKick = () => {
    setAthletes(athletes.filter((a) => a.uid !== selectedAthlete.uid));
    alert(`${selectedAthlete.firstname} wurde entfernt!`);
    setActiveModal(null);
  };

  const pickFile = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "video/mp4, video/webm, video/avi";
    input.onchange = (e: any) => {
      if (e.target.files?.[0]) setSelectedFile(e.target.files[0]);
    };
    input.click();
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Wähle ein Video aus!");
    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      await fetch(`${API_BASE_URL}/media`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("trainerToken")}`,
        },
        body: formData,
      });
      setVideos([
        { id: Math.random().toString(), name: `🎥 ${selectedFile.name}` },
        ...videos,
      ]);
      alert("Video hochgeladen!");
    } catch (error) {
      setVideos([
        { id: Math.random().toString(), name: `🎥 ${selectedFile.name}` },
        ...videos,
      ]);
      alert("Netzwerkfehler: Video lokal hinzugefügt.");
    } finally {
      setIsUploading(false);
      setSelectedFile(null);
      setActiveModal("videoManager");
    }
  };

  const toggleAthleteSelection = (uid: string) => {
    if (selectedAthleteIds.includes(uid))
      setSelectedAthleteIds(selectedAthleteIds.filter((id) => id !== uid));
    else setSelectedAthleteIds([...selectedAthleteIds, uid]);
  };

  const assignVideoToAthletes = () => {
    if (selectedAthleteIds.length === 0)
      return alert("Bitte Athleten auswählen!");
    alert(`Video gesendet!`);
    setSelectedAthleteIds([]);
    setActiveModal("videoManager");
  };

  if (isLoading) {
    return (
      <View
        style={[
          styles.mainContainer,
          {
            backgroundColor: theme.bg,
            justifyContent: "center",
            alignItems: "center",
          },
        ]}
      >
        <ActivityIndicator size="large" color="#F97316" />
      </View>
    );
  }

  return (
    <View style={[styles.mainContainer, { backgroundColor: theme.bg }]}>
      <View
        style={[
          styles.navBar,
          { backgroundColor: theme.nav, borderBottomColor: theme.border },
        ]}
      >
        <Text style={[styles.brand, { color: theme.text }]}>
          ProPerform <Text style={styles.brandAdmin}>Admin</Text>
        </Text>

        <View style={styles.navActions}>
          <TouchableOpacity
            onPress={toggleTheme}
            style={[styles.themeToggle, { backgroundColor: theme.btnGray }]}
          >
            <Text style={{ fontSize: 16 }}>{isDarkMode ? "☀️" : "🌙"}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
            <Text style={styles.logoutText}>Logout</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View
          style={[
            styles.heroSection,
            isMobile && { flexDirection: "column", alignItems: "center" },
          ]}
        >
          <View style={[styles.heroText, isMobile && { alignItems: "center" }]}>
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Trainer Dashboard</Text>
            </View>
            <Text
              style={[
                styles.mainTitle,
                { color: theme.text },
                isMobile && { textAlign: "center" },
              ]}
            >
              Willkommen zurück
            </Text>
            <Text
              style={[
                styles.subText,
                { color: theme.subText },
                isMobile && { textAlign: "center" },
              ]}
            >
              Hier verwaltest du deine Athleten, weist Übungen zu und
              organisierst deine Videobibliothek.
            </Text>

            <View style={{ flexDirection: "row", gap: 15 }}>
              <TouchableOpacity
                style={styles.primaryButton}
                onPress={() => setActiveModal("videoManager")}
              >
                <Text style={styles.primaryButtonText}>
                  🎥 Videos verwalten
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={[
              styles.quickFeaturesGrid,
              isMobile && { flexDirection: "column" },
            ]}
          >
            <View
              style={[
                styles.featureCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Text style={styles.featureIcon}>📋</Text>
              <Text style={[styles.featureTitle, { color: theme.text }]}>
                {exercises.length}
              </Text>
              <Text style={[styles.featureDesc, { color: theme.subText }]}>
                Übungen
              </Text>
            </View>
            <View
              style={[
                styles.featureCard,
                { backgroundColor: theme.card, borderColor: theme.border },
              ]}
            >
              <Text style={styles.featureIcon}>🎥</Text>
              <Text style={[styles.featureTitle, { color: theme.text }]}>
                {videos.length}
              </Text>
              <Text style={[styles.featureDesc, { color: theme.subText }]}>
                Videos
              </Text>
            </View>
          </View>
        </View>

        <View style={styles.testimonialSection}>
          <Text style={[styles.sectionTitle, { color: theme.text }]}>
            Deine Athleten
          </Text>

          <View
            style={[
              styles.testimonialGrid,
              { flexDirection: isMobile ? "column" : "row", flexWrap: "wrap" },
            ]}
          >
            {athletes.map((athlete) => (
              <View
                key={athlete.uid}
                style={[
                  styles.testimonialCard,
                  {
                    backgroundColor: theme.athleteCard,
                    minWidth: isMobile ? "100%" : 300,
                  },
                ]}
              >
                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>{athlete.firstname[0]}</Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      styles.athleteName,
                      { color: theme.athleteTextMain },
                    ]}
                  >
                    {athlete.firstname}
                  </Text>
                  <Text
                    style={[
                      styles.athleteEmail,
                      { color: theme.athleteTextSub },
                    ]}
                  >
                    {athlete.email}
                  </Text>

                  <View style={styles.actionRow}>
                    <TouchableOpacity
                      style={[
                        styles.actionBtnLight,
                        { backgroundColor: theme.card },
                      ]}
                      onPress={() => {
                        setSelectedAthlete(athlete);
                        setActiveModal("exercise");
                      }}
                    >
                      <Text
                        style={[
                          styles.actionBtnTextDark,
                          { color: theme.text },
                        ]}
                      >
                        + Übung
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.actionBtnDanger}
                      onPress={() => {
                        setSelectedAthlete(athlete);
                        setActiveModal("kick");
                      }}
                    >
                      <Text style={styles.actionBtnTextDanger}>Entfernen</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={activeModal === "exercise"}
        transparent
        animationType="slide"
      >
        <View
          style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalHeader, { color: theme.text }]}>
              Übung für {selectedAthlete?.firstname}
            </Text>
            <Text style={[styles.modalSub, { color: theme.subText }]}>
              Wähle eine Übung aus der Datenbank:
            </Text>

            <ScrollView style={{ maxHeight: 250, marginVertical: 15 }}>
              {exercises.length === 0 ? (
                <Text style={[styles.modalSub, { color: theme.subText }]}>
                  Keine Übungen im Backend gefunden.
                </Text>
              ) : null}
              {exercises.map((exercise) => (
                <TouchableOpacity
                  key={exercise.eid}
                  style={[
                    styles.planOption,
                    { backgroundColor: theme.bg, borderColor: theme.border },
                  ]}
                  onPress={() => {
                    alert(`Übung zugewiesen!`);
                    setActiveModal(null);
                  }}
                >
                  <Text style={[styles.planTitle, { color: theme.text }]}>
                    ⚡ {exercise.name}
                  </Text>
                  <Text style={[styles.planDesc, { color: theme.subText }]}>
                    {exercise.duration_minutes
                      ? `${exercise.duration_minutes} Min.`
                      : "Tippen zum Auswählen"}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.btnGray }]}
              onPress={() => setActiveModal(null)}
            >
              <Text
                style={[styles.primaryButtonText, { color: theme.btnGrayText }]}
              >
                Abbrechen
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        visible={activeModal === "videoManager"}
        transparent
        animationType="fade"
      >
        <View
          style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalHeader, { color: theme.text }]}>
              Deine Videobibliothek
            </Text>
            <Text style={[styles.modalSub, { color: theme.subText }]}>
              Wähle ein Video, um es Athleten zuzuweisen.
            </Text>

            <TouchableOpacity
              style={[styles.primaryButton, { marginBottom: 15 }]}
              onPress={() => setActiveModal("videoUpload")}
            >
              <Text style={styles.primaryButtonText}>
                + Neues Video hochladen
              </Text>
            </TouchableOpacity>

            <ScrollView style={{ maxHeight: 250 }}>
              {videos.map((video) => (
                <TouchableOpacity
                  key={video.id}
                  style={[
                    styles.planOption,
                    { backgroundColor: theme.bg, borderColor: theme.border },
                  ]}
                  onPress={() => {
                    setSelectedVideo(video);
                    setSelectedAthleteIds([]);
                    setActiveModal("videoAssign");
                  }}
                >
                  <Text style={[styles.planTitle, { color: theme.text }]}>
                    {video.name}
                  </Text>
                  <Text style={[styles.planDesc, { color: theme.subText }]}>
                    Tippen zum Zuweisen ➡️
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <TouchableOpacity
              style={[styles.closeButton, { backgroundColor: theme.btnGray }]}
              onPress={() => setActiveModal(null)}
            >
              <Text
                style={[styles.primaryButtonText, { color: theme.btnGrayText }]}
              >
                Schließen
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* MODAL 3: VIDEO HOCHLADEN */}
      <Modal
        visible={activeModal === "videoUpload"}
        transparent
        animationType="slide"
      >
        <View
          style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalHeader, { color: theme.text }]}>
              Neues Video hochladen
            </Text>

            <TouchableOpacity
              style={[
                styles.uploadBox,
                { backgroundColor: theme.bg, borderColor: theme.border },
              ]}
              onPress={pickFile}
            >
              <Text style={[styles.uploadBoxText, { color: theme.text }]}>
                {selectedFile
                  ? `✅ ${selectedFile.name}`
                  : "⬆️ Datei auswählen (MP4, AVI...)"}
              </Text>
            </TouchableOpacity>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
              <TouchableOpacity
                style={[
                  styles.closeButton,
                  { flex: 1, backgroundColor: theme.btnGray },
                ]}
                onPress={() => setActiveModal("videoManager")}
              >
                <Text
                  style={[
                    styles.primaryButtonText,
                    { color: theme.btnGrayText },
                  ]}
                >
                  Zurück
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.closeButton,
                  { flex: 1, backgroundColor: "#F97316" },
                  isUploading && { opacity: 0.5 },
                ]}
                onPress={handleUpload}
                disabled={isUploading}
              >
                <Text style={[styles.primaryButtonText, { color: "white" }]}>
                  {isUploading ? "Lädt..." : "Hochladen"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal
        visible={activeModal === "videoAssign"}
        transparent
        animationType="slide"
      >
        <View
          style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalHeader, { color: theme.text }]}>
              Video verteilen
            </Text>
            <Text
              style={[
                styles.modalSub,
                { color: "#F97316", fontWeight: "bold" },
              ]}
            >
              {selectedVideo?.name}
            </Text>

            <ScrollView style={{ maxHeight: 250, marginVertical: 10 }}>
              {athletes.map((athlete) => {
                const isSelected = selectedAthleteIds.includes(athlete.uid);
                return (
                  <TouchableOpacity
                    key={athlete.uid}
                    style={[
                      styles.planOption,
                      {
                        backgroundColor: theme.bg,
                        borderColor: isSelected ? "#F97316" : theme.border,
                      },
                    ]}
                    onPress={() => toggleAthleteSelection(athlete.uid)}
                  >
                    <Text
                      style={[
                        styles.planTitle,
                        { color: isSelected ? "#F97316" : theme.text },
                      ]}
                    >
                      {isSelected ? "✅ " : "⬜ "} {athlete.firstname}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 10 }}>
              <TouchableOpacity
                style={[
                  styles.closeButton,
                  { flex: 1, backgroundColor: theme.btnGray },
                ]}
                onPress={() => setActiveModal("videoManager")}
              >
                <Text
                  style={[
                    styles.primaryButtonText,
                    { color: theme.btnGrayText },
                  ]}
                >
                  Zurück
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.closeButton,
                  { flex: 1, backgroundColor: "#1E3A8A" },
                ]}
                onPress={assignVideoToAthletes}
              >
                <Text style={[styles.primaryButtonText, { color: "white" }]}>
                  Senden
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal visible={activeModal === "kick"} transparent animationType="fade">
        <View
          style={[styles.modalOverlay, { backgroundColor: theme.modalOverlay }]}
        >
          <View style={[styles.modalContent, { backgroundColor: theme.card }]}>
            <Text style={[styles.modalHeader, { color: theme.text }]}>
              Athlet entfernen
            </Text>
            <Text style={[styles.modalSub, { color: theme.subText }]}>
              Bist du sicher, dass du {selectedAthlete?.firstname} aus deinem
              Team werfen möchtest?
            </Text>

            <View style={{ flexDirection: "row", gap: 10, marginTop: 20 }}>
              <TouchableOpacity
                style={[
                  styles.closeButton,
                  { flex: 1, backgroundColor: theme.btnGray },
                ]}
                onPress={() => setActiveModal(null)}
              >
                <Text
                  style={[
                    styles.primaryButtonText,
                    { color: theme.btnGrayText },
                  ]}
                >
                  Abbrechen
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.closeButton,
                  { flex: 1, backgroundColor: "#EF4444" },
                ]}
                onPress={confirmKick}
              >
                <Text style={[styles.primaryButtonText, { color: "white" }]}>
                  Ja, entfernen
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  actionBtnDanger: {
    backgroundColor: "rgba(239, 68, 68, 0.2)",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  actionBtnLight: {
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  actionBtnTextDanger: {
    color: "#FCA5A5",
    fontSize: 12,
    fontWeight: "bold",
  },
  actionBtnTextDark: {
    fontSize: 12,
    fontWeight: "bold",
  },
  actionRow: {
    flexDirection: "row",
    gap: 10,
  },
  athleteEmail: {
    fontSize: 14,
    marginBottom: 12,
  },
  athleteName: {
    fontSize: 18,
    fontWeight: "bold",
  },
  avatar: {
    alignItems: "center",
    backgroundColor: "#F97316",
    borderRadius: 30,
    height: 60,
    justifyContent: "center",
    width: 60,
  },
  avatarText: {
    color: "white",
    fontSize: 24,
    fontWeight: "bold",
  },
  badge: {
    backgroundColor: "rgba(30,58,138,0.1)",
    borderRadius: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  badgeText: {
    color: "#1E3A8A",
    fontWeight: "bold",
  },
  brand: {
    fontSize: 22,
    fontWeight: "bold",
  },
  brandAdmin: {
    color: "#F97316",
  },
  closeButton: {
    alignItems: "center",
    borderRadius: 20,
    marginTop: 10,
    padding: 16,
  },
  contentContainer: {
    alignItems: "center",
    paddingBottom: 60,
    paddingHorizontal: 20,
  },
  featureCard: {
    alignItems: "center",
    borderRadius: 24,
    borderWidth: 1,
    minWidth: 160,
    padding: 30,
  },
  featureDesc: {
    fontWeight: "500",
    textAlign: "center",
  },
  featureIcon: {
    fontSize: 40,
    marginBottom: 16,
  },
  featureTitle: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 5,
    textAlign: "center",
  },
  heroSection: {
    flexDirection: "row",
    gap: 40,
    justifyContent: "space-between",
    maxWidth: 1100,
    paddingVertical: 80,
    width: "100%",
  },
  heroText: {
    alignItems: "flex-start",
    flex: 1,
  },
  logoutBtn: {
    backgroundColor: "rgba(239, 68, 68, 0.1)",
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 8,
  },
  logoutText: {
    color: "#EF4444",
    fontWeight: "bold",
  },
  mainContainer: {
    flex: 1,
  },
  mainTitle: {
    fontSize: 48,
    fontWeight: "bold",
    lineHeight: 56,
    marginBottom: 20,
  },
  modalContent: {
    borderRadius: 24,
    maxWidth: 450,
    padding: 30,
    width: "90%",
  },
  modalHeader: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 5,
  },
  modalOverlay: {
    alignItems: "center",
    flex: 1,
    justifyContent: "center",
  },
  modalSub: {
    fontSize: 14,
    marginBottom: 15,
  },
  navActions: {
    alignItems: "center",
    flexDirection: "row",
    gap: 15,
  },
  navBar: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    height: 70,
    justifyContent: "space-between",
    paddingHorizontal: 25,
  },
  planDesc: {
    fontSize: 13,
    marginTop: 4,
  },
  planOption: {
    borderRadius: 15,
    borderWidth: 2,
    marginBottom: 10,
    padding: 16,
  },
  planTitle: {
    fontSize: 16,
    fontWeight: "bold",
  },
  primaryButton: {
    backgroundColor: "#F97316",
    borderRadius: 30,
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  quickFeaturesGrid: {
    flexDirection: "row",
    gap: 20,
  },
  sectionTitle: {
    fontSize: 32,
    fontWeight: "bold",
    marginBottom: 40,
    textAlign: "center",
  },
  subText: {
    fontSize: 18,
    lineHeight: 28,
    marginBottom: 32,
    maxWidth: 500,
  },
  testimonialCard: {
    alignItems: "center",
    borderRadius: 24,
    flex: 1,
    flexDirection: "row",
    gap: 20,
    padding: 30,
  },
  testimonialGrid: {
    gap: 20,
    justifyContent: "flex-start",
    width: "100%",
  },
  testimonialSection: {
    alignItems: "center",
    marginBottom: 60,
    maxWidth: 1100,
    width: "100%",
  },
  themeToggle: {
    borderRadius: 20,
    padding: 8,
  },
  uploadBox: {
    alignItems: "center",
    borderRadius: 20,
    borderStyle: "dashed",
    borderWidth: 2,
    padding: 40,
  },
  uploadBoxText: {
    fontWeight: "bold",
    textAlign: "center",
  },
});
