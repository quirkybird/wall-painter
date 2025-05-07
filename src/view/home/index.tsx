import MainLayout from "@/layout/main/MainLayout";
import "./index.less";
import { Form, Input, Button, Card, Toast, List } from "antd-mobile";
import { useEffect, useState } from "react";
import { Tool } from "@icon-park/react";
import { getUnitCost, updateUnitCost } from "@/api/unitSetting";

interface PriceFormData {
  id?: string; // 唯一标识符
  // 内墙价格
  fakePortcelain: number; // 仿瓷价格（元/平方）
  latex: number; // 乳胶漆价格（元/平方）
  plasterLine: number; // 石膏线价格（元/米）
  edgeDrop: number; // 边吊价格（元/米）
  plaster: number; // 石膏价格（元/包）
  // 外墙价格
  realStone: number; // 真石漆价格（元/平方）
  romanColumn: number; // 罗马柱价格（元/个）
  roundColumn: number; // 圆柱子价格（元/个）
  railing: number; // 栏杆价格（元/米）
}

function Index() {
  const [form] = Form.useForm<PriceFormData>();
  const [isEditMode, setIsEditMode] = useState(false);
  const [priceData, setPriceData] = useState<PriceFormData>({
    fakePortcelain: 0,
    latex: 0,
    plasterLine: 0,
    edgeDrop: 0,
    plaster: 0, // 新增
    realStone: 0,
    romanColumn: 0,
    roundColumn: 0,
    railing: 0, // 新增
  });

  useEffect(() => {
    // 从API获取价格数据
    getUnitCost()
      .then((data: any) => {
        if (data.length > 0) {
          const priceData = data[0];
          setPriceData(priceData);
          form.setFieldsValue(priceData);
        }
      })
      .catch((error) => {
        console.error("获取价格数据失败:", error);
      });
  }, []);

  const handlePriceChange = (
    value: string,
    setValue: (val: string) => void
  ) => {
    // 如果输入为空，允许继续输入
    if (value === "") {
      setValue("");
      return;
    }

    const numValue = Number(value);
    // 检查是否是有效数字
    if (isNaN(numValue)) {
      setValue("");
      return;
    }

    if (numValue > 1000) {
      setValue("1000.00");
    } else if (numValue < 0) {
      setValue("0.00");
    } else {
      // 当失去焦点时才格式化为两位小数
      setValue(value);
    }
  };

  // 添加新的处理函数，处理失去焦点时的格式化
  const handlePriceBlur = (value: string, setValue: (val: string) => void) => {
    if (value === "") {
      setValue("0.00");
      return;
    }
    const numValue = Number(value);
    setValue(numValue.toFixed(2));
  };

  const onFinish = async (values: PriceFormData) => {
    console.log("表单数据:", values);
    await updateUnitCost(priceData.id, values);
    setPriceData(values);
    setIsEditMode(false);
    Toast.show({
      content: "保存成功！",
      position: "bottom",
    });
  };

  const renderUnitSuffix = (unit: string) => (
    <div
      style={{
        color: "#999",
        fontSize: "14px",
        marginLeft: "4px",
        display: "flex",
        alignItems: "center",
      }}
    >
      {unit}
    </div>
  );

  const renderPriceList = () => (
    <div>
      <List header="内墙项目价格">
        <List.Item
          extra={`${Number(priceData.fakePortcelain).toFixed(2)}元/平方`}
        >
          仿瓷
        </List.Item>
        <List.Item extra={`${Number(priceData.latex).toFixed(2)}元/平方`}>
          乳胶漆
        </List.Item>
        <List.Item extra={`${Number(priceData.plasterLine).toFixed(2)}元/米`}>
          石膏线
        </List.Item>
        <List.Item extra={`${Number(priceData.edgeDrop).toFixed(2)}元/米`}>
          边吊
        </List.Item>
        <List.Item extra={`${Number(priceData.plaster).toFixed(2)}元/包`}>
          石膏
        </List.Item>
      </List>

      <List header="外墙项目价格">
        <List.Item extra={`${Number(priceData.realStone).toFixed(2)}元/平方`}>
          真石漆
        </List.Item>
        <List.Item extra={`${Number(priceData.romanColumn).toFixed(2)}元/个`}>
          罗马柱
        </List.Item>
        <List.Item extra={`${Number(priceData.roundColumn).toFixed(2)}元/个`}>
          圆柱子
        </List.Item>
        <List.Item extra={`${Number(priceData.railing).toFixed(2)}元/米`}>
          栏杆
        </List.Item>
      </List>
    </div>
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
        <Card
          style={{
            borderRadius: "16px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            background: "#ffffff",
          }}
          extra={
            <Tool
              theme="two-tone"
              size="24"
              fill={isEditMode ? ["#333", "#FFC300"] : ["#333", "#fff"]}
              style={{ fontSize: 24 }}
              onClick={() => setIsEditMode(!isEditMode)}
            />
          }
          title={
            <div
              style={{
                width: "100%",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <span>{isEditMode ? "装修单价设置" : "装修单价"}</span>
            </div>
          }
        >
          {isEditMode ? (
            <Form
              form={form}
              layout="horizontal"
              onFinish={onFinish}
              initialValues={priceData}
              style={
                {
                  "--border-top": "0px",
                  "--border-bottom": "0px",
                } as any
              }
              footer={
                <div style={{ display: "flex", gap: "12px" }}>
                  <Button block onClick={() => setIsEditMode(false)}>
                    取消
                  </Button>
                  <Button block type="submit" color="primary">
                    保存设置
                  </Button>
                </div>
              }
            >
              <Form.Header>内墙项目价格</Form.Header>
              <Form.Item
                name="fakePortcelain"
                label="仿瓷"
                extra={renderUnitSuffix("元/平方")}
                rules={[{ required: true, message: "请输入价格" }]}
              >
                <Input
                  type="number"
                  placeholder="请输入价格"
                  onChange={(val) =>
                    handlePriceChange(val, (newVal) =>
                      form.setFieldValue("fakePortcelain", newVal)
                    )
                  }
                  onBlur={(e) =>
                    handlePriceBlur(e.target.value, (newVal) =>
                      form.setFieldValue("fakePortcelain", newVal)
                    )
                  }
                />
              </Form.Item>

              <Form.Item
                name="latex"
                label="乳胶漆"
                extra={renderUnitSuffix("元/平方")}
                rules={[{ required: true, message: "请输入价格" }]}
              >
                <Input
                  type="number"
                  placeholder="请输入价格"
                  onChange={(val) =>
                    handlePriceChange(val, (newVal) =>
                      form.setFieldValue("latex", newVal)
                    )
                  }
                  onBlur={(e) =>
                    handlePriceBlur(e.target.value, (newVal) =>
                      form.setFieldValue("latex", newVal)
                    )
                  }
                />
              </Form.Item>

              <Form.Item
                name="plasterLine"
                label="石膏线"
                extra={renderUnitSuffix("元/米")}
                rules={[{ required: true, message: "请输入价格" }]}
              >
                <Input
                  type="number"
                  placeholder="请输入价格"
                  onChange={(val) =>
                    handlePriceChange(val, (newVal) =>
                      form.setFieldValue("plasterLine", newVal)
                    )
                  }
                  onBlur={(e) =>
                    handlePriceBlur(e.target.value, (newVal) =>
                      form.setFieldValue("plasterLine", newVal)
                    )
                  }
                />
              </Form.Item>

              <Form.Item
                name="edgeDrop"
                label="边吊"
                extra={renderUnitSuffix("元/米")}
                rules={[{ required: true, message: "请输入价格" }]}
              >
                <Input
                  type="number"
                  placeholder="请输入价格"
                  onChange={(val) =>
                    handlePriceChange(val, (newVal) =>
                      form.setFieldValue("edgeDrop", newVal)
                    )
                  }
                  onBlur={(e) =>
                    handlePriceBlur(e.target.value, (newVal) =>
                      form.setFieldValue("edgeDrop", newVal)
                    )
                  }
                />
              </Form.Item>

              <Form.Item
                name="plaster"
                label="石膏"
                extra={renderUnitSuffix("元/包")}
                rules={[{ required: true, message: "请输入价格" }]}
              >
                <Input
                  type="number"
                  placeholder="请输入价格"
                  onChange={(val) =>
                    handlePriceChange(val, (newVal) =>
                      form.setFieldValue("plaster", newVal)
                    )
                  }
                  onBlur={(e) =>
                    handlePriceBlur(e.target.value, (newVal) =>
                      form.setFieldValue("plaster", newVal)
                    )
                  }
                />
              </Form.Item>

              <Form.Header>外墙项目价格</Form.Header>
              <Form.Item
                name="realStone"
                label="真石漆"
                extra={renderUnitSuffix("元/平方")}
                rules={[{ required: true, message: "请输入价格" }]}
              >
                <Input
                  type="number"
                  placeholder="请输入价格"
                  onChange={(val) =>
                    handlePriceChange(val, (newVal) =>
                      form.setFieldValue("realStone", newVal)
                    )
                  }
                  onBlur={(e) =>
                    handlePriceBlur(e.target.value, (newVal) =>
                      form.setFieldValue("realStone", newVal)
                    )
                  }
                />
              </Form.Item>

              <Form.Item
                name="romanColumn"
                label="罗马柱"
                extra={renderUnitSuffix("元/个")}
                rules={[{ required: true, message: "请输入价格" }]}
              >
                <Input
                  type="number"
                  placeholder="请输入价格"
                  onChange={(val) =>
                    handlePriceChange(val, (newVal) =>
                      form.setFieldValue("romanColumn", newVal)
                    )
                  }
                  onBlur={(e) =>
                    handlePriceBlur(e.target.value, (newVal) =>
                      form.setFieldValue("romanColumn", newVal)
                    )
                  }
                />
              </Form.Item>

              <Form.Item
                name="roundColumn"
                label="圆柱子"
                extra={renderUnitSuffix("元/个")}
                rules={[{ required: true, message: "请输入价格" }]}
              >
                <Input
                  type="number"
                  placeholder="请输入价格"
                  onChange={(val) =>
                    handlePriceChange(val, (newVal) =>
                      form.setFieldValue("roundColumn", newVal)
                    )
                  }
                  onBlur={(e) =>
                    handlePriceBlur(e.target.value, (newVal) =>
                      form.setFieldValue("roundColumn", newVal)
                    )
                  }
                />
              </Form.Item>

              <Form.Item
                name="railing"
                label="栏杆"
                extra={renderUnitSuffix("元/米")}
                rules={[{ required: true, message: "请输入价格" }]}
              >
                <Input
                  type="number"
                  placeholder="请输入价格"
                  onChange={(val) =>
                    handlePriceChange(val, (newVal) =>
                      form.setFieldValue("railing", newVal)
                    )
                  }
                  onBlur={(e) =>
                    handlePriceBlur(e.target.value, (newVal) =>
                      form.setFieldValue("railing", newVal)
                    )
                  }
                />
              </Form.Item>
            </Form>
          ) : (
            <div>{renderPriceList()}</div>
          )}
        </Card>
      </div>
    </MainLayout>
  );
}

export default Index;
