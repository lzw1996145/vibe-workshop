# 一、GPIO使用

# GPIO使用步骤

要想使用GPIO第一步先开始RCC时钟、第二步初始化GPIO、第三步定义输入输出在STM32中·工程选项，C/C++, Define内定义USE_STDPERIPH_DRV

# 1.1先使能GPIO

```c
void RCC_AHBPeriphClockCmd uint32_t RCC_AHBPeriph, FunctionalState NewState);  
void RCC/APB2PeriphClockCmd uint32_t RCC/APB2Periph, FunctionalState NewState);  
void RCC/APB1PeriphClockCmd uint32_t RCC/APB1Periph, FunctionalState NewState);
```

一般只用到这三个使能函数。  
设置那个外设口上使能。就是上电要那一组外设上电

```txt
例如：我需要把GPIOA组的IO使用就使用以下函数。  
第一个参数就是选择IO组是A组是B组，第二参数就是是否打开RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE);
```

# 1.2初始化GPIO

# 定义结构体

```txt
GPIO_InitTypeDef GPIO_InitStructure; //定义结构体  
GPIO_InitStructure.GPIO_Mode = GPIO_Mode_Out_PP; //定义输出模式  
GPIO_InitStructure.GPIO_Pin = GPIO_Pin_0; //定义让那个针脚本输出赋值为第0号引脚  
GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz; //定义GPIO速度，赋值为50MHz
```

GPIO_Init(GPIOA, &GPIO_InitStructure); //将赋值后的构体变量传递给GPIO_Init函数函数内部会自动根据结构体的参数配置相应寄存器

实现GPIOA的初始化

以上就是初始化GPIO

<table><tr><td>模式名称</td><td>性质</td><td>特征</td></tr><tr><td>浮空输入</td><td>数字输入</td><td>可读取引脚电平，若引脚悬空，则电平不确定</td></tr><tr><td>上拉输入</td><td>数字输入</td><td>可读取引脚电平，内部连接上拉电阻，悬空时默认高电平</td></tr><tr><td>下拉输入</td><td>数字输入</td><td>可读取引脚电平，内部连接下拉电阻，悬空时默认低电平</td></tr><tr><td>模拟输入</td><td>模拟输入</td><td>GPIO无效，引脚直接接入内部ADC</td></tr><tr><td>开漏输出</td><td>数字输出</td><td>可输出引脚电平，高电平为高阻态，低电平接VSS</td></tr><tr><td>推挽输出</td><td>数字输出</td><td>可输出引脚电平，高电平接VDD，低电平接VSS</td></tr><tr><td>复用开漏输出</td><td>数字输出</td><td>由片上外设控制，高电平为高阻态，低电平接VSS</td></tr><tr><td>复用推挽输出</td><td>数字输出</td><td>由片上外设控制，高电平接VDD，低电平接VSS</td></tr></table>

GPIO_Mode_AIN = 0x0: 模拟输入模式

GPIO_Mode_IN_FLOATING = 0x04：浮空输入模式

GPIO_Mode_IPD = 0x28：下拉输入模式

GPIO_Mode_IPU = 0x48：上拉输入模式

GPIO_Mode_Out_ID = 0x14: 开漏输出模式

GPIO_Mode_Out_PP = 0x10: 推挽输出模式

GPIO_Mode_AF_ID = 0x1C: 复用开漏输出模式

GPIO_Mode_AF_PP = 0x18: 复用推挽输出模式

# 1.3定义输入输出

GPIO输入函数

uint8_t GPIO_ReadInputDataBit(GPIO_TYPEDef* GPIOx, uint16_t GPIO_Pin);

//GPIO_ReadInputDataBit函数用于读取单个引脚的状态（高电平或低电平），它返回一个布尔值（true或false）。这个函数通常用于读取单个引脚的状态，例如判断按钮是否被按下。

uint16_t GPIO_ReadInputData(GPIO_TYPEDef* GPIOx);

//GPIO_GetReadInputData函数用于读取整个GPIO端口的所有引脚的状态，它返回一个32位无符号整数，其中每个位对应一个引脚的状态。这个函数通常用于同时读取多个引脚的状态，例如读取一个8位的数字输入。

uint8_t GPIO_ReadOutputDataBit(GPIO_TYPEDef* GPIOx, uint16_t GPIO_Pin);

//这个函数用于读取指定GPIO端口（GPIOx）上的一个引脚（GPIO_Pin）的输出状态，返回一个8位无符号整数，表示该引脚的状态（0或1）。

uint16_t GPIO_ReadOutputData(GPIO_TYPEDef* GPIOx);

//这个函数用于读取指定GPIO端口（GPIOx）的所有引脚的输出状态，返回一个16位无符号整数，其中每个位对应一个引脚的状态（0或1）。

GPIO输出函数

//方法1

GPIORESETBits(GPIOA,GPIO_Pin_0); //给低电平

GPIO_SetBits(GPIOA, GPIO_Pin_0); //给高电平

//方法2

GPIO_WritesBit(GPIOA, GPIO_Pin_0, (BitAction)0); //给低电平带强转

GPIO_writeBit(GPIOA,GPIO_Pin_0,(BitAction)1); //给高电平带强转

//方法3

GPIO WriteBit(GPIOA，GPIO_Pin_0，Bit_RESET）;//给低电平

GPIO_WriteBit(GPIOA，GPIO_Pin_0，Bit_SET）;//给高电平

```c
//方法4  
void GPIO_write(GPIO_TYPEDef* GPIOx, uint16_t PortVal);  
GPIO_write(GPIOA,  $\sim 0\mathrm{x}001$  );  
//第一个参数也是选择IO组，16进制的方式点亮0x001  
//0x002,0x0004,0x008,0x0010...
```

必须按照以上步骤使用

# 二、中断

因为程序只会在main函数中运行，但有些时候我们要需要暂停main函数去干其它的事所以就有了中断

# 中断分为硬件中断和软件中断

# 1、硬件中断

第一步定义GPIO外设、第二步定义AFIO中断引脚、第三步EXTI配置边缘检测控制、第四步NVIC中断优先级配置、第五步使用规定的函数名设置中断任务。

注意：使用中断函数时，中断标志位必须清除。//否则中断将连续不断地触发，导致主程序卡死。同样的功能建议别在中断中使用，中断建意输了变量就可以了

# 工作原理

AFIO就是GPIO所有引脚集中管理中心。EXTI是所有的外设管理中心、NVIC是对这些外设设定优先级的地方统一处理。

在STM32中有68个可屏蔽中断通道，包含EXTI、TIM、ADC、USART、SPI、I2C、RTC等多个外设

使用NVIC统一管理中断，每个中断通道都拥有16个可编程的优先等级，可对优先级进行分组，进一步设置抢占优先级和响应优先级

- NVIC的中断优先级由优先级寄存器的4位（0~15）决定，这4位可以进行切分，分为高n位的抢占优先级和低4-n位的响应优先级

- 抢占优先级高的可以中断嵌套，响应优先级高的可以优先排队，抢占优先级和响应优先级均相同的按中断号排队

<table><tr><td>分组方式</td><td>抢占优先级</td><td>响应优先级</td></tr><tr><td>分组0</td><td>0位，取值为0</td><td>4位，取值为0~15</td></tr><tr><td>分组1</td><td>1位，取值为0~1</td><td>3位，取值为0~7</td></tr><tr><td>分组2</td><td>2位，取值为0~3</td><td>2位，取值为0~3</td></tr><tr><td>分组3</td><td>3位，取值为0~7</td><td>1位，取值为0~1</td></tr><tr><td>分组4</td><td>4位，取值为0~15</td><td>0位，取值为0</td></tr></table>

-EXTI (External Interrupt) 外部中断

- EXTI可以监测指定GPIO口的电平信号，当其指定的GPIO口产生电平变化时，EXTI将立即向NVIC发出中断申请，经过NVIC裁决后即可中断CPU主程序，使CPU执行EXTI对应的中断程序

- 支持的触发方式：上升沿/下降沿/双边沿/软件触发

- 支持的GPIO口：所有GPIO口，但相同的Pin不能同时触发中断

- 通道数：16个GPIO_Pin，外加PVD输出、RTC闹钟、USB唤醒、以太网唤醒

触发响应方式：中断响应/事件响应

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/baa512e66f717b9717833c898cfeb2856490daa2a8bacef006150d44c5742c19.jpg)


- AFIO主要用于引脚复用功能的选择和重定义

- 在STM32中，AFIO主要完成两个任务：复用功能引脚重映射、中断引脚选择

AFIO就是GPIO所有引脚集中管理中心。EXTI是所有的外设管理中心、NVIC是对这些外设设定优先级的地方统一处理。

# 1.1定义GPIO外设

```c
/*开启时钟*/  
RCC_AP2PeriphClockCmd(RCC_AP2Periph_GPIOB, ENABLE); //开启GPIOB的时钟  
/*GPIO初始化*/  
GPIO_InitTypeDef GPIO_InitStructure;  
GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IPU;  
GPIO_InitStructure.GPIO_Pin = GPIO_Pin_0 | GPIO_Pin_1;  
GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;  
GPIO_Init(GPIOB, &GPIO_InitStructure); //将PBO和PB1引脚初始化为上拉输入
```

# 1.2定义AFIO中断引脚

```txt
RCC_AP2PeriphClockCmd(RCC_AP2Periph_AFIO，ENABLE); //开启AFIO的时钟，外部中断必须开启AFIO的时钟  
/*AFIO选择中断引脚*/  
GPIO_EXTILineConfig(GPIO_PortSourceGPIOB，GPIO_PinSource0）;//将外部中断的0号线映射到GPIOB，即选择PBO为外部中断引脚  
//定义AFIO的中断引脚和定义GPIO一样也要开启时钟使能
```

# 1.3EXTI配置边缘检测控制

```c
/*EXTI初始化*/  
EXTI_InitTypeDef EXTI_InitStructure; //定义结构体变量  
EXTI_InitStructure.EXTI_Line = EXTI_Line0 | EXTI_Line1; //选择配置外部中断的  
0号线和1号线  
EXTI_InitStructure.EXTI_LineCmd = ENABLE; //指定外部中断线使能  
EXTI_InitStructure.EXTI_Mode = EXTI_Mode_Interrupt; //指定外部中断线为中  
断模式  
EXTI_InitStructure.EXTI_Trigger = EXTI_Trigger_Falling; //指定外部中断线为下  
降沿触发  
EXTI_Init(&EXTI_InitStructure); //将结构体变量交给  
EXTI_Init，配置EXTI外设
```

# 1.4NVIC中断优先级配置

```c
/*NVIC中断分组*/  
NVIC_PriorityGroupConfig(NVIC_PriorityGroup_2); //配置NVIC为分组2  
//即抢占优先级范围：0~3，响应优先级范围：0~3  
//此分组配置在整个工程中仅需调用一次  
//若有多个中断，可以把此代码放在main函数内，while循环之前  
//若调用多次配置分组的代码，则后执行的配置会覆盖先执行的配置  
/*NVIC配置*/  
NVIC_InitTypeDef NVIC_InitStructure; //定义结构体变量  
NVIC_InitStructure.NVIC_IRQChannel = EXTIO_IRQn; //选择配置NVIC的EXTIO线  
NVIC_InitStructure.NVIC_IRQChannelCmd = ENABLE; //指定NVIC线路使能  
NVIC_InitStructure.NVIC_IRQChannelPreemptionPriority = 1; //指定NVIC线路的抢占优先级为1  
NVIC_InitStructure.NVIC_IRQChannelSubPriority = 1; //指定NVIC线路的响应优先级为1  
NVIC_Init(&NVIC_InitStructure); //将结构体变量交给NVIC_Init，配置NVIC外设
```

# 1.5使用规定的函数名设置中断任务

```c
voidEXTI0_IRQHandler(void)  
{if(EXTI_GetITStatus(EXTI_Line0) == SET)//判断是否是外部中断0号线触发的中断{/\*如果出现数据乱跳的现象，可再次判断引脚电平，以避免抖动\*/if(GPIO_ReadInputDataBit(GPIOB，GPIO_Pin_0）==0){Encoder_Count  $^{+ + }$  ：}EXTI_ClearITPendingBit(EXTI_Line0);//清除外部中断0号线的中断标志位//中断标志位必须清除//否则中断将连续不断地触发，导致主程序卡死1
```

# 2、软件中断

# 工作原理

软件中断要使用定时器功能才能实现

定时器分类：基本定时器、通用定时器、高级定时器。

<table><tr><td>类型</td><td>编号</td><td>总线</td><td>功能</td></tr><tr><td>高级定时器</td><td>TIM1、TIM8</td><td>APB2</td><td>拥有通用定时器全部功能，并额外具有重复计数器、死区生成、互补输出、刹车输入等功能</td></tr><tr><td>通用定时器</td><td>TIM2、TIM3、TIM4、TIM5</td><td>APB1</td><td>拥有基本定时器全部功能，并额外具有内外时钟源选择、输入捕获、输出比较、编码器接口、主从触发模式等功能</td></tr><tr><td>基本定时器</td><td>TIM6、TIM7</td><td>APB1</td><td>拥有定时中断、主模式触发DAC的功能</td></tr></table>

- STM32F103C8T6定时器资源：TIM1、TIM2、TIM3、TIM4

使用定时器步骤：第一步打开RCC时钟使能、第二步配置时钟模式、第三步配置时基单元、第四步配置中断输出配置、第五步NVIC中断分配系统。第六步启动动定时器、第七步写入中断函数

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/87037bc70fa0683fc536e4715db7afa6763ed3af6647c3e5e15350901c7d9f8b.jpg)


# 1、RCC时钟便能

RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM2, ENABLE); //通用定时器TIM2使能

# 2、配置时钟模式

TIM/InternalClockConfig(TIM2); //选择时钟输出模式为内部时钟模式

TIM_ETRClockMode2Config(TIM2,TIM_ExtTRGPSC_OFF,TIM_ExtTRGPolarity_NonInverted,0x0f);

//选择外部时钟模式2，时钟从TIM_ETR引脚输入

//注意TIM2的ETR引脚固定为PA0，无法随意更改

//最后一个滤波器参数加到最大0x0F，可滤除时钟信

TIM_ETRClockMode1Config(TIM2,TIM_ExtTRGPSC_OFF,TIM_ExtTRGPolarity_NonInverted,0x0f);

//选择外部时钟模式1

# 3、配置时基单元

```c
TIM_TimeBaseInitTypeDef TIM_TimeBasestructure; //定义结构体变量  
TIM_TimeBasestructure(TIM_ClockDivision = TIM_CKD_DIV1; //时钟分频，不分频  
TIM_TimeBasestructure(TIM CounterMode = TIM CounterMode_Up; //计数器模式为向上计数  
TIM_TimeBasestructure(TIM_Period = 10000 - 1; //ARR自动重装器的值，周期  
10000为1秒  
TIM_TimeBasestructure(TIM_Prescaler = 7200 - 1; //RSC预分频器的值对72MHZ进  
行分频  
TIM_TimeBasestructure(TIM_RepetitionCounter = 0; //重复计数器的值  
TIM_TimeBaseInit(TIM2, &TIM_TimeBasestructure);
```

时钟分频（PSC）

```txt
/
```

define TIM_CKD_DIV1 ((uint16_t)0x0000) //1分频

define TIM_CKD_DIV2 ((uint16_t)0x0100) //2分频

define TIM_CKD_DIV4 ((uint16_t)0x0200) //4分频

```txt
/
```

计数器（CNT）

```txt
/
```

define TIM CounterMode_Upp ((uint16_t)0x0000)//向上计数，定时器从0开

始计数，一直增加到自动重装载寄存器（ARR）的值，然后重新从0开始计数

define TIM CounterMode_Down ((uint16_t)0x0010)//向下计数定，时器从自

动重装载寄存器（ARR）的值开始计数，一直减少到0，然后重新从ARR的值开始计数。

define TIM CounterMode_CenterAligned1 ((uint16_t)0x0020)//中心对齐模式1，定时器

从0计数到ARR/2，然后从ARR减1计数回到0，形成一个对称的波形。

define TIM CounterMode_CenterAligned2 ((uint16_t)0x0040)//中心对齐模式2，类似于

中心对齐模式1，但计数方向相反，即从ARR减1计数到0，然后从0计数到ARR/2。

define TIM CounterMode_CenterAligned3 ((uint16_t)0x0060)//中心对齐模式3，定时器

从ARR减1计数到0，然后从0计数到ARR，形成一个非对称的波形。

```txt
/*****
```

# 4、中断输出配置

```c
//清除定时器更新标志位//TIM_TimeBaseInit函数末尾，手动产生了更新事件//TIM_TimeBaseInit函数末尾，手动产生了更新事件  
//如果不介意此问题，则不清除此标志位也可  
TIM_ClearFlag(TIM2，TIM_FLAG_Update);  
TIM_ITConfig(TIM2，TIM_IT_Update，ENABLE); //开启TIM2的更新中断  
* @arg TIM_IT_Update：TIM更新中断源  
* @arg TIM_IT_CC1：TIM Capture比较1中断源  
* @arg TIM_IT_CC2：TIM Capture Compare 2中断源  
* @arg TIM_IT_CC3：TIM Capture比较3中断源  
* @arg TIM_IT_CC4：TIM Capture比较4中断源
```

# 5、NVIC配置

