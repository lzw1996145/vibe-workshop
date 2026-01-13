---
title: STM32 GPIO 基础入门
date: 2025-01-12
tags: [STM32, GPIO, 嵌入式]
category: 嵌入式开发
---

# STM32 GPIO 基础入门

GPIO（通用输入输出）是 STM32 最基础也是最重要的外设之一。

## GPIO 模式

STM32 的 GPIO 支持多种工作模式：

| 模式 | 说明 |
|------|------|
| **输入浮空** | 高阻抗输入，状态不确定 |
| **输入上拉** | 默认高电平 |
| **输入下拉** | 默认低电平 |
| **推挽输出** | 强驱动，可输出高/低电平 |
| **开漏输出** | 只能输出低电平，需要上拉 |

## 代码示例

```c
#include "stm32f10x.h"

void GPIO_Config(void) {
    RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOC, ENABLE);

    GPIO_InitTypeDef GPIO_InitStructure;
    GPIO_InitStructure.GPIO_Pin = GPIO_Pin_13;
    GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP;
    GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;
    GPIO_Init(GPIOC, &GPIO_InitStructure);
}

int main(void) {
    GPIO_Config();
    while (1) {
        GPIO_SetBits(GPIOC, GPIO_Pin_13);  // LED 亮
        for (int i = 0; i < 500000; i++);
        GPIO_ResetBits(GPIOC, GPIO_Pin_13); // LED 灭
        for (int i = 0; i < 500000; i++);
    }
}
```

## 注意事项

1. 使用 GPIO 前必须使能对应时钟
2. 配置推挽输出时，设置合适的驱动速度
3. 注意引脚电压容忍范围

## 下一步

学习完 GPIO 后，可以继续学习：
- 中断（EXTI）
- 定时器（TIM）
- 串口（UART）
