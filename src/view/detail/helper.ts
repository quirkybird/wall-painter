export const transformProjectData = (data: any) => {
  const innerWallItems = [
    {
      name: "仿瓷",
      price: data.fakePortcelain,
      quantity: data.fakePortcelainQuantity,
      unit: data.fakePortcelainUnit,
      subtotal: data.$fakePortcelain,
    },
    {
      name: "乳胶漆",
      price: data.latex,
      quantity: data.latexQuantity,
      unit: data.latexUnit,
      subtotal: data.$latex,
    },
    {
      name: "石膏线",
      price: data.plasterLine,
      quantity: data.plasterLineQuantity,
      unit: data.plasterLineUnit,
      subtotal: data.$plasterLine,
    },
    {
      name: "边吊",
      price: data.edgeDrop,
      quantity: data.edgeDropQuantity,
      unit: data.edgeDropUnit,
      subtotal: data.$edgeDrop,
    },
  ];

  const outerWallItems = [
    {
      name: "真石漆",
      price: data.realStone,
      quantity: data.realStoneQuantity,
      unit: data.realStoneUnit,
      subtotal: data.$realStone,
    },
    {
      name: "罗马柱",
      price: data.romanColumn,
      quantity: data.romanColumnQuantity,
      unit: data.romanColumnUnit,
      subtotal: data.$romanColumn,
    },
    {
      name: "圆柱子",
      price: data.roundColumn,
      quantity: data.roundColumnQuantity,
      unit: data.roundColumnUnit,
      subtotal: data.$roundColumn,
    },
  ];

  return [
    {
      title: "内墙工程",
      sectionTotal: data.innerAmount,
      items: innerWallItems,
    },
    {
      title: "外墙工程",
      sectionTotal: data.outerAmount,
      items: outerWallItems,
    },
  ];
};