```c
/*NVIC中断分组*/  
NVICPriorityGroupConfig(NVICPriorityGroup_2); //配置NVIC为分组2  
/*NVIC配置*/  
NVIC_InitTypeDef NVIC_InitStructure; //定义结构体变量  
NVIC_InitStructure.NVIC_IRQChannel = TIM2_IRQn; //选择配置NVIC的TIM2线  
NVIC_InitStructure.NVIC_IRQChannelCmd = ENABLE; //指定NVIC线路使能  
NVIC_InitStructure.NVIC_IRQChannelPreemptionPriority = 2; //指定NVIC线路的抢占优先级为2  
NVIC_InitStructure.NVIC_IRQChannelSubPriority = 1; //指定NVIC线路的响应优先级为1  
NVIC_Init(&NVIC_InitStructure); //将结构体变量交给NVIC_Init，配置NVIC外设
```

# 6、启动动定时器

```txt
/*TIM使能*/  
TIM_Cmd(TIM2，ENABLE)； //使能TIM2，定时器开始运行
```

# 7、写入中断函数

```c
void TIM2_IRQHandler(void)  
{if (TIM_GetITStatus(TIM2, TIM_IT_Update) == SET) //判断是否是TIM2的更新事件触发的中断Num ++; //Num变量自增，用于测试定时中断TIM_ClearITPendingBit(TIM2, TIM_IT_Update); //清除TIM2更新事件的中断标志位//中断标志位必须清除//否则中断将连续不断地触发，导致主程序卡死}
```

# 三、定时器

*定时中断可以参考中断中的软件中断。**

# PWM应用

-PWM（Pulse Width Modulation）脉冲宽度调制

- 在具有惯性的系统中，可以通过对一系列脉冲的宽度进行调制，来等效地获得所需要的模拟参量，常应用于电机控速等领域

-PWM参数：

频率  $= 1 / \mathrm{TS}$  占空比  $=$  TON/TS 分辨率  $=$  占空比变化步距

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/e7e79eea12c3199ee2b3c745c640e2fc0ea583c660e00265298d481aa0aed8d2.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/742abe925cd9da7ba9335209906dbd692b3f9a115191759499709f6cd23b624f.jpg)


# 1、定时中断

定时中断可以参考中断中的软件中断。**

- 计数器溢出频率：CK_CNT_OV = CK_CNT / (ARR + 1)

1)

= CK_PSC / (PSC + 1) / (ARR +

# 2、输出比较

# 工作原理

要想使用PWM需要配置、时基单元、GPIO配置输出波形、CCR输出比较器、运行控制。

# PWM基本结构

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/c6e908c5fe229261233debc4c34980a075974d75c21a471cd65dab219bc08dec.jpg)


第一步配置GPIO选择输出波形引脚、第二步配置时基单元、第三步配置输出比较器、第四步开启定时器

# 1、配置GPIO

```c
RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE); //开启GPIOA的时钟  
/*GPIO初始化*/  
GPIO_InitTypeDef GPIO_InitStructure;  
GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AF_PP;  
GPIO_InitStructure.GPIO_Pin = GPIO_Pin_0;  
GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;  
GPIO_Init(GPIOA, &GPIO_InitStructure); //将PAO引脚初始化为复用推挽输出  
//受外设控制的引脚，均需要配置为复用模式
```

# 2、配置时基单元

```javascript
RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM2，ENABLE); //开启TIM2的时钟  
/*配置时钟源*/TIM/InternalClockConfig(TIM2); //选择TIM2为内部时钟，若不调用此函数，TIM默认也为内部时钟  
/*时基单元初始化*/TIM_TimeBaseInitTypeDef TIM_TimeBaseInitStructure; //定义结构体变量TIM_TimeBaseInitStructure(TIM_ClockDivision = TIM_CKD_DIV1; //时钟分频，选择不分频，此参数用于配置滤波器时钟，不影响时基单元功能TIM_TimeBaseInitStructure(TIM_CounterMode = TIM_CounterMode_Up; //计数器模式，选择向上计数TIM_TimeBaseInitStructure(TIM_Period = 100 - 1; //计数周期，即ARR的值
```

```txt
TIM_TimeBaseInitStructure.TIM_Prescaler  $= 720 - 1$  //预分频器，即  
PSC的值TIM_TimeBaseInitStructure.TIM_RepetitionCounter  $= 0$  //重复计数器，  
高级定时器才会用到TIM_TimeBaseInit(TIM2，&TIM_TimeBaseInitStructure); //将结构体变量  
交给TIM_TimeBaseInit，配置TIM2的时基单元  
预分频（一级分频）值是个数字，二级分频值是个模式（4位二进制不同的值选择不分频，2分频，4分  
频，8分频，16分频）周期T=1/频率f，它俩互为倒数的关系  
PWM频率：Freq  $\equiv$  CK_PSC / (PSC + 1) / (ARR + 1)  
PWM占空比：Duty  $=$  CCR / (ARR + 1)  
PWM分辨率：Reso  $= 1 / (\mathrm{ARR} + 1)$    
PWM频率  $=$  计数器更新频率故：CK_PSC / (PSC + 1) / (ARR + 1)=1000 72/PSC/100=100072000000/100/1000=720 PSC=720CCR/(ARR+1)=50% ARR=100 CCR=50%1/(ARR+1)=1%1/(100+1)=1
```

# 3、配置输出比较器

```c
/*输出比较初始化*/  
TIM_OCInitTypeDef TIM_OCInitStructure; //定义结构体变量  
TIM_OCStructInit(&TIM_OCInitStructure); //结构体初始化，若结构体没有完整赋值  
//则最好执行此函数，给结构体所有成员都赋一个默认值  
//避免结构体初值不确定的问题  
TIM_OCInitStructure.TIM_OCMode = TIM_OCMode_PWM1; //输出比较模式，选择PWM模式1  
TIM_OCInitStructure.TIM_OCPolarity = TIM_OCPolarity_High; //输出极性，选择为高，若选择极性为低，则输出高低电平取反  
TIM_OCInitStructure.TIM_OutputState = TIM_OutputState_Enable; //输出使能  
TIM_OCInitStructure.TIM_Pulse = 0; //初始的CCR值  
TIM_OC1Init(TIM2, &TIM_OCInitStructure); //将结构体变量交给TIM_OC1Init，配置TIM2的输出比较通道1
```

TIM_OCMode_Timing: 模式描述：计时模式。当定时器计数值达到设定的比较值时，会触发一个事件。这通常用于测量时间间隔或产生定时中断

TIM_OCMode_Active: 模式描述：活动模式。当定时器计数值达到设定的比较值时，输出引脚会被设置为高电平。

TIM_OCMode_Inactive:模式描述：非活动模式。当定时器计数值达到设定的比较值时，输出引脚会被设置为低电平。

TIM_OCMode_Toggle: 模式描述：切换模式。每当定时器计数值达到设定的比较值时，输出引脚的状态会从高电平切换到低电平，或者从低电平切换到高电平。这种模式常用于生成方波信号。

TIM_OCMode_PWM1: 模式描述：PWM模式1。在这种模式下，定时器会在计数值达到设定的比较值时将输出引脚设置为高电平，并在下一个周期将其设置为低电平。这种模式常用于生成占空比可变的PWM信号。

TIM_OCMode_PWM2: 模式描述：PWM模式2。与PWM模式1类似，但行为略有不同，具体取决于硬件实现。在某些微控制器中，PWM模式2可能在计数器达到最大值时将输出引脚设置为高电平，而在计数器达到比较值时将其设置为低电平。

# 4、开启定时器

TIM_Cmd(TIM2，ENABLE);

//使能TIM2，定时器开始运行

# 3、输入捕获

# 工作原理

-IC(Input Capture) 输入捕获

- 输入捕获模式下，当通道输入引脚出现指定电平跳变时，当前CNT的值将被锁存到CCR中，可用于测量PWM波形的频率、占空比、脉冲间隔、电平持续时间等参数

每个高级定时器和通用定时器都拥有4个输入捕获通道

- 可配置为PWM1模式，同时测量频率和占空比

- 可配合主从触发模式，实现硬件全自动测量

# 频率测量

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/fba7bffe1cab040ca740a5b85e49618dd8b13e469a48c8031f4163d71a49984b.jpg)


• 测频法：在闸门时间T内，对上升沿计次，得到N，则频率  $f_{x} = N / T$

• 测周法：两个上升沿内，以标准频率  $f_{c}$  计次，得到  $N$  ，则频率  $f_{x} = f_{c} / N$

- 中界频率：测频法与测周法误差相等的频率点

$$
f _ {m} = \sqrt {f _ {c} / T}
$$


图98 通用定时器框图


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/e10d7924fd56992feda8af076ed945398e93e16ffbdb92a7fb9a21fcbd5f41b5.jpg)



输入捕获基本结构


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/9d2ec215c9e34c185d6c6f3982922171ca39a574839d5a8eb7b1dca0a5ec6482.jpg)



PWMIM基本结构


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/b4b507062b0da6b3c215849be0ce19dfcea9931b806ca601a0abe3ea38e25562.jpg)


要想使用输入捕获需要进行如下步骤：

第一步选择对应的定时器TIM配置GPIO脚口、第二步配置输入捕获单元、第三步配置时基单元、第四步配置触发源、第五步配置主从模式。

# 1、择对应的定时器TIM配置GPIO脚口

```c
//如选择TIM3定时器对应的GPIO口为GPIO pinch_6  
RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE); //开启GPIOA的时钟  
/*GPIO初始化*/  
GPIO_InitTypeDef GPIO_InitStructure;  
GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IPU;  
GPIO_InitStructure.GPIO_Pin = GPIO_Pin_6;  
GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;  
GPIO_Init(GPIOA, &GPIO_InitStructure); //将PA6引脚初始化为上拉输入
```

# 2、配置输入捕获单元

```txt
/*输入捕获初始化*/  
TIM_ICInitTypeDef TIM_ICInitStructure; //定义结构体变量  
TIM_ICInitStructure(TIM_Channel = TIM_Channel_1; //选择配置定时器通道1  
TIM_ICInitStructure(TIM_ICFilter = 0xF; //输入滤波器参数，可以过滤信号抖动  
TIM_ICInitStructure(TIM_ICPolarity = TIM_ICPolarity_Rising; //极性，选择为上升沿触发捕获  
TIM_ICInitStructure(TIM_ICPrescaler = TIM_ICPSC_DIV1; //捕获预分频，选择不分频，每次信号都触发捕获  
TIM_ICInitStructure(TIM_ICSelection = TIM_ICSelection_DirectTI; //输入信号交叉，选择直通，不交叉  
TIM_ICInit(TIM3, &TIM_ICInitStructure); //将结构体变量交给TIM_ICInit，配置TIM3的输入捕获通道
```

```txt
如果需配置PWMI双通路捕获需要修改TIM_ICInitStructure.TIM_ICSelection  $\equiv$  TIM_ICSelection_DirectTI;/输入信号交叉TIM_PWMConfig(TIM3，&TIM_ICInitStructure)；//将结构体变量交给TIM_PWMConfig，配置TIM3的输入捕获通道  
//此函数同时会把另一个通道配置为相反的配置，实现PWMI模式
```

TIM_ICPolarity_Rising:当设置为这个模式时，定时器会在检测到输入信号从低电平变为高电平时触发事件。这通常用于测量脉冲的高电平持续时间或周期。

TIM_ICPolarity_Falling: 当设置为这个模式时，定时器会在检测到输入信号从高电平变为低电平时触发事件。这通常用于测量脉冲的低电平持续时间或周期。

```txt
//**********
```

TIM_ICSelection_DirectTI

定义：直接输入模式。

功能：将定时器的输入通道1（TIM Input 1）直接连接到输入捕获通道1（IC1）。这意味着输入信号会直接通过TIM Input 1进入IC1进行捕获。

应用场景：适用于需要直接捕获输入信号的场景，例如测量脉冲宽度或周期。

TIM_ICSelection_IndirectTI

定义：间接输入模式。

功能：将定时器的输入通道1（TIM Input 1）间接连接到输入捕获通道2（IC2）。这意味着输入信号会通过某种方式（例如滤波或分频）处理后，再进入IC2进行捕获。

应用场景：适用于需要对输入信号进行预处理后再捕获的场景，例如在噪声较大的环境中使用滤波器来减少噪声影响。

TIM_ICSelection_TRC

定义：触发控制寄存器模式。

功能：将定时器的输入通道1（TIM Input 1）连接到触发控制寄存器（TRC）。这意味着输入信号会通过触发控制逻辑进行处理，然后可能被用作其他功能，而不是直接用于输入捕获。

应用场景：适用于需要使用触发控制逻辑来管理输入信号的场景，例如在复杂的控制系统中根据特定条件触发事件。

# 3、配置时基单元

```javascript
/*开启时钟*/RCC_APB1PeriphClockCmd(RCC_APB1Periph_TIM3，ENABLE); //开启TIM3的时钟  
/*配置时钟源*/TIM/InternalClockConfig(TIM3); //选择TIM3为内部时钟，若不调用此函数，TIM默认也为内部时钟  
/*时基单元初始化*/TIM_TimeBaseInitTypeDef TIM_TimeBaseInitStructure; //定义结构体变量TIM_TimeBaseInitStructure(TIM_ClockDivision = TIM_CKD_DIV1; //时钟分频，选择不分频，此参数用于配置滤波器时钟，不影响时基单元功能TIM_TimeBaseInitStructure(TIM_CounterMode = TIM_CounterMode_Up; //计数器模式，选择向上计数TIM_TimeBaseInitStructure(TIM_Period = 65536 - 1; //计数周期，即ARR的值TIM_TimeBaseInitStructure(TIM_Prescaler = 72 - 1; //预分频器，即PSC的值TIM_TimeBaseInitStructure(TIM_RepetitionCounter = 0; //重复计数器，高级定时器才会用到TIM_TimeBaseInit(TIM3，&TIM_TimeBaseInitStructure); //将结构体变量交给TIM_TimeBaseInit，配置TIM3的时基单元
```

# 4、配置触发源

```c
/*选择触发源及从模式*/  
TIM_SelectInputTrigger(TIM3, TIM_TS_T1FP1); //触发源选择  
TI1FP1  
根据GPIO引脚的定义选择对应该的TIFP
```

# 5、配置主从模式

```txt
TIM_SelectSlaveMode(TIM3，TIM_SlateMode_Set); //从模式选择复位//即TI1产生上升沿时，会触发CNT归零  
TIM_SlateMode_Set  
定义：复位模式。
```

功能：当从定时器检测到同步事件时，它会重置其计数器并重新开始计数。这通常用于需要从零开始重新测量时间间隔的场景。

应用场景：适用于需要精确控制计数起点的应用，例如在周期性任务中确保每次任务都从相同的时间点开始。

# TIM_SlaveMode_Gated

定义：门控模式。

功能：从定时器会在检测到同步事件时启动计数，并在下一个同步事件到来时停止计数。这种模式类似于一个开关，只有在接收到触发信号时才进行计数。

应用场景：适用于需要在特定时间段内测量事件频率或持续时间的场景，例如测量脉冲宽度。

# TIM_SlaveMode_Trigger

定义：触发模式。

功能：从定时器会在检测到同步事件时产生一个输出事件（如中断或DMA请求），但不会改变其计数状态。这允许从定时器与其他外设同步操作，而不影响其自身的计数。

应用场景：适用于需要与其他外设同步操作而不干扰自身计数的场景，例如在多定时器系统中协调不同任务的执行。

# TIM_SlaveMode_External1

定义：外部信号模式1。

功能：从定时器会响应外部信号（通常是另一个定时器的输出）来启动、停止或复位其计数。这种模式提供了高度的灵活性，允许定时器之间复杂的交互和同步。

应用场景：适用于需要与其他定时器紧密协作的复杂应用，例如多通道PWM控制或精确的时间序列生成。

# 主从触发模式

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/cdac9d714cde53d01e9402c614fb157dd0bbea06f93a8347322f7387e1e9e316.jpg)



主模式


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/b8e757ada42097a989da394e31a131684ffeedc565698673b73734732e756790.jpg)



触发源选择



从模式


# 6、开启定时器

/*TIM使能*/

TIM_Cmd(TIM3，ENABLE）;

//使能TIM3，定时器开始运行

# 4、编码器

Encoder Interface 编码器接口

- 编码器接口可接收增量（正交）编码器的信号，根据编码器旋转产生的正交信号脉冲，自动控制CNT自增或自减，从而指示编码器的位置、旋转方向和旋转速度

每个高级定时器和通用定时器都拥有1个编码器接口

- 两个输入引脚借用了输入捕获的通道1和通道2

# 正交编码器

正转

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/c3b563de3007482e7d1f2de049db190e5b203bebb04d0ff34f903b275a4275e5.jpg)


反转

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/2df66fc92a71f22890ffc854fbbcb8d5c40db1bf493c55fa409d6c5bec9af3f5.jpg)



边沿 另一相状态


<table><tr><td>A相↑</td><td>B相低电平</td></tr><tr><td>A相↓</td><td>B相高电平</td></tr><tr><td>B相↑</td><td>A相高电平</td></tr><tr><td>B相↓</td><td>A相低电平</td></tr></table>


边沿 另一相状态


<table><tr><td>A相↑</td><td>B相高电平</td></tr><tr><td>A相↓</td><td>B相低电平</td></tr><tr><td>B相↑</td><td>A相低电平</td></tr><tr><td>B相↓</td><td>A相高电平</td></tr></table>


图98 通用定时器框图


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/034d162e65589698320e7e36e55d2da76c65a33734c94aaa2403324bf9ab1f8d.jpg)


# 编码器接口基本结构

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/f7f9a8d2d1052914e9d6644454b662c0e4c5d242f5f66817859d9c460294c83a.jpg)


第一步配置对应引脚的GPIO、第二步配置时期单元、第三步配置输入捕获单元、第四步配置编码器接口、第五步开启定时器

# 1、配置对应引脚的GPIO

