import React from "react";
import { TabBar } from "antd-mobile";
import { useNavigate, useLocation } from "react-router-dom";
import { AddSubtract, Notes, SettingTwo } from "@icon-park/react";
import useI18n from "@/hooks/i18n.ts";
import "./index.less";

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const t = useI18n();
  const location = useLocation();
  const { pathname } = location;
  const [activeKey, setActiveKey] = React.useState(pathname);

  const tabs = [
    {
      key: "/",
      title: t("单价设置"),
      icon:
        activeKey === "/" ? (
          <SettingTwo theme="two-tone" size="24" fill={["#333", "#FFC300"]} />
        ) : (
          <SettingTwo theme="outline" size="24" fill="#333" />
        ),
    },
    {
      key: "/wallet",
      title: t("计算总价"),
      icon:
        activeKey === "/wallet" ? (
          <AddSubtract theme="two-tone" size="24" fill={["#333", "#FFC300"]} />
        ) : (
          <AddSubtract theme="outline" size="24" fill="#333" />
        ),
    },
    {
      key: "/history",
      title: t("计算历史"),
      icon:
        activeKey === "/history" ? (
          <Notes theme="two-tone" size="24" fill={["#333", "#FFC300"]} />
        ) : (
          <Notes theme="outline" size="24" fill="#333" />
        ),
    },
  ];

  const setRouteActive = (value: string) => {
    setActiveKey(value);
    navigate(value);
  };

  return (
    <div className="main-layout">
      <div className="content layout-content">{children}</div>

      <div className="footer layout-tab">
        <TabBar activeKey={activeKey} onChange={setRouteActive}>
          {tabs.map((item) => (
            <TabBar.Item
              key={item.key}
              icon={item.icon}
              title={item.title}
              style={{
                color: "#333",
              }}
            />
          ))}
        </TabBar>
      </div>
    </div>
  );
};

export default MainLayout;
