import { Oval } from "react-loader-spinner";
import type { LoaderSpinnerProps } from "../../types/LoaderSpinnerTypes";

const LoaderSpinner = ({
  size = 60,
  color = "#2563eb",
  fullScreen = false,
}: LoaderSpinnerProps) => {
  return (
    <div
      className={`flex items-center justify-center ${
        fullScreen ? "h-screen w-screen" : ""
      }`}
    >
      <Oval
        height={size}
        width={size}
        color={color}
        ariaLabel="loader"
        strokeWidth={6}
        strokeWidthSecondary={6}
        secondaryColor="#e5e7eb"
      />
    </div>
  );
};
export default LoaderSpinner;