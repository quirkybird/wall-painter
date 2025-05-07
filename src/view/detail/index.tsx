import MainLayout from "@/layout/main/MainLayout";
import { Card, List, Button } from "antd-mobile";
import { useParams } from "react-router-dom";
import html2canvas from "html2canvas";
import "./index.less";
import { useEffect, useState } from "react";
import { transformProjectData } from "./helper";
import { fetchCalcResById } from "@/api/wallet";
import { getUnitCost } from "@/api/unitSetting";

interface DetailItem {
  name: string;
  price: number;
  quantity: number;
  unit: string;
  subtotal: number;
}

interface DetailSection {
  title: string;
  items: DetailItem[];
  sectionTotal: number;
}

function DetailPage() {
  const { id } = useParams<{ id: string | undefined }>();
  const [detailData, setDetailData] = useState<DetailSection[]>([]);
  const [originDetailData, setOriginDetailData] = useState<any>({});

  useEffect(() => {
    // 从API获取价格数据
    getUnitCost()
      .then((data: any) => {
        if (data.length > 0) {
          const priceData = data[0];
          if (!id) return;
          // 根据projectId获取数据
          fetchCalcResById(id)
            .then((response) => {
              setOriginDetailData(response[0]);
              const transformedData = transformProjectData({
                ...response[0],
                ...priceData,
              });
              console.log("转换后的数据", transformedData);
              setDetailData(transformedData);
            })
            .catch((error) => {
              console.error("获取数据错误", error);
            });
        }
      })
      .catch((error) => {
        console.error("获取价格数据失败:", error);
      });
  }, []);

  const handleExportImage = async () => {
    const element = document.querySelector(".detail-card");
    if (!element) return;

    try {
      const canvas = await html2canvas(element as HTMLElement, {
        backgroundColor: "#ffffff",
        useCORS: true,
        scale: 2, // 提高清晰度
      });

      const url = canvas.toDataURL("image/png");
      const link = document.createElement("a");
      link.download = `结算详情_${originDetailData?.total}元.png`;
      link.href = url;
      link.click();
    } catch (error) {
      console.error("导出图片失败:", error);
    }
  };

  const renderDetailItem = (item: DetailItem) =>
    Number(item.subtotal) > 0 && (
      <List.Item
        key={item.name}
        extra={`¥${item.subtotal}`}
        description={`${item.price}元/${item.unit} × ${item.quantity}${item.unit}`}
      >
        {item.name}
      </List.Item>
    );

  return (
    <MainLayout>
      <div
        style={{
          backgroundColor: "#f5f5f5",
          minHeight: "calc(100vh - 3.15rem)",
          padding: "16px",
        }}
      >
        <div className="detail-card">
          <Card
            title="结算详情"
            style={{
              borderRadius: "16px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              background: "#ffffff",
            }}
          >
            {detailData.map((section, index) => (
              <>
                {Number(section.sectionTotal) > 0 && (
                  <div
                    key={section.title}
                    style={{
                      marginBottom: index < detailData.length - 1 ? "16px" : 0,
                    }}
                  >
                    <List header={section.title}>
                      {section.items.map(renderDetailItem)}
                      <List.Item extra={`¥${section.sectionTotal}`}>
                        <span style={{ fontWeight: "bold" }}>小计</span>
                      </List.Item>
                    </List>
                  </div>
                )}
              </>
            ))}

            <div
              style={{
                marginTop: "16px",
                padding: "12px 16px",
                borderTop: "1px solid #f5f5f5",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span style={{ fontSize: "16px", fontWeight: "bold" }}>总计</span>
              <span
                style={{
                  fontSize: "20px",
                  fontWeight: "bold",
                  color: "#FFC300",
                }}
              >
                ¥{originDetailData?.total}
              </span>
            </div>
          </Card>
        </div>
        <Button
          color="primary"
          onClick={handleExportImage}
          style={{ marginBlock: "12px", width: "100%" }}
        >
          导出结算详情
        </Button>
      </div>
    </MainLayout>
  );
}

export default DetailPage;