```txt
RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE); //开启GPIOA的时钟  
/*GPIO初始化*/  
GPIO_InitTypeDef GPIO_InitStructure;  
GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IPU;  
GPIO_InitStructure.GPIO_Pin = GPIO_Pin_6 | GPIO_Pin_7;  
GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;  
GPIO_Init(GPIOA, &GPIO_InitStructure); //将PA6和PA7引脚初始化为上拉输入
```

# 2、配置时期单元

```txt
RCC_AP1PeriphClockCmd(RCC_AP1Periph_TIM3，ENABLE); //开启TIM3的时钟  
/*时基单元初始化*/  
TIM_TimeBaseInitTypeDef TIM_TimeBaseInitStructure; //定义结构体变量  
TIM_TimeBaseInitStructure.TIM_ClockDivision = TIM_CKD_DIV1; //时钟分频，选择不分频，此参数用于配置滤波器时钟，不影响时基单元功能  
TIM_TimeBaseInitStructure.TIM CounterMode = TIM CounterMode_Up; //计数器模式，选择向上计数  
TIM_TimeBaseInitStructure.TIM_Period = 65536 - 1; //计数周期，即ARR的值  
TIM_TimeBaseInitStructure.TIM_Prescaler = 1 - 1; //预分频器，即PSC的值  
TIM_TimeBaseInitStructure.TIM_RepetitionCounter = 0; //重复计数器，高级定时器才会用到  
TIM_TimeBaseInit(TIM3, &TIM_TimeBaseInitStructure); //将结构体变量交给TIM_TimeBaseInit，配置TIM3的时基单元
```

# 3、配置输入捕获单元

```c
/*输入捕获初始化*/  
TIM_ICInitTypeDef TIM_ICInitStructure; //定义结构体变量  
TIM_ICStructInit(&TIM_ICInitStructure); //结构体初始化，若结构体没有完整赋值  
//则最好执行此函数，给结构体所有成员都赋一个默认值  
//避免结构体初值不确定的问题  
TIM_ICInitStructure.TIM_Channel = TIM_Channel_1; //选择配置定时器通道1  
TIM_ICInitStructure.TIM_ICFilter = 0xF; //输入滤波器参数，可以过滤信号抖动  
TIM_ICInit(TIM3, &TIM_ICInitStructure); //将结构体变量交给TIM_ICInit，配置TIM3的输入捕获通道  
TIM_ICInitStructure.TIM_Channel = TIM_Channel_2; //选择配置定时器通道2  
TIM_ICInitStructure.TIM_ICFilter = 0xF; //输入滤波器参数，可以过滤信号抖动  
TIM_ICInit(TIM3, &TIM_ICInitStructure); //将结构体变量交给TIM_ICInit，配置TIM3的输入捕获通道
```

# 4、配置编码器接口

```javascript
/*编码器接口配置*/TIM EncoderInterfaceConfig(TIM3，TIM EncoderMode_TI12，TIM_ICPolarity_Rising，TIM_ICPolarity_Rising); //配置编码器模式以及两个输入通道是否反相 //注意此时参数的Rising和Falling已经不代表上升沿和下降沿了，而是代表是否反相 //此函数必须在输入捕获初始化之后进行，否则输入捕获的配置会覆盖此函数的部分配置
```

# 5、开启定时器

```txt
/*TIM使能*/  
TIM_Cmd(TIM3，ENABLE); //使能TIM3，定时器开始运行
```

# 附加编码器清零

```c
int16_t Encoder_Get(void)   
{ /\*使用Temp变量作为中继，目的是返回CNT后将其清零\*/ int16_t Temp; Temp  $=$  TIM_GetCounter(TIM3); TIM_SetCounter(TIM3,0); return Temp;   
}
```

# 四、数模转换

- ADC: 将连续的模拟信号转换为离散的数字信号。输入为模拟信号, 输出为数字信号。

- DAC：将数字信号转换为连续变化的模拟信号。输入为数字信号，输出为模拟信号。

- ADC：广泛应用于数据采集系统、传感器接口、音频处理等领域。

- DAC：用于波形生成、音频播放系统、控制系统中的执行器控制等。

# 1、ADC转换

- ADC (Analog-Digital Converter) 模拟-数字转换器

- ADC可以将引脚上连续变化的模拟电压转换为内存中存储的数字变量，建立模拟电路到数字电路的桥梁

# 工作原理

# 逐次逼近型ADC

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/ddd71538ce5732b7e30edf30029f647c922191080302655ee67e93c47e612f4a.jpg)


# ADC基本结构

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/c8a183082a6764811d794754517f3e0b6e419ef421223d5ea3a8cfcd430ed9ea.jpg)


如果我们要使用ADC转换的话，这个时候我们就使用外设GPIO口来接收转换信号、GPIO口接收到信号后进入AD转换器的内部、选择对应的模式，如规则组、注入组。二个组对应的转换数据是不一样的。进入了AD转换器，转换完成后就会存入AD数据寄存器中。我们需要查看结果直接去AD数据寄存器中取相对应的数据即可。

如取到数据进入看门管理、或者中断意可处理


转换模式


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/7be4e401819a6d3242dfaa0a33e596fd4810e4916d5975cfac2f4b68f526f4ed.jpg)



- 单次转换，非扫描模式


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/ffe0af19ef3d0a879675275a58ebfa2b3ff27b2ef9cc2d0d10f9282525fa482b.jpg)


单次转换、非扫描模式、转换后就去拿数据，然后结束


转换模式



- 连续转换，非扫描模式


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/f1b2b360b213a8b415f2728b6c1e23026a7633224de6c558a91f8da639507ccf.jpg)


连续转换、扫描模式、转换后就去拿数据，然后继续。


转换模式


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/012efae04ddb4aed7b14e9cd92b2e094d4f7313b3ab38ef37ab55cca6ff6e1b4.jpg)



- 单次转换，扫描模式


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/676ffda4a46c3d10c2f3763ad607575fa2b054feb278ae41ddf95bd8dcf02848.jpg)


# 转换模式

# 连续转换，扫描模式

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/c93c14fbb26e1f78d59ff4a962a6b693b3ca4186497055e52cae9fbd788c4375.jpg)


同理一个是1对1一个是多对多。

使用方法

第一步配置对应GPIO、第二步配置AD转换器、里面配置你要多少个通道要怎么转换数据、第三步对ADC进行校准、第四步获取转换结果

# 1、配置对应GPIO

RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE); //开启GPIOA的时钟

/*GPIO初始化*/

GPIO_InitTypeDef GPIO_InitStructure;

GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AIN;

//AIM是ADC转换的专用配

置

GPIO_InitStructure.GPIO_Pin = GPIO_Pin_0;

GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;

GPIO_Init(GPIOA，&GPIO_InitStructure);

//将PAO引脚初始化为模拟

输入

<table><tr><td>通道</td><td>ADC1</td><td>ADC2</td><td>ADC3</td></tr><tr><td>通道0</td><td>PA0</td><td>PA0</td><td>PA0</td></tr><tr><td>通道1</td><td>PA1</td><td>PA1</td><td>PA1</td></tr><tr><td>通道2</td><td>PA2</td><td>PA2</td><td>PA2</td></tr><tr><td>通道3</td><td>PA3</td><td>PA3</td><td>PA3</td></tr><tr><td>通道4</td><td>PA4</td><td>PA4</td><td>PF6</td></tr><tr><td>通道5</td><td>PA5</td><td>PA5</td><td>PF7</td></tr><tr><td>通道6</td><td>PA6</td><td>PA6</td><td>PF8</td></tr><tr><td>通道7</td><td>PA7</td><td>PA7</td><td>PF9</td></tr><tr><td>通道8</td><td>PB0</td><td>PB0</td><td>PF10</td></tr><tr><td>通道9</td><td>PB1</td><td>PB1</td><td></td></tr><tr><td>通道10</td><td>PC0</td><td>PC0</td><td>PC0</td></tr><tr><td>通道11</td><td>PC1</td><td>PC1</td><td>PC1</td></tr><tr><td>通道12</td><td>PC2</td><td>PC2</td><td>PC2</td></tr><tr><td>通道13</td><td>PC3</td><td>PC3</td><td>PC3</td></tr><tr><td>通道14</td><td>PC4</td><td>PC4</td><td></td></tr><tr><td>通道15</td><td>PC5</td><td>PC5</td><td></td></tr><tr><td>通道16</td><td>温度传感器</td><td></td><td></td></tr><tr><td>通道17</td><td>内部参考电压</td><td></td><td></td></tr></table>

# 2、配置AD转换器

```txt
RCC_APB2PeriphClockCmd(RCC_APB2Periph_ADC1，ENABLE); //开启ADC1的时钟  
/*设置ADC时钟*/  
RCC_ADCCLKConfig(RCC_PCLK2_Div6); //选择时钟6分频，ADCCLK=72MHz/6=12MHz因为内部是8位的寄存所以要分频
```

```txt
/*规则组通道配置*/  
ADC-RegularChannelConfig(ADC1, ADC_Channel_0, 1, ADC_SampleTime_55Cycles5); //规则组序列1的位置，配置为通道0 ADC_SampleTime_55Cycles5这个为周期时间55的周期， $55 + 12 = 67 + 1 = 68$ $1 / 12*68 = 5.6us$
```

```c
/*ADC初始化*/  
ADC_InitTypeDef ADC_InitStructure; //定义结构体变量  
ADC_InitStructure.ADC_Mode = ADC_Mode_Independent; //模式，选择独立模式，即单独使用ADC1  
ADC_InitStructure.ADC_DataAlign = ADC_DataAlignRight; //数据对齐，选择右对齐  
ADC_InitStructure.ADC_ExternalTrigConv = ADC_ExternalTrigConv_None; //外部触发，使用软件触发，不需要外部触发
```

```txt
ADC_InitStructure.ADC_ConsecutiveConvMode  $=$  DISABLE; //连续转换，失能，每转换一次规则组序列后停止 ADC_InitStructure.ADC_ScanConvMode  $=$  DISABLE; //扫描模式，失能，只转换规则组的序列1这一个位置
```

```txt
ADC_InitStructure.ADC_NbrOfChannel = 1; //通道数，为1，仅在扫描模式下，才需要指定大于1的数，在非扫描模式下，只能是1  
ADC_Init(ADC1, &ADC_InitStructure); //将结构体变量交给ADC_Init，配置ADC1
```

```c
/*ADC使能*/
ADC_Cmd(ADC1, ENABLE); //使能ADC1，ADC开始运行
```

```txt
//ADC_ConsecutiveConvMode  $=$  DISABLE;如果是ENABLE那就是连转换 //ADC_ScanConvMode  $=$  DISABLE; 如果ENABLE那就是连扫描模式
```

数据右对齐：


规则组


<table><tr><td>0</td><td>0</td><td>0</td><td>0</td><td>D11</td><td>D10</td><td>D9</td><td>D8</td><td>D7</td><td>D6</td><td>D5</td><td>D4</td><td>D3</td><td>D2</td><td>D1</td><td>D0</td></tr></table>

数据左对齐：


规则组


<table><tr><td>D11</td><td>D10</td><td>D9</td><td>D8</td><td>D7</td><td>D6</td><td>D5</td><td>D4</td><td>D3</td><td>D2</td><td>D1</td><td>D0</td><td>0</td><td>0</td><td>0</td><td>0</td></tr></table>

# 转换时间

- AD转换的步骤：采样，保持，量化，编码

- STM32 ADC的总转换时间为： $T_{CONV} =$  采样时间 + 12.5个ADC周期

例如：当ADCCLK=14MHz，采样时间为1.5个ADC周期  $T_{CONV} = 1.5 + 12.5 = 14$  个ADC周期  $= 1\mu s$

# 3、对ADC进行校准

```javascript
/*ADC校准*/ ADC Reset Calibration(ADC1); //固定流程，内部有电路会自动执行校准重置校准器 while（ADC_GetResetCalibrationStatus(ADC1 == SET)；//等待校准复位完成 ADC_StartCalibration(ADC1); //启动ADC1校准过程 while（ADC_GetCalibrationStatus(ADC1 == SET)； //等待校准过程完成
```

# 4、获取转换结果

```c
uint16_t AD_GetValue(void)  
{ADC_SoftwareStartConvCmd(ADC1, ENABLE); //软件触发AD转换一次while（ADC_GetFlagStatus(ADC1，ADC_FLAG_EOC）  $= =$  RESET）；//等待EOC标志位，即等待AD转换结束return ADC_GetConversionValue(ADC1); //读数据寄存器，得到AD转换的结果}  
重要函数就是ADC_GetConversionValue(ADC1); //读数据寄存器，得到AD转换的结果
```

```c
/**
* uint16_t AD_GetValue uint16_t ADC_Channel)
{
    ADC-RegularChannelConfig(ADC1, ADC_Channel, 1, ADC_SampleTime_55Cycles5);
    //规则组序列1的位置，配置为通道0
    ADC_SoftwareStartConvCmd(ADC1, ENABLE); //软件触发AD转换一次
    while (ADC_GetFlagStatus(ADC1, ADC_FLAG_EOC) == RESET); //等待EOC标志位，即等待AD转换结束
    return ADC_GetConversionValue(ADC1); //读数据寄存器，得到AD转换的结果
}
```

# 2、DMA转运

- DMA (Direct Memory Access) 直接存储器存取

- DMA可以提供外设和存储器或者存储器和存储器之间的高速数据传输，无须CPU干预，节省了CPU的资源

- 12个独立可配置的通道：DMA1（7个通道），DMA2（5个通道）

每个通道都支持软件触发和特定的硬件触发

触发DMA转运的在三个条件，1. 传输计数数不为0、2.DAM使能，3. 触发源有信号

# 存储器映像

<table><tr><td>类型</td><td>起始地址</td><td>存储器</td><td>用途</td></tr><tr><td rowspan="3">ROM</td><td>0x0800 0000</td><td>程序存储器Flash</td><td>存储C语言编译后的程序代码</td></tr><tr><td>0x1FFF F000</td><td>系统存储器</td><td>存储BootLoader,用于串口下载</td></tr><tr><td>0x1FFF F800</td><td>选项字节</td><td>存储一些独立于程序代码的配置参数</td></tr><tr><td rowspan="3">RAM</td><td>0x2000 0000</td><td>运行内存SRAM</td><td>存储运行过程中的临时变量</td></tr><tr><td>0x4000 0000</td><td>外设寄存器</td><td>存储各个外设的配置参数</td></tr><tr><td>0xE000 0000</td><td>内核外设寄存器</td><td>存储内核各个外设的配置参数</td></tr></table>

ROM为断保持寄存器、RAM为断电不保持寄存器。可以用16进制数查看变量的地址。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/8a47d25428122e7580f1b53bf253c6d130e8cbcf9145035a3d14730c681cf2af.jpg)


# 工作原理

DMA主要的工作就是把寄存器内容移到别的地主去，如把RAM寄存器中的数据转到ROM中、或ROM转RAM，或RAM转RAM、ROM转ROM。有点像mov的指令但是一个是不等于=赋值

要想使用DMA

第一步配置DMA初始化、第二步使用DAM转动函数工作没了

# 1、配置DMA初始化

```txt
uint16_t MyDMA_Size; //定义全局变量，用于记住Init函数的Size，供  
Transfer函数使用  
void MyDMA_Init( uint32_t AddrA, uint32_t AddrB, uint16_t Size)  
{MyDMA_Size = Size; //将Size写入到全局变量，记住参数Size  
/*开启时钟*/RCC_AHBPeriphClockCmd(RCC_AHBPeriph_DMA1, ENABLE); //开启DMA的时钟  
/*DMA初始化*/DMA_InitTypeDef DMA_InitStructure; //定义结构体变量DMA_InitStructure.DMA_PeripheralBaseAddr = AddrA; //外设基地址，给定形参AddrDMA_InitStructure.DMA_PeripheralDataSize = DMA_PeripheralDataSize_Byte; //外设数据宽度，选择字节DMA_InitStructure.DMA_PeripheralInc = DMA_PeripheralInc_Enable; //外设地址自增，选择使能DMA_InitStructure.DMA_MemoryBaseAddr = AddrB; //存储器基地址，给定形参AddrDMA_InitStructure.DMA_MemoryDataSize = DMA_MemoryDataSize_Byte; //存储器数据宽度，选择字节DMA_InitStructure.DMA_MemoryInc = DMA_MemoryInc_Enable; //存储器地址自增，选择使能
```

```txt
DMA_InitStructure.DMA_DIR = DMA_DIR_PeripheralSRC; //数据传输方向，选择由外设到存储器DMA_InitStructure.DMABufferSize = Size; //转运的数据大小（转运次数）//如果你是以Byte转运的话你的数据类型为int8类型，才能对应次数。如果是Halfword那你的数据类型是int16//如果是Word的话你的数据类型是int32.这样才能对应转动次数//单位：1Byte  $= 8$  bits。1Half word  $= 16$  bits。1word  $= 32$  bits。DMA_InitStructure.DMA_Mode  $\equiv$  DMA_Mode_Normal; //模式，选择正常模式DMA_InitStructure.DMA_M2M  $\equiv$  DMA_M2M_Enable; //存储器到存储器，选择使能DMA_InitStructure.DMA_Priority  $\equiv$  DMA_Priority_Medium; //优先级，选择中等DMA_Init(DMA1_Channel1，&DMA_InitStructure); //将结构体变量交给DMA_Init，配置DMA1的通道1/\*DMA使能\*/DMA_Cmd(DMA1_Channel1，DISABLE)； //这里先不给使能，初始化后不会立刻工作，等后续调用Transfer后，再开始}
```

