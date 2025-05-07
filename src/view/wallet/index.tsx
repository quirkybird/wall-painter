import { getUnitCost } from "@/api/unitSetting";
import MainLayout from "@/layout/main/MainLayout";
import {
  Form,
  Input,
  Button,
  Card,
  Toast,
  Switch,
  Popup,
  List,
  Dialog,
} from "antd-mobile";
import { useEffect, useState } from "react";
import { Decimal } from "decimal.js";
import {
  fetchCalcResById,
  fetchEngineeringCalculationForProject,
  submitCalcRes,
  updateCalcRes,
} from "@/api/wallet";
import { useNavigate } from "react-router-dom";

interface CalculationFormData {
  projectName: string; // 新增工程名称字段
  // 内墙数量
  fakePortcelainQuantity: number; // 仿瓷面积（平方）
  latexQuantity: number; // 乳胶漆面积（平方）
  plasterLineQuantity: number; // 石膏线长度（米）
  edgeDropQuantity: number; // 边吊长度（米）
  plasterQuantity: number; // 石膏数量（包）
  // 外墙数量
  realStoneQuantity: number; // 真石漆面积（平方）
  romanColumnQuantity: number; // 罗马柱数量（个）
  roundColumnQuantity: number; // 圆柱子数量（个）
  railingQuantity: number; // 栏杆长度（米）
}

