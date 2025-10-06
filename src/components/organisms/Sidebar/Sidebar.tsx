"use client";

import React, { useState, Suspense } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { HelpCircle, ChevronDown, PanelLeftClose } from "lucide-react";
import Logo from "./Logo";

interface SidebarItem {
  id: string;
  label: string;
  icon: string;
  href?: string;
  children?: SidebarItem[];
}

interface SidebarSection {
  id: string;
  label: string;
  items: SidebarItem[];
  icon: string;
  href?: string;
}

const sidebarSections: SidebarSection[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: "/layout-dashboard.svg",
    href: "/dashboard",
    items: [],
  },
  {
    id: "activity",
    label: "Activity Manager",
    icon: "/user.svg",
    items: [
      {
        id: "pending",
        label: "Pending Activities",
        icon: "/pending-activity.svg",
        href: "/activities/pending",
      },
      {
        id: "involved",
        label: "Involved Activities",
        icon: "/involved-activity.svg",
        href: "/activities/involved",
      },
    ],
  },
  {
    id: "entities",
    label: "ENTITIES",
    icon: "/building.svg",
    items: [
      {
        id: "propertys",
        label: "Propertys",
        icon: "/developers-icon.svg",
        href: "/propertys",
      },
      {
        id: "property-management-company",
        label: "Property Management Company",
        icon: "/project.svg",
        href: "/property-management-company",
      },
      {
        id: "owners",
        label: "Owners",
        icon: "/invester.svg",
        href: "/owners",
      },
    ],
  },
  {
    id: "deposits",
    label: "DEPOSITS",
    icon: "/dollar-circle.svg",
    items: [
      // {
      //   id: 'unallocated',
      //   label: 'Unallocated Transaction',
      //   icon: '/Transaction.svg',
      //   href: '/transactions/unallocated',
      // },
      {
        id: "deposit",
        label: "Deposit Transaction",
        icon: "/discarded-transaction.svg",
        href: "/transactions/deposit",
      },
      {
        id: "allocated",
        label: "Allocated Transaction",
        icon: "/Transaction_Allocated.svg",
        href: "/transactions/allocated",
      },
    ],
  },
  {
    id: "payment",
    label: "PAYMENT",
    icon: "/dock.svg",
    items: [
      {
        id: "voucher",
        label: "Voucher ",
        icon: "/hand-coins.svg",
        href: "/payments/voucher",
      },
      {
        id: "onlin-channel-payment",
        label: "Online",
        icon: "/hand-coins.svg",
        href: "/payments/online",
      }
      // {
      //   id: 'tas',
      //   label: 'TAS Payment',
      //   icon: '/file-key.svg',
      //   href: '/payments/tas',
      // },
    ],
  },
  {
    id: "budget",
    label: "BUDGET",
    icon: "/project.svg",
    items: [
      {
        id: "master-budget",
        label: "Master Budget",
        icon: "/developers-icon.svg",
        href: "/budgets/master-budget",
      },
      {
        id: "property-budget",
        label: "Property Budget",
        icon: "/project.svg",
        href: "/budgets/property-budget",
      },
    ],
  },
  //   {
  //   id: 'guarantee',
  //   label: 'Guarantee',
  //   icon: '/guarantee.svg',
  //   href: '/guarantee',
  //   items: [],
  // },
  //  {
  //   id: 'fee-repush',
  //   label: 'Fee Repush',
  //   icon: '/fee.svg',
  //   href: '/fee-repush',
  //   items: [],
  // },
  {
    id: "reports",
    label: "REPORTS",
    icon: "/reports.svg",
    items: [
      {
        id: "business",
        label: "Business Report",
        icon: "/file-chart-pie.svg",
        href: "/reports/business",
      },
    ],
  },
  {
    id: "system-admin",
    label: "SYSTEM ADMIN",
    icon: "/user-cog.svg",
    items: [
      {
        id: "bank",
        label: "Bank Management",
        icon: "/bank-management.svg",
        href: "/admin/bank-management",
      },
      {
        id: "user",
        label: "User Management",
        icon: "/user-management.svg",
        href: "/admin/user-management",
      },
      {
        id: "role",
        label: "Role Management",
        icon: "/role-management.svg",
        href: "/admin/role-management",
      },
      {
        id: "fee-type",
        label: "Fee Type",
        icon: "/fee.svg",
        href: "/admin/fee-types",
      },
    ],
  },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const [expandedItems, setExpandedItems] = useState<string[]>([]);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "activity",
    "entities",
    "deposits",
    "payment",
    "reports",
    "system-admin",
    "budget"
  ]);

  const isActive = (href: string) => pathname === href;
  const isExpanded = (itemId: string) => expandedItems.includes(itemId);
  const isSectionExpanded = (sectionId: string) =>
    expandedSections.includes(sectionId);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) =>
      prev.includes(sectionId)
        ? prev.filter((id) => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const isParentActive = (item: SidebarItem) => {
    if (item.href && isActive(item.href)) return true;
    if (item.children) {
      return item.children.some((child) => child.href && isActive(child.href));
    }
    return false;
  };

  return (
    <div className="w-62 flex flex-col px-4 border border-[#FFFFFF80] ml-4 mt-[15px] bg-[#FFFFFF40] rounded-2xl">
      {/* Logo */}
      <div>
        <Suspense
          fallback={
            <div className="w-32 h-8 bg-gray-200 rounded animate-pulse"></div>
          }
        >
          <Logo />
        </Suspense>
      </div>

      {/* Navigation */}
      <nav className="flex-1  overflow-y-auto scrollbar-hide py-4 border-t border-t-[#CAD5E2]">
        {sidebarSections.map((section) => (
          <div key={section.id} className="">
            {/* Section Header */}
            {section.label && (
              <div className="flex items-center gap-2 p-2">
                {section.href ? (
                  <Link
                    href={section.href}
                    className={`flex items-center gap-2 flex-1 ${
                      isActive(section.href)
                        ? "text-[#155DFC]"
                        : "text-[#4A5565]"
                    }`}
                  >
                    <img src={section.icon} alt="download icon" />
                    <h3 className="text-start font-sans font-medium text-[11px] leading-none uppercase align-middle">
                      {section.label}
                    </h3>
                  </Link>
                ) : (
                  <>
                    <img src={section.icon} alt="download icon" />
                    <h3 className="text-[#4A5565] text-start font-sans font-medium text-[11px] leading-none uppercase align-middle">
                      {section.label}
                    </h3>
                  </>
                )}
                {section.items.length > 0 && (
                  <button
                    onClick={() => toggleSection(section.id)}
                    className="p-1 transition-colors rounded hover:bg-gray-100"
                  >
                    <ChevronDown
                      className={`w-4 h-4 text-gray-400 transition-transform ${
                        isSectionExpanded(section.id) ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                )}
              </div>
            )}

            {/* Section Items */}
            {(!section.label || isSectionExpanded(section.id)) && (
              <div className="space-y-1">
                {section.items.map((item) => (
                  <div key={item.id}>
                    {item.children ? (
                      <>
                        <button
                          onClick={() => toggleExpanded(item.id)}
                          className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                            isParentActive(item)
                              ? "bg-blue-100 text-blue-600"
                              : "text-gray-700 hover:bg-gray-100"
                          }`}
                        >
                          <img src={item.icon} alt="download icon" />
                          <span className="flex-1 text-left">{item.label}</span>
                          <ChevronDown
                            className={`w-4 h-4 transition-transform ${
                              isExpanded(item.id) ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        {isExpanded(item.id) && (
                          <div className="mt-1 ml-8 space-y-1 ">
                            {item.children.map((child) => (
                              <Link
                                key={child.id}
                                href={child.href || "#"}
                                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                                  child.href && isActive(child.href)
                                    ? "bg-blue-100 text-blue-600"
                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                                }`}
                              >
                                <img src={child.icon} alt="download icon" />
                                {child.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Link
                        href={item.href || "#"}
                        className={`flex items-center gap-2 pl-[34px] py-2 pr-2 rounded-lg text-sm transition-colors font-outfit font-sans text-[13px] leading-[20px] align-middle ${
                          item.href && isActive(item.href)
                            ? "bg-[#DBEAFE] text-[#155DFC] font-medium"
                            : "text-[#1E2939] font-normal hover:bg-gray-100"
                        }`}
                      >
                        <img src={item.icon} alt="download icon" />
                        {item.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}

        {/* Help & Collapse */}
        <div className="pt-6 space-y-2 border-t border-gray-300">
          <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            <HelpCircle className="w-5 h-5 stroke-2" />
            Help
          </button>
          <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
            <PanelLeftClose className="w-5 h-5 stroke-2" />
          </button>
        </div>
      </nav>
    </div>
  );
};
