import React, { useEffect, useMemo, useState } from "react";
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
  InterestChip,
  SectionTitle,
} from "../components/AppUI";

import {
  getAvailableInterests,
  getMyInterests,
  saveMyInterests,
  Interest,
} from "../services/studentService";

import { colors } from "../theme/colors";

export default function SelectInterestsScreen() {
  const [interests, setInterests] = useState<Interest[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadInterests() {
      try {
        const [available, selected] = await Promise.all([
          getAvailableInterests(),
          getMyInterests(),
        ]);

        setInterests(available);
        setSelectedIds(selected.map((item) => item.id));
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load interests."
        );
      } finally {
        setLoading(false);
      }
    }

    void loadInterests();
  }, []);

  const groupedInterests = useMemo(() => {
    const groups: Record<string, Interest[]> = {};

    for (const interest of interests) {
      const category = interest.category || "Other";

      if (!groups[category]) {
        groups[category] = [];
      }

      groups[category].push(interest);
    }

    return groups;
  }, [interests]);

  function toggleInterest(id: string) {
    setSelectedIds((current) => {
      if (current.includes(id)) {
        return current.filter((item) => item !== id);
      }

      return [...current, id];
    });
  }

  async function handleSave() {
    if (saving) return;

    try {
      setSaving(true);
      setError("");

      await saveMyInterests(selectedIds);

      router.dismissTo("/student-home");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to save your interests."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <ResponsiveScreen>
      <Pressable
        onPress={() => router.dismissTo("/student-home")}
        style={styles.back}
      >
        <Text style={styles.backText}>
          ← Back to Dashboard
        </Text>
      </Pressable>

      <View style={styles.header}>
        <SectionTitle
          eyebrow="MAKE IT YOURS"
          title="What are you into?"
          subtitle="Choose things you enjoy. You can update your interests anytime."
        />

        <View style={styles.countBadge}>
          <Text style={styles.countText}>
            {selectedIds.length} selected
          </Text>
        </View>
      </View>

      {loading ? (
        <ActivityIndicator
          color={colors.accent}
          size="large"
          style={styles.loading}
        />
      ) : (
        <>
          {Object.entries(groupedInterests).map(
            ([category, items]) => (
              <View key={category} style={styles.category}>
                <AppCard>
                  <Text style={styles.categoryName}>
                    {category}
                  </Text>

                  <Text style={styles.categoryCaption}>
                    SELECT YOUR FAVORITES
                  </Text>

                  <View style={styles.chips}>
                    {items.map((interest) => (
                      <InterestChip
                        key={interest.id}
                        label={interest.name}
                        selected={selectedIds.includes(
                          interest.id
                        )}
                        onPress={() =>
                          toggleInterest(interest.id)
                        }
                      />
                    ))}
                  </View>
                </AppCard>
              </View>
            )
          )}

          {interests.length === 0 ? (
            <Text style={styles.empty}>
              No interests are available right now.
            </Text>
          ) : null}

          {error ? (
            <Text style={styles.error}>
              {error}
            </Text>
          ) : null}

          <View style={styles.actions}>
            <View style={styles.saveButton}>
              <AppButton
                title="Save My Interests →"
                variant="accent"
                onPress={handleSave}
                loading={saving}
              />
            </View>

            <View style={styles.cancelButton}>
              <AppButton
                title="Cancel"
                variant="outline"
                onPress={() => router.dismissTo("/student-home")}
                disabled={saving}
              />
            </View>
          </View>
        </>
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
    fontSize: 14,
    fontWeight: "600",
  },
  header: {
    marginBottom: 10,
  },
  countBadge: {
    alignSelf: "flex-start",
    backgroundColor: colors.accent,
    borderRadius: 100,
    paddingHorizontal: 18,
    paddingVertical: 10,
    marginBottom: 28,
  },
  countText: {
    color: colors.background,
    fontSize: 13,
    fontWeight: "800",
  },
  loading: {
    marginTop: 70,
  },
  category: {
    marginBottom: 20,
  },
  categoryName: {
    color: colors.text,
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 8,
  },
  categoryCaption: {
    color: colors.textMuted,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
  },
  chips: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 24,
  },
  empty: {
    color: colors.textSecondary,
    fontSize: 15,
    marginVertical: 25,
  },
  error: {
    color: colors.danger,
    fontSize: 14,
    marginVertical: 15,
  },
  actions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 25,
    marginBottom: 40,
  },
  saveButton: {
    minWidth: 220,
    flexGrow: 1,
  },
  cancelButton: {
    minWidth: 130,
  },
});