function Index() {
  const [form] = Form.useForm<CalculationFormData>();
  const nav = useNavigate();
  const [showInner, setShowInner] = useState(false); // 控制内墙表单显示
  const [showOuter, setShowOuter] = useState(false); // 控制外墙表单显示
  const [visible, setVisible] = useState(false); // 控制底部弹层
  const [projectInfo, setProjectInfo] = useState({
    projectName: "",
    projectId: "",
  }); // 选择的工程
  const [priceData, setPriceData] = useState<any>({}); // 单价
  const [historyProjects, setHistoryProjects] = useState<any>([]); // 单价
  const [calculating, setCalculating] = useState(false); // 添加 loading 状态

  useEffect(() => {
    let isSubscribed = true;

    const fetchData = async () => {
      try {
        const [priceResponse, projectsResponse] = await Promise.all([
          getUnitCost(),
          fetchEngineeringCalculationForProject(),
        ]);

        if (!isSubscribed) return;

        if (priceResponse && priceResponse.length > 0) {
          setPriceData(priceResponse[0]);
        }
        if (projectsResponse.length > 0) {
          setHistoryProjects(projectsResponse);
        }
      } catch (error) {
        console.error("数据加载失败:", error);
        if (isSubscribed) {
          Toast.show({
            content: "数据加载失败，请重试",
            position: "bottom",
          });
        }
      }
    };

    fetchData();

    return () => {
      isSubscribed = false;
    };
  }, []);

  const handleQuantityChange = (
    value: string,
    setValue: (val: string) => void
  ) => {
    const numValue = Number(value);
    if (numValue > 10000) {
      setValue("10000");
    } else if (numValue < 0) {
      setValue("0");
    } else {
      setValue(value);
    }
  };

  const handleSelectProject = async (project: any) => {
    try {
      if (project.projectId) {
        const data = await fetchCalcResById(project.projectId);
        if (data.length > 0) {
          const res = data[0];
          form.setFieldsValue({ ...res });
          if (res.innerAmount) {
            setShowInner(true);
          }
          if (res.outerAmount) {
            setShowOuter(true);
          }
        }
      }
      setProjectInfo({ ...project });
      form.setFieldValue("projectName", project.projectName);
      setVisible(false);
    } catch (error) {
      console.error("加载工程数据失败:", error);
      Toast.show({
        content: "加载工程数据失败，请重试",
        position: "bottom",
      });
    }
  };

  const handleAddNew = () => {
    Dialog.confirm({
      title: "新增工程",
      content: (
        <Input
          placeholder="请输入工程名称,推荐姓名+地址"
          id="projectNameInput"
        />
      ),
      afterShow: () => {
        const input = document.getElementById(
          "projectNameInput"
        ) as HTMLInputElement;
        input?.focus();
      },
      onConfirm: async () => {
        const input = document.getElementById(
          "projectNameInput"
        ) as HTMLInputElement;
        const value = input?.value?.trim();

        if (!value) {
          Toast.show({
            content: "请输入工程名称",
            position: "bottom",
          });
          return Promise.reject();
        }
        form.resetFields();
        handleSelectProject({ projectName: value });
        setShowInner(false);
        setShowOuter(false);
        return Promise.resolve();
      },
    });
  };

  const onFinish = async (values: CalculationFormData) => {
    try {
      setCalculating(true); // 开始计算时设置loading
      const calculateTotal = async () => {
        let total = new Decimal(0);
        const insertData = {
          ...values,
          $fakePortcelain: "0",
          $latex: "0",
          $plasterLine: "0",
          $edgeDrop: "0",
          $plaster: "0",
          $realStone: "0",
          $romanColumn: "0",
          $roundColumn: "0",
          $railing: "0",
          innerAmount: "0",
          outerAmount: "0",
        };

        // 内墙计算
        if (showInner) {
          // 仿瓷价格计算
          const fakePortcelainCost = new Decimal(
            values.fakePortcelainQuantity || 0
          ).times(new Decimal(priceData?.fakePortcelain || 0));
          insertData.$fakePortcelain = fakePortcelainCost.toFixed(2);

          // 乳胶漆价格计算
          const latexCost = new Decimal(values.latexQuantity || 0).times(
            new Decimal(priceData?.latex || 0)
          );
          insertData.$latex = latexCost.toFixed(2);

          // 石膏线价格计算
          const plasterLineCost = new Decimal(
            values.plasterLineQuantity || 0
          ).times(new Decimal(priceData?.plasterLine || 0));
          insertData.$plasterLine = plasterLineCost.toFixed(2);

          // 边吊价格计算
          const edgeDropCost = new Decimal(values.edgeDropQuantity || 0).times(
            new Decimal(priceData?.edgeDrop || 0)
          );
          insertData.$edgeDrop = edgeDropCost.toFixed(2);

          // 石膏价格计算
          const plasterCost = new Decimal(values.plasterQuantity || 0).times(
            new Decimal(priceData?.plaster || 0)
          );
          insertData.$plaster = plasterCost.toFixed(2);

          // 内墙总价
          total = total
            .plus(fakePortcelainCost)
            .plus(latexCost)
            .plus(plasterLineCost)
            .plus(edgeDropCost)
            .plus(plasterCost);

          insertData.innerAmount = total.toFixed(2);
        }

        // 外墙计算
        if (showOuter) {
          // 真石漆价格计算
          const realStoneCost = new Decimal(
            values.realStoneQuantity || 0
          ).times(new Decimal(priceData?.realStone || 0));
          insertData.$realStone = realStoneCost.toFixed(2);

          // 罗马柱价格计算
          const romanColumnCost = new Decimal(
            values.romanColumnQuantity || 0
          ).times(new Decimal(priceData?.romanColumn || 0));
          insertData.$romanColumn = romanColumnCost.toFixed(2);

          // 圆柱子价格计算
          const roundColumnCost = new Decimal(
            values.roundColumnQuantity || 0
          ).times(new Decimal(priceData?.roundColumn || 0));
          insertData.$roundColumn = roundColumnCost.toFixed(2);

          // 栏杆价格计算
          const railingCost = new Decimal(values.railingQuantity || 0).times(
            new Decimal(priceData?.railing || 0)
          );
          insertData.$railing = railingCost.toFixed(2);

          // 外墙总价
          total = total
            .plus(realStoneCost)
            .plus(romanColumnCost)
            .plus(roundColumnCost)
            .plus(railingCost);
          insertData.outerAmount = total.toFixed(2);
        }

        console.log("Insert Data:", insertData);
        const totalAmount = total.toFixed(2); // 保留两位小数
        let opreation: any = {};
        // 更新数据projectId如果存在
        if (projectInfo.projectId) {
          const res = await updateCalcRes(
            { ...insertData, total: totalAmount },
            projectInfo.projectId
          );
          opreation = res[0];
        } else {
          // 插入新的数据
          const res = await submitCalcRes({
            ...insertData,
            total: totalAmount,
          });
          opreation = res[0];
        }
        console.log("操作结果:", opreation);
        // 直接进入详情页
        nav("/detail/" + opreation.projectId);
      };

      await calculateTotal();
    } catch (error) {
      console.error("计算失败:", error);
      Toast.show({
        content: "计算失败，请重试",
        position: "bottom",
      });
    } finally {
      setCalculating(false); // 计算完成后取消loading
    }
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

  // 检查是否可以提交
  const canSubmit = () => {
    const projectName = form.getFieldValue("projectName");
    return projectName && (showInner || showOuter);
  };

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
          title="工程量计算"
        >
          <Form
            form={form}
            layout="horizontal"
            onFinish={onFinish}
            style={
              {
                "--border-top": "0px",
                "--border-bottom": "0px",
              } as any
            }
            footer={
              <Button
                block
                type="submit"
                color="primary"
                loading={calculating}
                disabled={!canSubmit() || calculating}
              >
                {calculating ? "计算中..." : "开始计算"}
              </Button>
            }
          >
            <Form.Item
              name="projectName"
              label="工程名称"
              rules={[{ required: true, message: "请选择或输入工程名称" }]}
              onClick={() => setVisible(true)}
            >
              <Input placeholder="点击选择工程" readOnly />
            </Form.Item>

            <div style={{ padding: "8px 12px", marginBottom: "12px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: "12px",
                  padding: "8px",
                  backgroundColor: "#f5f7fa",
                  borderRadius: "8px",
                }}
              >
                <span>内墙工程</span>
                <Switch
                  checked={showInner}
                  onChange={setShowInner}
                  style={
                    {
                      "--checked-color": "#ffc300",
                      "--before-background-color": "#ffc300",
                    } as any
                  }
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px",
                  backgroundColor: "#f5f7fa",
                  borderRadius: "8px",
                }}
              >
                <span>外墙工程</span>
                <Switch
                  checked={showOuter}
                  onChange={setShowOuter}
                  style={
                    {
                      "--checked-color": "#ffc300",
                      "--before-background-color": "#ffc300",
                    } as any
                  }
                />
              </div>
            </div>

            {showInner && (
              <>
                <Form.Header>内墙工程量</Form.Header>
                <Form.Item
                  name="fakePortcelainQuantity"
                  label="仿瓷面积"
                  extra={renderUnitSuffix("平方")}
                >
                  <Input
                    type="number"
                    placeholder="请输入面积"
                    onChange={(val) =>
                      handleQuantityChange(val, (newVal) =>
                        form.setFieldValue("fakePortcelainQuantity", newVal)
                      )
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="latexQuantity"
                  label="乳胶漆面积"
                  extra={renderUnitSuffix("平方")}
                >
                  <Input
                    type="number"
                    placeholder="请输入面积"
                    onChange={(val) =>
                      handleQuantityChange(val, (newVal) =>
                        form.setFieldValue("latexQuantity", newVal)
                      )
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="plasterLineQuantity"
                  label="石膏线长度"
                  extra={renderUnitSuffix("米")}
                >
                  <Input
                    type="number"
                    placeholder="请输入长度"
                    onChange={(val) =>
                      handleQuantityChange(val, (newVal) =>
                        form.setFieldValue("plasterLineQuantity", newVal)
                      )
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="edgeDropQuantity"
                  label="边吊长度"
                  extra={renderUnitSuffix("米")}
                >
                  <Input
                    type="number"
                    placeholder="请输入长度"
                    onChange={(val) =>
                      handleQuantityChange(val, (newVal) =>
                        form.setFieldValue("edgeDropQuantity", newVal)
                      )
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="plasterQuantity"
                  label="石膏数量"
                  extra={renderUnitSuffix("包")}
                >
                  <Input
                    type="number"
                    placeholder="请输入数量"
                    onChange={(val) =>
                      handleQuantityChange(val, (newVal) =>
                        form.setFieldValue("plasterQuantity", newVal)
                      )
                    }
                  />
                </Form.Item>
              </>
            )}

            {showOuter && (
              <>
                <Form.Header>外墙工程量</Form.Header>
                <Form.Item
                  name="realStoneQuantity"
                  label="真石漆面积"
                  extra={renderUnitSuffix("平方")}
                >
                  <Input
                    type="number"
                    placeholder="请输入面积"
                    onChange={(val) =>
                      handleQuantityChange(val, (newVal) =>
                        form.setFieldValue("realStoneQuantity", newVal)
                      )
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="romanColumnQuantity"
                  label="罗马柱数量"
                  extra={renderUnitSuffix("个")}
                >
                  <Input
                    type="number"
                    placeholder="请输入数量"
                    onChange={(val) =>
                      handleQuantityChange(val, (newVal) =>
                        form.setFieldValue("romanColumnQuantity", newVal)
                      )
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="roundColumnQuantity"
                  label="圆柱子数量"
                  extra={renderUnitSuffix("个")}
                >
                  <Input
                    type="number"
                    placeholder="请输入数量"
                    onChange={(val) =>
                      handleQuantityChange(val, (newVal) =>
                        form.setFieldValue("roundColumnQuantity", newVal)
                      )
                    }
                  />
                </Form.Item>

                <Form.Item
                  name="railingQuantity"
                  label="栏杆长度"
                  extra={renderUnitSuffix("米")}
                >
                  <Input
                    type="number"
                    placeholder="请输入长度"
                    onChange={(val) =>
                      handleQuantityChange(val, (newVal) =>
                        form.setFieldValue("railingQuantity", newVal)
                      )
                    }
                  />
                </Form.Item>
              </>
            )}
          </Form>
        </Card>
      </div>

      <Popup
        visible={visible}
        onMaskClick={() => setVisible(false)}
        bodyStyle={{
          borderTopLeftRadius: "12px",
          borderTopRightRadius: "12px",
          minHeight: "40vh",
          maxHeight: "40vh",
        }}
      >
        <div
          style={{
            padding: "16px",
            borderBottom: "0.5px solid #eee",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <span style={{ fontSize: "18px", fontWeight: "bold" }}>
              选择工程
            </span>
            <span
              style={{ color: "var(--adm-color-primary)" }}
              onClick={handleAddNew}
            >
              没有想要的工程？
            </span>
          </div>
        </div>

        <List style={{ overflow: "auto", height: "30vh" }}>
          {historyProjects.map((project: any) => (
            <List.Item
              key={project.projectId}
              onClick={() => handleSelectProject(project)}
              arrow={false}
            >
              {project.projectName}
            </List.Item>
          ))}
        </List>
      </Popup>
    </MainLayout>
  );
}

export default Index;
