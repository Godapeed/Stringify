const serialize = require("./serialize");

test(6, () => {
  expect(serialize(6)).toBe("6");
})

/*const list = {
  0: "0",
};
for (let i in list) {
  test(list[i], () => {
    expect(serialize(i)).toBe(list[i]);
  });
}



objects = {
    string: "Юки",
    number: 25,
    float: 2.3333,
    array: ["плавание", "горные лыжи"],
    literal: {
      city: "Москва",
      country: "Россия",
    },
    date: new Date(2020, 6, 6),
    bool: true,
    symbol: Symbol("id"),
    circular: null,
  };
  
  const getCircularReplacer = () => {
    const seen = new WeakSet();
    return (key, value) => {
      if (typeof value === "object" && value !== null) {
        if (seen.has(value)) {
          return "Обнаружен цикл";
        }
        seen.add(value);
      }
      return value;
    };
  };
  
  objects.circular = objects;
  
  for (const key in objects) {
    jsonSerialize = JSON.stringify(objects[key], getCircularReplacer(), 1);
    mySerialize = serialize(objects[key], getCircularReplacer(), 1);
  
    console.log(
      mySerialize === jsonSerialize ? true : mySerialize + " ||| " + jsonSerialize
    );
  }
  
  //npm + pacagjson
  //Markdown
  //moment
  //replacer - не только циклы
  //коменты внутрь*/