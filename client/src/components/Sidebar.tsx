import { NavLink } from "react-router-dom";
import sideBarConfig from "../navigation/sidebar.config";
import { useState } from "react";
import AccordionItem from "./AccordionItem";

type Sectionkey = "dashboard" | "clinical" | "administration";

interface SidebarProps{
  onNavigate: () => void;
}

const Sidebar = ({ onNavigate }: SidebarProps) => {
  const handleNavClick = () => {
    if (window.innerWidth < 768) {
      onNavigate();
    }
  }
  const [openSection, setOpenSection] = useState<Record<Sectionkey, boolean>>({
    dashboard: false,
    clinical: false,
    administration: false,
  });

  const toggleSection = (key: keyof typeof openSection) => {
    setOpenSection((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <nav>
      {/* Sidebar.Config*/}
      {sideBarConfig.map((section) => (
        <AccordionItem
          key={section.section}
          title={section.section}
          isOpen={openSection[section.key]}
          onToggle={() => toggleSection(section.key)}
        >
          <ul className="flex flex-col justify-center items-center">
            {section.items.map((item) => (
              <li key={item.label} className="text-base my-3">
                {item.path && (
                  <NavLink to={item.path} end onClick={handleNavClick}>
                    {item.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </AccordionItem>
      ))}
    </nav>
    /*
     <nav>
      {sideBarConfig.map((section) => (
        <div
          key={section.section}
          className=" border-amber-500 flex flex-col sm:flex-col"
        >
          <div className="border-red-700 border-2 flex justify-center items-center">
            <h4 className="text-xl sm:text-2xl md:text-3xl py-2  mx-2 pl-1">
              {section.section}
            </h4>
          </div>

          <ul className="flex flex-col sm:flex-col  justify-center items-center">
            {section.items.map((item) => (
              <li key={item.label} className="text-base my-3">
                {item.path && (
                  <NavLink to={item.path} end>
                    {item.label}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>    
  */
  );
};
export default Sidebar;
