# HOW TO PLAY

This is a dapp of the one-dollar-purchase. 

1. Type the number of trx you want to invest in the [INPUT] box(**trx can only be a multiple of 10**);

2. And then click the [BUY] button to purchase.

When the total number of trx of reaches the price of the purchased commodity, the current round game ends. The smart contract will select the lucky one among all players, and the lucky one gets all the rewards. Just wait for about 90 seconds and the result will be displayed on the page and the game will automatically go to the next round.



# FAIRNESS STATEMENT

### I. Introduction

This is the open source code of tronlucky.shop. The whole solidity source code is in the *contracts* folder.

We have the following three innovations:

1. Open all the source code, including the front-end, back-end and smart contract code, instead of just like other tron dapp, which just open front-end/back-end source code, or open non-critical source code in solidity. Welcome everyone to code review;
2. We use solidity to implement a completely open source, unpredictable random number algorithm, which is described in detail below. **For some tron network's characteristics, we have made corresponding optimizations;**
3. Based on the random number, we implement a fair lucky generation algorithm. If the player plays more, the probability of being the lucky is greater. The algorithm will be described in detail below.

### II. Basic process

Our smart contract is essentially a state machine. As long as the corresponding conditions are triggered, the state changes. In other words, if the condition is not met, the state cannot be changed. This is a self-looping system that is not controlled by the developer and is not controlled by the witness. No one can stop its loop or break its loop. The state diagram is as follows:


### III. Random number generation algorithm

We generate random numbers based on the following two seeds:

1. The hash of the block where the last purchase was made: ***H***
2. The secret held by the assistant account, keccak256 (secret) has been announced before the start of the game: ***S***

the random formula:

```random = xor(H, S);```

The developer or assistant simply can't predict in advance what the random number is. The witness can't make it win by changing the hash of the block.

In order to prevent the assistant from blocking the game, we limit the assistant must do the lucky in 28 blocks, otherwise the assistant will need to pay a fine and all players will receive double compensation.

Optimizations for tron network:

1. Because the tron network has 27 witnesses, we assume that at least half of the nodes are honest, that is, at least 14 nodes are honest, so the assistant needs to submit the secret for the game after 14 blocks, and needs After 28 blocks, it can be judged whether the assistant is really deliberately delaying the progress of the game;
2. Because the tron network's *send* function may throw an exception, leaving the attacker an entry, always blocking the progress of the game, so in our entire game, we will not use *send*, but use a separate function for award, if it fails, the lucky or the players (when compensation occurs) need withdraw the trx themself;
3. Because when the tron network's  witness produce blocks, in addition to the Energy limit, there are time limit, too many participants will inevitably time out, so we limit the number of players per game to ensure that the game process does not time out.

### IV. Lucky generation algorithm

We use a uniform distribution to generate the lucky one, the probability density is as follows:


It is easy to see that the more you invest, the greater the probability of winning.

### V. Plan

1. All player can strive to become the assistant before the draw;
2. Continue to develop sports lottery games, welfare lottery games, card games based on our completely fair random generation algorithm.





# 怎么玩

本游戏是一款区块链一元购游戏。

1. 在页面的【投入】输入框中输入您要投入的trx数量（注意trx只能是10的倍数）；
2. 点击【BUY】按钮，即可购买。

当投注的trx数量达到拼购的商品价格时，本轮拼购活动结束。智能合约将在所有购买的用户里面选出幸运者，幸运者获取所有奖励。只需稍等90秒左右，获奖结果会显示在页面上，游戏自动进入下一轮。

 

# 公平性声明

### 一、介绍

这个是tronlucky.shop的开源代码，我们开放了所有的solidity代码，都在*contracts*文件夹中。

我们有以下三个创新点：

1. 开源了所有的代码，包括前端、后端和智能合约的所有代码，而不是像其他的tron dapp一样，仅仅开源了前后端代码，或是开源了solidity中非关键的代码。欢迎大家来code review；

1. 我们使用solidity实现了一个完全开源的，不可预测的随机数算法，下文将详细介绍这个算法。**针对波场网络的一些特性，我们做了相应的优化；**

1. 基于随机数，我们实现了公平的幸运者生成算法，如果玩家投注的越多，获得最终奖项的概率就越大，下文将详细介绍这个算法。

### 二、基本流程

我们的智能合约本质上是一个状态机，只要触发相应的条件，状态就会发生变化，换句话说，如果条件没达到，状态就无法改变。这是一个自循环的，不受开发者控制，也不受超级节点控制的系统，任何人都无法打破他的循环，或者破坏他的循环。状态图如下：

[状态图]

### 三、随机数生成算法

我们基于以下两个种子生成随机数：

1. 最后一笔购买的交易所在的区块的hash:  ***H***

1. assistant账户持有的secret，keccak256(secret)在比赛开始之前已经公示：***S***

公式如下：

```random = xor(H, S);```

开发者根本就无法提前预知随机数是多少，assistant账户也无法提前预知随机数是多少，超级节点也没有办法通过改变所打包区块的Hash来使自己获奖。

为了预防assistant阻止比赛向下进行，我们限制28个区块内assistant必须开奖，否则就需要交纳罚金，所有玩家都获得双倍的补偿。

针对波场网络的优化：

1. 因为波场网络有27个超级节点，我们假设至少有过半的节点是诚实的，也就是至少14个节点是诚实的，所以assistant需要在14个区块之后才能提交secret进行开奖，并且需要28个块之后，才能判断assistant是否真的在故意拖延游戏进度；

1. 因为波场的send函数可能会抛出异常，给攻击者留下入口，永远阻止游戏的进度，所以在我们的整个游戏环节，都不会使用send，而是使用单独的函数发奖给幸运者，如果失败，需要获奖者或者玩家(发生补偿时)自己提款；

1. 因为波场超级节点产块时，除了有Energy限制，还有时间限制，所以参加人数过多必然会发生超时，所以我们限制了每场比赛的人数，确保开奖过程不会发生超时。

### 四、幸运者生成算法

我们使用均匀分布来产生幸运者，概率密度如下：



容易看出，投入的越多，获奖的概率越大。

### 五、计划

1.开奖之前，所有用户都可以争取成为assistant

2.基于我们的完全公平的随机数生成算法，继续开发体育彩票游戏、福利彩票游戏、卡牌类游戏
