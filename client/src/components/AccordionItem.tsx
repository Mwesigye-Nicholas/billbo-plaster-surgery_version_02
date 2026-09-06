import { FaChevronDown, FaChevronRight } from "react-icons/fa";
import type { ReactNode } from "react";

interface AccordionItemProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
}

const AccordionItem = ({
  title,
  isOpen,
  onToggle,
  children,
}: AccordionItemProps) => {
  return (
    <div>
      <div className="flex justify-center items-center my-4">
        <span className="text-base sm:text-xl md: ">{title}</span>

        <button type="button" onClick={onToggle} className="mt-1 text-sm px-4">
          {isOpen ? <FaChevronDown  /> : <FaChevronRight />}
        </button>
      </div>

      {isOpen && <div className="text-sm">{children}</div>}
    </div>
  );
};

export default AccordionItem;
