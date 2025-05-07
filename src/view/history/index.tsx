import { fetchEngineeringCalculation } from "@/api/wallet";
import MainLayout from "@/layout/main/MainLayout";
import { Card, List } from "antd-mobile";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import dayjs from "dayjs";

interface HistoryItem {
  id: string;
  created_at: string;
  total: number;
  projectName: string;
  projectId: string;
}

function HistoryPage() {
  const navigate = useNavigate();
  const [historyData, setHistoryData] = useState<HistoryItem[]>([]);

  useEffect(() => {
    // 从API获取计算历史数据
    fetchEngineeringCalculation().then((data) => {
      setHistoryData(data);
    });
  }, []);

  return (
    <MainLayout>
      <div
        style={{
          backgroundColor: "#f5f5f5",
          minHeight: "calc(100vh - 3.15rem)",
          padding: "16px",
        }}
      >
        <Card title="计算历史">
          <List>
            {historyData.map((item) => (
              <List.Item
                key={item.id}
                onClick={() => navigate(`/detail/${item.projectId}`)}
                arrow={true}
                extra={`¥${item.total}`}
                description={dayjs(item.created_at).format(
                  "YYYY-MM-DD HH:mm:ss"
                )}
              >
                {item.projectName}
              </List.Item>
            ))}
          </List>
        </Card>
      </div>
    </MainLayout>
  );
}

export default HistoryPage;
