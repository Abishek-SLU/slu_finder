import { router, useFocusEffect } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  useWindowDimensions,
} from "react-native";

import {
  AppButton,
  AppCard,
  InterestChip,
  SectionTitle,
} from "../components/AppUI";
import ResponsiveScreen from "../components/ResponsiveScreen";

import {
  DiscoveredStudent,
  discoverStudents,
} from "../services/studentService";

import { colors } from "../theme/colors";

export default function ExploreScreen() {
  const { width } = useWindowDimensions();
  const desktop = width >= 900;

  const [students, setStudents] = useState<DiscoveredStudent[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadStudents = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const data = await discoverStudents();
      setStudents(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load students");
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadStudents();
    }, [loadStudents]),
  );

  const filteredStudents = useMemo(() => {
    const query = search.trim().toLowerCase();

    if (!query) return students;

    return students.filter((student) =>
      [
        student.fullName,
        student.userName,
        student.major,
        student.program,
        ...(student.sharedInterests || []),
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query)),
    );
  }, [students, search]);

  return (
    <ResponsiveScreen>
      <View style={styles.navbar}>
        <Text style={styles.logo}>
          SLU <Text style={styles.accent}>Finder.</Text>
        </Text>

        <Pressable
          onPress={() => router.replace("/student-home")}
          style={styles.backButton}
        >
          <Text style={styles.backText}>← Dashboard</Text>
        </Pressable>
      </View>

      <View style={styles.header}>
        <SectionTitle
          eyebrow="DISCOVER SLU"
          title="Find your people."
          subtitle="Discover other students and see who shares your interests."
        />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, major, or interests..."
          placeholderTextColor={colors.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />
      </View>

      {loading ? (
        <ActivityIndicator
          size="large"
          color={colors.accent}
          style={styles.loading}
        />
      ) : error ? (
        <AppCard>
          <Text style={styles.error}>{error}</Text>

          <View style={styles.retry}>
            <AppButton title="Try Again" onPress={() => void loadStudents()} />
          </View>
        </AppCard>
      ) : filteredStudents.length === 0 ? (
        <AppCard>
          <Text style={styles.emptyTitle}>
            {search ? "No matching students." : "No students to discover yet."}
          </Text>

          <Text style={styles.emptyDescription}>
            {search
              ? "Try searching with a different name or interest."
              : "When more SLU students create profiles, they will appear here."}
          </Text>

          {!search && (
            <View style={styles.emptyAction}>
              <AppButton
                title="Manage My Interests →"
                variant="accent"
                onPress={() => router.push("/select-interests")}
              />
            </View>
          )}
        </AppCard>
      ) : (
        <>
          <Text style={styles.resultCount}>
            {filteredStudents.length} students found
          </Text>

          <View style={styles.grid}>
            {filteredStudents.map((student) => (
              <View
                key={student.userId}
                style={[
                  styles.cardWrapper,
                  { width: desktop ? "48%" : "100%" },
                ]}
              >
                <AppCard>
                  <View style={styles.cardTop}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarText}>
                        {student.fullName?.charAt(0).toUpperCase() || "S"}
                      </Text>
                    </View>

                    <View style={styles.matchBadge}>
                      <Text style={styles.matchText}>
                        {student.sharedInterestCount} shared
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.studentName}>{student.fullName}</Text>

                  <Text style={styles.username}>@{student.userName}</Text>

                  <Text style={styles.major}>
                    {student.major || student.program || "SLU Student"}
                  </Text>

                  {student.bio ? (
                    <Text style={styles.bio} numberOfLines={3}>
                      {student.bio}
                    </Text>
                  ) : null}

                  <View style={styles.interests}>
                    {(student.sharedInterests || []).map((interest) => (
                      <InterestChip key={interest} label={interest} selected />
                    ))}
                  </View>
                </AppCard>
              </View>
            ))}
          </View>
        </>
      )}
    </ResponsiveScreen>
  );
}

const styles = StyleSheet.create({
  navbar: {
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
    fontSize: 24,
    fontWeight: "900",
  },
  accent: {
    color: colors.accent,
  },
  backButton: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },
  backText: {
    color: colors.text,
    fontSize: 13,
    fontWeight: "700",
  },
  header: {
    marginTop: 45,
  },
  searchContainer: {
    marginBottom: 30,
  },
  searchInput: {
    backgroundColor: colors.input,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 13,
    minHeight: 56,
    paddingHorizontal: 18,
    fontSize: 15,
  },
  loading: {
    marginTop: 60,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
  },
  retry: {
    maxWidth: 180,
    marginTop: 20,
  },
  emptyTitle: {
    color: colors.text,
    fontSize: 23,
    fontWeight: "800",
  },
  emptyDescription: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 23,
    marginTop: 12,
  },
  emptyAction: {
    maxWidth: 270,
    marginTop: 25,
  },
  resultCount: {
    color: colors.textSecondary,
    fontSize: 14,
    marginBottom: 20,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    gap: 18,
  },
  cardWrapper: {
    minWidth: 0,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 65,
    height: 65,
    borderRadius: 17,
    backgroundColor: colors.primary,
    justifyContent: "center",
    alignItems: "center",
  },
  avatarText: {
    color: colors.text,
    fontSize: 28,
    fontWeight: "900",
  },
  matchBadge: {
    backgroundColor: colors.accent,
    borderRadius: 100,
    paddingHorizontal: 13,
    paddingVertical: 9,
  },
  matchText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: "800",
  },
  studentName: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
  },
  username: {
    color: colors.textMuted,
    fontSize: 13,
    marginTop: 5,
  },
  major: {
    color: colors.accent,
    fontSize: 14,
    fontWeight: "600",
    marginTop: 14,
  },
  bio: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 22,
    marginTop: 15,
  },
  interests: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginTop: 22,
  },
});
