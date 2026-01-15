interface StepIndicatorProps {
  step: number;
}

const steps = ["Data Diri", "Pilih Jadwal", "Pembayaran", "Selesai"];

const StepIndicator = ({ step }: StepIndicatorProps) => {
  return (
    <div className="flex items-center justify-center mb-8 w-full">
      <div className="flex items-center w-full max-w-2xl px-4">
        {steps.map((label, index) => {
          const stepNumber = index + 1;
          const isCompleted = step > stepNumber;
          const isActive = step === stepNumber;
          const isUpcoming = step < stepNumber;

          return (
            <div
              key={label}
              className="flex items-center"
              style={{ flex: index < steps.length - 1 ? 1 : "none" }}
            >
              {/* Step Circle and Label */}
              <div className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${
                    isCompleted
                      ? "bg-red-500 text-white"
                      : isActive
                      ? "bg-red-500 text-white ring-4 ring-red-200"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  {isCompleted ? "✓" : stepNumber}
                </div>
                <span
                  className={`mt-2 text-xs font-medium whitespace-nowrap ${
                    isCompleted || isActive ? "text-gray-800" : "text-gray-400"
                  }`}
                >
                  {label}
                </span>
              </div>

              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-3">
                  <div
                    className={`h-1 rounded-full transition-all ${
                      step > stepNumber ? "bg-red-500" : "bg-gray-300"
                    }`}
                  ></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default StepIndicator;
