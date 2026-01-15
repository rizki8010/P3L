import { useEffect, useState } from "react";

const StepSelesai = () => {
  const [registrationData, setRegistrationData] = useState<any>(null);

  // helper ambil cookie
  const getCookie = (name: string) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2)
      return decodeURIComponent(parts.pop()!.split(";").shift()!);
    return null;
  };

  useEffect(() => {
    // ambil data final dari cookie
    const finalData = getCookie("finalRegistration");
    if (finalData) {
      setRegistrationData(JSON.parse(finalData));
    }
  }, []);

  // ambil data dari registrationData
  const dataDiri = registrationData?.dataDiri || {};
  const jadwal = registrationData?.jadwal || {};
  const pembayaran = registrationData?.pembayaran || {};

  return (
    <div className="w-full mx-auto p-6 bg-white rounded-lg shadow-sm">
      {/* Icon Success */}
      <div className="flex justify-center mb-6">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center">
          <svg
            className="w-12 h-12 text-green-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-center mb-2">
        Pendaftaran Berhasil!
      </h2>
      <p className="text-sm text-gray-600 text-center mb-8">
        Terima kasih telah mendaftar di Sharma Music
      </p>

      {/* Email Info */}
      <div className="bg-gray-50 rounded-lg p-6 mb-6 text-center">
        <div className="flex justify-center mb-3">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
            <svg
              className="w-6 h-6 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
          </div>
        </div>
        <h3 className="font-bold mb-2">Cek Email Anda</h3>
        <p className="text-sm text-gray-600">
          Kami telah mengirimkan detail lengkap pendaftaran ke:
        </p>
        <p className="font-medium text-gray-800 mt-1">{dataDiri.email}</p>
      </div>

      {/* Ringkasan Pendaftaran */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
        <h3 className="font-bold mb-4 text-center">Ringkasan Pendaftaran</h3>
        <div className="space-y-3 text-sm">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shrink-0 font-bold text-xs">
              1
            </div>
            <div>
              <p className="font-medium text-gray-700">Data Diri</p>
              <p className="text-gray-600">Nama: {dataDiri.full_name}</p>
              <p className="text-gray-600">Email: {dataDiri.email}</p>
              <p className="text-gray-600">No. Telepon: {dataDiri.phone}</p>
              <p className="text-gray-600">
                Tanggal Lahir:{" "}
                {dataDiri.birth_date
                  ? new Date(dataDiri.birth_date).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    })
                  : "-"}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shrink-0 font-bold text-xs">
              2
            </div>
            <div>
              <p className="font-medium text-gray-700">Kursus yang Dipilih</p>
              <p className="text-gray-600">
                Instrumen: {dataDiri.instrument || "-"}
              </p>
              <p className="text-gray-600">
                Jenis Kelas: {dataDiri.classType || "-"}
              </p>
              <p className="text-gray-600">Tingkat: {dataDiri.level || "-"}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shrink-0 font-bold text-xs">
              3
            </div>
            <div>
              <p className="font-medium text-gray-700">Jadwal Kursus</p>
              {jadwal.schedules && jadwal.schedules.length > 0 ? (
                jadwal.schedules.map((schedule: string, index: number) => (
                  <p key={index} className="text-gray-600">
                    • {schedule}
                  </p>
                ))
              ) : (
                <p className="text-gray-600">Belum ada jadwal dipilih</p>
              )}
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center shrink-0 font-bold text-xs">
              4
            </div>
            <div>
              <p className="font-medium text-gray-700">Metode Pembayaran</p>
              <p className="text-gray-600">{pembayaran.paymentMethod || "-"}</p>
              <p className="text-gray-600 text-xs mt-1">
                Bukti pembayaran telah diunggah dan akan diverifikasi dalam 1x24
                jam
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Langkah Selanjutnya */}
      <div className="border-2 border-red-300 rounded-lg p-4 mb-6">
        <h3 className="font-bold mb-3 text-red-600">Langkah Selanjutnya:</h3>
        <ol className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start gap-2">
            <span className="font-bold text-red-500 shrink-0">1</span>
            <span>
              Cek email untuk detail lengkap pendaftaran dan bukti pembayaran
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-red-500 shrink-0">2</span>
            <span>
              Tim kami akan memverifikasi pembayaran Anda dalam 1x24 jam
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-red-500 shrink-0">3</span>
            <span>
              Anda akan dihubungi via WhatsApp untuk konfirmasi jadwal dan
              memulai kursus
            </span>
          </li>
          <li className="flex items-start gap-2">
            <span className="font-bold text-red-500 shrink-0">4</span>
            <span>Siap memulai kursus musik Anda 🎵</span>
          </li>
        </ol>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        <button
          onClick={() => window.location.reload()}
          className="w-full py-3 bg-red-400 hover:bg-red-500 text-white font-medium rounded transition-colors"
        >
          Kembali ke Beranda
        </button>
        <button
          onClick={() => window.print()}
          className="w-full py-3 border-2 border-gray-400 text-gray-700 font-medium rounded hover:bg-gray-50 transition-colors"
        >
          Cetak Bukti Pendaftaran
        </button>
      </div>

      {/* Contact Info */}
      <p className="text-center text-sm text-gray-600 mt-6">
        Butuh bantuan? Hubungi kami di{" "}
        <span className="font-bold text-red-500">0811-1945-622</span>
      </p>
    </div>
  );
};

export default StepSelesai;