```txt
define DMA_DIR_PeripheralDST //数据传输方向，选择由存储器到外设  
#define DMA_DIR_PeripheralsSRC //数据传输方向，选择由外设到存储器DMA_M2M_Enable：//启用DMA的存储器到存储器传输模式。在这种模式下，DMA可以直接在两个内存地址之间传输数据，而无需CPU的干预。这通常用于需要高效数据传输的场景，例如将数据从Flash复制到SRAM。DMA_M2M_Disable：//禁用DMA的存储器到存储器传输模式。在这种模式下，DMA不能直接在两个内存地址之间传输数据。如果需要在存储器之间传输数据，CPU必须参与其中。DMA_MemoryInc_Enable //存储器地址自增，选择使能DMA_MemoryInc_Disable //存储器地址自增，选择失能DMA_Mode_Circular：在循环模式下，DMA传输可以循环执行DMA_Mode_Normal：在普通模式下，DMA传输只会执行一次，传输完毕后就会停止
```

# 2、转运函数

```c
void MyDMA_Transfer(void)  
{DMA_Cmd(DMA1_Channel1, DISABLE); //DMA失能，在写入传输计数器之前，需要DMA暂停工作DMA_SetCurrDataCounter(DMA1_Channel1, MyDMA_Size); //写入传输计数器，指定将要转运的次数可以固定值但用变量方便调用DMA_Cmd(DMA1_Channel1, ENABLE); //DMA使能，开始工作while（DMA_GetFlagStatus(DMA1_FLAG_TC1）==RESET); //等待DMA工作完成DMA_ClearFlag(DMA1_FLAG_TC1); //清除工作完成标志位}
```

# 3、ADC扫描模式+DMA


ADC扫描模式+DMA


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/cdc99440a1bba173256fd5e6111fae9cbb29cc1fa74111becece295c92c8413b.jpg)


ADC+DMA是数据传输的好帮手可以说是固定搭配了。解决了大多的通讯问题

uint16_t AD_value[4]; //定义用于存放AD转换结果的全局数组.主函数只要调用这个数据组就能得到所有转换数据了

```c
void AD_Init(void)  
{ RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA, ENABLE); //开启GPIO时钟 RCC_APB2PeriphClockCmd(RCC_APB2Periph_ADC1, ENABLE); //开启ADC1时钟 RCC_AHBPeriphClockCmd(RCC_AHBPeriph_DMA1, ENABLE); //开启DMA1时钟
```

/*设置ADC时钟*/

RCC_ADCCLKConfig(RCC_PCLK2_Div6); //选择时钟6分频，ADCCLK = 72MHz / 6 = 12MHz因为内部是8位的寄存所以要分频

/*GPIOA配置*/

```txt
GPIO_InitTypeDef GPIO_InitStructure; //定义结构体变量  
GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AIN; //选择专用AIM模式  
GPIO_InitStructure.GPIO_Pin = GPIO_Pin_0 | GPIO_Pin_1 | GPIO_Pin_2 | GPIO_Pin_3; //选择引脚  
GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz; //选择频率  
GPIO_Init(GPIOA, &GPIO_InitStructure);
```

/*ADC规则组通道配置*/

```javascript
ADC_RegularChannelConfig(ADC1，ADC_Channel_0，1, ADC_SampleTime_55Cycles5);//规则组序列1的位置，配置为通道0 ADC_RegularChannelConfig(ADC1，ADC_Channel_1，2, ADC_SampleTime_55Cycles5);//规则组序列2的位置，配置为通道1 ADC_RegularChannelConfig(ADC1，ADC_Channel_2，3, ADC_SampleTime_55Cycles5);//规则组序列3的位置，配置为通道2 ADC_RegularChannelConfig(ADC1，ADC_Channel_3，4, ADC_SampleTime_55Cycles5); //规则组序列4的位置，配置为通道3
```

/*ADC初始化*/

ADC_InitTypeDef ADC_InitStruture; //定义结构体变量

ADC_InitStruture.ADC_DataAlign  $\equiv$  ADC_DataAlign Right;//数据对齐，选择右对齐

ADC_InitStruture.ADC_ExternalTrigConv=ADC_ExternalTrigConv_None;//外部触发，使用软件触发，不需要外部触发

ADC_InitStruture.ADC_Mode=ADC_Mode_Independent;//模式，选择独立模式，即单独使用ADC1

ADC_InitStrcuture.ADC_ContinuexConvMode  $\equiv$  ENABLE;//连续转换，使能，每转换一次规则组序列后立刻开始下一次转换

ADC_InitStruture.ADC_ScanConvMode  $\equiv$  ENABLE; //扫描模式，使能，扫描规则组的序列，扫描数量由ADC_NbrOfChannel确定

ADC_InitStruture.ADC_NbrOfChannel=4; //通道数，为4，扫描规则组的前4个通道

ADC_Init(ADC1,&ADC_InitStruture);//将结构体变量交给ADC_Init，配置ADC1

/*DMA初始化*/

DMA_InitTypeDef DMA_InitStructure; //定义结构体变量

/*源地址*/

DMA_InitStructure.DMA_PeripheralBaseAddr = (uint32_t)&ADC1->DR;

//外设基地址，给定形参AddrA

DMA_InitStructure.DMA_PeripheralDataSize = DMA_PeripheralDataSize_HalfWord;

//外设数据宽度，选择半字，对应16为的ADC数据寄存器

DMA_InitStructure.DMA_PeripheralInc = DMA_PeripheralInc_Disable;

//外设地址不自增，选择失能，始终以ADC数据寄存器为源

/*转运地址*/

DMA_InitStructure.DMA_MemoryBaseAddr = (uint32_t)AD_Value;

//存储器基地址，给定存放AD转换结果的全局数组AD_Value

DMA_InitStructure.DMA_MemoryDataSize = DMA_MemoryDataSize_HalfWord;

//存储器数据宽度，选择半字，与源数据宽度对应

DMA_InitStructure.DMA_MemoryInc = DMA_MemoryInc_Enable;

//存储器地址自增，选择使能，每次转运后，数组移到下一个位置

DMA_InitStructure.DMA_DIR = DMA_DIR_PeripheralSRC;

//数据传输方向，选择由外设到存储器，ADC数据寄存器转到数组

DMA_InitStructure.DMABufferSize = 4;

//转运的数据大小（转运次数），与ADC通道数一致

DMA_InitStructure.DMA_Mode = DMA_Mode_Circular;

//模式，选择循环模式，与ADC的连续转换一致

DMA_InitStructure.DMA_M2M = DMA_M2M_Disable;

//存储器到存储器，选择失能，数据由ADC外设触发转运到存储器

DMA_InitStructure.DMA_Priority = DMA_Priority_Medium;

//优先级，选择中等

DMA_Init(DMA1_Channel1, &DMA_InitStructure);

//将结构体变量交给DMA_Init，配置DMA1的通道1

/*DMA和ADC使能*/

DMA_Cmd(DMA1_Channel1，ENABLE); //DMA1的通道1使能ADC_DMACmd(ADC1，ENABLE)； //ADC1触发DMA1的信号使

能

ADC_Cmd(ADC1, ENABLE); //ADC1使能

/*ADC校准，固定流程，内部有电路会自动执行校准，步是ST公司推荐使用ADC时要校*/

ADC Reset Calibration(ADC1); //重置ADC1的校准寄存器

```txt
while (ADC_GetResetCalibrationStatus(ADC1) == SET); //等待ADC1的校准寄存器复位完成，完成跳出循环ADC_StartCalibration(ADC1); //启动ADC1的校准过程while (ADC_GetCalibrationStatus(ADC1) == SET); //等待ADC1的校准过程完成/\*ADC触发\*/ADC_SoftwareStartConvCmd(ADC1, ENABLE); //软件触发ADC开始工作，由于ADC处于连续转换模式，故触发一次后ADC就可以一直连续不断地工作}
```

# 五、通讯协议

- 通信的目的：将一个设备的数据传送到另一个设备，扩展硬件系统

- 通信协议：制定通信的规则，通信双方按照协议规则进行数据收发

- 电平标准是数据1和数据0的表达方式，是传输线缆中人为规定的电压与数据的对应关系，串口常用的电平标准有如下三种：

-TTL电平：+3.3V或+5V表示1，0V表示0

- RS232电平：-3~-15V表示1，+3~+15V表示0

- RS485电平：两线压差+2~+6V表示1，-2~-6V表示0（差分信号）

# 通信接口

- 通信的目的：将一个设备的数据传送到另一个设备，扩展硬件系统

- 通信协议：制定通信的规则，通信双方按照协议规则进行数据收发

<table><tr><td>名称</td><td>引脚</td><td>双工</td><td>时钟</td><td>电平</td><td>设备</td></tr><tr><td>USART</td><td>TX、RX</td><td>全双工</td><td>异步</td><td>单端</td><td>点对点</td></tr><tr><td>I2C</td><td>SCL、SDA</td><td>半双工</td><td>同步</td><td>单端</td><td>多设备</td></tr><tr><td>SPI</td><td>SCLK、MOSI、MISO、CS</td><td>全双工</td><td>同步</td><td>单端</td><td>多设备</td></tr><tr><td>CAN</td><td>CAN_H、CAN_L</td><td>半双工</td><td>异步</td><td>差分</td><td>多设备</td></tr><tr><td>USB</td><td>DP、DM</td><td>半双工</td><td>异步</td><td>差分</td><td>点对点</td></tr></table>

全双工：通信允许数据同时在两个方向上传输，即发送和接收可以同时进行。

半双工：通信允许数据在两个方向上传输，但在同一时刻只能进行一个方向的传输

单工：只有一方讲话另一方只能听

异步：不依赖于时钟信号来控制数据传输，每个字符独立传输，字符之间可能有任意长度的间隔

同步：依赖于时钟信号来控制数据传输，数据以数据块（帧）的形式连续传输，字符之间无间隔


串口时序


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/b1be6cfdac632beff0eee47b8e46202e0ad4e5e555648ba2003c19ccdddb15a2.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/960f62775f3b9499ba231c8182470e1fd8dde43e512e84cb3afcd602f0db79cf.jpg)


# USART串中通讯

-USART (Universal Synchronous/Asynchronous Receiver/Transmitter) 通用同步/异步收发器

-USART是STM32内部集成的硬件外设，可根据数据寄存器的一个字节数据自动生成数据帧时序，从TX引脚发送出去，也可自动接收RX引脚的数据帧时序，拼接为一个字节数据，存放在数据寄存器里

·自带波特率发生器，最高达4.5Mbits/s

- 可配置数据位长度 (8/9)、停止位长度 (0.5/1/1.5/2)

可选校验位（无校验/奇校验/偶校验）

- 支持同步模式、硬件流控制、DMA、智能卡、IrDA、LIN

- STM32F103C8T6USART资源：USART1、USART2、USART3

# 工作原理

USART串口通讯接线方式，TX为数据发送引脚，RX为数据接收引脚，使用时把发送端接到对方的接收端，对方的发送端接到我方的接收端。

# 硬件电路

- 简单双向串口通信有两根通信线（发送端TX和接收端RX）

- TX与RX要交叉连接

- 当只需单向的数据传输时，可以只接一根通信线

- 当电平标准不一致时，需要加电平转换芯片

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/8f4a4520418ee5ce07530ee56a79f6152a97dfc53b65897760b4deabde16622f.jpg)


# 串口参数及时序

- 波特率：串口通信的速率

- 起始位：标志一个数据帧的开始，固定为低电平

- 数据位：数据帧的有效载荷，1为高电平，0为低电平，低位先行

- 校验位：用于数据验证，根据数据位计算得来

- 停止位：用于数据帧间隔，固定为高电平

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/5e53c7df9b3f0a0bf4ad4ae828e3faf32b4b77832540fc84b9d3146b5447162d.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/604ede893ce294264168d476dd70b7c56d434831f89641f289252cefc95cf3cc.jpg)



图248USART框图


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/4eaf0176e73a523550b46010b57ded03ff493719c64b5b9730e74d221f68d36a.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/6fc6e317090202a2a331e3dd5d660432f80632ea816fcc5c825575970894a451.jpg)


使用UASRT步骤

第一步配置对应的GPIO、第二步配USART串口、第三步配置收发规则函数

# 1、配置对应的GPIO

根据芯片IO口选择对应的GPIO口

```c
/*开启时钟*/  
RCC_AP2PeriphClockCmd(RCC_AP2Periph_GPIOA, ENABLE); //开启GPIOA的时钟  
/*GPIO初始化*/  
GPIO_InitTypeDef GPIO_InitStructure;  
GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AF_PP;  
GPIO_InitStructure.GPIO_Pin = GPIO_Pin_9;  
GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;  
GPIO_Init(GPIOA, &GPIO_InitStructure); //将PA9引脚初始化为复用  
推挽输出  
GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IPU;  
GPIO_InitStructure.GPIO_Pin = GPIO_Pin_10;  
GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;  
GPIO_Init(GPIOA, &GPIO_InitStructure); //将PA10引脚初始化为上拉  
输入
```

# 2、配USART串口

```c
RCC_APB2PeriphClockCmd(RCC_APB2Periph_USART1, ENABLE); //开启USART1的时钟  
/*USART初始化*/  
USART_InitTypeDef USART_InitStructure; //定义结构体变量  
USART_InitStructure.USART_BaudRate = 9600; //波特率  
USART_InitStructure.USART_HardwareFlowControl =  
USART_HardwareFlowControl_None; //硬件流控制，不需要  
USART_InitStructure.USART_Mode = USART_Mode_Tx | USART_Mode_Rx; //模式，发送模式和接收模式均选择  
USART_InitStructure.USART_Parity = USART_Parity_No; //奇偶校验，不需要  
USART_InitStructure.USART_StopBits = USART_StopBits_1; //停止位，选择1位  
USART_InitStructure.USARTWordLength = USART_wordLength_8b; //字长，选择8位  
USART_Init(USART1, &USART_InitStructure); //将结构体变量交给USART_Init，配置USART1  
/*USART使能*/  
USART_Cmd(USART1, ENABLE); //使能USART1，串口开始运行
```

# 3、配置收发规则函数

```txt
USART_ReceiveData(USART1);  
USART_SendData(USART1, Byte);  
波形
```

```txt
//读取数据寄存器，存放在接收的数据变量 //将字节数据写入数据寄存器，写入后USART自动生成时序
```

# 1、发送一个字节

```c
/**
* 函数：串口发送一个字节
* 参数：Byte 要发送的一个字节
* 返回值：无
*/
void Serial_SendByte uint8_t Byte)
{
    USART_S新闻发布(USART1, Byte); //将字节数据写入数据寄存器，写入后USART自动生成时序波形
    while (USART_GetFlagStatus(USART1, USART_FLAG_TXE) == RESET); //等待发送完成
        /*下次写入数据寄存器会自动清除发送完成标志位，故此循环后，无需清除标志位*/
}
```

# 2、发送一个数组

```c
/**
* 函数：串口发送一个数组
* 参 数：Array 要发送数组的首地址
* 参 数：Length 要发送数组的长度
* 返回值：无
*/
void serial TransmitArray uint8_t *Array, uint16_t Length)
{
    uint16_t i;
    for (i = 0; i < Length; i++) //遍历数组
```

```txt
Serial_SendByteArray[i] //依次调用Serial_SendByte发送每个字节数据
```

# 3、发送一个字符串

```c
/**
* 函数：串口发送一个字符串
* 参数：String 要发送字符串的首地址
* 返回值：无
*/
void serial_SendString(char *string) {
    uint8_t i;
    for (i = 0; String[i] != '\0'; i++)//遍历字符数组（字符串），遇到字符串结束标志位后停止
        {
            Serial_SendByte(String[i]); //依次调用Serial_SendByte发送每个字节数据
        }
}
```

# 4、串口发送数字

串口发送数据其实就是把数字的十位百位千位万位等位拆开转换成字符数据发送出去

```c
/\*\* \*函数：计算x的次方（内部使用） \*参数：X数 y阶方 \*返回值：返回值等于X的Y次方假设x是2，y是3第一次循环result  $= 1^{*}2 = 2$  第二次循环result  $= 2^{*}2 = 4$  第三次循环result  $= 4^{*}2 = 8$  \*/ uint32_t Serial_Pow uint32_t X，uint32_t Y) { uint32_t result  $= 1$  //设置结果初值为1while(Y--)//执行Y次{ result  $\equiv x$  //将X累乘到结果} return result;   
} /\*\* \* 函数：串口发送数字\*参 数：Number要发送的数字，范围：0~4294967295\*参 数：Length要发送数字的长度，范围：0~10\* 假设number  $= 12345$  ，length  $= 5$
```

```c
第一次循环 Serial_Pow(10, 5 - 0 - 1) = Serial_Pow(10, 4) = 10000 number / 10000 % 10 = 12345 / 10000 % 10 = 1  
第二次循环 Serial_Pow(10, 5 - 1 - 1) = Serial_Pow(10, 3) = 1000 number / 1000 % 10 = 12345 / 1000 % 10 = 2  
第三次循环 Serial_Pow(10, 5 - 2 - 1) = Serial_Pow(10, 2) = 100 number / 100 % 10 = 12345 / 100 % 10 = 3  
第四次循环 Serial_Pow(10, 5 - 3 - 1) = Serial_Pow(10, 1) = 10 number / 10 % 10 = 12345 / 10 % 10 = 4  
第五次循环 Serial_Pow(10, 5 - 4 - 1) = Serial_Pow(10, 0) = 1 number / 1  
% 10 = 12345 / 1 % 10 = 5  
返回值：无  
\*/  
void send_sendnumber uint32_t number ,uint16_t length)  
{ uint16_t i; for(i=0;i<length;i++)//根据数字长度遍历数字的每一位 { //依次调用Serial_SendByte发送每位数字 Send_SendBeyt(number / Serial_Pow(10 ,length- i - 1) % 10 + '0'); }
```

