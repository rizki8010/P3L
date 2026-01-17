import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import MainLayout from "../layouts/MainLayout";
import Toast from "../components/Toast";
import { supabase } from "../lib/supabaseClient";

// Types for the questionnaire
interface QuestionnaireData {
  age: number | null;
  instrument: string;
  skillLevel: string;
  learningGoal: string;
  schedulePreference: string;
  flexibilityNeeded: string;
  learningStyle: string;
  genreInterest: string[];
  duration: string;
  budget: string;
  previousExperience: string;
}

interface AIRecommendationResult {
  recommendations: {
    instruments: string[];
    skill_level: string;
    class_type: string;
    class_style: string;
    learning_path: string;
    estimated_budget: string;
  };
  analysis: {
    instrument_reasoning: string;
    skill_level_reasoning: string;
    class_type_reasoning: string;
    class_style_reasoning: string;
    strengths: string[];
    areas_for_improvement: string[];
    potential_challenges: string[];
    success_factors: string[];
  };
  practical_advice: {
    practice_routine: string;
    equipment: string[];
    next_steps: string[];
  };
  ai_metadata: {
    model: string;
    prompt_version: string;
    confidence_score: number;
    processing_time_ms: number;
  };
}

const AIRecommendation = () => {
  const navigate = useNavigate();
  const [currentSection, setCurrentSection] = useState(1);
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState("");
  const [result, setResult] = useState<AIRecommendationResult | null>(null);
  const [initialLoading, setInitialLoading] = useState(true);
  const [assessmentId, setAssessmentId] = useState<string | null>(null);

  // Toast State
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastType, setToastType] = useState<"error" | "success" | "info">(
    "error",
  );

  const showNotification = (
    message: string,
    type: "error" | "success" | "info" = "error",
  ) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
  };

  // Check for existing results on mount
  useEffect(() => {
    const checkExistingResult = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search);
        const assessmentId = urlParams.get("assessment_id");

        const url = assessmentId
          ? `/api/results?assessment_id=${assessmentId}`
          : "/api/results";

        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          if (data.success && data.data?.result) {
            setResult(data.data.result.ai_analysis || data.data.result);
            setCurrentSection(12);
          }
        }
      } catch (error) {
        console.error("Error checking existing result:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    checkExistingResult();
  }, []);

  // Realtime subscription with polling fallback for AI Analysis results
  useEffect(() => {
    if (!assessmentId) return;

    let isCancelled = false;
    let pollingInterval: ReturnType<typeof setInterval> | null = null;
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    let pollingDelayId: ReturnType<typeof setTimeout> | null = null;

    const fetchResult = async (): Promise<boolean> => {
      if (isCancelled) return false;

      try {
        const response = await fetch(
          `/api/results?assessment_id=${assessmentId}`,
        );

        if (!response.ok) {
          // 404 means data not ready yet, which is expected
          if (response.status === 404) {
            return false;
          }
          console.error("API error:", response.status);
          return false;
        }

        const data = await response.json();
        if (data.success && data.data?.result) {
          const analysisData = data.data.result.ai_analysis || data.data.result;

          // Check if we have actual analysis data (not just empty object)
          if (analysisData && Object.keys(analysisData).length > 0) {
            if (!isCancelled) {
              setResult(analysisData);
              setCurrentSection(12);
              setLoading(false);
              setLoadingMessage("");
              setAssessmentId(null); // Stop listening which triggers cleanup
            }
            return true; // Result found
          }
        }
        return false; // Result not ready yet
      } catch (e) {
        // Silent fail for network errors during polling
        return false;
      }
    };

    // Start polling fallback (every 3 seconds)
    const startPolling = () => {
      if (pollingInterval) return; // Already polling

      console.log("Starting polling fallback after 25 seconds...");
      pollingInterval = setInterval(async () => {
        const found = await fetchResult();
        if (found && pollingInterval) {
          clearInterval(pollingInterval);
          pollingInterval = null;
        }
      }, 3000);
    };

    // Set timeout for maximum wait time (60 seconds)
    timeoutId = setTimeout(() => {
      if (!isCancelled) {
        console.error("Timeout waiting for AI analysis results");
        setLoading(false);
        setLoadingMessage("");
        showNotification(
          "Waktu tunggu habis. Silakan refresh halaman atau coba lagi.",
          "error",
        );
      }
    }, 60000);

    // Subscribe to Realtime changes (prioritized - both INSERT and UPDATE)
    const channel = supabase
      .channel(`assessment-${assessmentId}`)
      .on(
        "postgres_changes",
        {
          event: "*", // Listen to all events (INSERT, UPDATE, DELETE)
          schema: "public",
          table: "result_test",
          filter: `assessment_id=eq.${assessmentId}`,
        },
        (_payload) => {
          // Fetch on any database change detected by Realtime
          console.log("Realtime: Database change detected, fetching result...");
          fetchResult();
        },
      )
      .subscribe((status) => {
        console.log("Realtime subscription status:", status);
        if (status === "SUBSCRIBED") {
          // Connected! Realtime is now listening - no immediate fetch needed
          console.log("Realtime: Connected and listening for changes...");
        } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
          console.error(
            "Realtime connection issue. Starting polling immediately.",
          );
          // Start polling immediately if Realtime fails
          startPolling();
        }
      });

    // Start polling only after 25 seconds as fallback (prioritize Realtime)
    pollingDelayId = setTimeout(() => {
      if (!isCancelled) {
        startPolling();
      }
    }, 25000);

    return () => {
      isCancelled = true;
      supabase.removeChannel(channel);
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (pollingDelayId) {
        clearTimeout(pollingDelayId);
      }
    };
  }, [assessmentId]);

  const [formData, setFormData] = useState<QuestionnaireData>({
    age: null,
    instrument: "",
    skillLevel: "",
    learningGoal: "",
    schedulePreference: "",
    flexibilityNeeded: "",
    learningStyle: "",
    genreInterest: [],
    duration: "",
    budget: "",
    previousExperience: "",
  });

  const instruments = [
    "Piano",
    "Keyboard",
    "Gitar",
    "Bass",
    "Drum",
    "Vokal",
    "Saxophone",
    "Biola",
  ];

  const skillLevels = [
    {
      value: "beginner_zero",
      label: "Belum pernah belajar sama sekali (pemula 0)",
    },
    { value: "basic", label: "Bisa dasar saja" },
    {
      value: "fundamental",
      label: "Sudah ada fundamental dan bisa memainkan beberapa lagu",
    },
    { value: "intermediate", label: "Level menengah" },
    { value: "advanced", label: "Level mahir" },
  ];

  const learningGoals = [
    { value: "from_scratch", label: "Saya ingin belajar dari dasar / pemula" },
    {
      value: "specific_genre",
      label:
        "Saya ingin belajar genre atau gaya tertentu (jazz, pop, rock, worship, dll.)",
    },
    {
      value: "church_ministry",
      label: "Saya ingin meningkatkan kemampuan untuk pelayanan di gereja",
    },
    { value: "hobby", label: "Saya ingin mengembangkan skill untuk hobi" },
    {
      value: "professional",
      label: "Saya ingin upgrade skill untuk kebutuhan pekerjaan / event",
    },
  ];

  const schedulePreferences = [
    {
      value: "fixed",
      label: "Saya bisa mengikuti jadwal tetap setiap minggu (Kelas Siswa)",
    },
    {
      value: "flexible",
      label:
        "Saya butuh jadwal fleksibel karena kerja/aktifitas padat (Kelas Karyawan)",
    },
    { value: "unsure", label: "Tidak yakin, ingin rekomendasi" },
  ];

  const learningStyles = [
    {
      value: "reguler",
      label: "Mengikuti buku dan kurikulum bertingkat (Kelas Reguler)",
    },
    {
      value: "hobby",
      label: "Belajar genre/lagu sesuai minat tanpa buku (Kelas Hobby)",
    },
    {
      value: "ministry",
      label: "Fokus untuk pelayanan gereja (Kelas Ministry)",
    },
    { value: "unsure", label: "Belum tahu, minta rekomendasi" },
  ];

  const genres = ["Pop", "Rock", "Jazz", "R&B", "Worship", "Klasik", "Lainnya"];

  const durations = [
    { value: "short", label: "Jangka pendek (1–3 bulan)" },
    { value: "medium", label: "Menengah (3–6 bulan)" },
    { value: "long", label: "Jangka panjang (lebih dari 6 bulan)" },
  ];

  const budgets = [
    { value: "300000", label: "Rp 300.000" },
    { value: "400000", label: "Rp 400.000" },
    { value: "500000", label: "Rp 500.000" },
    { value: "flexible", label: "Tidak masalah, utamakan rekomendasi terbaik" },
  ];

  const handleInputChange = (field: keyof QuestionnaireData, value: any) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleGenreToggle = (genre: string) => {
    setFormData((prev) => ({
      ...prev,
      genreInterest: prev.genreInterest.includes(genre)
        ? prev.genreInterest.filter((g) => g !== genre)
        : [...prev.genreInterest, genre],
    }));
  };

  const validateSection = (section: number): boolean => {
    switch (section) {
      case 1:
        return formData.age !== null && formData.age > 0;
      case 2:
        return formData.instrument !== "";
      case 3:
        return formData.skillLevel !== "";
      case 4:
        return formData.learningGoal !== "";
      case 5:
        return formData.schedulePreference !== "";
      case 6:
        return formData.flexibilityNeeded !== "";
      case 7:
        return formData.learningStyle !== "";
      case 8:
        return true;
      case 9:
        return formData.duration !== "";
      case 10:
        return formData.budget !== "";
      case 11:
        return formData.previousExperience !== "";
      default:
        return false;
    }
  };

  const nextSection = () => {
    if (validateSection(currentSection)) {
      setCurrentSection((prev) => Math.min(prev + 1, 12));
    } else {
      showNotification("Mohon lengkapi pertanyaan yang wajib diisi!", "error");
    }
  };

  const prevSection = () => {
    setCurrentSection((prev) => Math.max(prev - 1, 1));
  };

  const submitQuestionnaire = async () => {
    if (!validateSection(11)) {
      showNotification(
        "Mohon lengkapi semua pertanyaan yang wajib diisi!",
        "error",
      );
      return;
    }

    setLoading(true);
    setLoadingMessage("Mengirim data assessment...");

    try {
      const assessmentPayload = {
        assessment_data: {
          age: formData.age,
          instruments: [formData.instrument],
          experience_level:
            skillLevels.find((l) => l.value === formData.skillLevel)?.label ||
            formData.skillLevel,
          learning_goals: [
            learningGoals.find((g) => g.value === formData.learningGoal)
              ?.label || formData.learningGoal,
          ],
          schedule_preference:
            schedulePreferences.find(
              (p) => p.value === formData.schedulePreference,
            )?.label || formData.schedulePreference,
          flexibility_needed:
            formData.flexibilityNeeded === "yes"
              ? "Ya, saya butuh fleksibilitas"
              : "Tidak, jadwal tetap tidak masalah",
          learning_style:
            learningStyles.find((s) => s.value === formData.learningStyle)
              ?.label || formData.learningStyle,
          preferred_genres: formData.genreInterest,
          duration:
            durations.find((d) => d.value === formData.duration)?.label ||
            formData.duration,
          budget:
            budgets.find((b) => b.value === formData.budget)?.label ||
            formData.budget,
          previous_experience:
            formData.previousExperience === "yes" ? "Ya" : "Tidak",
        },
      };

      const response = await fetch("/api/assessment", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(assessmentPayload),
      });

      if (!response.ok) {
        throw new Error("Failed to submit assessment");
      }

      const apiResult = await response.json();

      if (apiResult.success) {
        if (apiResult.data?.result) {
          setResult(apiResult.data.result.ai_analysis || apiResult.data.result);
          setCurrentSection(12);
          setLoading(false);
          setLoadingMessage("");
        } else if (apiResult.assessment_id) {
          setLoadingMessage("AI sedang menganalisis data Anda...");
          // Instead of polling, we set the assessmentId to trigger the realtime subscription
          setAssessmentId(apiResult.assessment_id);
          // Note: loading state remains true until realtime update is received
        } else {
          throw new Error("Invalid API response format");
        }
      } else {
        throw new Error(apiResult.message || "Failed to process assessment");
      }
    } catch (error) {
      console.error("Error submitting questionnaire:", error);
      showNotification(
        "Terjadi kesalahan saat memproses data Anda. Silakan coba lagi.",
        "error",
      );
      setLoading(false);
      setLoadingMessage("");
    }
  };

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
    transition: { duration: 0.3 },
  };

  const renderSection = () => {
    switch (currentSection) {
      case 1:
        return (
          <motion.div {...fadeInUp} className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#8B1538] mb-2">
              Berapa usia Anda?
            </h2>
            <p className="text-gray-500 text-sm mb-4">
              Usia digunakan untuk aturan khusus, misalnya kelas drum untuk anak
              di bawah 6 tahun.
            </p>
            <input
              type="number"
              min="1"
              max="100"
              value={formData.age || ""}
              onChange={(e) =>
                handleInputChange("age", parseInt(e.target.value) || null)
              }
              className="w-full px-5 py-4 rounded-full bg-white border border-gray-300 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-red-500 transition-all font-medium shadow-sm"
              placeholder="Contoh: 20"
            />
          </motion.div>
        );

      case 2:
        return (
          <motion.div {...fadeInUp} className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#8B1538] mb-2">
              Apa alat musik yang ingin Anda pelajari?
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Pilih satu instrumen yang paling Anda minati saat ini.
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {instruments.map((instrument) => (
                <button
                  key={instrument}
                  onClick={() => handleInputChange("instrument", instrument)}
                  className={`px-4 py-4 rounded-xl border-2 transition-all font-semibold shadow-sm ${
                    formData.instrument === instrument
                      ? "bg-[#8B1538] border-[#8B1538] text-white shadow-red-200 scale-[1.02]"
                      : "bg-white border-gray-100 text-gray-700 hover:border-red-300 hover:text-red-700 hover:bg-red-50"
                  }`}
                >
                  {instrument}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div {...fadeInUp} className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#8B1538] mb-2">
              Seberapa jauh kemampuan Anda?
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Kemampuan Anda saat ini di{" "}
              {formData.instrument || "instrumen terpilih"}.
            </p>
            <div className="space-y-3">
              {skillLevels.map((level) => (
                <button
                  key={level.value}
                  onClick={() => handleInputChange("skillLevel", level.value)}
                  className={`w-full px-5 py-4 rounded-xl border-2 text-left transition-all font-medium shadow-sm ${
                    formData.skillLevel === level.value
                      ? "bg-[#8B1538] border-[#8B1538] text-white shadow-red-200"
                      : "bg-white border-gray-100 text-gray-700 hover:border-red-300 hover:text-red-700 hover:bg-red-50"
                  }`}
                >
                  {level.label}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div {...fadeInUp} className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#8B1538] mb-6">
              Apa tujuan utama Anda?
            </h2>
            <div className="space-y-3">
              {learningGoals.map((goal) => (
                <button
                  key={goal.value}
                  onClick={() => handleInputChange("learningGoal", goal.value)}
                  className={`w-full px-5 py-4 rounded-xl border-2 text-left transition-all font-medium shadow-sm ${
                    formData.learningGoal === goal.value
                      ? "bg-[#8B1538] border-[#8B1538] text-white shadow-red-200"
                      : "bg-white border-gray-100 text-gray-700 hover:border-red-300 hover:text-red-700 hover:bg-red-50"
                  }`}
                >
                  {goal.label}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 5:
        return (
          <motion.div {...fadeInUp} className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#8B1538] mb-6">
              Bagaimana preferensi jadwal Anda?
            </h2>
            <div className="space-y-3">
              {schedulePreferences.map((pref) => (
                <button
                  key={pref.value}
                  onClick={() =>
                    handleInputChange("schedulePreference", pref.value)
                  }
                  className={`w-full px-5 py-4 rounded-xl border-2 text-left transition-all font-medium shadow-sm ${
                    formData.schedulePreference === pref.value
                      ? "bg-[#8B1538] border-[#8B1538] text-white shadow-red-200"
                      : "bg-white border-gray-100 text-gray-700 hover:border-red-300 hover:text-red-700 hover:bg-red-50"
                  }`}
                >
                  {pref.label}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 6:
        return (
          <motion.div {...fadeInUp} className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#8B1538] mb-6">
              Apakah Anda membutuhkan fleksibilitas jadwal?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleInputChange("flexibilityNeeded", "yes")}
                className={`px-6 py-5 rounded-2xl border-2 transition-all group shadow-sm ${
                  formData.flexibilityNeeded === "yes"
                    ? "bg-[#8B1538] border-[#8B1538] text-white shadow-red-200"
                    : "bg-white border-gray-100 text-gray-700 hover:border-red-300 hover:text-red-700 hover:bg-red-50"
                }`}
              >
                <div className="text-xl font-bold mb-1">Ya</div>
                <div
                  className={`text-sm ${
                    formData.flexibilityNeeded === "yes"
                      ? "text-red-100"
                      : "text-gray-500 group-hover:text-red-600"
                  }`}
                >
                  Bisa ganti sesi jika berhalangan (Kelas Karyawan)
                </div>
              </button>
              <button
                onClick={() => handleInputChange("flexibilityNeeded", "no")}
                className={`px-6 py-5 rounded-2xl border-2 transition-all group shadow-sm ${
                  formData.flexibilityNeeded === "no"
                    ? "bg-[#8B1538] border-[#8B1538] text-white shadow-red-200"
                    : "bg-white border-gray-100 text-gray-700 hover:border-red-300 hover:text-red-700 hover:bg-red-50"
                }`}
              >
                <div className="text-xl font-bold mb-1">Tidak</div>
                <div
                  className={`text-sm ${
                    formData.flexibilityNeeded === "no"
                      ? "text-red-100"
                      : "text-gray-500 group-hover:text-red-600"
                  }`}
                >
                  Jadwal tetap setiap minggu (Kelas Siswa)
                </div>
              </button>
            </div>
          </motion.div>
        );

      case 7:
        return (
          <motion.div {...fadeInUp} className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#8B1538] mb-6">
              Apa gaya pembelajaran yang Anda inginkan?
            </h2>
            <div className="space-y-3">
              {learningStyles.map((style) => (
                <button
                  key={style.value}
                  onClick={() =>
                    handleInputChange("learningStyle", style.value)
                  }
                  className={`w-full px-5 py-4 rounded-xl border-2 text-left transition-all font-medium shadow-sm ${
                    formData.learningStyle === style.value
                      ? "bg-[#8B1538] border-[#8B1538] text-white shadow-red-200"
                      : "bg-white border-gray-100 text-gray-700 hover:border-red-300 hover:text-red-700 hover:bg-red-50"
                  }`}
                >
                  {style.label}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 8:
        return (
          <motion.div {...fadeInUp} className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#8B1538] mb-2">
              Minat genre musik?
            </h2>
            <p className="text-gray-500 text-sm mb-6">
              Opsional - Pilih satu atau lebih genre (boleh dilewati).
            </p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => handleGenreToggle(genre)}
                  className={`px-4 py-4 rounded-xl border-2 transition-all font-semibold shadow-sm ${
                    formData.genreInterest.includes(genre)
                      ? "bg-[#8B1538] border-[#8B1538] text-white shadow-red-200"
                      : "bg-white border-gray-100 text-gray-700 hover:border-red-300 hover:text-red-700 hover:bg-red-50"
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 9:
        return (
          <motion.div {...fadeInUp} className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#8B1538] mb-6">
              Berapa lama rencana mengikuti kelas?
            </h2>
            <div className="space-y-3">
              {durations.map((dur) => (
                <button
                  key={dur.value}
                  onClick={() => handleInputChange("duration", dur.value)}
                  className={`w-full px-5 py-4 rounded-xl border-2 text-left transition-all font-medium shadow-sm ${
                    formData.duration === dur.value
                      ? "bg-[#8B1538] border-[#8B1538] text-white shadow-red-200"
                      : "bg-white border-gray-100 text-gray-700 hover:border-red-300 hover:text-red-700 hover:bg-red-50"
                  }`}
                >
                  {dur.label}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 10:
        return (
          <motion.div {...fadeInUp} className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#8B1538] mb-6">
              Berapa budget bulanan Anda?
            </h2>
            <div className="space-y-3">
              {budgets.map((bud) => (
                <button
                  key={bud.value}
                  onClick={() => handleInputChange("budget", bud.value)}
                  className={`w-full px-5 py-4 rounded-xl border-2 text-left transition-all font-medium shadow-sm ${
                    formData.budget === bud.value
                      ? "bg-[#8B1538] border-[#8B1538] text-white shadow-red-200"
                      : "bg-white border-gray-100 text-gray-700 hover:border-red-300 hover:text-red-700 hover:bg-red-50"
                  }`}
                >
                  {bud.label}
                </button>
              ))}
            </div>
          </motion.div>
        );

      case 11:
        return (
          <motion.div {...fadeInUp} className="space-y-6">
            <h2 className="text-2xl md:text-3xl font-bold text-[#8B1538] mb-6">
              Pernah ikut kelas musik sebelumnya?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <button
                onClick={() => handleInputChange("previousExperience", "yes")}
                className={`px-6 py-5 rounded-2xl border-2 transition-all shadow-sm ${
                  formData.previousExperience === "yes"
                    ? "bg-[#8B1538] border-[#8B1538] text-white shadow-red-200"
                    : "bg-white border-gray-100 text-gray-700 hover:border-red-300 hover:text-red-700 hover:bg-red-50"
                }`}
              >
                <div className="text-xl font-bold mb-1">Ya</div>
                <div
                  className={`text-sm ${
                    formData.previousExperience === "yes"
                      ? "text-red-100"
                      : "text-gray-500"
                  }`}
                >
                  Iya, saya sudah pernah belajar musik
                </div>
              </button>
              <button
                onClick={() => handleInputChange("previousExperience", "no")}
                className={`px-6 py-5 rounded-2xl border-2 transition-all shadow-sm ${
                  formData.previousExperience === "no"
                    ? "bg-[#8B1538] border-[#8B1538] text-white shadow-red-200"
                    : "bg-white border-gray-100 text-gray-700 hover:border-red-300 hover:text-red-700 hover:bg-red-50"
                }`}
              >
                <div className="text-xl font-bold mb-1">Tidak</div>
                <div
                  className={`text-sm ${
                    formData.previousExperience === "no"
                      ? "text-red-100"
                      : "text-gray-500"
                  }`}
                >
                  Belum, ini pertama kalinya
                </div>
              </button>
            </div>
          </motion.div>
        );

      case 12:
        return result ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            {/* -- HEADER: Personal Greeting -- */}
            <div className="mb-10 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-full text-[#8B1538] text-sm font-bold mb-6">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
                Analisis Selesai
              </div>
              <h2 className="text-4xl md:text-5xl font-serif font-medium text-gray-900 mb-4 leading-tight">
                Halo, Calon Musisi. <br />
                <span className="text-[#8B1538] font-bold">
                  Ini Rencana Musik Anda.
                </span>
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed max-w-2xl">
                Berdasarkan profil Anda sebagai seseorang berusia{" "}
                <strong>{formData.age} tahun</strong> yang ingin belajar{" "}
                <strong>{formData.instrument}</strong>, saya telah menyusun
                strategi pembelajaran yang paling pas untuk Anda.
              </p>
            </div>

            {/* -- THE RECOMMENDATION (Hero Section) -- */}
            <div className="bg-white border-none shadow-xl shadow-gray-200/50 rounded-3xl overflow-hidden mb-12 relative">
              <div className="absolute top-0 left-0 w-2 h-full bg-[#8B1538]"></div>
              <div className="p-8 md:p-10">
                <div className="flex flex-col md:flex-row gap-8 items-start">
                  <div className="flex-1">
                    <h3 className="text-gray-400 text-sm font-bold tracking-widest uppercase mb-3">
                      Rekomendasi Utama
                    </h3>
                    <div className="text-3xl md:text-4xl font-serif text-gray-900 leading-snug mb-6">
                      "Saya sangat menyarankan Anda mengambil kelas{" "}
                      <span className="bg-yellow-100 px-2 box-decoration-clone">
                        {result.recommendations?.class_style || "Privat"}
                      </span>{" "}
                      untuk instrumen{" "}
                      <span className="text-[#8B1538] font-bold">
                        {result.recommendations?.instruments?.[0] ||
                          formData.instrument}
                      </span>{" "}
                      di level{" "}
                      <span className="underline decoration-red-300 decoration-2 underline-offset-4">
                        {result.recommendations?.skill_level || "Dasar"}
                      </span>
                      ."
                    </div>
                    <div className="flex gap-4 flex-wrap">
                      <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-600 border border-gray-100">
                        ⏱ {result.recommendations?.class_type}
                      </div>
                      <div className="px-4 py-2 bg-gray-50 rounded-lg text-sm font-medium text-gray-600 border border-gray-100">
                        💰 Rp{" "}
                        {parseInt(
                          result.recommendations?.estimated_budget || "0",
                        ).toLocaleString("id-ID")}
                        /bln
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* -- NARRATIVE: Why This Fits -- */}
            <div className="mb-12 space-y-8">
              <div className="flex items-start gap-4">
                <div className="hidden md:flex w-12 h-12 bg-gray-900 text-white rounded-full items-center justify-center font-serif text-xl shrink-0">
                  1
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Mengapa ini cocok untuk Anda?
                  </h3>
                  <div className="prose prose-lg text-gray-600 leading-relaxed">
                    <p className="mb-4">
                      {result.analysis?.instrument_reasoning}
                    </p>
                    <p className="mb-4 bg-red-50/50 p-6 rounded-2xl border-l-4 border-[#8B1538] text-gray-800 italic">
                      "{result.recommendations?.learning_path}"
                    </p>
                    <p>{result.analysis?.skill_level_reasoning}</p>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="hidden md:flex w-12 h-12 bg-gray-900 text-white rounded-full items-center justify-center font-serif text-xl shrink-0">
                  2
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    Kekuatan & Tantangan Anda
                  </h3>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-green-50 p-6 rounded-2xl border border-green-100">
                      <h4 className="font-bold text-green-800 mb-3 flex items-center gap-2">
                        <span>✓</span> Kekuatan Anda
                      </h4>
                      <ul className="space-y-2">
                        {(result.analysis?.strengths || []).map((s, i) => (
                          <li key={i} className="text-green-900 text-sm">
                            {s}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="bg-orange-50 p-6 rounded-2xl border border-orange-100">
                      <h4 className="font-bold text-orange-800 mb-3 flex items-center gap-2">
                        <span>!</span> Hal yang perlu diperhatikan
                      </h4>
                      <ul className="space-y-2">
                        {(result.analysis?.potential_challenges || []).map(
                          (c, i) => (
                            <li key={i} className="text-orange-900 text-sm">
                              {c}
                            </li>
                          ),
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* -- PRACTICAL: Next Steps -- */}
            <div className="bg-gray-900 text-white rounded-3xl p-8 md:p-12 mb-10 overflow-hidden relative">
              <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#8B1538] rounded-full blur-3xl opacity-20"></div>

              <h3 className="text-2xl font-serif mb-8 relative z-10">
                Apa yang harus disiapkan?
              </h3>

              <div className="grid md:grid-cols-2 gap-10 relative z-10">
                <div>
                  <h4 className="text-gray-400 font-bold text-xs tracking-widest uppercase mb-4">
                    Equipment & Alat
                  </h4>
                  <ul className="space-y-4">
                    {(result.practical_advice?.equipment || []).map((e, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full border border-gray-600 flex items-center justify-center text-[10px] shrink-0 mt-0.5">
                          ✓
                        </span>
                        <span className="text-gray-300">{e}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h4 className="text-gray-400 font-bold text-xs tracking-widest uppercase mb-4">
                    Langkah Selanjutnya
                  </h4>
                  <ul className="space-y-4">
                    {(result.practical_advice?.next_steps || []).map((s, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <span className="text-[#8B1538] font-bold">
                          {i + 1}.
                        </span>
                        <span className="text-white font-medium">{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-10 pt-8 border-t border-gray-800 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <p className="text-gray-400 text-sm mb-1">
                    Siap untuk memulai perjalanan musik Anda?
                  </p>
                  <p className="text-white font-bold text-lg">
                    Jadwal tersedia untuk minggu ini.
                  </p>
                </div>
                <button
                  onClick={() => navigate("/registration")}
                  className="px-8 py-4 bg-white text-gray-900 rounded-full font-bold hover:bg-gray-100 transition-all shadow-lg hover:scale-105 active:scale-95"
                >
                  Daftar Kelas Sekarang
                </button>
              </div>
            </div>

            {/* -- FOOTER: Restart -- */}
            <div className="text-center pb-8">
              <button
                onClick={() => {
                  setCurrentSection(1);
                  setResult(null);
                  setFormData({
                    age: null,
                    instrument: "",
                    skillLevel: "",
                    learningGoal: "",
                    schedulePreference: "",
                    flexibilityNeeded: "",
                    learningStyle: "",
                    genreInterest: [],
                    duration: "",
                    budget: "",
                    previousExperience: "",
                  });
                }}
                className="text-gray-400 text-sm hover:text-gray-600 underline"
              >
                Ulangi Analisis (Reset)
              </button>
            </div>
          </motion.div>
        ) : null;

      default:
        return null;
    }
  };

  if (initialLoading) {
    return (
      <MainLayout>
        <div className="min-h-screen mt-16 flex items-center justify-center bg-gray-50">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-red-200 border-t-red-600 rounded-full animate-spin"></div>
            <p className="text-gray-500 font-medium animate-pulse">Memuat...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="min-h-screen pt-24 pb-12 bg-white px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          {currentSection < 12 && (
            <div className="text-center m-12">
              <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-5xl font-bold text-[#8B1538] mb-4"
              >
                Temukan Kelas Musik Ideal
              </motion.h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-gray-600 text-lg max-w-2xl mx-auto"
              >
                Jawab beberapa pertanyaan singkat untuk mendapatkan rekomendasi
                kelas yang dipersonalisasi oleh AI
              </motion.p>
            </div>
          )}

          {/* Progress Bar */}
          {currentSection < 12 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mb-10 max-w-xl mx-auto"
            >
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-500 text-xs font-bold uppercase tracking-widest">
                  Langkah {currentSection} dari 11
                </span>
                <span className="text-[#8B1538] text-xs font-bold">
                  {Math.round((currentSection / 11) * 100)}%
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                <motion.div
                  className="bg-[#8B1538] h-2 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(currentSection / 11) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          )}

          {/* Main Content */}
          <motion.div
            layout
            className="bg-white rounded-3xl p-6 md:p-10 shadow-xl shadow-gray-100/50 border border-gray-100"
          >
            <AnimatePresence mode="wait">{renderSection()}</AnimatePresence>

            {/* Navigation Buttons */}
            {currentSection < 12 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="flex justify-between mt-10 pt-8 border-t border-gray-100"
              >
                <button
                  onClick={prevSection}
                  disabled={currentSection === 1}
                  className={`px-8 py-3 rounded-full font-semibold transition-all ${
                    currentSection === 1
                      ? "bg-gray-50 text-gray-300 cursor-not-allowed"
                      : "bg-white border-2 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                  }`}
                >
                  ← Sebelumnya
                </button>

                {currentSection < 11 ? (
                  <button
                    onClick={nextSection}
                    className="px-8 py-3 bg-[#8B1538] text-white rounded-full font-semibold hover:bg-red-700 shadow-lg shadow-red-200 transition-all hover:scale-105"
                  >
                    Selanjutnya →
                  </button>
                ) : (
                  <button
                    onClick={submitQuestionnaire}
                    disabled={loading}
                    className="px-10 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-green-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105"
                  >
                    {loading ? "Memproses..." : "Dapatkan Rekomendasi 🎯"}
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-white/80 backdrop-blur-sm z-50 flex items-center justify-center">
            <div className="bg-white border border-gray-100 rounded-3xl p-10 max-w-md mx-4 shadow-2xl text-center">
              <div className="flex flex-col items-center gap-6">
                {/* Spinner */}
                <div className="relative">
                  <div className="w-20 h-20 border-4 border-red-100 rounded-full"></div>
                  <div className="w-20 h-20 border-4 border-t-[#8B1538] border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin absolute top-0 left-0"></div>
                </div>

                {/* Loading Message */}
                <div>
                  <h3 className="text-gray-900 text-xl font-bold mb-2">
                    {loadingMessage || "Sedang Menganalisis..."}
                  </h3>
                  <p className="text-gray-500">
                    AI sedang mempelajari preferensi musik Anda
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        <Toast
          message={toastMessage}
          isVisible={showToast}
          onClose={() => setShowToast(false)}
          type={toastType}
        />
      </div>
    </MainLayout>
  );
};

export default AIRecommendation;
