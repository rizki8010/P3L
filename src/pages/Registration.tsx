import { useState } from "react";

// import semua step
import StepIndicator from "../components/StepIndicator";
import StepDataDiri from "../components/StepDatadiri";
import StepPilihJadwal from "../components/StepPilihJadwal";
import StepPembayaran from "../components/StepPembayaran";
import StepSelesai from "../components/StepSelesai";
import Navbar from "../components/Navbar";

const Registration = () => {
  const [step, setStep] = useState<number>(1);

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* NAVBAR */}
      <Navbar />

      {/* CONTENT */}
      <div className="pt-24 pb-32 px-4">
        <div className="max-w-4xl mx-auto">
          <StepIndicator step={step} />

          <div className="mt-6">
            {step === 1 && <StepDataDiri onNext={nextStep} />}
            {step === 2 && (
              <StepPilihJadwal onBack={prevStep} onNext={nextStep} />
            )}
            {step === 3 && (
              <StepPembayaran onBack={prevStep} onNext={nextStep} />
            )}
            {step === 4 && <StepSelesai />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