# 5、发送数据包


发送数据包其实就是发数一个数组


```c
/\*\* \*函数：串口发送数据包 \*参数：无 \*返回值：无 \*说 明：调用此函数后，Serial_TxPacket数组的内容将加上包头（FF）包尾（FE）后，作为数据包发送出去\*/ uint8_t Serial_TxPacket[4]； //定义发送数据包数组，数据包格式：FF01020304FE void Serial_SendPacket(void) { Serial_SendByte(0xFF); Serial_SendArray(Serial_TxPacket,4)；// Serial_SendByte(0xFE);   
}
```

# 6、接收一个数据


因为接收到数据会有一个标志位，对标志位进行分装


```c
uint8_t Serial_RxData; //定义串口接收的数据变量  
uint8_t Serial_RxFlag; //定义串口接收的标志位变量  
/**  
* 函数：获取串口接收标志位  
* 参数：无  
* 返回值：串口接收标志位，范围：0~1，接收到数据后，标志位置1，读取后标志位自动清零
```

```c
\*/   
uint8_t Serial_GetRxFlag(void)   
{ if (Serial_RxFlag  $= = 1$  //如果标志位为1 { Serial_RxFlag  $= 0$  return 1; //则返回1，并自动清零标志位 } return 0; //如果标志位为0，则返回0   
}   
/\*\* \*函数：获取串口接收的数据 \*参数：无 \*返回值：接收的数据，范围：0~255 \*/   
uint8_t Serial_GetRxData(void)   
{ return Serial_RxData; //返回接收的数据变量
```

```c
采集用中断的方式进行接收，所以要在初始化中对NVIC进行中断配置  
/*中断输出配置*/USART_ITConfig(USART1,USART_IT_RXNE, ENABLE); //开启串口接收数据的中断  
/*NVIC中断分组*/NVIC_PriorityGroupConfig(NVIC_PriorityGroup_2); //配置NVIC为分组2  
/*NVIC配置*/NVIC_InitTypeDef NVIC_InitStructure; //定义结构体变量  
NVIC_InitStructure.NVIC_IRQChannel = USART1_IRQn; //选择配置NVIC的USART1  
线NVIC_InitStructure.NVIC_IRQChannelCmd = ENABLE; //指定NVIC线路使能  
NVIC_InitStructure.NVIC_IRQChannelPreemptionPriority = 1; //指定NVIC线路的抢占优  
先级为1NVIC_InitStructure.NVIC_IRQChannelSubPriority = 1; //指定NVIC线路的响应优先  
级为1NVIC_Init(&NVIC_InitStructure); //将结构体变量交给  
NVIC_Init，配置NVIC外设
```

```c
//中断函数  
voidUSART1_IRQHandler(void)  
{  
    if (USART_GetITStatus(USART1, USART_IT_RXNE == SET) //判断是否是USART1的接收事件触发的中断  
    {  
        Serial_RxData = USART_ReceiveData(USART1); //读取数据寄存器，存放在接收的数据变量  
        Serial_RxFlag = 1; //置接收标志位变量为1
```

```javascript
USART_ClearITPendingBit(USART1,USART_IT_RXNE); //清除USART1的RXNE标志位 //读取数据寄存器会自动清除此标志位 //如果已经读取了数据寄存器，也可以不执行此代码}
```

# 6、接收一个数据hex数据包

一般我们采用接收数据包的方式来接收数据效率高所以上面的uint8_t Serial_GetRxData(void)函数就不需要，不过中断还是要配置的

接收数据的方法可以做一个状态机来进行程序设计。就是设计一个步进指令第一步干嘛，第二步干嘛。

# HEX数据包接收

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/c643a17dd2255fbe0e9018f3f9461b1683c79c726c411dc9e35bf277b73fc770.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/7fdaa702df2768ef1748648787c1c668045d16c9af37466a03302299d517886d.jpg)


```c
/* 
* 函数：USART1中断函数
* 参数：无
* 返回值：无
* 注意事项：此函数为中断函数，无需调用，中断触发后自动执行
* 函数名为预留的指定名称，可以从启动文件复制
* 请确保函数名正确，不能有任何差异，否则中断函数将不能进入
*/ 
uint8_t Serial_TxPacket[4]; //定义发送数据包数组，数据包格式：FF01020304FE 
uint8_t Serial_RxPacket[4]; //定义接收数据包数组 
void USART1_IRQHandler(void) 
{
    static uint8_t RxState = 0; //定义表示当前状态机状态的静态变量
    static uint8_t pRxPacket = 0; //定义表示当前接收数据位置的静态变量
    if (USART_GetITStatus(USART1, USART_IT_RXNE) == SET) //判断是否是USART1的接收事件触发的中断
    {
        uint8_t RxData = USART_ReceiveData(USART1); //读取数据寄存器，存放在接收的数据变量
```

```javascript
/*使用状态机的思路，依次处理数据包的不同部分*/   
/*当前状态为0，接收数据包包头*/ if (RxState  $= = 0$  ） { if (RxData  $= = 0\mathrm{xFF}$  //如果数据确实是包头 RxState  $= 1$  //置下一个状态 pRxPacket  $= 0$  //数据包的位置归零 }   
/*当前状态为1，接收数据包数据*/ else if (RxState  $= = 1$  ） { Serial_RxPacket[pRxPacket]  $\equiv$  RxData; //将数据存入数据包数组的指定位置 pRxPacket ++; //数据包的位置自增 if(pRxPacket  $> = 4$  //如果收够4个数据 RxState  $= 2$  //置下一个状态 }   
/*当前状态为2，接收数据包包尾*/ else if (RxState  $= = 2$  ） { if (RxData  $= = 0\mathrm{XFE}$  //如果数据确实是包尾部 RxState  $= 0$  //状态归O Serial_RxFFlag  $= 1$  //接收数据包标志位置1，成功接收一个数据包 } }USART_ClearITPendingBit(USART1，USART_IT_RXNE); //清除标志位 }
```

# 7、接收一个文本数据包

# 文本数据包接收

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/e01cf3239f518b1ebcd503ed583b5c9da6bf6efe2cfb2da7c07fb035521220a0.jpg)


```c
\*\*函数：USART1中断函数\*参数：无\*返回值：无\*注意事项：此函数为中断函数，无需调用，中断触发后自动执行\*函数名为预留的指定名称，可以从启动文件复制\*请确保函数名正确，不能有任何差异，否则中断函数将不能进入\*/char Serial_RxPacket[100]; //定义接收数据包数组，数据包格式"@MSG\r\n"\voidUSART1_IRQHandler(void){static uint8_t RxState  $= 0$  //定义表示当前状态机状态的静态变量static uint8_t pRxPacket  $= 0$  //定义表示当前接收数据位置的静态变量if（USART_GetITStatus(USART1，USART_IT_RXNE）  $\equiv =$  SET）//判断是否是USART1的接收事件触发的中断{uint8_t RxData  $\equiv$  USART_ReceiveData(USART1); //读取数据寄存器，存放在接收的数据变量/\*使用状态机的思路，依次处理数据包的不同部分\*//\*当前状态为0，接收数据包包头\*/if(RxState  $\equiv = 0$  {if(RxData  $\equiv =$  '@' &&Serial_RxFlag  $\equiv = 0$  //如果数据确实是包头，并且上一个数据包已处理完毕{RxState  $= 1$  //置下一个状态pRxPacket  $= 0$  //数据包的位置归零}1/\*当前状态为1，接收数据包数据，同时判断是否接收到了第一个包尾\*/else if (RxState  $\equiv = 1$  {if(RxData  $\equiv =$  '\r') //如果收到第一个包尾{RxState  $= 2$  //置下一个状态}else //接收到了正常的数据{Serial_RxPacket[pRxPacket]  $\equiv$  RxData; //将数据存入数据包数组的指定位置pRxPacket  $^{+ + }$  //数据包的位置自增}1/\*当前状态为2，接收数据包第二个包尾\*/else if (RxState  $\equiv = 2$  {if(RxData  $\equiv =$  '\n') //如果收到第二个包尾{RxState  $= 0$  //状态归OSerial_RxPacket[pRxPacket]  $\equiv =$  '\0'; //将收到的字符数据包添加一个字符串结束标志Serial_RxFlag  $= 1$  //接收数据包标志位置1，成功接收一个数据包
```

```javascript
} }USART_ClearITPendingBit(USART1，USART_IT_RXNE)； //清除标志位 1
```

# 8、以收发一个hex数据包为例的全工程


Serial.c文件


```c
include"stm32f10x.h" //Deviceheader #include<stdio.h> #include<stdlib.h> uint8_t Serial_TxPacket[4]; //定义发送数据包数组，数据包格式：FF 01 02 03 04 FE uint8_t Serial_RxPacket[4]; //定义接收数据包数组 uint8_t Serial_RxFlag; //定义接收数据包标志位   
/\*\* \*函数：串口初始化 \*参数：无 \*返回值：无 \*/ void serial_Init(void) { /\*开启时钟\*/ RCC/APB2PeriphClockCmd(RCC/APB2Periph_USART1，ENABLE); //开启USART1的时钟 RCC/APB2PeriphClockCmd(RCC/APB2Periph_GPIOA，ENABLE); //开启GPIOA的时钟 /\*GPIO初始化\*/ GPIO_InitTypeDef GPIO_InitStructure; GPIO_InitStructure.GPIO_Mode  $=$  GPIO_Mode_AF_PP; GPIO_InitStructure.GPIO_Pin  $=$  GPIO_Pin_9; GPIO_InitStructure.GPIO_Speed  $=$  GPIO_Speed_50MHz; GPIO_Init(GPIOA，&GPIO_InitStructure); //将PA9引脚初始化为复用 推挽输出 GPIO_InitStructure.GPIO_Mode  $=$  GPIO_Mode_IPU; GPIO_InitStructure.GPIO_Pin  $=$  GPIO_Pin_10; GPIO_InitStructure.GPIO_Speed  $=$  GPIO_Speed_50MHz; GPIO_Init(GPIOA，&GPIO_InitStructure); //将PA10引脚初始化为上拉 输入 /\*USART初始化\*/USART_InitTypeDef USART_InitStructure; //定义结构体变量USART_InitStructure.USART_BaudRate  $= 9600$  ： //波特率USART_InitStructure.USART_HardwareFlowControl  $\equiv$  USART_HardwareFlowControl_None；//硬件流控制，不需要USART_InitStructure.USART_Mode  $=$  USART_Mode_Tx|USART_Mode_Rx；//模式，发送模 式和接收模式均选择USART_InitStructure.USART_PARity  $=$  USART_PARity_NO; //奇偶校验，不需要USART_InitStructure.USART_StopBits  $=$  USART_StopBits_1; //停止位，选择1位USART_InitStructure.USART_wordLength  $=$  USART_wordLength_8b; //字长，选择8位
```

```c
USART_Init(USART1, &USART_InitStructure); //将结构体变量交给
USART_Init, 配置USART1
/*中断输出配置*/
USART_ITConfig(USART1, USART_IT_RXNE, ENABLE); //开启串口接收数据的中断
/*NVIC中断分组*/
NVIC_PriorityGroupConfig(NVIC_PriorityGroup_2); //配置NVIC为分组2
/*NVIC配置*/
NVIC_InitTypeDef NVIC_InitStructure; //定义结构体变量
NVIC_InitStructure.NVIC_IRQChannel = USART1_IRQn; //选择配置NVIC的USART1
线
NVIC_InitStructure.NVIC_IRQChannelCmd = ENABLE; //指定NVIC线路使能
NVIC_InitStructure.NVIC_IRQChannelPreemptionPriority = 1; //指定NVIC线路的抢占优先级为1
NVIC_InitStructure.NVIC_IRQChannelSubPriority = 1; //指定NVIC线路的响应优先级为1
NVIC_Init(&NVIC_InitStructure); //将结构体变量交给
NVIC_Init, 配置NVIC外设
/*USART使能*/
USART_Cmd(USART1, ENABLE); //使能USART1，串口开始运行
}
/**\* 函数：串口发送一个字节\* 参数：Byte 要发送的一个字节\* 返回 值：无\*/void Serial_SendByte uint8_t Byte)
{
    USART_Data(USART1, Byte); //将字节数据写入数据寄存器，写入后USART自动生成时序波形
    while (USART_GetFlagStatus(USART1, USART_FLAG_TXE) == RESET); //等待发送完成/\*下次写入数据寄存器会自动清除发送完成标志位，故此循环后，无需清除标志位\*/}
/**
* 函数：串口发送一个数组\* 参数：Array 要发送数组的首地址\* 参数：Length 要发送数组的长度\* 返回 值：无\*/void Serial_SendArray uint8_t *Array, uint16_t Length)
{
    uint16_t i;
    for (i = 0; i < Length; i++)
        //遍历数组
        {
            Serial_SendByte(Array[i]); //依次调用Serial_SendByte发送每个字节数据
        }
}
```

```txt
\*函数：串口发送一个字符串  
\*参数：String要发送字符串的首地址\*返回值：无\*/  
void serial_sendstring(char \*string)  
{uint8_t i;for  $(i = 0$  ;String[i]！  $= '\backslash 0'$  ；i++)//遍历字符数组（字符串），遇到字符串结束标志位后停止{Serial_SendByte(String[i])；//依次调用Serial_SendByte发送每个字节数据}  
1  
/\*\*  
\*函数：次方函数（内部使用）\*返回值：返回值等于X的Y次方\*/  
uint32_t Serial_Pow( uint32_t X，uint32_t Y)  
{uint32_t Result  $= 1$  //设置结果初值为1while(Y--）//执行Y次{Result  $\equiv x$  //将X累乘到结果}return Result;  
1  
/\*\*  
\*函数：串口发送数字\*参数：Number要发送的数字，范围：0~4294967295\*参数：Length要发送数字的长度，范围：0~10\*返回值：无\*/  
void serial_sendNumber( uint32_t Number，uint8_t Length)  
{uint8_t i;for  $(i = 0$  ;i<Length;i++)//根据数字长度遍历数字的每一位{Serial_SendByte(Number/Serial_Pow(10，Length-i-1)%10+‘0')）;//依次调用Serial_SendByte发送每位数字}  
1  
/\*\*  
\*函数：使用printf需要重定向的底层函数\*参数：保持原始格式即可，无需变动\*返回值：保持原始格式即可，无需变动\*/int fputc(int ch，FILE \*f)  
{Serial_SendByte(ch); //将printf的底层重定向到自己的发送字节函数return ch;
```

```c
/* 
* 函数：自己封装的printf函数
* 参数：format格式化字符串
* 参数：... 可变的参数列表
* 返回值：无
*/
void serial(Print(char *format, ...) 
{
    char String[100]; //定义字符数组
    va_list arg; //定义可变参数列表数据类型的变量arg
    va_start(arg, format); //从format开始，接收参数列表到arg变量
    vsprintf(String, format, arg); //使用vsprintf打印格式化字符串和参数列表到字符数组中
    va_end(arg); //结束变量arg
    Serial_SendString(String); //串口发送字符数组（字符串）
}
/* 
* 函数：串口发送数据包
* 参数：无
* 返回值：无
* 说明：调用此函数后，Serial_TxPacket数组的内容将加上包头（FF）包尾（FE）后，作为数据包发送出去
*/
void serial_SendPacket(void)
{
    Serial_SendByte(0xFF);
    Serial_SendDate(Serial_TxPacket, 4);
    Serial_SendByte(0xFE);
}
/* 
* 函数：获取串口接收数据包标志位
* 参数：无
* 返回值：串口接收数据包标志位，范围：0~1，接收到数据包后，标志位置1，读取后标志位自动清零 */
uint8_t Serial_GetRxFlag(void)
{
    if (Serial_RxFlag == 1) //如果标志位为1
        {
            Serial_RxFlag = 0;
        }
    return 1; //则返回1，并自动清零标志位
} 
return 0; //如果标志位为0，则返回0
}
/* 
* 函数：USART1中断函数
* 参数：无
* 返回值：无
* 注意事项：此函数为中断函数，无需调用，中断触发后自动执行
* 函数名为预留的指定名称，可以从启动文件复制
* 请确保函数名正确，不能有任何差异，否则中断函数将不能进入
*/
void USART1_IRQHandler(void)
{
```

```c
static uint8_t RxState = 0; //定义表示当前状态机状态的静态变量  
static uint8_t pRxPacket = 0; //定义表示当前接收数据位置的静态变量  
if (USART_GetITStatus(USART1, USART_IT_RXNE) == SET) //判断是否是USART1  
的接收事件触发的中断  
{  
    uint8_t RxData = USART_ReceiveData(USART1); //读取数据寄存器，存  
放在接收的数据变量  
/*使用状态机的思路，依次处理数据包的不同部分*/  
/*当前状态为0，接收数据包包头*/  
if (RxState == 0)  
{  
    if (RxData == 0xFF) //如果数据确实是包头  
    {  
        RxState = 1; //置下一个状态  
        pRxPacket = 0; //数据包的位置归零  
    }  
}  
/*当前状态为1，接收数据包数据*/  
else if (RxState == 1)  
{  
    Serial_RxPacket[pRxPacket] = RxData; //将数据存入数据包数组的指定位置  
    pRxPacket++; //数据包的位置自增  
    if (pRxPacket >= 4) //如果收够4个数据  
    {  
        RxState = 2; //置下一个状态  
    }  
}  
/*当前状态为2，接收数据包包尾*/  
else if (RxState == 2)  
{  
    if (RxData == 0xFE) //如果数据确实是包尾部  
    {  
        RxState = 0; //状态归0  
        Serial_RxFlag = 1; //接收数据包标志位置1，成功接收一个数据包  
    }  
}  
USART_ClearITPendingBit(USART1, USART_IT_RXNE); //清除标志位  
}
```


