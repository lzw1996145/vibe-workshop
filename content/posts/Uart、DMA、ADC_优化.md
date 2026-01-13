# Uart、DMA、ADC开发手册

> 蓝桥杯嵌入式CT117E-M4外设速查

---

## 快速索引

| 目标 | 跳转 |
|------|------|
| UART配置与通信 | [§一、UART串口通信](#一uart串口通信) |
| DMA数据传输 | [§二、DMA传输](#二dma传输) |
| ADC模数转换 | [§三、ADC模数转换](#三adc模数转换) |
| CubeMX配置图示 | [§四、CubeMX配置图示](#四cubemx配置图示) |
| 常见错误汇总 | [§五、常见错误与注意事项](#五常见错误与注意事项) |

---

## 一、UART串口通信

### 1.1 基础概念

| 项目 | 说明 |
|------|------|
| 调试接口 | 串口1（USART1） |
| 波特率 | 9600（比赛标准） |
| 数据位 | 8位 |
| 停止位 | 1位 |
| 校验位 | 无 |

### 1.2 CubeMX配置 ⚠️必做

<img src="./Uart、DMA、ADC.assets/image-20260112183704066.png" alt="UART模式配置" style="zoom:50%;" />

<img src="./Uart、DMA、ADC.assets/image-20260112183807334.png" alt="UART参数配置" style="zoom:50%;" />

<img src="./Uart、DMA、ADC.assets/image-20260112184004003.png" alt="NVIC中断配置" style="zoom:50%;" />

**关键配置点**：

| 配置项 | 设置值 |
|--------|--------|
| Mode | Asynchronous（异步模式） |
| Baud Rate | 9600 |
| NVIC Settings | ✅ 启用USART1 interrupt |
| DMA Settings | ✅ 启用USART1_RX |

### 1.3 Keil设置 ⚠️易漏

> 必须勾选微库，否则单片机可能卡死

<img src="./Uart、DMA、ADC.assets/image-20260112184513549.png" alt="微库配置" style="zoom: 50%;" />

```
Project → Options for Target → Target → Use MicroLIB ✓
```

### 1.4 底层代码（usart.c）

**比赛方案：串口中断+超时解析**

```c
/* USER CODE BEGIN 0 */
#include "string.h"
typedef struct __FILE FILE;  // 重定向必须

uint16_t uart_rx_index = 0;   // 接收数据索引
uint32_t uart_rx_ticks = 0;   // 超时计时
uint8_t uart_rx_buffer[128] = {0};  // 接收缓冲区
/* USER CODE END 0 */

void MX_USART1_UART_Init(void)
{
  // ... CubeMX生成代码 ...

  /* USER CODE BEGIN USART1_Init 2 */
  // 启动中断接收（每次1字节）
  HAL_UART_Receive_IT(&huart1, uart_rx_buffer, 1);
  /* USER CODE END USART1_Init 2 */
}

/* USER CODE BEGIN 1 */
// 重定向printf
int fputc(int ch, FILE *str)
{
    HAL_UART_Transmit(&huart1, (uint8_t *)&ch, 1, 10);
    return ch;
}
/* USER CODE END 1 */
```

### 1.5 逻辑层代码（uart_app.c）

```c
#include "uart_app.h"

// 回调函数：每收到1字节进入一次
void HAL_UART_RxCpltCallback(UART_HandleTypeDef *huart)
{
    if(huart->Instance == USART1)
    {
        uart_rx_ticks = uwTick;  // 更新时间戳
        uart_rx_index++;         // 索引+1
        // 继续接收下一字节
        HAL_UART_Receive_IT(&huart1, &uart_rx_buffer[uart_rx_index], 1);
    }
}

// 任务函数：超时100ms视为一帧结束
void uart_proc(void)
{
    if(uart_rx_index == 0) return;  // 无数据

    if(uwTick - uart_rx_ticks > 100)  // 超时判断
    {
        printf("user data:%s\n", uart_rx_buffer);  // 打印数据

        memset(uart_rx_buffer, 0, uart_rx_index);  // 清空缓冲区
        uart_rx_index = 0;

        // 重置HAL接收指针
        huart1.pRxBuffPtr = uart_rx_buffer;
    }
}
```

### 1.6 使用示例

```c
// 发送数据
printf("Hello World\n");
printf("ADC Value: %.2f\n", adc_value[0]);

// 接收数据处理（自动在uart_proc中处理）
// 当PC发送"hello"时，串口打印user data:hello
```

### ⚠️ UART易错点

| 错误现象 | 原因 | 解决方案 |
|----------|------|----------|
| 乱码 | 波特率不匹配 | 检查9600 |
| 卡死 | 未勾选微库 | 勾选Use MicroLIB |
| 数据不完整 | 缓冲区太小 | 建议128字节 |
| 回调不进入 | 未启用中断 | 检查NVIC配置 |

---

## 二、DMA传输

### 2.1 DMA概念

| 项目 | 说明 |
|------|------|
| 全称 | Direct Memory Access（直接存储器访问） |
| 作用 | CPU的搬运助手，外设与内存直接传输 |
| 优势 | 不占用CPU，减轻负担 |

### 2.2 DMA原理

![DMA原理](./Uart、DMA、ADC.assets/image-20260112200031789.png)

![DMA通道](./Uart、DMA、ADC.assets/image-20260112200200878.png)

### 2.3 DMA配置要点

| 配置项 | 设置值 |
|--------|--------|
| Mode | Circular（循环模式） |
| Data Width | Word（32位） |
| 方向 | Peripheral to Memory |

### 2.4 RingBuffer（环形缓冲区）

> 开发版本使用，比赛不建议（时间有限）

```
原理：头尾相接的环形缓冲区
- 写入：尾指针前进
- 读取：头指针前进
- 到达末尾：回到开头

优势：无数据覆盖，支持不定长数据
```

---

## 三、ADC模数转换

### 3.1 硬件基础

| 项目 | 说明 |
|------|------|
| 分辨率 | 12位（0~4095） |
| 参考电压 | 3.3V |
| 通道数 | 2路（ADC1、ADC2） |
| 输入源 | 滑动变阻器R37、R38 |

### 3.2 原理图

<img src="./Uart、DMA、ADC.assets/image-20260112202451053.png" alt="ADC原理图" style="zoom:50%;" />

### 3.3 CubeMX配置 ⚠️易漏

**步骤1：配置ADC模式**

<img src="./Uart、DMA、ADC.assets/image-20260112202739708.png" alt="ADC基本配置" style="zoom:50%;" />

**步骤2：使能ADC1和ADC2**

<img src="./Uart、DMA、ADC.assets/image-20260112203046946.png" alt="ADC通道使能" style="zoom:50%;" />

**步骤3：添加DMA通道**

<img src="./Uart、DMA、ADC.assets/image-20260112203200824.png" alt="ADC DMA配置" style="zoom:50%;" />

**步骤4：DMA设置为循环模式**

<img src="./Uart、DMA、ADC.assets/image-20260112203250929.png" alt="DMA循环模式" style="zoom:50%;" />

**步骤5：ADC参数设置**

<img src="./Uart、DMA、ADC.assets/image-20260112203512113.png" alt="ADC参数" style="zoom:50%;" />

**步骤6：打开ADC中断**

<img src="./Uart、DMA、ADC.assets/image-20260112203717741.png" alt="ADC中断配置" style="zoom:50%;" />

### 3.4 ADC配置要点汇总

| 配置项 | 设置值 | 位置 |
|--------|--------|------|
| Resolution | 12-bit | ADC Settings |
| Continuous Conversion Mode | ✅ Enabled | ADC Settings |
| DMA Continuous Requests | ✅ Enabled | ADC Settings |
| Mode | Circular | DMA Settings |
| Data Width | Word | DMA Settings |
| NVIC | ✅ ADC1、ADC2 interrupt | NVIC Settings |

### 3.5 底层代码（main.c）

```c
// DMA缓冲区定义
uint32_t dma_buff[2][30];  // 2路ADC，每路30个采样点

// main()中启动ADC DMA
HAL_ADC_Start_DMA(&hadc1, (uint32_t *)&dma_buff[0][0], 30);
HAL_ADC_Start_DMA(&hadc2, (uint32_t *)&dma_buff[1][0], 30);
```

### 3.6 逻辑层代码（adc_app.c）

```c
#include "adc_app.h"

uint32_t dma_buff[2][30];    // DMA缓冲区
float adc_value[2];          // 转换后的电压值

void adc_proc(void)
{
   
    // 累加30个采样值
    for(int i = 0; i < 30; i++)
    {
        adc_value[0] += dma_buff[0][i];  // ADC1
        adc_value[1] += dma_buff[1][i];  // ADC2
    }

    // 平均值 × 3.3V / 4096 = 电压值
    adc_value[0] = (float)adc_value[0] / 30 * 3.3f / 4096;
    adc_value[1] = (float)adc_value[1] / 30 * 3.3f / 4096;
}
```

### 3.7 使用示例

```c
// 显示ADC值
LcdSprintf(Line0, "ADC1: %.2f V", adc_value[0]);
LcdSprintf(Line1, "ADC2: %.2f V", adc_value[1]);

// 串口打印
printf("ADC1: %.2f V, ADC2: %.2f V\n", adc_value[0], adc_value[1]);
```

### 3.8 ADC值换算

| 公式 | 说明 |
|------|------|
| `adc_value = sum / N * 3.3f / 4096` | N=采样次数 |

### ⚠️ ADC易错点

| 错误现象 | 原因 | 解决方案 |
|----------|------|----------|
| ADC值不变 | 未启动DMA | 添加HAL_ADC_Start_DMA |
| 数值一直4095 | 超过参考电压 | 检查硬件连接 |
| 数据波动大 | 未做平均 | 多次采样取平均 |
| 编译报错 | DMA缓冲区未取地址 | 使用`&dma_buff[0][0]` |

---

## 四、CubeMX配置图示

### 4.1 UART配置汇总

| 步骤 | 配置项 | 图示 |
|------|--------|------|
| 1 | Asynchronous + 9600 | ![图1](./Uart、DMA、ADC.assets/image-20260112183704066.png) |
| 2 | NVIC中断 | ![图2](./Uart、DMA、ADC.assets/image-20260112183807334.png) |
| 3 | DMA_RX | ![图3](./Uart、DMA、ADC.assets/image-20260112184004003.png) |

### 4.2 ADC配置汇总

| 步骤 | 配置项 | 图示 |
|------|--------|------|
| 1 | ADC模式 | ![图4](./Uart、DMA、ADC.assets/image-20260112202739708.png) |
| 2 | 通道使能 | ![图5](./Uart、DMA、ADC.assets/image-20260112203046946.png) |
| 3 | DMA通道 | ![图6](./Uart、DMA、ADC.assets/image-20260112203200824.png) |
| 4 | 循环模式 | ![图7](./Uart、DMA、ADC.assets/image-20260112203250929.png) |
| 5 | 连续转换+DMA | ![图8](./Uart、DMA、ADC.assets/image-20260112203512113.png) |
| 6 | 中断使能 | ![图9](./Uart、DMA、ADC.assets/image-20260112203717741.png) |

---

## 五、常见错误与注意事项

### 5.1 UART相关

| 错误现象 | 原因 | 解决方案 |
|----------|------|----------|
| 串口无输出 | 微库未勾选 | Project → Target → Use MicroLIB |
| 回调不执行 | NVIC未使能 | 启用USART1 interrupt |
| 乱码 | 波特率错误 | 双方都设为9600 |
| 数据丢失 | 缓冲区溢出 | 加大缓冲区至256 |

### 5.2 DMA相关

| 错误现象 | 原因 | 解决方案 |
|----------|------|----------|
| ADC不更新 | 未调用Start_DMA | main.c中添加启动代码 |
| 数据全0 | 地址错误 | `&dma_buff[0][0]`取地址 |
| 编译报错 | 未定义类型 | 包含"stm32g4xx_hal.h" |

### 5.3 ADC相关

| 错误现象 | 原因 | 解决方案 |
|----------|------|----------|
| 固定4095 | 输入超量程 | 检查滑动变阻器 |
| 波动大 | 未滤波 | 增加采样次数取平均 |
| 数值不变 | DMA未循环 | Mode设为Circular |
| 误差大 | 参考电压不准 | 3.3V基准 |

### 5.4 通用注意事项

| 要点 | 说明 |
|------|------|
| ✅ DMA缓冲区要初始化 | `uint32_t dma_buff[2][30] ；` |
| ✅ ADC启动放在main.c | HAL_ADC_Start_DMA() |
| ✅ UART重定向需微库 | 否则卡死 |
| ✅ 回调函数要声明 | HAL_UART_RxCpltCallback |

---

## 六、程序框架整合

### 6.1 任务注册（scheduler.c）

```c
static task_t scheduler_task[] = {
    {led_proc,   1,    0},   // LED: 1ms
    {key_proc,  10,    0},   // KEY: 10ms
    {lcd_proc, 100,    0},   // LCD: 100ms
    {uart_proc, 20,    0},   // UART: 20ms
    {adc_proc,  50,    0},   // ADC: 50ms
};
```

### 6.2 bsp_system.h更新

```c
// 添加以下头文件
#include "uart_app.h"
#include "adc_app.h"
```

### 6.3 初始化流程

```
HAL_Init()
  ↓
SystemClock_Config()
  ↓
MX_GPIO_Init()
  ↓
MX_USART1_UART_Init()    // 串口初始化
MX_ADC1_Init()           // ADC1初始化
MX_ADC2_Init()           // ADC2初始化
  ↓
LCD_Init() + SetColor()
  ↓
HAL_ADC_Start_DMA()      // 启动ADC DMA ⭐
scheduler_init()
  ↓
while(1) { scheduler_run(); }
```

---

## 七、引脚速查表

### 7.1 串口引脚

| 功能 | TX | RX |
|------|----|----| 
| USART1 | PA9 | PA10 |

### 7.2 ADC引脚

| 通道 | 引脚 | 说明 |
|------|------|------|
| ADC1 | PB12 | 滑动变阻器R37 |
| ADC2 | PB15 | 滑动变阻器R38 |

---

*最后更新：2026-01-12 | 蓝桥杯嵌入式CT117E-M4*
