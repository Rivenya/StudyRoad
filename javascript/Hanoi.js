function Hanoi (n, A, B, C) {
  if (n === 1) {
    console.log(A + "====>" + C)
    return
  }
  Hanoi(n - 1, A, C, B)
  console.log(A + "====>" + C)
  Hanoi(n - 1, B, A, C)
}
Hanoi(3, "A", "B", "C")