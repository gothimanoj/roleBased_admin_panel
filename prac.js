// const promise1 = Promise.resolve(5);
// const promise2 = 42;
// const promise3 = Promise.resolve("err");
const promise4 = new Promise((resolve, reject) => {
  setTimeout(reject, 100, "foo");
});
const promise5 = new Promise((resolve, reject) => {
  setTimeout(reject, 200, "foot");
});

Promise.race([promise4, promise5]).then((values) => {
  console.log(values);
});
