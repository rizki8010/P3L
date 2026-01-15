import { useState, useEffect } from "react";

interface StepDataDiriProps {
  onNext: () => void;
}

interface Course {
  id: string;
  title: string;
  description: string;
  instrument: string;
  level: string;
  instructor_name: string;
  duration_minutes: number;
  price: number;
  price_per_session?: number;
  type_course: string;
}

interface ApiResponse {
  success: boolean;
  data: {
    courses: Course[];
  };
}

interface ClassType {
  type: string;
  label: string;
  price: number;
  course_id: string;
}

const StepDataDiri = ({ onNext }: StepDataDiriProps) => {
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [instruments, setInstruments] = useState<string[]>([]);
  const [levels, setLevels] = useState<string[]>([]);
  const [classTypes, setClassTypes] = useState<ClassType[]>([]);
  const [isLoadingInstruments, setIsLoadingInstruments] = useState(false);

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    phone: "",
    birth_date: "",
    birth_place: "",
    address: "",
    instrument: "",
    classType: "",
    course_id: "",
    price: 0,
    level: "",
    individualStatus: "",
    school: "",
    studentClass: "",
    guardian_name: "",
    guardian_phone: "",
  });

  useEffect(() => {
    const fetchInstruments = async () => {
      setIsLoadingInstruments(true);
      try {
        const response = await fetch(
          "https://api.shemamusic.my.id/api/courses"
        );
        const result: ApiResponse = await response.json();
        if (
          result.success &&
          result.data &&
          Array.isArray(result.data.courses)
        ) {
          setAllCourses(result.data.courses);

          // Extract unique instruments from all courses initially
          const uniqueInstruments = Array.from(
            new Set(result.data.courses.map((course) => course.instrument))
          ).sort();
          setInstruments(uniqueInstruments);
        }
      } catch (error) {
        console.error("Failed to fetch courses:", error);
      } finally {
        setIsLoadingInstruments(false);
      }
    };

    fetchInstruments();
  }, []);

  // Update available levels and class types when instrument changes
  useEffect(() => {
    if (form.instrument) {
      const filteredCourses = allCourses.filter(
        (course) => course.instrument === form.instrument
      );

      // Extract unique levels for this instrument
      const uniqueLevels = Array.from(
        new Set(filteredCourses.map((course) => course.level))
      ).sort();
      setLevels(uniqueLevels);

      // Extract unique class types for this instrument
      const classTypeMap = new Map<string, ClassType>();
      filteredCourses.forEach((course) => {
        // Use type_course or a combined key to ensure uniqueness if needed
        // Here we assume type_course is the differentiator (e.g. Regular, Hobby)
        // Default to "reguler" if null, as "general" is invalid
        let typeKey = course.type_course?.toLowerCase() || "reguler";

        // Ensure typeKey is one of the valid options: reguler, hobby, karyawan, ministry, privat
        if (!classTypeMap.has(typeKey)) {
          classTypeMap.set(typeKey, {
            type: typeKey, // Use the sanitized typeKey
            label: course.title,
            price: course.price_per_session || course.price,
            course_id: course.id,
          });
        }
      });
      setClassTypes(Array.from(classTypeMap.values()));
    } else {
      // Reset if no instrument selected
      setLevels([]);
      setClassTypes([]);
    }
  }, [form.instrument, allCourses]);



  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "instrument") {
      // Reset dependent fields when instrument changes
      setForm({
        ...form,
        instrument: value,
        classType: "",
        course_id: "",
        level: "",
        price: 0,
      });
    } else if (name === "classType") {
      const selectedClass = classTypes.find((ct) => ct.type === value);
      setForm({
        ...form,
        classType: value,
        course_id: selectedClass?.course_id || "",
        price: selectedClass?.price || 0,
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = () => {
    // Validasi semua field harus diisi
    if (!form.full_name.trim()) {
      alert("Nama lengkap harus diisi!");
      return;
    }

    if (!form.email.trim()) {
      alert("Email harus diisi!");
      return;
    }

    // Validasi format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      alert("Format email tidak valid!");
      return;
    }

    if (!form.phone.trim()) {
      alert("No. Telepon / WhatsApp harus diisi!");
      return;
    }

    if (!form.birth_date) {
      alert("Tanggal lahir harus diisi!");
      return;
    }
    if (!form.birth_place) {
      alert("Tempat lahir harus diisi!");
      return;
    }

    if (!form.address.trim()) {
      alert("Alamat harus diisi!");
      return;
    }

    if (!form.instrument) {
      alert("Instrumen harus dipilih!");
      return;
    }

    if (!form.classType) {
      alert("Jenis kelas harus dipilih!");
      return;
    }

    if (!form.level) {
      alert("Tingkat kemampuan harus dipilih!");
      return;
    }
    if (!form.individualStatus) {
      alert("Status individu harus dipilih!");
      return;
    }

    if (form.individualStatus === "Pelajar") {
      if (!form.school.trim()) {
        alert("Nama sekolah harus diisi!");
        return;
      }
      if (!form.studentClass.trim()) {
        alert("Kelas harus diisi!");
        return;
      }
      if (!form.guardian_name.trim()) {
        alert("Nama wali/orang tua harus diisi!");
        return;
      }
      if (!form.guardian_phone.trim()) {
        alert("Nomor WhatsApp wali harus diisi!");
        return;
      }
    }

    // simpan dalam array
    const dataArray = [form];

    // simpan ke cookie (stringify)
    document.cookie = `registrationData=${encodeURIComponent(
      JSON.stringify(dataArray)
    )}; path=/`;

    onNext();
  };

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-sm">
      <h2 className="text-xl font-bold text-center mb-2">
        Formulir Pendaftaran
      </h2>
      <p className="text-sm text-gray-600 text-center mb-6">
        Lengkapi data diri Anda untuk mendaftar kursus musik
      </p>

      <div className="space-y-4">
        {/* Nama Lengkap */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Nama Lengkap <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              👤
            </span>
            <input
              type="text"
              name="full_name"
              placeholder="Masukkan nama lengkap"
              value={form.full_name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Email <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              ✉️
            </span>
            <input
              type="email"
              name="email"
              placeholder="contoh@email.com"
              value={form.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* No. Telepon / WhatsApp */}
        <div>
          <label className="block text-sm font-medium mb-1">
            No. Telepon / WhatsApp <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              📞
            </span>
            <input
              type="tel"
              name="phone"
              placeholder="08xx-xxxx-xxxx"
              value={form.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Tempat & Tanggal Lahir */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Tempat Lahir */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tempat Lahir <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="birth_place"
              placeholder="Masukkan tempat lahir"
              value={form.birth_place}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Tanggal Lahir */}
          <div>
            <label className="block text-sm font-medium mb-1">
              Tanggal Lahir <span className="text-red-500">*</span>
            </label>
            <input
              type="date"
              name="birth_date"
              value={form.birth_date}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
            />
          </div>
        </div>

        {/* Alamat */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Alamat <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <span className="absolute left-3 top-3 text-gray-400">📍</span>
            <textarea
              name="address"
              placeholder="Masukkan alamat lengkap"
              value={form.address}
              onChange={handleChange}
              rows={3}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 resize-none"
            />
          </div>
        </div>
        {/* Status Individu */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Status Individu <span className="text-red-500">*</span>
          </label>
          <select
            name="individualStatus"
            value={form.individualStatus}
            onChange={handleChange}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
          >
            <option value="">Pilih Status</option>
            <option value="Pelajar">Pelajar</option>
            <option value="Mahasiswa">Mahasiswa</option>
            <option value="Pekerja Swasta">Pekerja Swasta</option>
            <option value="PNS">PNS</option>
            <option value="Umum">Umum</option>
          </select>
        </div>

        {/* Form Tambahan untuk Pelajar */}
        {form.individualStatus === "Pelajar" && (
          <div className="space-y-4">
            {/* Data Sekolah */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nama Sekolah */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nama Sekolah <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="school"
                  placeholder="Masukkan nama sekolah"
                  value={form.school}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* Kelas */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Kelas <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="studentClass"
                  placeholder="Contoh: 10 IPA 2"
                  value={form.studentClass}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>

            {/* Data Wali */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Nama Wali */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  Nama Wali/Orang Tua <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="guardian_name"
                  placeholder="Masukkan nama wali"
                  value={form.guardian_name}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>

              {/* No WA Wali */}
              <div>
                <label className="block text-sm font-medium mb-1">
                  No. WhatsApp Wali <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="guardian_phone"
                  placeholder="Masukkan nomor WA wali"
                  value={form.guardian_phone}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}

        {/* Instrumen yang Dipilih */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Instrumen yang Dipilih <span className="text-red-500">*</span>
          </label>
          <select
            name="instrument"
            value={form.instrument}
            onChange={handleChange}
            disabled={isLoadingInstruments}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700"
          >
            <option value="">
              {isLoadingInstruments ? "Loading..." : "Pilih Instrumen"}
            </option>
            {instruments.map((inst, index) => (
              <option key={index} value={inst}>
                {inst}
              </option>
            ))}
          </select>
        </div>

        {/* Jenis Kelas */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Jenis Kelas <span className="text-red-500">*</span>
          </label>
          <div className="space-y-3">
            {!form.instrument ? (
              <div className="text-center py-4 text-gray-500">
                Silakan pilih instrumen terlebih dahulu
              </div>
            ) : isLoadingInstruments ? (
              <div className="text-center py-4 text-gray-500">
                Loading class types...
              </div>
            ) : classTypes.length > 0 ? (
              classTypes.map((classType, index) => (
                <label
                  key={index}
                  className="flex items-start p-3 border border-gray-300 rounded cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="classType"
                    value={classType.type}
                    checked={form.classType === classType.type}
                    onChange={handleChange}
                    className="mt-1 mr-3"
                  />
                  <div>
                    <div className="font-medium">{classType.label}</div>
                    <div className="text-sm text-gray-500">
                      {classType.price > 0
                        ? `Rp ${classType.price.toLocaleString("id-ID")}/sesi`
                        : "Hubungi Kami"}
                    </div>
                  </div>
                </label>
              ))
            ) : (
              <div className="text-center py-4 text-gray-500">
                Tidak ada kelas tersedia untuk instrumen ini
              </div>
            )}
          </div>
        </div>

        {/* Tingkat Kemampuan */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Tingkat Kemampuan <span className="text-red-500">*</span>
          </label>
          <select
            name="level"
            value={form.level}
            onChange={handleChange}
            disabled={!form.instrument}
            className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500 text-gray-700 disabled:bg-gray-100"
          >
            <option value="">Pilih Tingkat Kemampuan</option>
            {levels.map((lvl, index) => (
              <option key={index} value={lvl}>
                {lvl}
              </option>
            ))}
          </select>
        </div>

        {/* Button Submit */}
        <button
          onClick={handleSubmit}
          className="w-full bg-red-400 hover:bg-red-500 text-white font-medium py-3 rounded transition-colors"
        >
          Lanjut ke Pilih Jadwal
        </button>
      </div>
    </div>
  );
};

export default StepDataDiri;
