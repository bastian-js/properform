import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { typography } from "@/src/theme/typography";
import { spacing } from "@/src/theme/spacing";
import { colors } from "@/src/theme/colors";
import SecondaryButton from "@/src/components/secondaryButton";
import api from "@/src/utils/axiosInstance";
import { useFocusEffect } from "expo-router";
import { MaterialIcons as Icon } from "@expo/vector-icons";

const getTodayString = () => new Date().toISOString().split("T")[0];

const getYesterdayString = () => {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().split("T")[0];
};

const getCurrentWeekDates = () => {
  const today = new Date();
  const day = today.getDay();
  const monday = new Date(today);
  monday.setDate(today.getDate() - (day === 0 ? 6 : day - 1));

  const dates: string[] = [];

  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    dates.push(d.toISOString().split("T")[0]);
  }

  return dates;
};

const getStreakLabel = (days: number) =>
  `${days} ${days === 1 ? "Tag" : "Tage"} aktiv`;

const formatWorkoutDuration = (totalSeconds: number) => {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  if (minutes === 0) {
    return `${seconds} Sek.`;
  }

  return `${minutes} min ${String(seconds).padStart(2, "0")} s`;
};

type LastWorkout = {
  name: string;
  duration: number;
  date: string;
};

export default function HomeScreen() {
  const [user, setUser] = useState<{
    firstname: string;
    profile_image_url: string | null;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [greeting, setGreeting] = useState("");
  const [streakDays, setStreakDays] = useState(0);
  const [completed, setCompleted] = useState<boolean[]>(Array(7).fill(false));
  const [lastWorkout, setLastWorkout] = useState<LastWorkout | null>(null);

  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await api.get("/users/me");
        setUser(response.data);
      } catch (err) {
        console.log("Fehler beim Laden der User-Daten:", err);
      } finally {
        setLoading(false);
      }
    };

    getUserData();
  }, []);

  const calculateGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Guten Morgen,";
    if (hour < 18) return "Guten Tag,";
    return "Guten Abend,";
  };

  const loadAndUpdateStreak = useCallback(async () => {
    const today = getTodayString();

    const lastVisit = await AsyncStorage.getItem("home_streak_last_visit");
    const storedStreak = await AsyncStorage.getItem("home_streak_current");
    const storedWeekVisits = await AsyncStorage.getItem(
      "home_streak_week_visits",
    );

    let current = storedStreak ? parseInt(storedStreak, 10) : 0;
    let weekVisits: string[] = storedWeekVisits
      ? JSON.parse(storedWeekVisits)
      : [];

    if (lastVisit === today) {
    } else if (lastVisit === getYesterdayString()) {
      current += 1;
    } else {
      current = 1;
    }

    if (!weekVisits.includes(today)) {
      weekVisits = [...weekVisits, today];
    }

    const weekDates = getCurrentWeekDates();
    weekVisits = weekVisits.filter((d) => weekDates.includes(d));

    await AsyncStorage.setItem("home_streak_last_visit", today);
    await AsyncStorage.setItem("home_streak_current", String(current));
    await AsyncStorage.setItem(
      "home_streak_week_visits",
      JSON.stringify(weekVisits),
    );

    setStreakDays(current);
    setCompleted(weekDates.map((d) => weekVisits.includes(d)));
  }, []);

  const loadLastWorkout = useCallback(async () => {
    const storedWorkout = await AsyncStorage.getItem("last_workout");

    if (!storedWorkout) {
      setLastWorkout(null);
      return;
    }

    setLastWorkout(JSON.parse(storedWorkout));
  }, []);

  useFocusEffect(
    useCallback(() => {
      setGreeting(calculateGreeting());
      void loadAndUpdateStreak();
      void loadLastWorkout();
    }, [loadAndUpdateStreak, loadLastWorkout]),
  );
  const days = ["M", "D", "M", "D", "F", "S", "S"];

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color={colors.primaryBlue} />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* top row (profile, greeting, name) */}
        <View style={styles.topRow}>
          <View style={styles.avatarIconWrap}>
            <Icon name="person" size={28} color={colors.primaryBlue} />
          </View>

          <View style={styles.greetingBlock}>
            <Text style={styles.goodMorning}>{greeting}</Text>
            <Text style={styles.hello}>{user?.firstname || "..."}</Text>
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.streakHeader}>
            <Text style={styles.streakTitle}>Besuch-Streak</Text>

            <View style={styles.streakRight}>
              <Text style={styles.fire}>🔥</Text>
              <Text style={styles.streakActive}>
                {getStreakLabel(streakDays)}
              </Text>
            </View>
          </View>

          <View style={styles.streakSquaresRow}>
            {completed.map((isOn, dayIndex) => (
              <View
                key={dayIndex}
                style={[
                  styles.streakSquare,
                  isOn ? styles.streakSquareOn : styles.streakSquareOff,
                ]}
              />
            ))}
          </View>

          <View style={styles.streakDaysRow}>
            {days.map((dayLabel, dayIndex) => (
              <Text key={dayIndex} style={styles.streakDayLabel}>
                {dayLabel}
              </Text>
            ))}
          </View>
        </View>

        <View style={styles.card}>
          <View style={styles.lastWorkoutHeader}>
            <Text style={styles.lastWorkoutTitle}>Letztes Workout</Text>
            {lastWorkout ? (
              <View style={styles.lastWorkoutBadge}>
                <Text style={styles.lastWorkoutBadgeText}>
                  {new Date(lastWorkout.date).toLocaleDateString("de-AT")}
                </Text>
              </View>
            ) : null}
          </View>

          {lastWorkout ? (
            <>
              <Text style={styles.lastWorkoutName}>{lastWorkout.name}</Text>
              <View style={styles.lastWorkoutInfoRow}>
                <View style={styles.lastWorkoutInfoCard}>
                  <Text style={styles.lastWorkoutInfoLabel}>Dauer</Text>
                  <Text style={styles.lastWorkoutInfoValue}>
                    {formatWorkoutDuration(lastWorkout.duration)}
                  </Text>
                </View>

                <View style={styles.lastWorkoutInfoCard}>
                  <Text style={styles.lastWorkoutInfoLabel}>Status</Text>
                  <Text style={styles.lastWorkoutInfoValue}>Abgeschlossen</Text>
                </View>
              </View>
            </>
          ) : (
            <>
              <Text style={styles.lastWorkoutName}>
                Noch kein Workout gespeichert
              </Text>
              <Text style={styles.lastWorkoutEmptyText}>
                Sobald du ein Training beendest, erscheint es hier.
              </Text>
            </>
          )}
        </View>

        {/* heutiges vorgeschlagenes training dummy */}
        <View style={styles.trainingCard}>
          {/* Deko Kreise */}
          <View style={styles.decoCircle1} />
          <View style={styles.decoCircle2} />

          <View style={styles.trainingTop}>
            <Text style={styles.trainingLabel}>HEUTIGES TRAINING</Text>

            <View style={styles.durationBadge}>
              <Text style={styles.durationIcon}>🕒</Text>
              <Text style={styles.durationText}>45 min.</Text>
            </View>
          </View>

          <Text style={styles.trainingMain}>Brust & Trizeps</Text>

          <View style={styles.trainingButtonWrap}>
            <SecondaryButton text="TRAINING STARTEN" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  scrollContent: {
    paddingHorizontal: spacing.screenPaddingHorizontal,
    paddingTop: spacing.screenPaddingTop,
    paddingBottom: spacing.xl,
  },

  // top row (profile, greeting, name)
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.lg,
  },

  avatarIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: "#EEF2F7",
    alignItems: "center",
    justifyContent: "center",
    marginRight: spacing.md,
  },

  greetingBlock: {
    flex: 1,
  },

  goodMorning: {
    ...typography.secondary,
    textAlign: "left",
    fontSize: 14,
    color: colors.textSecondary,
  },

  hello: {
    ...typography.greeting,
    textAlign: "left",
    fontSize: 28,
    fontWeight: "800",
    color: colors.textPrimary,
  },

  // streak card
  card: {
    backgroundColor: colors.white,
    borderRadius: 24,
    padding: spacing.lg,
    marginBottom: spacing.xl,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 14,
    elevation: 3,
  },

  // streak
  streakHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },

  streakTitle: {
    fontFamily: "Inter",
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    flex: 1,
  },

  streakRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
  },

  fire: {
    fontSize: 16,
  },

  streakActive: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "700",
    color: colors.accentOrange,
  },

  streakSquaresRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: spacing.sm,
  },

  streakSquare: {
    width: 38,
    height: 38,
    borderRadius: 8,
  },

  streakSquareOn: {
    backgroundColor: colors.primaryBlue,
  },

  streakSquareOff: {
    backgroundColor: "#D1D5DB59",
  },

  streakDaysRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  streakDayLabel: {
    fontFamily: "Inter",
    fontSize: 12,
    fontWeight: "600",
    color: colors.borderGray,
    width: 38,
    textAlign: "center",
  },

  lastWorkoutHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
    gap: spacing.sm,
  },

  lastWorkoutTitle: {
    fontFamily: "Inter",
    fontSize: 18,
    fontWeight: "700",
    color: colors.textPrimary,
    flex: 1,
  },

  lastWorkoutBadge: {
    backgroundColor: "#EEF4FF",
    borderRadius: 999,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.xs,
  },

  lastWorkoutBadgeText: {
    fontFamily: "Inter",
    fontSize: 12,
    fontWeight: "700",
    color: colors.primaryBlue,
  },

  lastWorkoutName: {
    fontFamily: "Inter",
    fontSize: 24,
    fontWeight: "900",
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },

  lastWorkoutInfoRow: {
    flexDirection: "row",
    gap: spacing.sm,
  },

  lastWorkoutInfoCard: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 16,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
  },

  lastWorkoutInfoLabel: {
    fontFamily: "Inter",
    fontSize: 12,
    fontWeight: "700",
    color: colors.textSecondary,
    marginBottom: spacing.xs,
    letterSpacing: 0.5,
  },

  lastWorkoutInfoValue: {
    fontFamily: "Inter",
    fontSize: 15,
    fontWeight: "700",
    color: colors.textPrimary,
  },

  lastWorkoutEmptyText: {
    fontFamily: "Inter",
    fontSize: 14,
    color: colors.textSecondary,
  },

  // training card
  trainingCard: {
    backgroundColor: colors.primaryBlue,
    borderRadius: 28,
    padding: spacing.xl,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 4,
    overflow: "hidden",
  },

  decoCircle1: {
    position: "absolute",
    width: 220,
    height: 220,
    borderRadius: 999,
    right: -80,
    top: -60,
    backgroundColor: "#FFFFFF14",
  },

  decoCircle2: {
    position: "absolute",
    width: 140,
    height: 140,
    borderRadius: 999,
    right: 10,
    bottom: -60,
    backgroundColor: "#FFFFFF0F",
  },

  trainingTop: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: spacing.md,
  },

  trainingLabel: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "800",
    letterSpacing: 1,
    color: "#FFFFFFB3",
  },

  durationBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 999,
    backgroundColor: "#FFFFFF29",
  },

  durationIcon: {
    fontSize: 14,
  },

  durationText: {
    fontFamily: "Inter",
    fontSize: 14,
    fontWeight: "700",
    color: colors.white,
  },

  trainingMain: {
    fontFamily: "Inter",
    fontSize: 28,
    fontWeight: "900",
    color: colors.white,
    marginBottom: spacing.md,
  },

  trainingButtonWrap: {
    marginTop: -spacing.xs,
  },
});