Serial.h文件


```c
ifndef__SERIAL_H #define__SERIAL_H #include<stdio.h> extern uint8_t Serial_TxPacket[]; extern uint8_t Serial_RxPacket[]; void Serial_Init(void);
```

```c
void Serial_SendByte( uint8_t Byte);   
void Serial_SendArray( uint8_t *Array, uint16_t Length);   
void Serial_SendString(char *String);   
void Serial_SendNumber( uint32_t Number, uint8_t Length);   
void Serial(Print(char *format, ...);   
void Serial_SendPacket(void);   
uint8_t Serial_GetRxFlag(void);   
#endif
```

# printf函数重写

# 1、重定向printf函数

```c
include"stm32f10x.h" //Deviceheader #include<stdio.h> #include<stdlib.h>   
\*\* 函数：使用printf需要重定向的底层函数 \*参 数：保持原始格式即可，无需变动 \*返回值：保持原始格式即可，无需变动 \*/ int fputc(int ch，FILE \*f) { Serial_SendByte(ch); //将printf的底层重定向到自己的发送字节函数 returnch;
```

# 2、封装prinf函数

```txt
/**
* 函数：自己封装的printf函数
* 参数 数：format 格式化字符串
* 参 数：... 可变的参数列表
* 返回值：无
*/
void Serial(Print(char *format, ...) {
    char String[100]; //定义字符数组
    va_list arg; //定义可变参数列表数据类型的变量arg
    va_start(arg, format); //从format开始，接收参数列表到arg变量
    vsprintf(String, format, arg); //使用vsprintf打印格式化字符串和参数列表到字符数组中
    va_end(arg); //结束变量arg
    Serial_SendString(String); //串口发送字符数组（字符串）
}
```

# I2C通讯

- I2C (Inter IC Bus) 是由Philips公司开发的一种通用数据总线

- 两根通信线：SCL（Serial Clock）、SDA（Serial Data）

- 同步，半双工

·带数据应答

- 支持总线挂载多设备（一主多从、多主多从）

# 使用时

- 所有I2C设备的SCL连在一起，SDA连在一起

设备的SCL和SDA均要配置成开漏输出模式

- SCL和SDA各添加一个上拉电阻，阻值一般为4.7KΩ左右

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/22bc868430d7317cda236a4dc687d3c44114787702ed34471200a5fca0027959.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/67a85efa93a77684ac0ff74693d8c4b79adfce6abc0db0f1d34fc3547b7ad67e.jpg)


# 通讯过程

I2C通讯协议的通讯过程可以分为以下几个步骤：

# 第一步

发送起始信号(Start Signal)：在SCL为高电平时，SDA由高电平跳变为低电平，表示开始通信

# 第二步

发送从设备地址（Slave Address）：主机发送7位或10位的从设备地址。这个地址用于确定与哪个从机进行通信。

# 第三步

发送读写控制位（R/W Bit）：在从设备地址之后，紧接着是读写控制位。如果该位为0，表示主机将向从机写入数据；如果该位为1，表示主机将从从机读取数据。

# 第四步

等待应答信号（ACK/NACK）：从设备接收到地址和读写控制位后，会发送一个应答信号（ACK）或非应答信号（NACK）。ACK表示从设备已准备好接收或发送数据，而NACK则表示从设备未准备好或出现了某种错误。

# 第五步

数据传输：根据读写控制位的不同，主机和从机之间将进行数据传输。在写操作中，主机发送数据，从机接收并存储数据；在读操作中，从机发送数据，主机接收数据。每个字节（8位）的数据都在SCL的每个时钟周期内传输一位。

# 第六步

发送停止信号（Stop Signal）：在SCL为高电平时，SDA由低电平跳变为高电平，表示结束通信。

时序模块图

# I2C时序基本单元

- 起始条件：SCL高电平期间，SDA从高电平切换到低电平

- 终止条件：SCL高电平期间，SDA从低电平切换到高电平

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/c7fd40636e39129b4e04df715b7d718fcf20b50ca93385b8eb830d7eaf9020cc.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/2fbcb96c9da9c9c789a88b4f179fe51433e2356934276461cc7844348cf04373.jpg)


# I2C时序基本单元

- 发送一个字节：SCL低电平期间，主机将数据位依次放到SDA线上（高位先行），然后释放SCL，从机将在SCL高电平期间读取数据位，所以SCL高电平期间SDA不允许有数据变化，依次循环上述过程8次，即可发送一个字节

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/2cd022ab908c55e8e18f9850daa8ffc33cfc3f3a63c8078624b62c0b9f9aab20.jpg)


# I2C时序基本单元

- 接收一个字节：SCL低电平期间，从机将数据位依次放到SDA线上（高位先行），然后释放SCL，主机将在SCL高电平期间读取数据位，所以SCL高电平期间SDA不允许有数据变化，依次循环上述过程8次，即可接收一个字节（主机在接收之前，需要释放SDA）

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/2cc4ab6d8d180e96d18a7d788d24e47799b28165713a88ef3e2b65ceae5303a1.jpg)


# I2C时序基本单元

- 发送应答：主机在接收完一个字节之后，在下一个时钟发送一位数据，数据0表示应答，数据1表示非应答

- 接收应答：主机在发送完一个字节之后，在下一个时钟接收一位数据，判断从机是否应答，数据0表示应答，数据1表示非应答（主机在接收之前，需要释放SDA)

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/ac6b28a5e4214a314fbf2cac6b26df4d145412bb49728f1da05494b408c42b9b.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/bb755414ae56d2f22b503bf1df86cb4d027fbd679057fbac909f6b8802e065b2.jpg)


# 写一个寄存器步骤

/

第一步发送起始信号

第二步发送需要通讯的设备地址号。以发送字节的方式

第三步接收应答

第四步发送需要写的寄存器地址

第五步接收应答

第六步发送要写入寄器数据

第七步接收应答

第八步结束通讯

通讯出问题了看看ACK应答位的状态

\*/

# 读一个寄存器步骤

\*/

读寄存器首先，读到的数据往那存入？这个问题先解决。

例如定义一个uint8_t Date;的变量来存入数据

读取寄存器

第一步发送起始信号

第二步发送需要通讯的设备地址号。以发送字节的方式

第三步接收应答

第四步发送需要读取的寄存地址

第五步接收应答

第六步因为我们前五步我们只写的时序，所以我们要重新进，发送起始信号。如果不加前五步读取到的数据会一直跳变

对我们的读取到数据不好进行应用

第七步发送从设备地址，默认是0是写1是读

第八步接收应答

第九步把接收的应答数据存入Date中

第十步发送应答给从机非应答，终止从机的数据输出

最后返回Date数据就行了

\*/

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/01d50055fdc4c9b0e7dc669872809a87f9034537fb70011ac61fef7a2c8e8f07.jpg)


# 软件I2C

在使用软件写I2C协议时，我们可以指定任意GPIO通过手动翻转GPIO的高低电平来模拟时序。基本程序设计思路如下：

# GPIO为开漏输出模式

1、设计一个I2C的通讯时序。如起始条件、终止条件、发送字节、接收字节、发送应答、接收应答等时序。

2、设计需要通讯的模块，调成设计好的I2C通讯时序程序，从而发起通讯

3、在main函数中或其它模块中应用数据。

# 1、定义GPIO引脚

```c
define MyI2C_GPIO GPIO   
#define MyI2C_SCL GPIO_Pin_10   
#define MyI2C_SDA GPIO_Pin_11   
//加宏定义方便移植更改   
void MyI2C_Init(void)   
{ /\*开启时钟\*/ RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOB，ENABLE); //开启GPIOA的时钟  $/^{*}\mathrm{GPIO}$  初始化\*/ GPIO_InitTypeDef GPIO_InitStructure; GPIO_InitStructure.GPIO_Mode  $=$  GPIO_Mode_Out_ID; //将引脚初始化为开漏输 出 GPIO_InitStructure.GPIO_Pin  $=$  MyI2C_SCL | MyI2C_SDA; GPIO_InitStructure.GPIO_Speed  $=$  GPIO_Speed_50MHz; GPIO_Init(MyI2C_GPIO，&GPIO_InitStructure); //将引脚初始化 为开漏输出 /\*设置GPIO初始化后的默认电平\*/ GPIO_SetBits(MyI2C_GPIO，MyI2C_SCL | MyI2C_SDA); //设置PA1和PA2 引脚为高电平   
}   
//初始化GPIO
```

# 2、编写I2C时序程序

# 1、设定GPIO引脚状态函数，方便修改

```c
void MyI2C_W_SCL( uint8_t BitValue) //输入SCL引脚0~1  
{GPIO_writeBit (MyI2C(GPIO, MyI2C_SCL, (BitAction)BitValue); //写GPIO状态 强转为set and reset类型Delay_us(10); //延时10us，防止时序频率超过要求}  
void MyI2C_W_SDA( uint8_t BitValue) //输入SDA引脚0~1  
{GPIO_writeBit (MyI2C(GPIO, MyI2C_SDA, (BitAction)BitValue); //写GPIO状态 强转为set and reset类型Delay_us(10); //延时10us，防止时序频率超过要求}  
uint8_t MyI2C_R_SDA(void) //读取SDA引脚0~1  
{uint8_t BitValue;BitValue = GPIO_GetInputDataBit (MyI2C(GPIO, MyI2C_SDA); //读GPIO状态 Delay_us(10); //延时10us，防止时序频率超过要求return BitValue;  
}
```

# 2、起始条件

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/380bdb83d7f4fa9351ef65920b21c64f8a63df1dbd465be19b8c1bc7e5df7761.jpg)


```c
/*起始条件*/  
void MyI2C_start(void)  
{  
    MyI2C_W_SDA(1); //释放SDA，确保SDA为高电平  
    MyI2C_W_SCL(1); //释放SCL，确保SCL为高电平  
    MyI2C_W_SDA(0); //在SCL高电平期间，拉低SDA，产生起始信号  
    MyI2C_W_SCL(0); //起始后把SCL也拉低，即为了占用总线，也为了方便总线时序的拼接  
}  
//SDA由高电平跳变为低电平，表示开始通信启动时SDA和SCL为高电平，这边优先SDA为高电平是为了方便发数据时的状态替换
```

# 3、终止条件

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/9908b611ae30a237e1328d604490cc5b4e363e6ced1764236726e3f4198309dc.jpg)


```c
/*终止条件*/  
void MyI2C_stop(void)  
{  
    MyI2C_W_SDA(0); //拉低SDA，确保SDA为低电平  
    MyI2C_W_SCL(1); //释放SCL，使SCL呈现高电平  
    MyI2C_W_SDA(1); //在SCL高电平期间，释放SDA，产生终止信号  
}  
//SDA由低电平跳变为高电平，再释放SCL，使SCL呈现高电平读取时序状态
```

# 4、发送一个字节

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/41f031d29935ba4120360ed5b8bbd7650caa16cd0764070ef0521700692698fd.jpg)


```c
/*发送一个字节*/  
void MyI2C_sendByte( uint8_t Byte)  
{  
    uint8_t i;  
    for(i=0;i<8;i++)  
    {  
        MyI2C_W_SDA(||Byte & (0x80 >>i)));//使用掩码的方式取出Byte的指定一位数据并写入到SDA线  
        MyI2C_W_SCL(1); //SCL高电平读取，从机在SCL高电平期间读取SDA  
        MyI2C_W_SCL(0); //SCL读取完后释放主机开始发送下一位数据  
    }  
}  
//SCL读取时为高电平状态，读完一个字节就会变成低电平方便下一个字节的读取
```

# 5、接收一个字节

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/0e2666004c60d5b8e9fb0f79210ab84397f4c2fe642d1ec396f4d05a70915d56.jpg)


```c
/*接收一个字节*/  
uint8_t MyI2C_ReceiveByte(void)  
{  
    uint8_t i, Byte =0x00; //如果if成立那么就返回高位，如不成立就返回0  
    MyI2C_W_SDA(1); //接收前，主机先确保释放SDA，避免干扰从机的数据发送  
    for(i=0;i<8;i++)  
    {  
        /*两个！可以对数据进行两次逻辑取反，作用是把非0值统一转换为1，即：！！(0) = 0，！！（非0）  
    }  
    MyI2C_W_SCL(1); //释放SCL，主机机在SCL高电平期间读取SDA  
    if (MyI2C_R_SDA() == 1) {Byte |= (0x80 >> i);} //如果if成立那么就返回高位，如不成立就返回0  
    MyI2C_W_SCL(0); //拉低SCL，从机在SCL低电平期间写入SDA  
}  
return Byte;  
}  
//返回 Byte方便读取到的数据
```

# 6、发送应答

SCL

SDA

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/1c9642afee9f45923966fde4df91e034dc4ade247042df24b42bec252b9d9a63.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/5a1652bd6136ea62ac3777f3c45235c182c8d3e1b494e82eea34f46066b03616.jpg)


SCL

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/db84601d34ac80da4a1e10cdb52b204a1f59dba40b509e444a08f73bf03e1322.jpg)


SDA

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/9935dc3a199ea17e9865c25a5e099fad385a5881bb8346436bccdf0fb6f2f276.jpg)


```c
/*发送应答*/  
void MyI2C_SendAck uint8_t AckBit)  
{  
    MyI2C_W_SDA(AckBit); //主机把应答位数据放到SDA线  
    MyI2C_W_SCL(1); //释放SCL，从机在SCL高电平期间，读取应答位  
    MyI2C_W_SCL(0); //拉低SCL，开始下一个时序模块  
}  
//发送应答其事就是对发送一个字节的简化版本。
```

# 7、接收应答

SCL ACK

SDA

SCL ACK

SDA


/*接收应答*/


```c
uint8_t MyI2C_ReceiveAck(void)  
{  
    uint8_t AckBit; //定义应答位变量  
    MyI2C_W_SDA(1); //接收前，主机先确保释放SDA，避免干扰从机的数据发送  
    MyI2C_W_SCL(1); //释放SCL，主机机在SCL高电平期间读取SDA  
    AckBit = MyI2C_R_SDA(); //将应答位存储到变量里  
    MyI2C_W_SCL(0); //拉低SCL，开始下一个时序模块  
    return AckBit; //返回定义应答位变量  
}  
//返回应答
```

# 3、调用I2C时序

以MPU6050陀螺仪为例，在其工程中引工程


include "MyI2c.h"


```txt
define MPU6050_ADDRESS 0xD0 //MPU6050的I2C从机地址
```

# 1、写寄存器


/*MPU6050写寄存器*/


```c
void MPU6050_WritReg( uint8_t RegAddress, uint8_t Data)  
{ MyI2C_start(); //发送起始信号 MyI2C_sendByte(MPU6050_ADDRESS); //发送从设备地址，默认是0是写  
1是读 MyI2C_ReceiveAck(); //接收应答 MyI2C_sendByte(RegAddress); //发送寄存器地址 MyI2C_ReceiveAck(); //接收应答 MyI2C_sendByte(Data); //发送要写入寄存器的数据 MyI2C_ReceiveAck(); //接收应答 MyI2C_stop(); //I2C终止
```

```txt
\}
/*  
第一步发送起始信号  
第二步发送需要通讯的设备地址号。以发送字节的方式  
第三步接收应答  
第四步发送需要写的寄存器地址  
第五步接收应答  
第六步发送要写入寄器数据  
第七步接收应答  
第八步结束通讯  
通讯出问题了看看ACK应答位的状态  
*/
```

# 2、读寄存器

```c
/*MPU6050读寄存器*/  
uint8_t MPU6050_RegReg uint8_t RegAddress)  
{  
    uint8_t Date;  
    MyI2C_start(); //发送起始信号  
    MyI2C_sendByte(MPU6050_ADDRESS); //发送从设备地址，默认是0  
    MyI2C_ReceiveAck(); //接收应答  
    MyI2C_sendByte(RegAddress); //发送寄存器地址  
    MyI2C_ReceiveAck(); //接收应答  
    MyI2C_start(); //I2C重复起始  
    MyI2C_sendByte(MPU6050_ADDRESS | 0x01); //发送从设备地址，默认是0是写  
1是读  
    MyI2C_ReceiveAck(); //接收应答  
    Date = MyI2C_ReceiveByte(); //接收指定寄存器的数据  
    MyI2C_SendAck(1); //发送应答，给从机非应答，终止从  
机的数据输出  
    MyI2C_stop(); //I2C终止  
return Date;  
}  
/*  
读寄存器首先，读到的数据往那存入？这个问题先解决。  
例如定义一个uint8_t Date;的变量来存入数据  
读取寄存器  
第一步发送起始信号  
第二步发送需要通讯的设备地址号。以发送字节的方式  
第三步接收应答  
第四步发送需要读取的寄存地址  
第五步接收应答  
第六步因为我们前五步我们只写的时序，所以我们要重新进，发送起始信号。如果不加前五步读取到的数据会  
一直跳变  
对我们的读取到数据不好进行应用  
第七步发送从设备地址，默认是0是写1是读  
第八步接收应答  
第九步把接收的应答数据存入Date中  
第十步发送应答给从机非应答，终止从机的数据输出  
最后返回Date数据就行了  
*/
```

# 3、利用指针的方式来读取多个返回值

