// ==UserScript==
// @name         Amazon Q Helper
// @namespace    http://tampermonkey.net/
// @version      4.5
// @description  优化版本 - 深绿色主题悬停展开助手
// @author       You
// @match        https://paragon-na.amazon.com/hz/*
// @match        https://paragon-eu.amazon.com/hz/*
// @match        https://paragon-fe.amazon.com/hz/*
// @updateURL    https://raw.githubusercontent.com/Lira1996/amazon-q-helper/main/Amazon%20Q%20Helper-V4.user.js
// @downloadURL  https://raw.githubusercontent.com/Lira1996/amazon-q-helper/main/Amazon%20Q%20Helper-V4.user.js
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    console.log('Amazon Q Helper Lobby修复版开始加载');

    // 简化的防重复机制
    if (document.getElementById('amazon-q-lobby-fixed-widget')) {
        console.log('检测到已存在的悬浮窗，跳过创建');
        return;
    }

    // ========== 配置区域 - 可随时编辑 ==========
    const CONFIG = {
        // 主题颜色 - 深绿色
        themeColor: '#228B22', // 森林绿
        
        // ===== 一级目录配置 =====
        mainCategories: {
            // 一级目录1: PCO General check - 点击直接复制prompt
            "general": {
                name: "PCO General check",
                type: "direct",
                prompt: `常规PCO检查
背景：作为亚马逊卖家支持专员，需要AI协助审核回复质量，确保回复准确、完整且专业。重点关注回复中的有效性、完整性、清晰度和合规性，避免因沟通不足导致案例重启。
说明：
请按以下步骤进行分析：
1. 检查信息有效性
   - 验证链接可访问
   - 确认ASIN编号正确
   - 核实订单编号/Shipment ID正确
2. 评估回复质量
   - 完整回复卖家提的问题
   - 表达准确性和逻辑性
   - 与官方政策一致性（比如符合wiki/帮助页面/SOP中的内容）
3. 识别潜在问题
   - 模糊或歧义表达
   - 逻辑矛盾
输出要求：
1.	分析当前案例中的问题要点以及最新备注中即将回复的内容，在【修改后的完整回复】的内容中请勿生成案例中非最新备注中的内容，因为可能涉及内部信息
2.	确保优化后的完整回复内容：有清晰的段落层次、专业的格式排版、完整的逻辑结构、无任何占位符、易于阅读理解。
3.	未发现问题时：提供优化后的完整回复内容，展示为一个板块【修改后的完整回复】，请把板块名称加粗；
4.	如发现问题：请直接指出问题并提供优化后的完整回复内容。请展示为两个板块：【潜在问题】、【修改后的完整回复】，请把板块名称加粗。
5.	在回复的末尾加上一句“此 Case 已根据现有流程为您处理完毕，此 Case 就为您关闭了。如您有进一步的问题或其他问题，欢迎您创建新的 Case 联系 PSS，我们将非常乐意为您提供帮助。”
`
            },
            
            // 一级目录2: Atlas check - 展开二级目录
            "atlas": {
                name: "Atlas check",
                type: "submenu",
                // ===== 二级目录配置 =====
                subItems: {
                    "create_manage_deals": {
                        name: "Create_Manage_Deal",
                        prompt: `Deal 问题检查
背景：我是亚马逊高级销售伙伴支持专员，需要AI协助分析和优化对卖家咨询的回复质量。重点关注秒杀价格相关问题，确保回复的完整性和专业性，避免因沟通不充分导致案例重启。
说明：
1. 分析当前案例中的问题要点以及最新备注中即将回复的内容，在【修改后的完整回复】的内容中请勿生成案例中非最新备注中的内容，因为可能涉及内部信息
2. 识别回复中的不足之处
3. 可参考样本中的常见问题（秒杀价格来源/修改、秒杀标志显示）进行分析
4. 预判最可能导致案例重启的2个问题点
5. 提供优化后的完整回复建议
6. 不要提供亚马逊内部系统的报错代码
7. 在回复的末尾加上一句“此 Case 已根据现有流程为您处理完毕，此 Case 就为您关闭了。如您有进一步的问题或其他问题，欢迎您创建新的 Case 联系 PSS，我们将非常乐意为您提供帮助。”
8. 参考关键信息：
- 秒杀推荐价格计算逻辑
- 30天最低价查询方法
- ASIN层面的价格抓取机制
样本：
样本1：
问题描述：卖家对秒杀推荐价格来源提出疑问/卖家要求修改秒杀价
案例分析要点：
现有回复内容：已告知秒杀推荐价格的计算政策；确认价格符合计算逻辑。
问题后果： 导致卖家不满意现有解释，重启案例
回复机会点：未解释当前报错价格为什么符合计算逻辑；未提供该价格的订单查询方法或具体订单。
需重点关注： 拒绝理由的充分性。案例回复出现样本1相关情况时，请参考本prompts中的“Deal price 的计算来源”提示我给卖家说明为什么当前报错价格符合计算逻辑。或者如果秒杀价来源是近30天最低价，请将查询最近30天最低价的方法告知卖家。
查询最近30天最低价的方法：
1. 请卖家在订单-订单报告处下载过去30天的订单报告
2. 拿到报告以后，可以先筛选ASIN，站点，以及订单状态：shipped.
3. 然后在表格item-promotion-discount 后面插入一列计算商品实际成交价。公式为：= item-price - item-promotion-discount 这个计算出来的价格就是商品实际成交金额，我们再在此金额中去查找秒杀推荐价即可。
请注意：ASIN最近30天最低价，系统是抓取ASIN层面，即如果其他的卖家为此ASIN也提供了offer，其他offer的最近30天最低价也会被抓取。

样本2：
问题描述：卖家询问ASIN秒杀标志不显示原因/卖家咨询ASIN秒杀价过低原因
现有回复内容：告知卖家秒杀推荐价的计算逻辑
问题后果：卖家质疑最低秒杀价的抓取逻辑
回复机会点：没有回复对应ASIN当前秒杀推荐价的计算逻辑
需重点关注：政策解释的针对性。回复政策时请结合卖家咨询的ASIN，给出对应Asin秒杀推荐价的计算逻辑和结果。
回复政策时请结合卖家咨询的ASIN，给出对应Asin秒杀推荐价的计算逻辑和结果。
Deal price 的计算来源：
系统会综合参考以下价格，取最低价作为秒杀推荐价。
1. 过去30天的最低价格（包含促销价格和非促销价格）（此价格不会再进行折扣）
2. 基础价格（系统中经过验证的list price/was price)进行折扣的阈值：
1）list price：
美国和EU各站大促：listprice*80%；美国站非大促：listprice*90%；EU各占非大促：wasprice*85%
2）wasprice：
Wasprice*（100%-0.01%），大促会采用wasprice*95%
注：was price：为了买家体验和客户信任，为了展现最真实的wasprice， Was price 的计算逻辑有所更新。对于过去90天促销时长较多的ASIN， wasprice计算系统会加入促销订单进行计算。

输出要求：请结合背景、说明、样本，根据当前案例卖家咨询的问题和最新备注进行预判，如果你是卖家，你最可能重启案例咨询的2个问题，并针对你预测的卖家重启案例咨询的2个问题给出回复内容。请展示为两个板块：【潜在问题】、【修改后的完整回复】，请把板块名称加粗。`
                    },
                    "price_update": {
                        name: "Price_Update",
                        prompt: `价格问题检查
背景：我是亚马逊高级销售伙伴支持专员，需要AI协助分析和优化对卖家咨询的回复质量。重点关注价格相关问题，确保回复的完整性和专业性，避免因沟通不充分导致案例重启。
说明：
1. 分析当前案例中的问题要点以及最新备注中即将回复的内容，在【修改后的完整回复】的内容中请勿生成案例中非最新备注中的内容，因为可能涉及内部信息
2. 识别回复中的不足之处
3. 可参考样本分析
4. 预判最可能导致案例重启的2个问题点
5. 提供优化后的完整回复建议
6. 在回复的末尾加上一句“此 Case 已根据现有流程为您处理完毕，此 Case 就为您关闭了。如您有进一步的问题或其他问题，欢迎您创建新的 Case 联系 PSS，我们将非常乐意为您提供帮助。”
7. 请不要自行杜撰价格生效的时间，不要承诺卖家价格具体会在多久内生效

样本：
样本1：
问题描述：卖家要求咨询价格折扣的报错价格或要求刷新报错价格
现有回复内容：价格基于买家在过去 30 天购买的最低价格，折扣需比此价格优惠至少5%。系统推荐价格正确。
问题后果：卖家质疑最近30天买家购买时的最低价格，称未曾以此价格销售或希望更改最近30天最低价。
回复机会点：1. 说明买家在过去 30 天购买的最低价格不可修改（除系统错误外）。2. 解释买家在过去 30 天购买的最低价格是基于ASIN层面，此价格可能来自其他卖家，保密原因无法提供详情。
需重点关注：在解释报错价格来源，以及告知该价格合理时，注意结合本prompts中的“价格折扣条件”的内容给出价格的计算逻辑和结果。如果价格来源与买家在过去 30 天购买的最低价格有关，请结合本prompts中的“回复机会点”提前说明无法更改最近30天最低价的原因。
价格折扣条件：
•	比买家在过去 30 天购买的最低价格（包括所有卖家的所有特惠、推广和促销价格）至少优惠 5%
•	比当前价格至少优惠 5%
•	对于具有经验证的参考价（比如 list price/was price）的商品，至少比参考价优惠 5%。没有经验证的参考价的商品不会向买家显示带删除线的价格或节省金额。

样本2：
问题描述：卖家要求验证/刷新list price
现有回复内容：告知卖家无法验证的原因是  outlier price
问题后果：由于outlier price是亚马逊内部术语，卖家不理解其含义，重启案例提供其他证据要求验证
回复机会点： 将outlier price用通俗语言解释，告知卖家以下内容：
原因是：您所提供的市场价应该代表您或其他零售商或卖家最近售出或计划售出大量相关商品时所采用的价格。
由于ASIN：XXX 的参考价过高，系统将不接受任何高于或等于此参考价的订单作为验证依据。
如果您需要继续验证，有劳您在后台保留新的 list price，并提供新的合理的 list price 给我们，我们会尽全力进一步为您提交申请。
需重点关注：请将SIM/TT回复或wiki中的亚马逊内部术语解释为卖家能听懂的语言，并提供与之对应的替代解决方案。
样本3：
问题描述：卖家要求更改DOTD/Top Deal的价格
现有回复内容：案例A的回复：更改成功。案例B的回复：内部团队拒绝了更改请求。原因是：已开跑的DOTD/Top Deal，如果ASIN并没有因为价格过高被抑制，那么无法处理价格更改请求。
问题后果：卖家重启案例A表示查看前台，DOTD/Top Deal 价格并未更改成功。卖家重启案例B质疑此政策。
回复机会点：提交价格更改申请前：检查ASIN和活动状态，预告可能限制；申请更改成功后：验证前台验证实际效果，是否价格已更改成功。
需重点关注：当卖家咨询样本3的问题，请提示我样本3回复机会点的内容，提醒我多检查。

输出要求：请结合背景、说明、样本，根据当前案例卖家咨询的问题和最新备注进行预判，如果你是卖家，你最可能重启案例咨询的2个问题，并针对你预测的卖家重启案例咨询的2个问题给出回复内容。请展示为两个板块：【潜在问题】、【修改后的完整回复】，请把板块名称加粗。`
                    },
                    "listing_not_found": {
                        name: "Listing_Not_Found",
                        prompt: `背景：我是亚马逊高级销售伙伴支持专员，需要AI协助分析和优化对卖家咨询的回复质量。重点关注商品不可售相关问题，确保回复的完整性和专业性，避免因沟通不充分导致案例重启。
说明：
1. 分析当前案例中的问题要点以及最新备注中即将回复的内容，在【修改后的完整回复】的内容中请勿生成案例中非最新备注中的内容，因为可能涉及内部信息
2. 识别回复中的不足之处
3. 可参考样本分析
4. 预判最可能导致案例重启的2个问题点
5. 提供优化后的完整回复建议
6. 在回复的末尾加上一句“此 Case 已根据现有流程为您处理完毕，此 Case 就为您关闭了。如您有进一步的问题或其他问题，欢迎您创建新的 Case 联系 PSS，我们将非常乐意为您提供帮助。”
样本：
样本1：
问题描述：ASIN收到绩效通知需要合规性审核，产品已售罄且后台不存在。
现有回复内容：让卖家在后台提交申诉。
问题后果：卖家提交文件后被拒绝，不得不重启case要求继续跟进。
回复机会点：
1.	提前告知具体审核要求和标准
2.	说明如果提交被拒绝的后续处理方式(开新case)
3.	确保卖家理解流程后再关闭case
需重点关注：在首次回复时就应完整告知整个处理流程，避免卖家重复提交造成额外工作量。
输出要求：请结合背景、说明、样本，根据当前案例卖家咨询的问题和最新备注进行预判，如果你是卖家，你最可能重启案例咨询的2个问题，并针对你预测的卖家重启案例咨询的2个问题给出回复内容。请展示为两个板块：【潜在问题】、【修改后的完整回复】，请把板块名称加粗。
`
                    },
                    "dp_category": {
                        name: "DP_Category",
                        prompt: `背景：我是亚马逊高级销售伙伴支持专员，需要AI协助分析和优化对卖家咨询的回复质量。重点关注节点更改的问题，确保回复的完整性和专业性，避免因沟通不充分导致案例重启。
说明：
1. 分析当前案例中的问题要点以及最新备注中即将回复的内容，在【修改后的完整回复】的内容中请勿生成案例中非最新备注中的内容，因为可能涉及内部信息
2. 识别回复中的不足之处
3. 可参考样本分析
4. 预判最可能导致案例重启的2个问题点
5. 提供优化后的完整回复建议
6. 在回复的末尾加上一句“此 Case 已根据现有流程为您处理完毕，此 Case 就为您关闭了。如您有进一步的问题或其他问题，欢迎您创建新的 Case 联系 PSS，我们将非常乐意为您提供帮助。”
样本：
样本1：
问题描述：卖家要求更改ASIN的节点
现有回复内容：直接协助修改节点，未说明变体节点政策。
问题后果：卖家重启案例表示只改提供的子ASIN的节点，不需要整个变体一起更新，要求同一组变体使用不同节点。
回复机会点：
1.	检查卖家提供的ASIN是否隶属于变体中，如果是，在更改之前先告知卖家变体节点政策，并确认是否仍需更改。
2.	第一次回复时就说明变体节点政策：亚马逊目前是单一节点政策，在我们提交某一 ASIN 节点更新请求时，系统就会自动应用到同一变体下的所有 ASIN，无法就同一组变体不同的 ASIN 应用不同的节点，目前没有路径申请为同一变体保留两个及以上的节点。
需重点关注：向卖家说明变体节点政策。
样本2：
问题描述：卖家提供竞品ASIN，要求将自己的ASIN修改为与竞品相同的节点，但审核结果显示不通过被拒绝。
现有回复内容：提供了举报途径，说明如果认为其他卖家的商品不应该在该节点下销售，可以通过卖家后台的举报功能进行反馈： 卖家后台 → 绩效 → 账户状况 → 举报滥用亚马逊政策的行为 → 选择合适的情况
问题后果：卖家对审核结果不满，质疑为什么相同产品的竞品可以在其要求的节点下销售，要求修改自己的商品节点或举报竞品节点不当。
回复机会点：
1.	首次回复必须明确说明三点：
（1）节点评估原则：节点团队在更新商品节点时，不参考其他第三方卖家或自营卖家的商品情况，仅根据商品本身是否适合该节点来评估
（2）竞品ASIN节点差异原因：说明竞品ASIN目前在该节点是因为尚未被系统识别到节点与商品不匹配，强调一旦系统或节点团队发现不匹配，竞品节点也将被修改。解释卖家商品无法修改到该节点的原因是确实与节点不匹配。
（3）举报途径：提供完整的举报路径，说明使用英文举报的建议

2.	明确说明PSS团队权限范围及处理流程：
（1）PSS团队无权修改其他卖家商品节点
（2）举报后会有专门团队进行调查
需重点关注：
1.	确保首次回复就完整说明节点评估标准以及竞品ASIN节点差异原因
2.	提供明确的举报操作步骤
3.	说明PSS团队的权限范围，避免卖家期望过高
4.	建议使用英文提交举报以提高效率
输出要求：请结合背景、说明、样本，根据当前案例卖家咨询的问题和最新备注进行预判，如果你是卖家，你最可能重启案例咨询的2个问题，并针对你预测的卖家重启案例咨询的2个问题给出回复内容。请展示为两个板块：【潜在问题】、【修改后的完整回复】，请把板块名称加粗。
`
                    },
                    "variations_create": {
                        name: "Variations_Create",
                        prompt: `背景：我是亚马逊高级销售伙伴支持专员，需要AI协助分析和优化对卖家咨询的回复质量。重点关注创建变体相关问题，确保回复的完整性和专业性，避免因沟通不充分导致案例重启。
说明：
1. 分析当前案例中的问题要点以及最新备注中即将回复的内容，在【修改后的完整回复】的内容中请勿生成案例中非最新备注中的内容，因为可能涉及内部信息
2. 识别回复中的不足之处
3. 可参考样本分析
4. 预判最可能导致案例重启的2个问题点
5. 提供优化后的完整回复建议
6. 在回复的末尾加上一句“此 Case 已根据现有流程为您处理完毕，此 Case 就为您关闭了。如您有进一步的问题或其他问题，欢迎您创建新的 Case 联系 PSS，我们将非常乐意为您提供帮助。”
样本：
样本1：
问题描述：卖家变体被反复恶意拆分
现有回复内容：已成功处理，变体关系已恢复。
问题后果：在卖家收到邮件回复后，发现变体关系又被恶意拆分，卖家重启案例要求恢复变体关系。
回复机会点：使用话术提醒卖家如果再次被恶意拆分请开新case并附上之前的case id，PSS会尽快为您处理。
需重点关注：如果当前案例是处理变体被恶意拆分，以恢复变体关系。请在回复的末尾加上一句“如后续变体又被拆分，请您附上当前 Case id 创建新的 Case 联系 PSS，我们将非常乐意为您提供帮助。”

样本2：
问题描述：卖家请求拆分变体，但相关ASIN在后台不存在
现有回复内容：告知卖家ASIN不在后台，直接拒绝卖家请求
问题后果：卖家不理解拒绝原因，不清楚如何正确操作拆分流程，导致重启案例
回复机会点：
1. 明确告知变体拆分条件：子体ASIN需在后台存在且有可售商品
2. 提供具体操作指导：先添加商品到后台，确认可售后再申请拆分
需重点关注：
验证ASIN在后台状态；提供完整的满足变体拆分的操作流程指导
样本3：
问题描述：卖家要求合并不同款式（绕踝vs不绕踝）的鞋类变体
现有回复内容：因高跟鞋绑带样式不同，直接拒绝合并请求
问题后果：卖家认为只是细节差异，坚持要求合并，导致案例重启
回复机会点：
明确解释亚马逊变体政策规则：在亚马逊的政策中，子体商品只能有变体主题上的区别，如果主题以外的其他区别都会被视为不同商品（违规变体）。由于卖家ASIN的变体主题是颜色和尺码，那么子体间应该是颜色和尺码的区别。而鞋款（绕踝vs不绕踝）不同，不能作为变体。
需重点关注：详细说明变体政策标准；举例说明合规与违规的区别； 强调产品实质差异与变体规则的关系
输出要求：请结合背景、说明、样本，根据当前案例卖家咨询的问题和最新备注进行分析，如果你是卖家，最可能重启案例咨询的2个问题，并给出回复建议。请展示为两个板块：【潜在问题】、【修改后的完整回复】，请把板块名称加粗。`
                    },
                    "other_amazon_programs": {
                        name: "Other_Amazon_Programs",
                        prompt: `其他亚马逊项目检查
背景：作为亚马逊卖家支持专员，需要AI协助审核回复质量，确保回复准确、完整且专业。
说明：
1. 分析当前案例中的问题要点以及最新备注中即将回复的内容
2. 识别回复中的不足之处
3. 预判最可能导致案例重启的2个问题点
4. 提供优化后的完整回复建议
5. 在回复的末尾加上一句"此 Case 已根据现有流程为您处理完毕，此 Case 就为您关闭了。如您有进一步的问题或其他问题，欢迎您创建新的 Case 联系 PSS，我们将非常乐意为您提供帮助。"
输出要求：请展示为两个板块：【潜在问题】、【修改后的完整回复】，请把板块名称加粗。`
                    },
                    "buybox_win": {
                        name: "buy_box",
                        prompt:`背景：我是亚马逊高级销售伙伴支持专员，需要AI协助分析和优化对卖家咨询的回复质量。重点关注恢复购物车相关问题，确保回复的完整性和专业性，避免因沟通不充分导致案例重启。
说明：
1. 分析当前案例中的问题要点以及最新备注中即将回复的内容，在【修改后的完整回复】的内容中请勿生成案例中非最新备注中的内容，因为可能涉及内部信息
2. 识别回复中的不足之处
3. 可参考样本分析
4. 预判最可能导致案例重启的2个问题点
5. 提供优化后的完整回复建议
6. 在回复的末尾加上一句“此 Case 已根据现有流程为您处理完毕，此 Case 就为您关闭了。如您有进一步的问题或其他问题，欢迎您创建新的 Case 联系 PSS，我们将非常乐意为您提供帮助。”
样本：
样本1：
问题描述：卖家反馈购物车丢失,要求恢复购物车功能。
现有回复内容：告知卖家由于竞争力外部价格问题导致丢失购物车,建议卖家自行定位外网并调整外部链接价格或降低亚马逊价格以恢复购物车。
问题后果：卖家无法找到外部网站链接,重启案例要求支持人员提供具体外部网站信息。
回复机会点：
1.	首次回复需明确告知因政策原因无法透露具体外部竞争网站信息
2.	在购物车未恢复前不要过早关闭案例
3.	给出明确的解决方向:调整价格或排查外部链接
需重点关注：确保首次回复就说明政策限制，避免卖家有错误预期反复询问外部网站信息而导致案例重启。

样本2：
问题描述：卖家发现后台显示的外部竞价与亚马逊价格一致，但仍然丢失购物车，质疑系统错误。
现有回复内容：告知卖家确实存在外部竞价更低的情况，建议自行排查外部网站调价。
问题后果：卖家找不到比亚马逊价格更低的外部网站，重启案例质疑系统抓取错误。
回复机会点：首次回复需说明后台价格显示与实际不符是由于商品缺货或系统延迟更新所致。
需重点关注：首次回复时需检查商品库存状态，并说明缺货对竞争力价格显示的影响，避免卖家因信息不完整而重启案例。
本次输出要求：请结合背景、说明、样本，根据当前案例卖家咨询的问题和最新备注进行预判，如果你是卖家，你最可能重启案例咨询的2个问题，并针对你预测的卖家重启案例咨询的2个问题给出回复内容。请展示为两个板块：【潜在问题】、【修改后的完整回复】，请把板块名称加粗。
`
                    },
                    "title_other_update": {
                        name: "Title/Other_Update",
                        prompt: `背景：我是亚马逊高级销售伙伴支持专员，需要AI协助分析和优化对卖家咨询的回复质量。重点关注属性更新相关问题，确保回复的完整性和专业性，避免因沟通不充分导致案例重启。
说明：
1. 分析当前案例中的问题要点以及最新备注中即将回复的内容，在【修改后的完整回复】的内容中请勿生成案例中非最新备注中的内容，因为可能涉及内部信息
2. 识别回复中的不足之处
3. 可参考样本分析
4. 预判最可能导致案例重启的2个问题点
5. 提供优化后的完整回复建议
6. 在回复的末尾加上一句“此 Case 已根据现有流程为您处理完毕，此 Case 就为您关闭了。如您有进一步的问题或其他问题，欢迎您创建新的 Case 联系 PSS，我们将非常乐意为您提供帮助。”
7. 请不要自行杜撰价格生效的时间，不要杜撰承诺卖家属性更新具体会在多久内生效

样本：
样本1：
问题描述：卖家请求修改ASIN属性信息(如尺寸等)，但属性控制权在其他品牌卖家手中。
现有回复内容：告知卖家控制权在品牌卖家，无操作空间并关闭case。
问题后果：卖家重启案例询问如何获得控制权或要求获取控制权卖家的联系方式
回复机会点：
1.	首次回复时就明确说明“由于告知卖家其他卖家的用户信息包括邮箱会涉及到卖家个人信息泄露的安全隐患，同时获得控制权的卖家并非您当前账户的其他站点，因此我们无法查看到获得控制权的卖家的信息并告知您获得控制权的卖家的邮箱或者是站点。”
2.	告知卖家无法更改属性的原因：当前ASIN已经获得品牌卖家的控制权。品牌ASIN和品牌卖家的控制权高于PSS团队，我们无法通过系统工具为您更改商品的页面信息。PSS团队只能修改普通卖家以及只有普通卖家权限的ASIN的页面信息，建议您通过信息被采纳方的账户与之取得联系。并向卖家提供控制权替代方案：
1）如您是目前备案品牌“XXX”的注册卖家，您可联系所有获得您品牌授权的卖家并由其更新图片。
2）如您是目前备案品牌“XXXX”的授权卖家，您可联系将该品牌授权给您的品牌所有者，并由该品牌所有者告知您所有获得品牌授权的其他卖家的联系方式，之后由您联系所有获得品牌授权的卖家来更新该商品的图片信息。
3）如果您知道是哪一个账户获得控制权，但是该账户已经被冻结无法再使用，您可以登陆品牌账户移除其品牌授权，然后再来更新商品的详情页面信息，以便控制权发生变化
品牌账户登陆：https://brandregistry.amazon.com
需重点关注：
1.	向卖家说明保护卖家隐私信息，因此无法向其他卖家透露您的信息，或向您透露其他卖家信息。
2.	提供本prompts中的控制权替代方案给卖家。
样本2：
问题描述：卖家要求修改特殊属性(如item_package_quantity)。
现有回复内容：告知该属性为特殊属性,当前无法更新或移除。
问题后果：卖家担心错误属性会误导消费者并重启案件。
回复机会点：
1.	解释特殊属性的系统限制
2.	审核并确认详情页面信息展示
3.	建议添加替代属性(如number_of_items)来准确描述产品
需重点关注：在拒绝卖家时，提供可行的替代方案

输出要求：请结合背景、说明、样本，根据当前案例卖家咨询的问题和最新备注进行分析，如果你是卖家，你最可能重启案例咨询的2个问题，并给出回复建议。请展示为两个板块：【潜在问题】、【修改后的完整回复】，请把板块名称加粗。
`
                    }
                }
            }
        }
    };
    // ========== 配置区域结束 ==========

    let currentWidget = null;
    let isExpanded = false;
    let currentView = 'main';
    let currentSubmenu = null;
    let clipboardContent = '';
    let copyHistory = [];
    let hoverTimeout = null;

    function createWidget() {
        if (!document.body) {
            console.log('document.body不存在，延迟创建');
            setTimeout(createWidget, 200);
            return;
        }

        console.log('开始创建悬浮窗');

        try {
            currentWidget = document.createElement('div');
            currentWidget.id = 'amazon-q-lobby-fixed-widget';
            
            currentWidget.innerHTML = `
                <div class="mini-bar" style="background:${CONFIG.themeColor};color:white;padding:8px 15px;border-radius:20px;cursor:move;display:flex;justify-content:center;align-items:center;user-select:none;box-shadow:0 2px 8px rgba(0,0,0,0.2);font-size:14px;font-weight:bold;">
                    Q Helper
                </div>
                <div class="expanded-content" style="display:none;background:white;border:2px solid ${CONFIG.themeColor};border-radius:8px;box-shadow:0 4px 12px rgba(0,0,0,0.3);margin-top:5px;">
                    <div class="header" style="background:${CONFIG.themeColor};color:white;padding:10px;border-radius:6px 6px 0 0;display:flex;justify-content:space-between;align-items:center;user-select:none;">
                        <span class="title">Q Helper</span>
                        <div>
                            <button class="clear-btn" style="background:none;border:none;color:white;cursor:pointer;margin-right:5px;font-size:12px;padding:2px 6px;" title="清空剪贴板">🗑</button>
                            <button class="back-btn" style="background:none;border:none;color:white;cursor:pointer;margin-right:5px;font-size:14px;padding:2px 6px;display:none;">←</button>
                            <button class="close-btn" style="background:none;border:none;color:white;cursor:pointer;font-size:16px;padding:2px 6px;">×</button>
                        </div>
                    </div>
                    <div class="content" style="padding:10px;background:white;"></div>
                    <div class="status" style="background:#f5f5f5;padding:5px 10px;font-size:11px;color:#666;border-radius:0 0 6px 6px;">剪贴板: 空</div>
                </div>
            `;

            currentWidget.style.cssText = `
                position: fixed !important;
                top: 10px !important;
                left: 800px !important;
                transform: none !important;
                z-index: 2147483647 !important;
                font-family: Arial, sans-serif !important;
                transition: all 0.3s ease !important;
            `;

            document.body.appendChild(currentWidget);
            console.log('悬浮窗DOM已添加');

            setupHoverEvents();
            renderMainMenu();
            setupEventListeners();
            setupDragging();

            console.log('悬浮窗创建完成');

        } catch (error) {
            console.error('创建悬浮窗时出错:', error);
        }
    }

    function setupHoverEvents() {
        currentWidget.addEventListener('mouseenter', () => {
            if (hoverTimeout) {
                clearTimeout(hoverTimeout);
                hoverTimeout = null;
            }
            if (!isExpanded) {
                expandWidget();
            }
        });

        currentWidget.addEventListener('mouseleave', () => {
            hoverTimeout = setTimeout(() => {
                if (isExpanded) {
                    collapseWidget();
                }
            }, 500);
        });
    }

    function expandWidget() {
        const miniBar = currentWidget.querySelector('.mini-bar');
        const expandedContent = currentWidget.querySelector('.expanded-content');
        
        isExpanded = true;
        miniBar.style.display = 'none';
        expandedContent.style.display = 'block';
        currentWidget.style.width = '380px';
    }

    function collapseWidget() {
        const miniBar = currentWidget.querySelector('.mini-bar');
        const expandedContent = currentWidget.querySelector('.expanded-content');
        
        isExpanded = false;
        miniBar.style.display = 'flex';
        expandedContent.style.display = 'none';
        currentWidget.style.width = 'auto';
    }

    function renderMainMenu() {
        const content = currentWidget.querySelector('.content');
        const title = currentWidget.querySelector('.title');
        const backBtn = currentWidget.querySelector('.back-btn');
        
        title.textContent = 'Q Helper';
        backBtn.style.display = 'none';
        currentView = 'main';
        
        content.innerHTML = `
            <div style="display:flex;flex-direction:column;gap:8px;">
                ${Object.keys(CONFIG.mainCategories).map(key => {
                    const item = CONFIG.mainCategories[key];
                    return `<button class="main-btn" data-key="${key}" style="padding:12px;background:#f0f0f0;border:1px solid ${CONFIG.themeColor};border-radius:4px;cursor:pointer;font-size:14px;transition:all 0.2s;text-align:left;">${item.name}</button>`;
                }).join('')}
            </div>
        `;
    }

    function renderSubmenu(submenuKey) {
        const content = currentWidget.querySelector('.content');
        const title = currentWidget.querySelector('.title');
        const backBtn = currentWidget.querySelector('.back-btn');
        
        const submenu = CONFIG.mainCategories[submenuKey];
        title.textContent = submenu.name;
        backBtn.style.display = 'inline-block';
        currentView = 'submenu';
        currentSubmenu = submenuKey;
        
        content.innerHTML = `
            <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:5px;">
                ${Object.keys(submenu.subItems).map(key => {
                    const item = submenu.subItems[key];
                    return `<button class="sub-btn" data-key="${key}" style="padding:8px 4px;background:#f0f0f0;border:1px solid ${CONFIG.themeColor};border-radius:4px;cursor:pointer;font-size:10px;transition:all 0.2s;text-align:center;line-height:1.2;word-wrap:break-word;overflow:hidden;">${item.name}</button>`;
                }).join('')}
            </div>
        `;
    }

    function setupEventListeners() {
        const content = currentWidget.querySelector('.content');
        const backBtn = currentWidget.querySelector('.back-btn');
        const closeBtn = currentWidget.querySelector('.close-btn');
        const clearBtn = currentWidget.querySelector('.clear-btn');

        backBtn.onclick = () => renderMainMenu();
        
        closeBtn.onclick = () => {
            if (currentWidget) {
                currentWidget.remove();
                currentWidget = null;
            }
        };

        clearBtn.onclick = () => {
            clipboardContent = '';
            copyHistory = [];
            updateStatus();
            showNotification('剪贴板已清空');
        };

        content.onclick = (e) => {
            const target = e.target;
            
            if (target.classList.contains('main-btn')) {
                const key = target.dataset.key;
                const item = CONFIG.mainCategories[key];
                
                if (item.type === 'direct') {
                    addToClipboard(item.prompt, item.name);
                } else if (item.type === 'submenu') {
                    renderSubmenu(key);
                }
            }
            
            if (target.classList.contains('sub-btn')) {
                const key = target.dataset.key;
                const item = CONFIG.mainCategories[currentSubmenu].subItems[key];
                addToClipboard(item.prompt, item.name);
            }
        };

        content.onmouseover = (e) => {
            if (e.target.tagName === 'BUTTON') {
                e.target.style.background = CONFIG.themeColor;
                e.target.style.color = 'white';
            }
        };

        content.onmouseout = (e) => {
            if (e.target.tagName === 'BUTTON') {
                e.target.style.background = '#f0f0f0';
                e.target.style.color = 'black';
            }
        };
    }

    function addToClipboard(text, name) {
        if (clipboardContent) {
            clipboardContent += '\n\n---\n\n' + text;
        } else {
            clipboardContent = text;
        }
        
        copyHistory.push(name);
        
        navigator.clipboard.writeText(clipboardContent).then(() => {
            showNotification('已添加: ' + name);
            updateStatus();
        }).catch(() => {
            const textarea = document.createElement('textarea');
            textarea.value = clipboardContent;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            showNotification('已添加: ' + name);
            updateStatus();
        });
    }

    function updateStatus() {
        const status = currentWidget.querySelector('.status');
        if (copyHistory.length === 0) {
            status.textContent = '剪贴板: 空';
            status.style.color = '#666';
        } else {
            status.textContent = `剪贴板: ${copyHistory.join(' + ')} (${copyHistory.length}项)`;
            status.style.color = CONFIG.themeColor;
        }
    }

    function showNotification(message) {
        const notification = document.createElement('div');
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed !important;
            top: 70px !important;
            right: 20px !important;
            background: ${CONFIG.themeColor} !important;
            color: white !important;
            padding: 10px !important;
            border-radius: 4px !important;
            z-index: 2147483647 !important;
            font-family: Arial, sans-serif !important;
        `;
        document.body.appendChild(notification);
        setTimeout(() => notification.remove(), 2000);
    }

    function setupDragging() {
        const miniBar = currentWidget.querySelector('.mini-bar');
        const header = currentWidget.querySelector('.header');
        let isDragging = false;
        let startX, startY, startLeft, startTop;

        function startDrag(e) {
            isDragging = true;
            startX = e.clientX;
            startY = e.clientY;
            startLeft = currentWidget.offsetLeft;
            startTop = currentWidget.offsetTop;
            
            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
            e.preventDefault();
        }

        miniBar.addEventListener('mousedown', startDrag);
        header.addEventListener('mousedown', (e) => {
            if (e.target.tagName !== 'BUTTON') startDrag(e);
        });

        function onMouseMove(e) {
            if (!isDragging) return;
            
            const deltaX = e.clientX - startX;
            const deltaY = e.clientY - startY;
            
            let newLeft = startLeft + deltaX;
            let newTop = startTop + deltaY;
            
            newTop = Math.max(0, Math.min(newTop, 100));
            newLeft = Math.max(0, Math.min(newLeft, window.innerWidth - currentWidget.offsetWidth));
            
            currentWidget.style.left = newLeft + 'px';
            currentWidget.style.top = newTop + 'px';
            currentWidget.style.transform = 'none';
        }

        function onMouseUp() {
            isDragging = false;
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        }
    }

    // 初始化
    function init() {
        console.log('初始化脚本');
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', createWidget);
        } else {
            createWidget();
        }
    }

    init();

})();
