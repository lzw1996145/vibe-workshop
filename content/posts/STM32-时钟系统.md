---
title: STM32 时钟系统详解
date: 2025-01-09
tags: [STM32, 时钟, RCC]
category: 嵌入式开发
---

# STM32 时钟系统详解

时钟系统是 STM32 的"心脏"，正确配置时钟是开发的第一步。

## STM32 时钟源

STM32G4 系列提供多种时钟源：

| 时钟源 | 频率 | 特点 |
|--------|------|------|
| HSI | 16 MHz | 内部高速RC，精度一般 |
| HSE | 4-48 MHz | 外部晶振，精度高 |
| LSI | 32 kHz | 低速内部RC，低功耗 |
| LSE | 32.768 kHz | 外部低速晶帆，RTC专用 |
| PLL | 可配置 | 倍频输出，高性能 |

## 时钟树

```
                        PLL 输入
                           ↓
    HSE ←────→  M/N/R 分频  →  SYSCLK → AHB → APB1/APB2
                           ↓
                    HSI →  CSS  →  备份域
                           ↓
                        LSE
```

## 代码配置示例

```c
#include "stm32g4xx.h"

void SystemClock_Config(void) {
    RCC_OscInitTypeDef RCC_OscInitStruct = {0};
    RCC_ClkInitTypeDef RCC_ClkInitStruct = {0};

    // 配置 HSE + PLL
    RCC_OscInitStruct.OscillatorType = RCC_OSCILLATORTYPE_HSE;
    RCC_OscInitStruct.HSEState = RCC_HSE_ON;
    RCC_OscInitStruct.PLL.PLLState = RCC_PLL_ON;
    RCC_OscInitStruct.PLL.PLLSource = RCC_PLLSOURCE_HSE;
    RCC_OscInitStruct.PLL.PLLM = 4;
    RCC_OscInitStruct.PLL.PLLN = 170;
    RCC_OscInitStruct.PLL.PLLP = RCC_PLLP_DIV2;
    RCC_OscInitStruct.PLL.PLLQ = RCC_PLLQ_DIV2;
    HAL_RCC_OscConfig(&RCC_OscInitStruct);

    // 配置系统时钟
    RCC_ClkInitStruct.ClockType = RCC_CLOCKTYPE_HCLK |
                                  RCC_CLOCKTYPE_SYSCLK |
                                  RCC_CLOCKTYPE_PCLK1 |
                                  RCC_CLOCKTYPE_PCLK2;
    RCC_ClkInitStruct.SYSCLKSource = RCC_SYSCLKSOURCE_PLLCLK;
    RCC_ClkInitStruct.AHBCLKDivider = RCC_SYSCLK_DIV1;
    RCC_ClkInitStruct.APB1CLKDivider = RCC_HCLK_DIV2;
    RCC_ClkInitStruct.APB2CLKDivider = RCC_HCLK_DIV1;
    HAL_RCC_ClockConfig(&RCC_ClkInitStruct, FLASH_LATENCY_2);
}
```

## 外设时钟使能

使用外设前必须先使能时钟：

```c
// 使能 GPIOC 时钟
__HAL_RCC_GPIOC_CLK_ENABLE();

// 使能 TIM3 时钟
__HAL_RCC_TIM3_CLK_ENABLE();

// 使能 USART1 时钟
__HAL_RCC_USART1_CLK_ENABLE();
```

## 常见问题

### Q: 系统不工作怎么办？
A: 检查以下几点：
- HSE 晶振是否起振
- PLL 配置是否正确
- FLASH 等待周期是否匹配

### Q: 如何降低功耗？
A:
- 不用的外设关闭时钟
- 使用低功耗模式（Sleep、Stop、Standby）
- 降低系统时钟频率

## 总结

理解时钟系统是 STM32 开发的基础，建议：
1. 熟悉时钟树结构
2. 掌握 PLL 配置方法
3. 了解各模式的功耗特点