```c
/*MPU6050获取数据*/  
void MPU6050_GetData(int16_t *AccX, int16_t *AccY, int16_t *AccZ, int16_t *GyroX, int16_t *GyroY, int16_t *GyroZ)  
{ uint8_t DataH, DataL; //定义数据高8位和低8位的变量  
DataH = MPU6050_ReadReg(MPU6050_ACCEL_XOUT_H); //读取加速度计X轴的高8位数据  
DataL = MPU6050_ReadReg(MPU6050_ACCEL_XOUT_L); //读取加速度计X轴的低8位数据  
*AccX = (DataH << 8) | DataL; //数据拼接，通过输出参数返回  
/* 这一步将高8位数据左移8位，然后与低8位数据进行按位或操作，从而拼接成一个完整的16位数据。具体解释如下：  
DataH << 8: 将高8位数据左移8位，使其占据16位数据的高8位位置。例如，如果 DataH 是 0xAB，则 DataH << 8 结果是 0xAB00。| DataL: 将低8位数据与高8位数据进行按位或操作，从而组合成完整的16位数据。例如，如果 DataL 是 0xCD，则最终结果为 0xABCD。  
*/  
DataH = MPU6050_ReadReg(MPU6050_ACCEL_YOUT_H); //读取加速度计Y轴的高8位数据  
DataL = MPU6050_ReadReg(MPU6050_ACCEL_YOUT_L); //读取加速度计Y轴的低8位数据  
*AccY = (DataH << 8) | DataL; //数据拼接，通过输出参数返回  
DataH = MPU6050_ReadReg(MPU6050_ACCEL_ZOUT_H); //读取加速度计Z轴的高8位数据  
DataL = MPU6050_ReadReg(MPU6050_ACCEL_ZOUT_L); //读取加速度计Z轴的低8位数据  
*AccZ = (DataH << 8) | DataL; //数据拼接，通过输出参数返回  
DataH = MPU6050_ReadReg(MPU6050_GYRO_XOUT_H); //读取陀螺仪X轴的高8位数据  
DataL = MPU6050_ReadReg(MPU6050_GYRO_XOUT_L); //读取陀螺仪X轴的低8位数据  
*GyroX = (DataH << 8) | DataL; //数据拼接，通过输出参数返回  
DataH = MPU6050_ReadReg(MPU6050_GYRO_YOUT_H); //读取陀螺仪Y轴的高8位数据  
DataL = MPU6050_ReadReg(MPU6050_GYRO_YOUT_L); //读取陀螺仪Y轴的低8位数据  
*GyroY = (DataH << 8) | DataL; //数据拼接，通过输出参数返回  
DataH = MPU6050_ReadReg(MPU6050_GYRO_ZOUT_H); //读取陀螺仪Z轴的高8位数据  
DataL = MPU6050_ReadReg(MPU6050_GYRO_ZOUT_L); //读取陀螺仪Z轴的低8位数据  
*GyroZ = (DataH << 8) | DataL; //数据拼接，通过输出参数返回  
}  
int main(void)  
{ int16_t AX, AY, AZ, GX, GY, GZ; //定义用于存放各个数据的变量 while(1) { MPU6050_GetData(&AX, &AY, &AZ, &GX, &GY, &GZ); //获取MPU6050的数据 }
```

# 硬件I2C

硬I2C是利用自身的I2C通讯线进行硬件通讯不用手动去翻转电平，全由硬件解决，我们只需要查看接位EV状态就可判断他是否成功

# I2C基本结构

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/2f5e5e1d554d29d88ba491a2a6e01c54d93449a1d81644e1f56c28cde8d75a70.jpg)


# 使用步骤

第一步配置对应引脚的GPIO、第二步配置I2C单元、第三步调用标准库实现操作

# 1、配置对应引脚的GPIO

```txt
RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOB, ENABLE); //开启GPIOB的时钟  
/*GPIO初始化*/  
GPIO_InitTypeDef GPIO_InitStructure;  
GPIO_InitStructure.GPIO_Mode = GPIO_Mode_AF_OD;  
GPIO_InitStructure.GPIO_Pin = GPIO_Pin_10 | GPIO_Pin_11;  
GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;  
GPIO_Init(GPIOB, &GPIO_InitStructure); //将PB10和PB11引脚初始化为复用开漏输出
```

# 2、配置I2C单元

```c
/*开启时钟*/  
RCC_APB1PeriphClockCmd(RCC_APB1Periph_I2C2, ENABLE); //开启I2C2的时钟  
/*I2C初始化*/  
I2C_InitTypeDef I2C_InitStructure; //定义结构体变量  
I2C_InitStructure.I2C_Mode = I2C_Mode_I2C; //模式，选择为I2C模式  
I2C_InitStructure.I2C_ClockSpeed = 50000; //时钟速度，选择为50KHz  
I2C_InitStructure.I2C_DutyCycle = I2C_DutyCycle_2; //时钟占空比，选择  
Tlow/Thigh = 2  
I2C_InitStructure.I2C_Ack = I2C_Ack_Enable; //应答，选择使能  
I2C_InitStructure.I2C_AcknowledgedAddress = I2C_AcknowledgedAddress_7bit; //应答地址，选择7位，从机模式下才有效  
I2C_InitStructure.I2C_OwnAddress1 = 0x00; //自身地址，从机模式下才有效  
I2C_Init(I2C2, &I2C_InitStructure); //将结构体变量交给  
I2C_Init, 配置I2C2
```

# 3、调用标准库实现操作

如对MPU6050芯片进行操作

# 1、写寄器

# 主机发送


图245 主发送器传送序列图


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/7d1d6217f6acb398af7f525ec6518a4f887bfd27e13a95e44880f39483f100ea.jpg)



注：1-EV5、EV6、EV9、EV8_1和EV8_2事件拉长SCL低的时间，直到对应的软件序列结束。2-EV8的软件序列必须在当前字节传输结束之前完成。


```c
/*  
第一步生成起始条件  
第二步等待EV5处理可以用while循环来判断不过要退出循环不然容易卡死程序  
可以理解为接收应答  
while（I2C ✓CheckEvent(I2Cx，I2C_EVENT）  $! =$  SUCCESS）//循环等待指定事件  
第三步发送设备地址  
第四步接收应答EV6数据  
第五步发送寄存器地址  
第六步接收应答EV8  
第七步发送数据  
第八步接收应答EV8_2  
第九步终止条件  
*/  
/**  
* 函数：MPU6050等待事件  
* 参数：同I2C ✓CheckEvent  
* 返回值：无  
*/  
void MPU6050_waitEvent(I2C_TYPEDef\* I2Cx，uint32_t I2C_EVENT)  
{uint32_t Timeout;Timeout  $= 10000$  //给定超时计数时间while（I2C ✓CheckEvent(I2Cx，I2C_EVENT）  $! =$  SUCCESS）//循环等待指定事件{Timeout--；//等待时，计数值自减if (Timeout  $\equiv = 0$  //自减到0后，等待超时{/\*超时的错误处理代码，可以添加到此处*/
```

```c
break; //跳出等待，不等了  
}  
}  
}  
/**  
* 函数：MPU6050写寄存器  
* 参 数：RegAddress 寄存器地址，范围：参考MPU6050手册的寄存器描述  
* 参 数：Data 要写入寄存器的数据，范围：0x00~0xFF  
* 返回值：无  
*/  
void MPU6050_writeReg uint8_t RegAddress, uint8_t Data)  
{I2CGenerateSTART(I2C2, ENABLE); //硬件  
件I2C生成起始条件MPU6050_waitEvent(I2C2, I2C_EVENT MASTER_MODE_SELECT); //等待EV5I2C_Send7bitAddress(I2C2, MPU6050_ADDRESS, I2C_Direction_Transmitter); //硬件  
件I2C发送从机地址，方向为发送MPU6050_waitEvent(I2C2, I2C_EVENT MASTER_TRANSMITTER_MODE_SELECTED); //等待EV6I2C_SendData(I2C2, RegAddress); //硬件  
件I2C发送寄存器地址MPU6050_waitEvent(I2C2, I2C_EVENT MASTER_BYTE_TRANSMITTING); //等待EV8I2C_SendData(I2C2, Data); //硬件  
件I2C发送数据MPU6050_waitEvent(I2C2, I2C_EVENT MASTER_BYTE_TRANSMITTED); //等待EV8_2I2C_GenerateSTOP(I2C2, ENABLE); //硬件  
件I2C生成终止条件}
```

# 2、读寄器

# 主机接收


图246 主接收器传送序列图


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/624c061153a8779758a80d08cb98d2b42bc0df147df7bb71c3354608f0ca71e3.jpg)


```c
/*  
第一步发送启始条件  
第二步接收应答EV5  
第三步发送设备地址  
第四步接收应答EV6  
第五步发送寄存器地址  
第六步接收应答EV8_2  
第七步重启启始条件，不然数据跳变快  
第八步接收应答EV5  
第九步发送发送从机地址，方向为接收  
第十步接收应答EV6  
第十一步先设计在接收最后一个字节之前提前将应答失能，在接收最后一个字节之前提前申请停止条方便多数据接收  
第十二步等待接收应答EV7  
第十三步把接收数据到的寄存器数据存入变量中  
第十三步将应答恢复为使能，为了不影响后续可能产生的读取多字节操作  
*/  
/**  
* 函数：MPU6050读寄存器  
* 参 数：RegAddress 寄存器地址，范围：参考MPU6050手册的寄存器描述  
* 返回值：读取寄存器的数据，范围：  $0\mathrm{x}00\sim 0\mathrm{x}FF$   
*/  
uint8_t MPU6050_RegReg uint8_t RegAddress)  
{  
    uint8_t Data;  
    I2CGenerateSTART(I2C2, ENABLE); //硬件I2C生成起始条件  
    MPU6050_waitEvent(I2C2, I2C_EVENTMASTER_MODE_SELECT); //等待EV5  
    I2C.Send7bitAddress(I2C2, MPU6050_ADDRESS, I2C_Direction_Transmitter); //硬件I2C发送从机地址，方向为发送  
    MPU6050_waitEvent(I2C2, I2C_EVENTMASTER_TRANSMITTER_MODE_SELECTED); //等待EV6  
    I2C_Data(I2C2, RegAddress); //硬件I2C发送寄存器地址  
    MPU6050_waitEvent(I2C2, I2C_EVENTMASTER_BYTE_TRANSMITTED); //等待EV8_2  
    I2C_GenerateSTART(I2C2, ENABLE); //硬件I2C生成重复起始条件  
    MPU6050_waitEvent(I2C2, I2C_EVENTMASTER_MODE_SELECT); //等待EV5  
    I2C_Send7bitAddress(I2C2, MPU6050_ADDRESS, I2C_Direction_Receiver); //硬件I2C发送从机地址，方向为接收  
    MPU6050_waitEvent(I2C2, I2C_EVENTMASTER_RECEIVER_MODE_SELECTED); //等待EV6
```

```txt
I2C_AcknowledgeConfig(I2C2, DISABLE); //在接收最后一个字节之前提前将应答失能I2C_GenerateSTOP(I2C2，ENABLE)； //在接收最后一个字节之前提前申请停止条件MPU6050_waitEvent(I2C2，I2C_EVENT MASTER_BYTE_received)；//等待EV7Data  $=$  I2C_ReceiveData(I2C2); //接收数据寄存器I2C_AcknowledgeConfig(I2C2，ENABLE)；//将应答恢复为使能，为了不影响后续可能产生的读取多字节操作return Data;1
```

# SPI通讯

- SPI (Serial Peripheral Interface) 是由Motorola（摩托罗拉）公司开发的一种通用数据总线

- 四根通信线：SCK（Serial Clock时钟线）、MOSI（Master Output Slave Input主输出从输入）、MISO（Master Input Slave Output主输入从输出）、SS（Slave Select地址线）

- 同步，全双工

- 支持总线挂载多设备（一主多从）

# SS低电平时为导通高电平不工作

配置问题：·输出引脚配置为推挽输出，输入引脚配置为浮空或上拉输入

# 硬件电路

- 所有SPI设备的SCK、MOSI、MISO分别连在一起

- 主机另外引出多条SS控制线，分别接到各从机的SS引脚

- 输出引脚配置为推挽输出，输入引脚配置为浮空或上拉输入

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/8435fcf0c7bac67615d7110107893fe50ee3fca3db0a954d4b42534b863b866d.jpg)


# 通讯过程

SPI本身就是一个交换字节的通讯协议，在进行通讯时，主设备寄存器地址高8位依次往从设的低位进入转移。从设备高8位依次往主设备代位转移。

/\*\*使用SPI模式0

第一步先解决交换到的数据存在那

```txt
第二进行发送数据的逻判断  
掩码的方式取出数据写入MOSI线上SCK时钟线高电平取数据  
读取MISO线上数据进行放在变量里SCK时钟线低电平移入数据  
第三步返回数据
```

1、起始信号：主设备通过拉低片选信号（SS）来启动与从设备的通信。

2、数据传输：在每个时钟周期内，主设备通过MOSI线向从设备发送一位数据，同时从设备也通过MISO线向主设备发送一位数据。这样，在每个时钟周期内，双方都会交换一位数据。

3、结束信号：当所有数据位都传输完毕后，主设备通过拉高片选信号（SS）来结束与从设备的通信。

CPOL（时钟极性）

定义：CPOL用于设置SPI总线在空闲时的时钟信号电平状态。

CPOL=0：表示空闲时，时钟信号处于低电平状态。

CPOL=1：表示空闲时，时钟信号处于高电平状态。

CPHA（时钟相位）

定义：CPHA用于设置数据采样和输出的时序。

CPHA=0：表示数据在时钟信号的第一个跳变沿（上升沿或下降沿，具体取决于CPOL）被采样。

CPHA=1：表示数据在时钟信号的第二个跳变沿（与第一个跳变沿相反）被采样。

SPI的四种模式

通过CPOL和CPHA的不同组合，SPI可以配置为四种不同的工作模式：

Mode 0 (CPOL=0, CPHA=0):

时钟极性：空闲时SCK为低电平。

采样时刻：数据在时钟的上升沿被采样，在下降沿输出。

Mode 1 (CPOL=0, CPHA=1):

时钟极性：空闲时SCK为低电平。

采样时刻：数据在时钟的下降沿被采样，在上升沿输出。

Mode 2 (CPOL=1, CPHA=0):

时钟极性：空闲时SCK为高电平。

采样时刻：数据在时钟的下降沿被采样，在上升沿输出。

Mode 3 (CPOL=1, CPHA=1):

时钟极性：空闲时SCK为高电平。

采样时刻：数据在时钟的上升沿被采样，在下降沿输出。

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/0017df5f8611dc1d80879ac47c13814c8f4b3a3b59ee72206b9888fbbd80fcf9.jpg)


时序图

# SPI时序基本单元

- 起始条件：SS从高电平切换到低电平

- 终止条件：SS从低电平切换到高电平

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/660d37e12ad69b0457838701d68b2f6be6688519a407b90d08e526b2fb721aed.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/5a695329dd7db378691e312a64ce08838bbfdaa6831a6cfb8bdaf1ef1f92762a.jpg)


# SPI时序基本单元

- 交换一个字节 (模式0)

- CPOL=0：空闲状态时，SCK为低电平

- CPHA=0：SCK第一个边沿移入数据，第二个边沿移出数据

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/bb8009b536e264fe5784113bb076f47d11a0436fa918c494138362290f6fbc2a.jpg)


SPI协议通过四根线进行通信：时钟线（SCLK）、主设备输出从设备输入线（MOSI）、主设备输入从设备输出线（MISO）和片选线（SS）。其中，时钟极性（CPOL）和时钟相位（CPHA）的不同组合决定了SPI的工作模式。

# 各模式详解及应用场景

# 1. 模式0（CPOL=0，CPHA=0）

• 特性：在时钟的空闲状态下，SCLK线保持低电平。数据在SCLK的下降沿采样，上升沿输出。

• 适用场景：这是最常见的SPI工作模式，适用于大多数标准的SPI设备。由于其简单性和广泛应用，模式0在许多嵌入式系统中被默认采用。

# 2. 模式1 (CPOL=0, CPHA=1)

。特性：在时钟的空闲状态下，SCLK线保持低电平。数据在SCLK的上升沿采样，下降沿输出。

• 适用场景：模式1适用于一些需要特定时序的设备，如某些传感器或存储器芯片。当设备要求数据在时钟上升沿被采样时，模式1是合适的选择。

# 3. 模式2 (CPOL=1, CPHA=0)

• 特性：在时钟的空闲状态下，SCLK线保持高电平。数据在SCLK的上升沿采样，下降沿输出。

• 适用场景：模式2较少见，但适用于某些特殊设计的设备，这些设备可能因为内部逻辑或电气特性而要求时钟信号在高电平时保持稳定。

# 4. 模式3 (CPOL=1, CPHA=1)

。特性：在时钟的空闲状态下，SCLK线保持高电平。数据在SCLK的下降沿采样，上升沿输出。

• 适用场景：与模式2类似，模式3也是为满足特定设备的时序要求而设计的。它在某些高速数据传输或特殊应用中可能有优势。

# SPI时序基本单元

- 交换一个字节（模式0）

- CPOL=0：空闲状态时，SCK为低电平

- CPHA=0：SCK第一个边沿移入数据，第二个边沿移出数据

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/d4bbc305360883f0004145b1a1d69dcc1ce24910748daec8f2d473a00077d5f4.jpg)


# SPI时序基本单元

- 交换一个字节（模式1）

- CPOL=0：空闲状态时，SCK为低电平

- CPHA=1：SCK第一个边沿移出数据，第二个边沿移入数据

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/50dfa6993fdc94c99d6457a131ce284a2644ad686b743536b73c3d2c690ee94e.jpg)


# SPI时序基本单元

- 交换一个字节（模式2）

- CPOL=1：空闲状态时，SCK为高电平

