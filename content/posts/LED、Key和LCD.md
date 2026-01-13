# LED、KEY与LCD笔记

> 蓝桥杯嵌入式CT117E-M4开发板外设速查

---

## 快速索引

| 目标 | 跳转 |
|------|------|
| LED底层代码 | [§二、LED驱动](#二led驱动) |
| KEY底层代码 | [§三、KEY驱动](#三key驱动) |
| LCD初始化 | [§四、LCD驱动](#四lcd驱动) |
| 常见错误汇总 | [§五、常见错误与注意事项](#五常见错误与注意事项) |
| 引脚速查表 | [§六、引脚速查表](#六引脚速查表) |

---

## 一、硬件基础

### 1.1 LED原理

| 项目 | 说明 |
|------|------|
| 驱动方式 | 低电平点亮 |
| 锁存器控制 | PD2（输出高电平使能锁存器） |
| LED引脚 | PC8 ~ PC15（共8个LED） |

```
原理图示意：
PC8 ─┬─ LED1 ─┐
PC9 ─┬─ LED2 ─┤ 锁存器PD2控制
  ...          │
PC15─┬─ LED8 ─┘
      │
    GND (低电平点亮)
```

### 1.2 KEY原理

| 项目 | 说明 |
|------|------|
| GPIO模式 | **上拉输入**（板载上拉电阻） |
| 按键数量 | 4个（B1~B4） |
| 按下时电平 | 低电平（GPIO_PIN_RESET） |

| 按键 | 引脚 | 键值 |
|------|------|------|
| B1 | PB0 | 1 |
| B2 | PB1 | 2 |
| B3 | PB2 | 3 |
| B4 | PA0 | 4 |

### 1.3 LCD原理

| 项目 | 说明 |
|------|------|
| 数据总线 | PC0 ~ PC7（8080并行接口） |
| 控制引脚 | PB5(WR)、PB8(RS)、PA8(RD) |
| 锁存器 | PD2（解决LCD/LED引脚复用） |

> **关键**：LCD与LED共用PC0~PC7数据口，通过锁存器隔离

---

## 二、LED驱动

### 2.1 核心数据结构

```c
uint8_t ucled[8] = {0};  // LED状态数组，0=灭，1=亮
```

### 2.2 底层驱动 ⚠️易错

```c
void led_disp(uint8_t *ucled)
{
    uint8_t temp = 0x00;              // 本次LED状态
    static uint8_t temp_old = 0xff;   // 上次LED状态（static保持值）

    // 打包：ucled[0]→LED1(最高位)，ucled[7]→LED8(最低位)
    for(int i = 0; i < 8; i++)
        temp |= (ucled[i] << (7 - i));   // ⚠️ 易错：左移(7-i)，不是(i)

    // 状态改变时才刷新
    if(temp != temp_old)
    {
        GPIOC->ODR &= 0x00ff;           // 清空PC8~15
        GPIOC->ODR |= ~(temp << 8);     // ⚠️ 易错：必须<<8，只操作高8位
        GPIOD->BSRR = 0x01 << 2;        // 开锁存器
        GPIOD->BRR  = 0x01 << 2;        // 关锁存器
        temp_old = temp;
    }
}
```

### 2.3 任务函数

```c
void led_proc(void)
{
    led_disp(ucled);  // 1ms周期调用
}
```

### 2.4 使用示例

```c
// 点亮LED1、LED3、LED5
ucled[0] = 1;
ucled[2] = 1;
ucled[4] = 1;

// 翻转LED2状态
ucled[1] ^= 1;
```

### ⚠️ LED易错点

| 错误点 | 正确写法 |
|--------|----------|
| 左移位数 | `temp << 8`（左移8位操作高字节） |
| 位序 | `ucled[0]` → LED1（最高位MSB） |
| 锁存器操作 | 先BSRR置位，再BRR复位 |

---

## 三、KEY驱动

### 3.1 全局变量

```c
uint8_t key_val = 0;   // 当前键值（0=无按键）
uint8_t key_down = 0;  // 下降沿标志（按下瞬间=1）
uint8_t key_up = 0;    // 上升沿标志（释放瞬间=1）
uint8_t key_old = 0;   // 上次键值
```

### 3.2 读取键值

```c
uint8_t key_read(void)
{
    uint8_t temp = 0;
    if(HAL_GPIO_ReadPin(GPIOB, GPIO_PIN_0) == GPIO_PIN_RESET) temp = 1;
    if(HAL_GPIO_ReadPin(GPIOB, GPIO_PIN_1) == GPIO_PIN_RESET) temp = 2;
    if(HAL_GPIO_ReadPin(GPIOB, GPIO_PIN_2) == GPIO_PIN_RESET) temp = 3;
    if(HAL_GPIO_ReadPin(GPIOA, GPIO_PIN_0) == GPIO_PIN_RESET) temp = 4;
    return temp;
}
```

### 3.3 按键处理

```c
void key_proc(void)
{
    key_val = key_read();

    // 检测下降沿（按下）
    key_down = key_val & (key_old ^ key_val);
    // 检测上升沿（释放）
    key_up   = ~key_val & (key_old ^ key_val);

    key_old = key_val;
}
```

### 3.4 使用示例

```c
void key_proc(void)
{
    key_proc();  // 更新key_down/key_up

    if(key_down == 1)  // B1按下
        ucled[0] ^= 1;  // LED1取反
    if(key_down == 2)  // B2按下
        ucled[1] ^= 1;  // LED2取反
}
```

### ⚠️ KEY易错点

| 错误点 | 说明 |
|--------|------|
| 忘记更新key_old | 导致边沿检测失效 |
| GPIO模式错误 | 必须配置为**上拉输入** |
| 轮询周期 | 建议10ms，太快会抖动 |

---

## 四、LCD驱动

### 4.1 初始化（main.c）（易忘记）

```c
LCD_Init();              // 初始化LCD
LCD_Clear(Black);        // 清屏（黑色背景）
LCD_SetTextColor(White); // 设置文字颜色
LCD_SetBackColor(Black); // 设置背景颜色

//在bsp_system.c中有三行头文件
#include "lcd.h"
#include "stdio.h"
#include "stdarg.h"
```

### 4.2 格式化输出 ⚠️易错

```c
void LcdSprintf(uint8_t Line, char *format, ...)
{
    char String[21];           // LCD每行20字符
    va_list arg;
    va_start(arg, format);
    vsprintf(String, format, arg);
    va_end(arg);
    LCD_DisplayStringLine(Line, String);
}
```

### 4.3 使用示例

```c
LcdSprintf(Line0, "Hello World");           // 第0行
LcdSprintf(Line1, "Count: %d", count);      // 第1行，带变量
LcdSprintf(Line2, "Temp: %.1f C", temp);    // 浮点数格式化
```

### 4.4 行号定义

| 行号 | 坐标 | 说明 |
|------|------|------|
| Line0 | 0x00 | 第1行 |
| Line1 | 0x18 | 第2行 |
| ... | ... | 每行间隔24像素 |
| Line9 | 0xF0 | 第10行 |

---

## 五、常见错误与注意事项

### 5.1 LED相关

| 错误现象 | 原因 | 解决方案 |
|----------|------|----------|
| LED全亮 | 锁存器未使能 | 检查PD2的BSRR/BRR操作 |
| LED显示错位 | 位序搞反 | 确认`ucled[0]`对应LED1 |
| 部分LED不亮 | ODR操作遗漏 | `&=0x00ff`后再`|=(~temp<<8)` |

### 5.2 KEY相关

| 错误现象 | 原因 | 解决方案 |
|----------|------|----------|
| 按键无响应 | 模式配置为下拉 | 改为上拉输入模式 |
| 边沿检测失效 | 未更新key_old | 每次处理完必须更新 |
| 长按连续触发 | 未做消抖 | 增加状态机或延时 |

### 5.3 LCD相关

| 错误现象 | 原因 | 解决方案 |
|----------|------|----------|
| LCD花屏 | LCD与LED同时使能 | LCD操作完后关闭锁存器 |
| 字符显示不完整 | 缓冲区溢出 | 确保String[21]足够 |
| 刷新闪烁 | 刷新太快 | LCD刷新间隔≥50ms |

### 5.4 通用注意事项

- ✅ 所有外设初始化在`main.c`中调用
- ✅ LED/LCD共享PC0~PC7，通过锁存器PD2隔离
- ✅ 按键GPIO必须配置为上拉输入模式
- ✅ 调度器周期：LED=1ms, KEY=10ms, LCD=100ms

---

## 六、引脚速查表

### 6.1 GPIO总览

| 端口 | 用途 | 引脚 | 方向 |
|------|------|------|------|
| **PC** | LED控制 | PC8~PC15 | 输出 |
| **PC** | LCD数据 | PC0~PC7 | 复用 |
| **PD** | 锁存器使能 | PD2 | 输出 |
| **PB** | 按键输入 | PB0, PB1, PB2 | 输入（上拉） |
| **PA** | 按键输入 | PA0 | 输入（上拉） |
| **PB** | LCD控制 | PB5(WR), PB8(RS) | 输出 |
| **PA** | LCD控制 | PA8(RD) | 输出 |

### 6.2 CubeMX配置要点

| 外设 | 配置项 | 设置值 |
|------|--------|--------|
| LED(PC8~15) | Mode | Output Push Pull |
| KEY(PB0,1,2) | Mode | GPIO Input (Pull-up) |
| KEY(PA0) | Mode | GPIO Input (Pull-up) |
| 锁存器(PD2) | Mode | Output Push Pull |
| LCD控制 | Mode |复用Push Pull |

---

## 七、程序框架

### 7.1 初始化顺序

```
HAL_Init()
  ↓
SystemClock_Config()
  ↓
MX_GPIO_Init()
  ↓
LCD_Init() + LCD_Clear() + LCD_SetText/BackColor()
  ↓
scheduler_init()
  ↓
while(1) { scheduler_run(); }
```

### 7.2 任务调度器

```c
// 任务数组（scheduler.c）
static task_t scheduler_task[] = {
    {led_proc,  1,   0},   // LED: 1ms周期
    {key_proc, 10,   0},   // KEY: 10ms周期
    {lcd_proc, 100,  0},   // LCD: 100ms周期
};
```

> 每个任务按设定的周期独立执行，互不阻塞。

---

## 八、文件索引

| 文件 | 位置 | 作用 |
|------|------|------|
| led_app.c/h | MyApp/ | LED驱动与任务函数 |
| key_app.c/h | MyApp/ | KEY扫描与任务函数 |
| lcd_app.c/h | MyApp/ | LCD格式化输出 |
| scheduler.c/h | MyApp/ | 任务调度器 |
| system.c/h | MyApp/ | 系统初始化 |
| bsp_system.h | MyApp/ | 统一头文件，包含所有依赖 |
| main.c | Core/Src/ | 主程序入口 |

---

*最后更新：2026-01-11 | 蓝桥杯嵌入式CT117E-M4*
