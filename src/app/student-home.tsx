import { router, useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";

import {
  AppButton,
  AppCard,
  InterestChip,
  SectionTitle,
} from "../components/AppUI";
import ResponsiveScreen from "../components/ResponsiveScreen";

import {
  getMyInterests,
  getStudentProfile,
  Interest,
  StudentProfile,
} from "../services/studentService";

import { clearToken } from "../services/authSession";
import { colors } from "../theme/colors";

export default function StudentHome() {
  const { width } = useWindowDimensions();
  const desktop = width >= 900;

  const [profile, setProfile] = useState<StudentProfile | null>(null);
  const [interests, setInterests] = useState<Interest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const [profileData, interestData] = await Promise.all([
        getStudentProfile(),
        getMyInterests(),
      ]);

      setProfile(profileData);
      setInterests(interestData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load student details.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadData();
    }, [loadData]),
  );

  async function logout() {
    await clearToken();
    router.replace("/login");
  }

  return (
    <ResponsiveScreen>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.logo}>SLU Finder</Text>
          <Text style={styles.topSubtitle}>STUDENT DASHBOARD</Text>
        </View>

        <Pressable onPress={logout} style={styles.logout}>
          <Text style={styles.logoutText}>Log out →</Text>
        </Pressable>
      </View>

      <View style={styles.pageHeading}>
        <SectionTitle
          eyebrow="WELCOME BACK"
          title={
            profile?.fullName
              ? `Hey, ${profile.fullName.split(" ")[0]} 👋`
              : "Your Campus Dashboard"
          }
          subtitle="Everything about your SLU community, in one place."
        />
      </View>

      {loading ? (
        <ActivityIndicator
          color={colors.accent}
          size="large"
          style={styles.loading}
        />
      ) : error ? (
        <AppCard>
          <Text style={styles.error}>{error}</Text>

          <View style={styles.retry}>
            <AppButton title="Try Again" onPress={() => void loadData()} />
          </View>
        </AppCard>
      ) : (
        <>
          <View
            style={[
              styles.mainGrid,
              { flexDirection: desktop ? "row" : "column" },
            ]}
          >
            <View style={styles.mainColumn}>
              <AppCard>
                <View style={styles.cardHeader}>
                  <Text style={styles.cardEyebrow}>YOUR PROFILE</Text>

                  <Text style={styles.cardTitle}>About you</Text>
                </View>

                <View style={styles.avatar}>
                  <Text style={styles.avatarText}>
                    {profile?.fullName?.charAt(0).toUpperCase() || "S"}
                  </Text>
                </View>

                <Text style={styles.profileName}>
                  {profile?.fullName || "SLU Student"}
                </Text>

                <Text style={styles.profileEmail}>{profile?.email || ""}</Text>

                <View style={styles.profileDivider} />

                <InfoRow label="Program" value={profile?.program} />
                <InfoRow label="Major" value={profile?.major} />
                <InfoRow label="Academic Year" value={profile?.academicYear} />

                <View style={styles.bioSection}>
                  <Text style={styles.infoLabel}>BIO</Text>
                  <Text style={styles.bioText}>
                    {profile?.bio || "Add a short bio about yourself."}
                  </Text>
                </View>

                <View style={styles.cardAction}>
                  <AppButton
                    title="Edit Profile →"
                    onPress={() => router.push("/edit-profile")}
                  />
                </View>
              </AppCard>
            </View>

            <View style={styles.sideColumn}>
              <AppCard>
                <Text style={styles.cardEyebrow}>PERSONALIZE</Text>

                <Text style={styles.cardTitle}>Your interests</Text>

                <Text style={styles.cardDescription}>
                  Let others know what you enjoy.
                </Text>

                <View style={styles.interestWrap}>
                  {interests.length > 0 ? (
                    interests.map((interest) => (
                      <InterestChip
                        key={interest.id}
                        label={interest.name}
                        selected
                      />
                    ))
                  ) : (
                    <Text style={styles.emptyText}>
                      No interests selected yet.
                    </Text>
                  )}
                </View>

                <View style={styles.cardAction}>
                  <AppButton
                    title="Manage Interests →"
                    variant="accent"
                    onPress={() => router.push("/select-interests")}
                  />
                </View>
              </AppCard>

              <View style={styles.sideSpace} />

              <View style={styles.discoverCard}>
                <Text style={styles.discoverIcon}>✦</Text>

                <Text style={styles.discoverTitle}>Discover your people.</Text>

                <Text style={styles.discoverDescription}>
                  Meet students, explore shared interests, and build your campus
                  network.
                </Text>

                <View style={{ marginTop: 20 }}>
                  <AppButton
                    title="Explore SLU →"
                    onPress={() => router.push("/explore")}
                  />
                </View>
              </View>
            </View>
          </View>

          <Text style={styles.footer}>
            SLU FINDER / BUILT FOR THE SLU COMMUNITY
          </Text>
        </>
      )}
    </ResponsiveScreen>
  );
}

function InfoRow({ label, value }: { label: string; value?: string | null }) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.infoLabel}>{label.toUpperCase()}</Text>
      <Text style={styles.infoValue}>{value || "Not added"}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 12,
    paddingBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  logo: {
    color: colors.text,
    fontSize: 23,
    fontWeight: "900",
  },
  topSubtitle: {
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 5,
  },
  logout: {
    borderWidth: 1,
    borderColor: colors.border,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
  },
  logoutText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  pageHeading: {
    marginTop: 44,
  },
  mainGrid: {
    width: "100%",
    gap: 24,
    alignItems: "flex-start",
  },
  mainColumn: {
    flex: 1.5,
    width: "100%",
    minWidth: 0,
  },
  sideColumn: {
    flex: 1,
    width: "100%",
    minWidth: 0,
  },
  sideSpace: {
    height: 24,
  },
  cardHeader: {
    marginBottom: 20,
  },
  cardEyebrow: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 2,
    marginBottom: 10,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
  },
  avatar: {
    width: 76,
    height: 76,
    borderRadius: 20,
    backgroundColor: colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 18,
  },
  avatarText: {
    color: colors.text,
    fontSize: 34,
    fontWeight: "900",
  },
  profileName: {
    color: colors.text,
    fontSize: 23,
    fontWeight: "800",
  },
  profileEmail: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 6,
  },
  profileDivider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 25,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    gap: 12,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  infoLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
  },
  infoValue: {
    color: colors.text,
    fontSize: 14,
    fontWeight: "600",
  },
  bioSection: {
    marginTop: 24,
  },
  bioText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 23,
    marginTop: 10,
  },
  cardAction: {
    marginTop: 28,
  },
  cardDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    marginTop: 10,
    lineHeight: 22,
  },
  interestWrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 24,
  },
  emptyText: {
    color: colors.textMuted,
    fontSize: 14,
  },
  discoverCard: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 28,
  },
  discoverIcon: {
    color: colors.accent,
    fontSize: 32,
    marginBottom: 24,
  },
  discoverTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
    lineHeight: 36,
  },
  discoverDescription: {
    color: "#E3EBFF",
    fontSize: 14,
    lineHeight: 23,
    marginTop: 14,
  },
  comingSoon: {
    color: colors.accent,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.5,
    marginTop: 32,
  },
  loading: {
    marginTop: 80,
  },
  error: {
    color: colors.danger,
    fontSize: 15,
  },
  retry: {
    maxWidth: 180,
    marginTop: 18,
  },
  footer: {
    color: colors.textMuted,
    fontSize: 10,
    letterSpacing: 2,
    textAlign: "center",
    marginTop: 65,
    marginBottom: 20,
  },
});
