import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { router } from "expo-router";

import ResponsiveScreen from "../components/ResponsiveScreen";
import {
  AppButton,
  AppCard,
  AppInput,
  SectionTitle,
} from "../components/AppUI";

import {
  getStudentProfile,
  updateStudentProfile,
  StudentProfile,
} from "../services/studentService";

import { colors } from "../theme/colors";

export default function EditProfileScreen() {
  const [profile, setProfile] = useState<StudentProfile | null>(null);

  const [bio, setBio] = useState("");
  const [program, setProgram] = useState("");
  const [major, setMajor] = useState("");
  const [academicYear, setAcademicYear] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await getStudentProfile();

        setProfile(data);
        setBio(data.bio || "");
        setProgram(data.program || "");
        setMajor(data.major || "");
        setAcademicYear(data.academicYear || "");
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load profile."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadProfile();
  }, []);

  async function handleSave() {
    if (saving) return;

    try {
      setSaving(true);
      setError("");

      await updateStudentProfile({
        bio: bio.trim(),
        program: program.trim(),
        major: major.trim(),
        academicYear: academicYear.trim(),
        profileImageUrl: profile?.profileImageUrl || null,
      });

      router.dismissTo("/student-home");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save profile."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <ResponsiveScreen variant="form">
      <Pressable
        style={styles.back}
        onPress={() => router.dismissTo("/student-home")}
      >
        <Text style={styles.backText}>
          ← Back to Dashboard
        </Text>
      </Pressable>

      <SectionTitle
        eyebrow="YOUR ACCOUNT"
        title="Edit profile."
        subtitle="Tell other students a little more about yourself."
      />

      {loading ? (
        <ActivityIndicator
          color={colors.accent}
          size="large"
          style={styles.loading}
        />
      ) : !profile ? (
        <AppCard>
          <Text style={styles.error}>
            {error || "Unable to load your profile."}
          </Text>
        </AppCard>
      ) : (
        <AppCard>
          <Text style={styles.cardTitle}>
            Personal information
          </Text>

          <Text style={styles.cardDescription}>
            Your name and email are connected to your SLU account.
          </Text>

          <View style={styles.readOnly}>
            <Text style={styles.fieldLabel}>FULL NAME</Text>
            <Text style={styles.readOnlyValue}>
              {profile.fullName}
            </Text>
          </View>

          <View style={styles.readOnly}>
            <Text style={styles.fieldLabel}>EMAIL</Text>
            <Text style={styles.readOnlyValue}>
              {profile.email}
            </Text>
          </View>

          <View style={styles.divider} />

          <AppInput
            label="Program"
            value={program}
            onChangeText={setProgram}
            placeholder="Example: Master's"
          />

          <AppInput
            label="Major"
            value={major}
            onChangeText={setMajor}
            placeholder="Example: Computer Science"
          />

          <AppInput
            label="Academic Year"
            value={academicYear}
            onChangeText={setAcademicYear}
            placeholder="Example: Graduate Student"
          />

          <AppInput
            label="About Me"
            value={bio}
            onChangeText={setBio}
            placeholder="Write something about yourself..."
            multiline
            maxLength={500}
          />

          <Text style={styles.counter}>
            {bio.length}/500 characters
          </Text>

          {error ? (
            <Text style={styles.error}>{error}</Text>
          ) : null}

          <View style={styles.actions}>
            <AppButton
              title="Save Changes →"
              variant="accent"
              onPress={handleSave}
              loading={saving}
            />

            <AppButton
              title="Cancel"
              variant="outline"
              onPress={() => router.dismissTo("/student-home")}
              disabled={saving}
            />
          </View>
        </AppCard>
      )}
    </ResponsiveScreen>
  );
}

const styles = StyleSheet.create({
  back: {
    alignSelf: "flex-start",
    marginBottom: 42,
  },
  backText: {
    color: colors.textSecondary,
    fontWeight: "600",
    fontSize: 14,
  },
  loading: {
    marginTop: 50,
  },
  cardTitle: {
    color: colors.text,
    fontSize: 24,
    fontWeight: "800",
  },
  cardDescription: {
    color: colors.textSecondary,
    lineHeight: 22,
    fontSize: 14,
    marginTop: 10,
    marginBottom: 28,
  },
  readOnly: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  fieldLabel: {
    color: colors.textMuted,
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1,
    marginBottom: 9,
  },
  readOnlyValue: {
    color: colors.text,
    fontSize: 15,
    fontWeight: "600",
  },
  divider: {
    height: 24,
  },
  counter: {
    color: colors.textMuted,
    fontSize: 12,
    textAlign: "right",
    marginTop: -8,
    marginBottom: 20,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    marginBottom: 15,
  },
  actions: {
    marginTop: 10,
    gap: 12,
  },
});