---
typora-root-url: ./..\..\image
---

# 树的基础知识

## 树

树是一种树状的数据结构，它由 n（n > 0）个有限的节点组成，比如族谱、公司职级架构就是典型的树数据结构。

树中的每个元素都叫做节点。其中，没有父节点的节点叫做根节点，根节点位于树的顶部。没有子节点的节点叫做叶节点，叶节点位于每条路径的底部。

我们可以对树进行分层，其中根节点位于第 0 层，根节点的子节点位于第 1 层，以此类推。而树的高度就等于最大层数。

![树](/algorithm-and-data-structure/tree/tree.png)

## 二叉树

二叉树是树的一种，二叉树中的每个节点最多只有 2 个子节点，其中一个是左侧子节点，另一个是右侧子节点。

![二叉树](/algorithm-and-data-structure/tree/binary-tree.png)

## 完全二叉树

完全二叉树是二叉树的一种特殊形态，其定义为：对于一个高度为 h 的二叉树，除了第 h 层外，其余各层的节点数都达到了最大值，且第 h 层的所有节点是从左到右连续排列的。

![完全二叉树](/algorithm-and-data-structure/tree/complete-binary-tree.png)

## 满二叉树

满二叉树是完全二叉树的一种特殊形态，其定义为：每一层的节点数都达到了最大值。

![满二叉树](/algorithm-and-data-structure/tree/full-binary-tree.png)

## 平衡二叉树

如果一棵二叉树的任意节点的左侧子树和右侧子树的高度差不大于 1，那么我们就称这棵二叉树为平衡二叉树。平衡二叉树是二叉树的一种特殊形态。

## 自平衡二叉树

自平衡二叉搜索树是一种会自动保持平衡的二叉搜索树，具体来说，每当新增或删除节点之后，自平衡二叉搜索树都会检查自身是否仍然平衡，如果不平衡了，那么它就会通过平衡操作来使自己变回平衡状态。

## 二叉搜索树

二叉搜索树是一种特殊的二叉树，其遵循下述规则：

- 左侧子节点的值必须比父节点的值小。
- 右侧子节点的值必须比父节点的值大。
- 树中每个节点的值都是唯一的。

## AVL 树

AVL 树（Adelson-Velskii-Landi Tree）是计算机科学中最早被发明的自平衡二叉搜索树，每当新增或删除节点之后，自平衡二叉搜索树都会检查自身是否仍然处于平衡状态，如果任意节点的左侧子树和右侧子树的高度差不大于 `1`，那么就可以认为自己处于平衡状态，否则自平衡二叉树就需要通过旋转操作来使自己回归到平衡状态。

相较于二叉搜索树，AVL 树的新增、删除、搜索操作在平均和最坏情况下的时间复杂度都是 `O(logn)`，这得益于 AVL 树总是会保持着一种较为接近满二叉树的形态。

## 红黑树

红黑树也是一种自平衡的二叉搜索树，红黑树的新增和删除性能比 AVL 树更好，AVL 树的搜索性能比红黑树更好。红黑树比 AVL 树要复杂的多，树中的每个节点都需要遵循以下规则：

- 节点是红色或黑色的。
- 根节点是黑色的。
- 所有叶节点都是黑色的，且所有叶节点都是空节点。
- 红色节点不能与红色节点直接连通。
- 从任一节点到其每个叶节点的所有简单路径都包含相同数目的黑色节点。