- CPHA=0：SCK第一个边沿移入数据，第二个边沿移出数据

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/dc5d83548de8585c6872a3aa15ebba983d559ac7bc038cbe60ba9f2f5d3c2030.jpg)


# SPI时序基本单元

- 交换一个字节（模式3）

- CPOL=1：空闲状态时，SCK为高电平

- CPHA=1：SCK第一个边沿移出数据，第二个边沿移入数据

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/0c011337b7b3abac9d5fe1eb2b759cb324a5d0a2b59c7670639aa43da081d6ff.jpg)


![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/51ae272456e93e0b48f43c3c22f3155aeb040587661c5011818373325cf68dcb.jpg)


·指定地址读

![image](https://cdn-mineru.openxlab.org.cn/result/2026-01-13/e69a5f71-50ae-4817-be38-ba0cff066dff/7ba4643f11d6f9500a8a65f0bc965bc1fa23a03f1c9a84a589984dc982e1e643.jpg)


# 软件SPI

在配置软件SPI手搓时序时我们还是先理一下程序架构、SS低电平时为导通高电平不工作

第一步配置SPI时序的工程里面包含了启动时序、停止时序、交换字节时序、GPIO口

第二步模块调用SPI时序模块从而实现SPI通讯

第三步在主程序中应用数据

其它通讯过程根据芯片通讯地址手册为定

第一步发起启始时序，

第二步发送交换地址、根据手册返回值选是否继续交换数据其过程是

交换、交换、交换……手册地址有个少个返回值就交换多少次。如果觉得有意意的数据就存入变量中、无意意的数据就不存

第三步终止时序

# 1、配置GPIO初始化

//当然可以用宏定义方便程序的移植

```c
define MySPI_CS GPIO_Pin_4 //地址线  
#define MySPI_CLK GPIO_Pin_5 //时钟线  
#define MySPI_DO GPIO_Pin_6 //主输入从输出 主设备的输入是从设备的输出嘛  
#define MySPI_DI GPIO_Pin_7 //主输出从输入 从设备的输入是主设备的输出嘛
```

```c
void MySPI_Init(void)   
{ /\*开启时钟\*/ RCC_APB2PeriphClockCmd(RCC_APB2Periph_GPIOA，ENABLE); //开启GPIOA的时钟 /\*GPIO初始化\*/ GPIO_InitTypeDef GPIO_InitStructure; GPIO_InitStructure.GPIO_Mode  $=$  GPIO_Mode_Out_PP; GPIO_InitStructure.GPIO_Pin  $=$  GPIO_Pin_4|GPIO_Pin_5|GPIO_Pin_7; GPIO_InitStructure.GPIO_Speed  $=$  GPIO_Speed_50MHz;
```

```c
GPIO_Init(GPIOA, &GPIO_InitStructure); //将PA4、PA5和PA7引脚初始化为推挽输出  
GPIO_InitStructure.GPIO_Mode = GPIO_Mode_IPU;  
GPIO_InitStructure.GPIO_Pin = GPIO_Pin_6;  
GPIO_InitStructure.GPIO_Speed = GPIO_Speed_50MHz;  
GPIO_Init(GPIOA, &GPIO_InitStructure); //将PA6引脚初始化为上拉输入  
/*设置默认电平*/  
MySPI_W_SS(1); //SS默认高电平  
MySPI_W_SCK(0); //SCK默认低电平
```

# 2、配置SPI时序

# 1、配置引脚配置层方便置1和0

```c
/\*\* \*函数：SPI写SS引脚电平\*参数：BitValue协议层传入的当前需要写入SS的电平，范围0\~1\*返回值：无\*注意事项：此函数需要用户实现内容，当BitValue为0时，需要置SS为低电平，当BitValue为1时，需  
要置SS为高电平\*/void MySPI_W_SS uint8_t BitValue)  
{GPIO_writeBit(GPIOA,GPIO_Pin_4,(BitAction)BitValue); //根据BitValue，设  
置SS引脚的电平  
}  
/\*\* \*函数：SPI写SCK引脚电平\*参数：BitValue协议层传入的当前需要写入SCK的电平，范围0\~1\*返回值：无\*注意事项：此函数需要用户实现内容，当BitValue为0时，需要置SCK为低电平，当BitValue为1时，  
需要置SCK为高电平\*/void MySPI_W_SCK uint8_t BitValue)  
{GPIO_writeBit(GPIOA,GPIO_Pin_5,(BitAction)BitValue); //根据BitValue，设  
置SCK引脚的电平  
}  
/\*\* \*函数：SPI写MOSI引脚电平\*参数：BitValue协议层传入的当前需要写入MOSI的电平，范围0\~1\*返回值：无\*注意事项：此函数需要用户实现内容，当BitValue为0时，需要置MOSI为低电平，当BitValue为1时，  
需要置MOSI为高电平\*/void MySPI_W_MOSI uint8_t BitValue)  
{GPIO_writeBit(GPIOA,GPIO_Pin_7,(BitAction)BitValue); //根据BitValue，设  
置MOSI引脚的电平，BitValue要实现非0即1的特性
```

```c
}  
/\*\* \*函数：I2C读MISO引脚电平\*参数：无\*返回值：协议层需要得到的当前MISO的电平，范围0~1\*注意事项：此函数需要用户实现内容，当前MISO为低电平时，返回0，当前MISO为高电平时，返回1\*/uint8_t MySPI_R_MISO(void)  
{return GPIO_ReadInputDataBit(GPIOA，GPIO_Pin_6); //读取MISO电平并返回}
```

# 2、SPI起始时序

```c
/**
* 函数：SPI起始
* 参数：无
* 返回值：无
*/
void MySPI_Start(void)
{
    MySPI_W_SS(0); //拉低SS，开始时序
```

# 3、SPI终止

```txt
void MySPI_Stop(void)  
{  
    MySPI_W_SS(1); //拉高SS，终止时序  
}
```

# 4、SPI交换传输一个字节，使用SPI模式0

```c
/\*\*第一步先解决交换到的数据存在那  
第二进行发送数据的逻判断  
掩码的方式取出数据写入MOSI线上  
SCK时钟线高电平取数据  
读取MISO线数据进行放在变量里  
SCK时钟线低电平移入数据  
第三步返回数据\*函数：SPI交换传输一个字节，使用SPI模式0\*参数：ByteSend要发送的一个字节\*返回值：接收的一个字节\*/uint8_t MySPI_SwapByte uint8_t ByteSend)  
{uint8_t i，ByteReceive  $= 0\times 00$  //定义接收的数据，并赋初值0x00，此处必须赋初值0x00，后面会用到
```

```txt
for  $(i = 0;i <   8;i++)$  //循环8次，依次交换每一位数据{/\*两个！可以对数据进行两次逻辑取反，作用是把非0值统一转换为1，即：！！(0）  $= 0$  ，！！（非0） $= 1^{*} /$  MySPI_W_MOSI(!!(ByteSend & (0x80 >> i))）；//使用掩码的方式取出ByteSend的指  
定一位数据并写入到MOSI线MySPI_W_SCK(1); //拉高SCK，上升沿移出数据if（MySPI_R_MISO()）{ByteReceive  $| =$  (0x80>>i)；//读取MISO数据，并存储到  
Byte变量//当MISO为1时，置变量指  
定位为1，当MISO为0时，不做处理，指定位为默认的初值0MySPI_W_SCK(0); //拉低SCK，下降沿移入数据}return ByteReceive; //返回接收到的一个字节数据}
```

# 3、SPI时序模块调用

以W25Q64非易失性存储器为例

常应用于数据存储、字库存储、固件程序存储等场景

# 1、调用SPI时序初始化

```c
include "MySPI.h" //SPI时序  
#include "w25Q64_Ins.h" //寄存器地址  
void w25Q64_Init(void)  
{ MySPI_Init(); //先初始化底层的SPI
```

# 2、MPU6050读取ID号

\*/

读取设备其步骤

1、发起起始

2、发送需要交换的地址存入变量中、因为接收的数据是高8位先行，所以变量需要向左移8位发起交换地址，交换、交换、退出

3、结束

\*/

```c
void w25Q64_ReadID(void8_t *MID, uint16_t *DID)  
{MySPI_Start(); //SPI起始MySPI_SwapByte(w25Q64_JEDEC_ID); //交换发送读取ID的指令 发起交换地址，这个时候这个数据会按照厂商设定的地址去找数据，我们没必要存储\*MID  $=$  MySPI_SwapByte(w25Q64_DUMMY_BYTE); //交换接收MID，通过输出参数返回，第二次我们随便给个数比如给1块钱他就给我们返我们想要数据，1块换100块。根据手册这个时候返回的是厂商ID\*DID  $=$  MySPI_SwapByte(w25Q64_DUMMY_BYTE); //交换接收DID高8位 手册第三次返回的是设备ID的高8位，再用1块换100块\*DID  $\ll = 8$  //高8位移到高位\*DID |= MySPI_SwapByte(w25Q64_DUMMY_BYTE); //或上交换接收DID的低8位，通过输出参数返回 手册第三次返回的是设备ID的低8位所以要用或等于
```

```txt
MySPI_Stop(); //SPI终止
```

# 3、写读W25Q64存储器

根据手册规定：

写入操作时：

写入操作前，必须先进行写使能

每个数据位只能由1改写为0，不能由0改写为1

写入数据前必须先擦除，擦除后，所有数据位变为1

擦除必须按最小擦除单元进行

连续写入多字节时，最多写入一页的数据，超过页尾位置的数据，会回到页首覆盖写入

写入操作结束后，芯片进入忙状态，不响应新的读写操作

读取操作时：

直接调用读取时序，无需使能，无需额外操作，没有页的限制，读取操作结束后不会进入忙状态，但不能在忙状态时读取

写入操作前，必须先进行写使能

```c
/*w25Q64写使能*/  
void w25Q64_writeEnable(void)  
{  
    MySPI_Start(); //SPI起始  
    MySPI_SwapByte(w25Q64_WRITE_ENABLE); //交换发送写使能的指令  
    MySPI_Stop(); //SPI终止  
}
```

写入数据前必须先擦除，擦除后，所有数据位变为1

```c
/* 
* 函数：w25Q64扇区擦除（4KB）
* 参数：Address 指定扇区的地址，范围：0x000000~0x7FFFFFF
* 返回值：无
*/  
void w25Q64_SectorErase uint32_t Address)  
{  
    w25Q64_writeEnable(); //写使能  
    MySPI_Start(); //SPI起始  
    MySPI_SwapByte(w25Q64_SECTOR_ERASE_4KB); //交换发送扇区擦除的指令  
    MySPI_SwapByte(Address >> 16); //交换发送地址23~16位  
    MySPI_SwapByte(Address >> 8); //交换发送地址15~8位  
    MySPI_SwapByte(Address); //交换发送地址7~0位  
    MySPI_Stop(); //SPI终止  
    w25Q64_waitBusy(); //等待忙  
}
```

```c
/* 
* 函数：w25Q64等待忙
* 参 数：无
* 返回值：无
*/  
void w25Q64_WaitBusy(void)
```

```txt
\(\begin{array}{rl} & \text{int32_t Timeout;}\\ & \text{MySPI_Start();}\quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad \quad }\\ & {\text{MySPI_SwapByte(w25Q64_READ_STATUS_REGISTER_1);}}\\ & {\text{交换发送读状态寄存器1的指令}}\\ & {\text{Timeout = 100000;}}\\ & {\text{while ((MySPI_SwapByte(w25Q64_DUMMY_BYTE) & 0x01) == 0x01) //循环等待忙标志位}}\\ & {\{\text{Timeout --;}}\\ & {\text{if (Timeout == 0)}\\ & {\{\text{/*超时的错误处理代码，可以添加到此处*/}}\\ & {\text{break;}}\\ & {\text{/*超时的错误处理代码，可以添加到此处*/}}\\ & {\text{break;}}\\ & {\text{/*超时的错误处理代码，可以添加到此处*/}}\\ & {\text{/*超时的错误处理代码，可以添加到此处*/}}\\ & {\text{/*超时的错误处理代码，可以添加到此处*/}}\\ & {\text{/*超时的错误处理代码，可以添加到此处*/}}\\ & {\text{/*超时的错误处理代码，可以添加到此处*/}}\\ & {\text{/*超时的错误处理代码，可以添加到此处*/}}\\ & {\mathrm{/\*}}\\ & {\mathrm{/\*}}\\ & {\mathrm{/\*}}\\ & {\mathrm{/\*}}\\ & {\mathrm{/\*}}\\ & {\mathrm{/\*}}\\ & {\mathrm{/\*}}\\ & {\mathrm{/\*}}\\ & {\mathrm{/\*}}\\ & {\mathrm{/\*}}\\ & {\mathrm{/\*}}\\ & {\mathrm{/\*}}\\ & {\mathrm{/\*}}\\ & {w25Q64_i;}\\ & {w25Q64_writeEnable();}\\ & {w25Q64_writeEnable();}\\ & {w25Q64_i;}\\ & {w25Q64_i;}\\ & {w25Q64_i;}\\ & {w25Q64_i;}\\ & {w25Q64_i;}\\ & {w25Q64_i;}\\ & {w25Q64_i;}\\ & {w25Q64_i;}\\ & {w25Q64_i;}\\ & {w25Q64_i;}\\ 
\end{array}\)   
 $\begin{array}{rl}&{\mathrm{**}}\\&{\mathrm{*}\text{函 数:W25Q64页编程}}\\&{\mathrm{*}\text{参 数:Address页编程的起始地址,范围:0x000000~0x7FFFFFF}}}\\&{\mathrm{*}\text{参 数:Arrayion 用于写入数据的数组}}\\&{\mathrm{*}\text{参 数:Count要写入数据的数量,范围:0~256}}\\&{\mathrm{*}\text{返回值:无}}\\&{\mathrm{*}\text{注意事项:写入的地址范围不能跨页}}\\&{\mathrm{*}\text{/}}\end{array}$ $\begin{array}{rl}&{\mathrm{void w25Q64_PageProgram( uint32_t Address, uint8_t *DataArray, uint16_t Count)}\\&{\mathrm{void w25Q64_PageProgram( uint32_t Address, uint8_t *DataArray, uint16_t Count)}}\\&{\mathrm{void w25Q64_PAGEProgram( uint32_t Address, uint8_t *DataArray, uint16_t Count)}}\\&{\mathrm{void w25Q64_PAGEProgram( uint32_t Address, uint8_t *DataArray, uint16_t Count)}}\\&{\mathrm{void w25Q64_PAGEProgram( uint32_t Address, uint8_t *DataArray, uint16_t Count)}}\\&{\mathrm{void w25Q_{64\_WaitBusy}(};}\end{array}$ $\begin{array}{rl}&{\mathrm{w25Q64_i;}}\\&{\mathrm{w25Q64_i;}}\\&{\mathrm{w25Q64_i;}}\\&{\mathrm{w25Q64_i;}}\\&{\mathrm{w25Q64_i;}}\\&{\mathrm{w25Q64_i;}}\\&{\mathrm{w25Q64_i;}}\\&{\mathrm{w25Q64_i;}}\\&{\frac{}{}}\\&{\mathrm{w25Q64_i;}}\\&{\mathrm{w25Q64_i;}}\\&{\mathrm{w25Q64_i;}}\\&{\mathrm{w25Q64_i;}}\\&{\mathrm{w25Q64_i;}}\\&{\mathrm{w25Q64_i;}}\\&{\mathrm{w25Q64_i;}}\\&\end{array}$ $\begin{array}{rl}&{\mathrm{*}\text{函 数:W25Q64读取数据}}\\&{\mathrm{*}\text{参 数:Address读取数据的起始地址,范围:0x000000~0x7FFFFFF}}\\&{\mathrm{*}\text{参 数:Arrayion 用于接收读取数据的数组,通过输出参数返回}}\\&{\mathrm{*}\text{参 数:Count 要读取数据的数量,范围:0~0x800000}}\\&{\mathrm{*}\text{返回值:无}}\end{array}$
```

```c
void w25Q64_ReadData( uint32_t Address, uint8_t *DataArray, uint32_t Count)  
{  
    uint32_t i;  
    MySPI_Start(); //SPI起始  
    MySPI_SwapByte(w25Q64_READ_DATA); //交换发送读取数据的指令  
    MySPI_SwapByte(Address >> 16); //交换发送地址23~16位  
    MySPI_SwapByte(Address >> 8); //交换发送地址15~8位  
    MySPI_SwapByte(Address); //交换发送地址7~0位  
    for (i = 0; i < Count; i++) //循环Count次  
    {  
        DataArray[i] = MySPI_SwapByte(w25Q64_DUMMY_BYTE); //依次在起始地址后读取数据  
    }  
    MySPI_Stop(); //SPI终止  
}
```

# 六、RTC实时时钟与BKP

# BKP断电保持寄存器

要使用BKP断电保持需要给VBAT备用电源，所以要给一个电池才能使用

要想使用断保存寄器需进行以步骤

第一步开启BKP寄存器时钟、第二步开始PWR时钟、第三步使用PWR开启对备份寄存器的访问、第四步写入读出寄存值

```cpp
/*开启时钟*/  
RCC_APB1PeriphClockCmd(RCC_APB1Periph_PWR，ENABLE); //开启PWR的外部时钟  
RCC_APB1PeriphClockCmd(RCC_APB1Periph_BKP，ENABLE); //开启BKP的时钟  
/*备份寄存器访问使能*/  
PWR_BackupAccessCmd(ENABLE); //使用PWR开启对备份寄存器的访问  
BKP_writeBackupRegister(BKP_DR1，ArrayWrite[0]); //写入测试数据到备份寄存器  
ArrayRead[0] = BKP_ReadBackupRegister(BKP_DR1); //读取备份寄存器的数据
```