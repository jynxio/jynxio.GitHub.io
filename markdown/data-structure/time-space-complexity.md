# 时间和空间复杂度

## 概述

算法是通过操纵数据来解决问题的方法，计算机执行算法需要消耗时间与内存，不同算法对时间与内存的消耗程度大不相同。我们通常会从时间和空间两个维度来分析算法的效率，以便于筛选出更加合适的算法，时间维度上的衡量指标是时间复杂度，空间维度上的衡量指标是空间复杂度。

## 时间复杂度

时间复杂度用于表示算法在时间维度上的效率，具体来说它代表了算法所执行的语句的次数随着问题规模 n 的变化而变化的规律。

因为一个算法在不同性能的机器上的运行时间会大不相同，所以我们不能直接使用算法的真实运行时间来作为它的时间复杂度。取而代之的是，我们会使用渐进时间复杂度来作为它算法的时间复杂度，在介绍渐进的时间复杂度之前，我们需要先理解下面几个概念。

### 时间频度

时间频度的符号是 `T(n)`，它代表一个算法会执行多少次语句。时间频度的意义是可以更加简单的反映出算法的耗时，因为我们很难统计出每条语句的具体耗时，不过我们至少可以认为算法的耗时与语句的执行次数成正比，当算法需要执行的语句的次数越多时，算法消耗的时间也会越长。

`T(n)` 中的 n 代表问题的规模，比如对于一个函数而言，n 代表函数的输入值。`T(n)` 只能表示算法在某个特定规模下的效率，但我们往往需要知道算法在任意规模下的效率，这样才方便我们直观的感受到不同的算法在不同规模的场景下的效率的优劣。

不过，我们根本无法穷举出算法在所有规模下的效率，因为规模的数量是无穷的，所以我们不能通过暴力的计算出 `T(n)` 在每种 n 下的值来模拟出算法在任意规模下的效率，取而代之的方法是，我们会通过计算出 `T(n)` 随着 n 的变化所呈现出的规律来模拟算法在任意规模下的效率。

### 渐进时间复杂度

渐进时间复杂度就是 `T(n)` 随着 n 的变化所呈现出的规律，而时间复杂度正是渐进时间复杂度的简称，在下文中，我会使用时间复杂度这一术语来代表渐进时间复杂度。

时间复杂度的符号是 `O( f(n) )`，其中 `f(n)` 代表一个与 `T(n)` 同数量级的函数，其中 `O( f(n) )` 代表存在一个常数 C，可以使得 `T(n) <= C * f(n)`。这代表着我们可以用 `f(n)` 来近似的模拟 `T(n)`，并通过观察 `f(n)` 的曲线来粗略的判断出 `T(n)` 在不同规模（n）下的变化规律，毕竟 `f(n)` 和 `T(n)` 是同一数量级的函数。另外，当 n 趋近于无穷时，`f(n)` 会越来越贴近 `T(n)`。

为了更简洁的表示出算法的时间复杂度，我们还可以简化 `f(n)`，只要保证 `f(n)` 与 `T(n)` 在同一数量级即可，所以我们会把常数级别的时间复杂度写作 `O(1)`，而不是更复杂的 `O(2)`、`O(100)`或其他。另外，我们也会省略对数函数的底数，来简化对数级别的时间复杂度，比如把 `O(log2 n)` 简写为 `O(log n)`。

最后，我们就得到了下文这些常见的时间复杂度模型，并按照复杂度由低到高的顺序进行了排序：

1. `O(1)`
2. `O(log n)`
3. `O(n)`
4. `O(nlog n)`
5. `O(n^2)`
6. `O(n^3)`
7. ......
8. `O(2^n)`
9. `O(n!)`

另外，在为具体场景选择算法时，我们还必须基于场景的规模 n 来进行选择，而不能一昧认为时间复杂度低的算法的效率就更高。一个例子是，当问题规模 n 很小时，`O(2^n)` 比 `O(1)` 更小，当问题规模 n 很大时，`O(2^n)` 比 `O(1)` 更大。

而在实践中，一个算法通常会存在最好、最坏、平均三种情况，我们一般关注最坏情况。比如下述代码的时间复杂度就是 `O(n)` 而不是 `O(1)`，因为我们关注最坏情况。

```js
if ( n < 100 ) console.log( 1 );
else for ( let i = 0; i < n; i++ ) console.log( 1 );
```

### 计算时间复杂度

- 如果时间频度 `T(n)` 为 `常数`，那么时间复杂度为 `O(1)`
- 如果时间频度 `T(n)` 为 `常数*n + 常数`，那么时间复杂度为 `O(n)`。
- 如果时间频度 `T(n)` 是一个更加复杂的多项式，那么时间复杂度就是 `O(n^最高次幂)`。比如当 `T(n)` 为 `5*n^3 + 4*n^2 + 3*n` 时，对应的时间复杂度是 `O(n^3)`。

> 对于第二和第三条，我们之所以可以省略掉式子中的低次幂项、常数项和系数，是因为当 n 趋于无穷时，这些项与系数的影响将会越来越小，以至于可以忽略不计，所以我们就干脆省略掉了它们，如此一来时间复杂度的式子还能更加简洁易懂。
>
> 另外，如果时间复杂度是一个对数，我们还会省略掉对数的底数。

### 示例 - O(1)

观察下述程序，无论它只有 3 行语句，还是有上千万行语句，它的时间频度都是一个常数，这代表着它的时间频度不会随着问题规模的增长而增长，因此它的时间复杂度为 `O(1)`。

