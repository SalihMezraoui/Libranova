import React, { useState } from "react";
import { useTranslation } from "react-i18next";

type ExpandedItemsState = {
  [key: string]: boolean;
};

const Accessibility: React.FC = () => {
  const { t } = useTranslation();

  const [expandedItems, setExpandedItems] = useState<ExpandedItemsState>({});

  const toggleExpand = (key: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const items = [
    { key: "keyboard", icon: "✅" },
    { key: "responsive", icon: "📱" },
    { key: "colors", icon: "🎨" },
    { key: "clarity", icon: "📝" },
    { key: "multilang", icon: "🌍" }
  ];

  return (
    <div className="container my-5">
      <div className="card shadow-lg border-0 rounded-3">
        <div className="card-body p-4">
          <h2 className="card-title text-primary mb-3">
            {t("accessibility.title")}
          </h2>
          <p className="card-text">{t("accessibility.description")}</p>

          <ul className="list-group list-group-flush mt-3">
            {items.map(({ key, icon }) => (
              <li className="list-group-item d-flex flex-column" key={key}>
                <div className="d-flex align-items-center">
                  <span>{icon} {t(`accessibility.${key}`)}</span>
                  <button
                    onClick={() => toggleExpand(key)}
                    className="btn btn-sm btn-outline-primary ms-3 d-flex align-items-center"
                    style={{ gap: "4px" }}
                  >
                    {expandedItems[key]
                      ? t("accessibility.hide")
                      : t("accessibility.show_more")}
                    <span
                      style={{
                        display: "inline-block",
                        transition: "transform 0.3s",
                        transform: expandedItems[key]
                          ? "rotate(180deg)"
                          : "rotate(0deg)"
                      }}
                    >
                      ▼
                    </span>
                  </button>
                </div>

                {expandedItems[key] && (
                  <p className="mt-2 text-muted">
                    {t(`accessibility.${key}_desc`)}
                  </p>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Accessibility;
