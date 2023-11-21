const serialize = require("./serialize");

o = { a: Symbol("s")};
test(1, () => {
  expect(serialize(o)).toBe(JSON.stringify(o));
});

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

for (let i in objects) {
  test(i, () => {
    expect(serialize(objects[i], getCircularReplacer())).toBe(
      JSON.stringify(objects[i], getCircularReplacer())
    );
  });
}

for (let i in objects) {
  test(i, () => {
    expect(serialize(objects[i], getCircularReplacer(), 1)).toBe(
      JSON.stringify(objects[i], getCircularReplacer(), 1)
    );
  });
}