```js
const a = 1;
const b = 2;
const c = 3;
...
```

### 示例 - O(log n)

观察下述程序，第一条语句的频度是 1，因为它只会执行一次。

对于第二和第三条语句，我们需要详细的解释一下：变量 i 会通过不断的乘以 2 来逼近变量 n，直至变量 i 大于变量 n 之后，变量 i 就不会再自乘 2，并且结束掉整个程序。我们可以假设变量 i 最多可以乘以 x 次 2，这意味着第三条语句就执行了 x 次，第二条语句就执行了 `x+1` 次。第二条语句之所以会执行 `x+1` 次，是因为只有当第二条语句有 x 次判断为真之后，才能执行 x 次第三条语句，而第二条语句又一定会有一次判定为假，因为只有这样才能结束掉整个程序。这样，我们就可以计算出整个程序的时间频度是 `2x+2`次。因为 `i * 2^x <= n`，且变量 i 的初始值为 1，因此可以得到 `2^x <= n`，基于这个式子我们就可以计算出 `x <= log2 n`，因此这个程序的时间频度是 `2log2 n + 2`，继而计算出这个程序的时间复杂度就是 `O(log n)`。

```js
let i = 1;        // 1：1次
while( i <= n ) { // 2：x+1次
    i *= 2;       // 3：x次
}
```

### 示例 - O(n)

观察下述代码，其中 `let i = 0` 会执行 1 次， `i < n` 会执行 `n+1` 次（理由同上），`i++` 会执行 n 次，`console.log( i )` 会执行 n 次，因此这个程序的时间频度是 `3n + 2`，因此这个程序的时间复杂度就是 `O(n)`。

```js
for ( let i = 0; i < n; i++ ) console.log( i )
```

### 示例 - O(nlog n)

观察下述代码，它是 “示例 - O(log n)” 的变体，变化的地方是它在 “示例 - O(log n)” 的外围包裹上了一层 for 循环，使该 “示例 - O(log n)” 会被执行 n 次，所以显然这个程序的时间复杂度是 `O(nlog n)`。

```js
for ( let i = 0; i < n; i++ ) {
    let j = 1;
    while ( j <= n ) {
        j *= 2;
    }
}
```

### 示例 - O(n^2)

观察下述代码，根据 “示例 - O(n)”，易得内层 for 循环的时间频度是 `3n + 2`。对于外层 for 循环，它会执行 1 次 `let i = 0`、执行 `n+1` 次 `i < n`、执行 n 次 `i++`，执行 n 次内层 for 循环。因此整个程序的时间频度是 `(3n + 2) * n + 1 + n + 1 + n`，即 `3n^2 + 4n + 2`，继而推断出这个程序的时间复杂度是 `O(n^2)`。

```js
for ( let i = 0; i < n; i++ ) {
    for ( let j = 0; j < n; j++ ) {
        console.log( j );
    }
}
```

观察上述代码可知，嵌套了 2 层 n 次 for 循环的程序的时间复杂度就是 `O(n^2)`，所以 `O(n^3)` 乃至 `O(n^k)` 就代表了嵌套 3 层乃至 k 层 n 次 for 循环的程序的时间复杂度。

### 示例 - O(nm)

我们将 “示例 - o(n^2)” 的代码改动一下，将内层 for 循环的 n 替换为 m，那么这个程序的时间频度就是 `(3m + 2) * n + 1 + n + 1 + n`，即 `3nm + 4n + 2`，继而推断出这个程序的时间复杂度就是 `O(nm)`。

```js
for ( let i = 0; i < n; i++ ) {
    for ( let j = 0; j < m; j++ ) {
        console.log( j );
    }
}
```

### 示例 - O(2^n)

正在编辑。

### 示例 - O(!n)

正在编辑。

### 练习

假设某算法的时间频度等于一个递推的关系式：`T(n) = T(n-1) + n`（其中 n 为正整数），并且已知 `T(0) = 1`，求该算法的时间复杂度。

```
由： T(n) = T(n-1) + n
得： T(n-1) = T(n-2) + (n-1)
得： T(n-2) = T(n-3) + (n-2)
得： T(n-3) = T(n-4) + (n-3)
得： ......

套娃可得：
T(n) = T(n-2) + (n-1) + n
	 = T(n-3) + (n-2) + (n-1) + n
	 = T(n-4) + (n-3) + (n-2) + (n-1) + n
	 = ......
	 = T(0) + 1 + 2 + 3 + ... + n
	 = 1 + (1+n) * (n/2)
	 = (1/2) * (n^2) + (1/2) * n + 1

故该算法的时间复杂度为 O(n^2)
```

## 空间复杂度

> 因为我们往往只使用时间复杂度来衡量算法的性能，而很少会讨论算法的空间复杂度，因此本文只会简述空间复杂度。

空间复杂度用于表示算法在空间维度上的效率，具体来说它代表了算法需要占用的内存的大小随着问题规模 n 的变化而变化的规律。空间复杂度和时间复杂度的相同之处在于，它们的值都是估算的，而不是精确的。

### 示例 - O(1)

观察下述代码，无论它只有 3 行语句，还是有上千万行语句，它的空间复杂度都是 `O(1)`，因为这个程序需要占用的内存空间与问题规模 n 没有关系。

```js
const a = 1;
const b = 2;
const c = 3;
...
```

### 示例 - O(n)

观察下述代码，这个程序的空间复杂度就是 `O(n)`。

```js
new Array(n); // [ empty, empty, ..., empty ]
```
