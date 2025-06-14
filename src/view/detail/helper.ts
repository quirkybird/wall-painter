export const transformProjectData = (data: any) => {
  const sections = [
    {
      title: "内墙工程",
      items: [
        {
          name: "仿瓷",
          price: Number(data.fakePortcelain),
          quantity: Number(data.fakePortcelainQuantity),
          unit: "平方",
          subtotal: Number(data.$fakePortcelain),
        },
        {
          name: "乳胶漆",
          price: Number(data.latex),
          quantity: Number(data.latexQuantity),
          unit: "平方",
          subtotal: Number(data.$latex),
        },
        {
          name: "石膏线",
          price: Number(data.plasterLine),
          quantity: Number(data.plasterLineQuantity),
          unit: "米",
          subtotal: Number(data.$plasterLine),
        },
        {
          name: "边吊",
          price: Number(data.edgeDrop),
          quantity: Number(data.edgeDropQuantity),
          unit: "米",
          subtotal: Number(data.$edgeDrop),
        },
        {
          name: "石膏",
          price: Number(data.plaster),
          quantity: Number(data.plasterQuantity),
          unit: "包",
          subtotal: Number(data.$plaster),
        },
        {
          name: "踢脚线",
          price: Number(data.baseboard),
          quantity: Number(data.baseboardQuantity),
          unit: "米",
          subtotal: Number(data.$baseboard),
        },
      ],
      sectionTotal: Number(data.innerAmount),
    },
    {
      title: "外墙工程",
      items: [
        {
          name: "真石漆",
          price: Number(data.realStone),
          quantity: Number(data.realStoneQuantity),
          unit: "平方",
          subtotal: Number(data.$realStone),
        },
        {
          name: "罗马柱",
          price: Number(data.romanColumn),
          quantity: Number(data.romanColumnQuantity),
          unit: "个",
          subtotal: Number(data.$romanColumn),
        },
        {
          name: "圆柱子",
          price: Number(data.roundColumn),
          quantity: Number(data.roundColumnQuantity),
          unit: "个",
          subtotal: Number(data.$roundColumn),
        },
        {
          name: "栏杆",
          price: Number(data.railing),
          quantity: Number(data.railingQuantity),
          unit: "米",
          subtotal: Number(data.$railing),
        },
      ],
      sectionTotal: Number(data.outerAmount),
    },
  ];

  return sections;
};
