import { Link, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

import { navLinks, type NavLink, type SubLink } from "../data/navigation";

export default function Sidebar() {
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });
  const [expandedGroups, setExpandedGroups] = useState<string[]>([]);

  useEffect(() => {
    localStorage.setItem("sidebarCollapsed", JSON.stringify(collapsed));
  }, [collapsed]);

  useEffect(() => {
    const handleSidebarStateChange = (event: Event) => {
      const customEvent = event as CustomEvent;
      setCollapsed(customEvent.detail.collapsed);
    };

    window.addEventListener("sidebarStateChanged", handleSidebarStateChange);
    return () => {
      window.removeEventListener(
        "sidebarStateChanged",
        handleSidebarStateChange,
      );
    };
  }, []);

  const toggleGroup = (label: string) => {
    setExpandedGroups((prev) =>
      prev.includes(label) ? prev.filter((g) => g !== label) : [...prev, label],
    );
  };

  const isActive = (path?: string) => path === pathname;

  const linkClass = (path?: string) =>
    `flex items-center ${
      collapsed ? "justify-center" : "justify-start gap-3 px-4"
    } py-3 rounded-lg mb-2 transition-colors duration-200 ${
      isActive(path)
        ? "bg-blue-600 text-white"
        : "text-gray-300 hover:bg-blue-900"
    }`;

  const groupButtonClass = () =>
    `flex items-center ${
      collapsed ? "justify-center" : "justify-between"
    } w-full ${
      collapsed ? "justify-center" : "justify-start gap-3 px-4"
    } py-3 rounded-lg mb-2 transition-colors duration-200 text-gray-300 hover:bg-blue-900 cursor-pointer`;

  const renderSubLink = (subLink: SubLink, parentLabel: string) => {
    const id = `${parentLabel}-${subLink.label}`;
    const isExpanded = expandedGroups.includes(id);
    const hasSubLinks = "subLinks" in subLink;

    if (hasSubLinks) {
      return (
        <div key={id}>
          <button
            onClick={() => toggleGroup(id)}
            className={`flex items-center justify-between w-full px-4 py-2 rounded-lg mb-2 transition-colors duration-200 text-gray-300 hover:bg-blue-900 cursor-pointer text-sm`}
          >
            <span className="flex-1 text-left">{subLink.label}</span>
            {!collapsed && (
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${
                  isExpanded ? "rotate-180" : ""
                }`}
              />
            )}
          </button>

          {isExpanded && !collapsed && (
            <div className="ml-4 border-l border-gray-700 pl-2">
              {(subLink as any).subLinks.map((sub: SubLink) =>
                renderSubLink(sub, parentLabel),
              )}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={(subLink as any).to}
        to={(subLink as any).to}
        className={`flex items-center gap-3 px-4 py-2 rounded-lg mb-2 transition-colors duration-200 text-gray-300 hover:bg-blue-900 text-sm ${
          isActive((subLink as any).to) ? "bg-blue-600 text-white" : ""
        }`}
      >
        <span>{subLink.label}</span>
      </Link>
    );
  };

  const renderMenuItem = (link: NavLink, index: number) => {
    const isExpanded = expandedGroups.includes(link.label);
    const hasChildren = link.subLinks && link.subLinks.length > 0;

    if (!hasChildren) {
      return (
        <Link
          key={`${link.label}-${index}`}
          to={link.to}
          className={linkClass(link.to)}
        >
          <span className="text-xl">{link.icon}</span>
          {!collapsed && <span>{link.label}</span>}
        </Link>
      );
    }

    return (
      <div key={`${link.label}-${index}`}>
        <button
          onClick={() => toggleGroup(link.label)}
          className={groupButtonClass()}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{link.icon}</span>
            {!collapsed && <span>{link.label}</span>}
          </div>
          {!collapsed && (
            <ChevronDown
              size={16}
              className={`transition-transform duration-200 ${
                isExpanded ? "rotate-180" : ""
              }`}
            />
          )}
        </button>

        {isExpanded && !collapsed && (
          <div className="ml-4 border-l border-gray-700 pl-2">
            {link.subLinks?.map((sub) => renderSubLink(sub, link.label))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div
      className={`h-screen bg-gray-900 border-r border-gray-800 p-4 flex flex-col transition-all duration-300 flex-shrink-0 ${
        collapsed ? "w-20" : "w-64"
      }`}
    >
      <h1
        className={`text-2xl font-bold mb-6 text-white transition-opacity duration-300 ${
          collapsed ? "opacity-0 pointer-events-none" : "opacity-100"
        }`}
      >
        ProPerform
      </h1>

      <div className="flex-1 overflow-y-auto sidebar-scroll">
        {navLinks.map((link, index) => renderMenuItem(link, index))}
      </div>

      <button
        onClick={() => setCollapsed(!collapsed)}
        className={`cursor-pointer bg-gray-800 hover:bg-gray-700 text-white p-2 rounded-full transition mt-auto ${
          collapsed ? "self-center" : "self-end"
        }`}
      >
        {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
      </button>
    </div>
  );
}
