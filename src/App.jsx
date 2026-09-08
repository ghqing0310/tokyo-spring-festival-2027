import { useEffect, useMemo, useState } from 'react'
import fujiHero from './assets/fuji.png'
import tokyoBg from './assets/tokyo.png'
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  CloudSun,
  ExternalLink,
  Footprints,
  Hotel,
  Info,
  Landmark,
  Map,
  MapPin,
  Maximize2,
  Minus,
  Plane,
  Plus,
  Printer,
  RotateCcw,
  Route,
  Sparkles,
  Ticket,
  TrainFront,
  Utensils,
} from 'lucide-react'

const dayPool = [
  {
    day: 'D1', date: '02.08', weekday: '周一', title: '上海 → 东京 · 抵达与城市预热',
    subtitle: 'PVG / SHA → HND，入住新宿，把体力留给四个主菜日', tone: 'navy', total: '¥52–87（不含机酒）',
    tags: ['国际抵达', '新宿夜景', '轻松日'],
    stops: [
      { time: '08:00–12:00', icon: 'plane', name: '上海飞东京', detail: '优先选 SHA/PVG → HND 白天直飞，飞行约 2.5–3.5h；春节档建议按 ¥3,000–5,500/人往返预留。', fee: '机票另计' },
      { time: '12:00–13:30', icon: 'train', name: '羽田机场 → 新宿', detail: '京急至品川后转 JR 山手线；含入境、取行李与换乘缓冲。若飞成田，改买 N’EX 往返票。', fee: '约 ¥24' },
      { time: '14:00–15:00', icon: 'hotel', name: '新宿酒店入住 / 寄存', detail: '建议住新宿站西口或新宿三丁目：箱根与河口湖早班最省心，东京市区也方便。', fee: '住宿另计' },
      { time: '15:30–17:10', icon: 'landmark', name: '东京都厅展望室', detail: '从新宿站步行约 12 分钟。冬季日落约 17:18，天气好可提前看富士山方向。', fee: '免费' },
      { time: '17:30–19:00', icon: 'food', name: '思出横丁 / 新宿晚餐', detail: '第一晚不排重餐，选拉面、烧鸟或定食，早睡为箱根与富士山早起做准备。', fee: '¥66–131' },
    ],
    transit: '机场交通约 35–55 min · 市内步行约 4 km', note: '若落地 NRT：N’EX 到新宿约 ¥146；成田往返票约 ¥227。', source: 'https://www.jreast.co.jp/en/multi/nex/'
  },
  {
    day: 'D5', date: '02.12', weekday: '周五', title: '东京一日 · 秋叶原、原宿、表参道与 Omakase',
    subtitle: '从二次元电器街走到东京时装轴线，以银座板前席收官', tone: 'coral', total: '¥480–1,925',
    tags: ['秋叶原', '原宿表参道', 'Omakase'],
    stops: [
      { time: '09:00–11:20', icon: 'landmark', name: '秋叶原电器街', detail: 'Radio Kaikan、模型店与电器街主轴。店铺多在 10:00 后营业，不建议更早到。', fee: '免费逛' },
      { time: '11:25–12:10', icon: 'landmark', name: '神田明神', detail: '从秋叶原步行约 7 分钟；动漫文化与江户守护神交汇。资料馆可按兴趣进入。', fee: '参拜免费 / 馆约 ¥22' },
      { time: '12:15–13:10', icon: 'food', name: '秋叶原午餐', detail: '咖喱、鳗鱼饭或女仆咖啡厅三选一；避免在热门店排队超过 30 分钟。', fee: '¥52–109' },
      { time: '13:15–13:50', icon: 'train', name: 'JR 山手线 → 原宿', detail: '秋叶原直达原宿，约 32 分钟；使用 Welcome Suica / PASMO 刷卡。', fee: '约 ¥9' },
      { time: '14:00–15:30', icon: 'landmark', name: '明治神宫', detail: '原宿站入，南参道慢走。冬日林荫安静，主殿往返约 60–75 分钟。', fee: '参拜免费 / 博物馆约 ¥44' },
      { time: '15:40–17:30', icon: 'foot', name: '原宿 → 表参道漫步', detail: '东急 Plaza Omokado 屋顶、Cat Street、表参道 Hills 连走，不坐一站地铁。', fee: '免费逛' },
      { time: '17:35–18:00', icon: 'train', name: '表参道 → 银座', detail: '东京 Metro 银座线直达，为晚餐预留 15 分钟找店和入席。', fee: '约 ¥8' },
      { time: '18:15–20:15', icon: 'food', name: '银座 Omakase', detail: '默认亲民层：Sushi Banya Kai；可在预算面板切换中高端或高端方案。', fee: '约 ¥418 起' },
    ],
    transit: 'JR + Metro 约 ¥17 · 步行约 9 km', note: '板前席通常严格按时开席；建议提前 15 分钟到店，避免香水。', source: 'https://www.tablecheck.com/en/shops/sushibanya-kai/reserve'
  },
  {
    day: 'D2', date: '02.09', weekday: '周二', title: '东京往返箱根 · 艺术与山海空环线',
    subtitle: '雕刻之森、空中缆车、大涌谷、芦之湖与箱根神社一日闭环', tone: 'gold', total: '¥494–573',
    tags: ['箱根周游券', '雕刻之森', '大涌谷', '芦之湖'],
    stops: [
      { time: '06:35–08:10', icon: 'train', name: '新宿 → 箱根汤本', detail: '06:35 前到小田急窗口/闸机；浪漫特快约 80 分钟，指定席需另购特急券。', fee: '周游券内 + 约 ¥52' },
      { time: '08:15–08:55', icon: 'train', name: '箱根汤本 → 雕刻之森', detail: '乘箱根登山电车，沿山谷爬升；从雕刻之森站步行约 2 分钟到馆。', fee: '周游券内' },
      { time: '09:00–10:40', icon: 'landmark', name: '箱根雕刻之森美术馆', detail: '露天雕塑、毕加索馆、彩色玻璃塔与足汤；网上购票更划算。', fee: '官网票约 ¥79' },
      { time: '10:45–11:20', icon: 'train', name: '雕刻之森 → 强罗 → 早云山', detail: '登山电车一站到强罗，再换登山缆车；换乘留出排队时间。', fee: '周游券内' },
      { time: '11:20–12:20', icon: 'landmark', name: '大涌谷', detail: '空中缆车上山，观火山地貌、吃黑鸡蛋；天气差时改冈田美术馆。', fee: '观景免费' },
      { time: '12:20–13:10', icon: 'train', name: '大涌谷 → 桃源台 → 元箱根', detail: '空中缆车下至桃源台，换芦之湖海盗船；冬季航程约 25–35 分钟。', fee: '周游券内' },
      { time: '13:15–14:00', icon: 'food', name: '元箱根午餐', detail: 'Bakery & Table 湖畔简餐最省时；若重视正餐可提前订强罗餐厅。', fee: '¥66–109' },
      { time: '14:00–14:50', icon: 'landmark', name: '箱根神社', detail: '步行往返，湖上鸟居常排队；时间紧就拍外景，不执着单人机位。', fee: '参拜免费 / 宝物殿约 ¥22' },
      { time: '15:10–17:40', icon: 'train', name: '元箱根 → 箱根汤本 → 新宿', detail: '巴士下山后换小田急；若缆车或海盗船停运，提前从强罗巴士下山。', fee: '周游券内 + 约 ¥52' },
    ],
    transit: '箱根周游券约 ¥310 · 浪漫特快往返约 +¥105', note: '冬季强风可能停运缆车或海盗船，07:00 先查官方运况。', source: 'https://www.hakonenavi.jp/transportation/'
  },
  {
    day: 'D3', date: '02.10', weekday: '周三', title: '东京往返镰仓 · 古寺与海街',
    subtitle: '先长谷，再海岸，最后鹤冈八幡宫与小町通', tone: 'mint', total: '¥170–240',
    tags: ['平日错峰', '镰仓大佛', '江之电'],
    stops: [
      { time: '07:20–08:30', icon: 'train', name: '东京 / 新宿 → 镰仓', detail: '东京站走 JR 横须贺线；从新宿可走湘南新宿线。建议 07:30 前上车。', fee: '往返约 ¥91' },
      { time: '08:35–09:00', icon: 'train', name: '镰仓 → 长谷', detail: '换乘江之电，买 Noriorikun 一日券；人多时车站会排队。', fee: '一日券约 ¥35' },
      { time: '09:00–10:00', icon: 'landmark', name: '长谷寺', detail: '寺院、海景台与庭园；2 月梅花期值得留足 60 分钟。', fee: '约 ¥17' },
      { time: '10:10–10:50', icon: 'landmark', name: '高德院 · 镰仓大佛', detail: '从长谷寺步行约 7 分钟；大佛胎内是否开放以当天公告为准。', fee: '约 ¥13' },
      { time: '11:05–11:40', icon: 'landmark', name: '镰仓高校前', detail: '江之电到经典海街机位，仅停留 15–20 分钟；务必遵守路口与居民区秩序。', fee: '一日券内' },
      { time: '12:10–14:20', icon: 'food', name: '鹤冈八幡宫 + 小町通', detail: '先参拜再午餐，网红店排队长时建议看到顺眼的定食店就进。', fee: '参拜免费 / 餐 ¥66–109' },
      { time: '15:00–16:15', icon: 'train', name: '镰仓 → 东京', detail: '预留 30–45 分钟缓冲；若客流过大，放弃江之岛，不压缩返程。', fee: '已计入往返' },
    ],
    transit: 'JR 往返约 ¥91 · 江之电一日券约 ¥35', note: '改到 2/10 平日错峰；仍建议早出发，完整江之岛不硬塞。', source: 'https://visit.trip-kamakura.com/zh-hans/access/'
  },
  {
    day: 'D4', date: '02.11', weekday: '周四 · 日本假日', title: '东京往返富士 · 新仓山与河口湖',
    subtitle: '把高概率冬季富士山放在上午：忠灵塔、大石公园、湖畔蓝调', tone: 'sky', total: '¥262–328',
    tags: ['高速巴士', '新仓山', '河口湖'],
    stops: [
      { time: '06:40–09:00', icon: 'train', name: '新宿 → 中央道下吉田', detail: '06:40 到新宿高速巴士总站，提前预约 07:00 左右班次；堵车需留缓冲。', fee: '约 ¥94' },
      { time: '09:00–10:35', icon: 'landmark', name: '新仓山浅间公园', detail: '忠灵塔经典机位需上 398 级台阶；遇结冰缩短停留，不抢护栏位。', fee: '免费' },
      { time: '10:40–11:25', icon: 'train', name: '下吉田 → 河口湖', detail: '步行回下吉田站，乘富士急行线到河口湖；班次稀疏，按票面时刻走。', fee: '约 ¥14' },
      { time: '11:30–12:40', icon: 'food', name: '河口湖站午餐', detail: '吉田乌冬或馎饦面，先吃热食再去湖边；车站寄存柜可能较早满。', fee: '¥52–87' },
      { time: '12:50–13:50', icon: 'landmark', name: '天上山公园缆车 · 可选', detail: '天气清晰且风小时再上；强风停运就直接把时间给大石公园。', fee: '往返约 ¥44' },
      { time: '14:00–15:35', icon: 'landmark', name: '大石公园 / 河口湖畔', detail: '红线周游巴士前往；冬季空气通透，是平地看富士最稳的机位之一。', fee: '公园免费 / 巴士约 ¥66' },
      { time: '16:30–18:30', icon: 'train', name: '河口湖 → 新宿', detail: '提前订回程高速巴士；若担心堵车，可改富士回游指定席。', fee: '约 ¥96–101' },
    ],
    transit: '巴士 + 富士急 + 周游巴士约 ¥269', note: '清晨常低于 0℃；前夜下雪时忠灵塔台阶可能结冰，缆车为可删项。', source: 'https://highway-buses.jp/chs/course/kawaguchiko-onedaytrip.php'
  },
  {
    day: 'D6', date: '02.13', weekday: '周六', title: '东京 → 上海 · 从容返程',
    subtitle: '早餐、补货、退房与机场；不再安排远距离景点', tone: 'violet', total: '¥87–153',
    tags: ['返程', '补货', '机场'],
    stops: [
      { time: '08:00–09:00', icon: 'food', name: '酒店早餐 / 咖啡', detail: '昨晚收好行李，早上只留随身购物袋；核对护照、退税品与充电宝。', fee: '¥35–66' },
      { time: '09:00–10:30', icon: 'landmark', name: '新宿最后补货', detail: '药妆、伴手礼一次买齐；不要安排筑地或浅草，避免跨城误机。', fee: '购物自定' },
      { time: '10:30–11:00', icon: 'hotel', name: '退房', detail: '国际航班建议起飞前 3 小时到机场；春节回程值机可能更慢。', fee: '—' },
      { time: '11:00–12:00', icon: 'train', name: '新宿 → 羽田机场', detail: 'JR 到品川转京急；如 NRT 返程，按航班至少再提前 60 分钟出发。', fee: '约 ¥24' },
      { time: '15:00–18:00', icon: 'plane', name: '东京飞上海', detail: '以实际航班为准；入境后预留 60–90 分钟取行李与交通。', fee: '机票已计' },
    ],
    transit: '新宿 → 羽田约 40–55 min', note: '若返程为成田：优先 N’EX，最晚于起飞前约 4.5 小时离开新宿。', source: 'https://tokyo-haneda.com/zh-CHS/access/train/index.html'
  },
]

const days = [dayPool[0], dayPool[2], dayPool[3], dayPool[4], dayPool[1], dayPool[5]]

const routeMaps = {
  D1: {
    area: '上海 → 东京 · 机场进城线',
    points: [
      ['上海', 8, 68, '起飞'], ['羽田 T3', 31, 74, '入境'], ['品川', 53, 61, '京急'], ['新宿', 73, 40, '入住'], ['都厅', 88, 24, '日落'],
    ],
  },
  D2: {
    area: '箱根 · 登山电车与芦之湖环线',
    points: [
      ['箱根汤本', 8, 76, '起点'], ['雕刻之森', 27, 52, '美术馆'], ['强罗', 42, 40, '换乘'], ['大涌谷', 58, 20, '火山'], ['桃源台', 72, 38, '乘船'], ['元箱根', 88, 69, '神社'],
    ],
  },
  D3: {
    area: '镰仓 · 古寺与湘南海岸线',
    points: [
      ['镰仓站', 10, 30, 'JR'], ['长谷寺', 30, 53, '庭园'], ['大佛', 45, 43, '高德院'], ['高校前', 68, 70, '海街'], ['小町通', 89, 30, '返程'],
    ],
  },
  D4: {
    area: '富士山 · 下吉田与河口湖北岸',
    points: [
      ['下吉田', 10, 66, '下车'], ['新仓山', 28, 28, '忠灵塔'], ['河口湖站', 50, 68, '午餐'], ['天上山', 65, 39, '可选'], ['大石公园', 90, 30, '湖畔'],
    ],
  },
  D5: {
    area: '东京 · 东西城市文化轴线',
    points: [
      ['新宿', 8, 58, '出发'], ['秋叶原', 31, 25, '电器街'], ['明治神宫', 53, 68, '原宿'], ['表参道', 72, 53, '建筑'], ['银座', 91, 29, 'Omakase'],
    ],
  },
  D6: {
    area: '东京 → 上海 · 返程线',
    points: [
      ['新宿', 10, 30, '退房'], ['品川', 37, 50, '换乘'], ['羽田 T3', 62, 72, '值机'], ['上海', 91, 40, '抵达'],
    ],
  },
}

const dailyDining = {
  D1: [
    ['MO-MO-PARADISE 新宿东口', '寿喜烧 / 涮涮锅', '约 ¥220–260/人', '建议预约', 'https://mo-mo-paradise.com/zh/pages/shop-list/shinjukuhigashi'],
    ['京都 清水 和牛 八重郎', '和牛饭三吃', '约 ¥130–175/人', '建议预约', 'https://www.restaurants-park.jp/restaurant/?id=544'],
  ],
  D2: [
    ['GORA BREWERY & GRILL', '精酿 + 炭火料理', '午餐约 ¥110/人', '建议预约', 'https://itoh-dining.co.jp/gorabrewery/index.html'],
    ['Bakery & Table Hakone', '湖畔面包 / 简餐', '约 ¥20–125/人', '现场排队', 'https://www.bthjapan.com/hakone.php'],
    ['懐石料理 花壇', '箱根怀石', '午餐约 ¥370起/人', '强烈建议预约', 'https://www.gorakadan.com/hakone/kaiseki-restaurant/?lang=en'],
  ],
  D3: [
    ['海畑 镰仓长谷店', '吻仔鱼 / 海鲜天妇罗', '约 ¥90–130/人', '建议预约', 'https://umibatake.com/kamakura-hase/'],
    ['bills 七里滨', '澳式 Brunch / 松饼', '约 ¥90–130/人', '建议预约', 'https://www.billsjapan.com/en/locations/shichirigahama'],
    ['Pondichery', '法式 × 南印度香料', '午餐约 ¥220–260/人', '建议预约', 'https://www.tablecheck.com/en/shops/pondichery/reserve'],
  ],
  D4: [
    ['富士天妇罗 いだ天', '天妇罗 / 乌冬', '约 ¥90–130/人', '现场排队', 'https://fuji.creative-r.com/zh/pages/idaten-kawaguchiko'],
    ['ほうとう不動', '山梨馎饦面', '约 ¥45–90/人', '现场排队', 'http://www.houtou-fudou.jp/english.html'],
    ['紅梅や 大石公园店', '乡土料理 / 天妇罗', '约 ¥90–130/人', '建议预约', 'https://s.tabelog.com/cn/yamanashi/A1903/A190303/19013700/'],
  ],
  D5: [
    ['丸五 · 秋叶原', '炸猪排', '约 ¥45–90/人', '不可预约', 'https://tabelog.com/en/tokyo/A1310/A131001/13000379/'],
    ['CICADA · 表参道', '地中海料理', '午餐约 ¥90–130/人', '建议预约', 'https://www.tablecheck.com/en/shops/cicada/reserve'],
    ['鮨 银座おのでら', '江户前 Omakase', '午餐约 ¥385起/人', '强烈建议预约', 'https://onodera-group.com/reservation/'],
  ],
  D6: [
    ['築地日本海 新宿西口店', '寿司 / 海鲜', '午餐约 ¥45–90/人', '可预约', 'https://yoyaku.toreta.in/daisyo-5253'],
    ['SUSHI TOKYO TEN 新宿', '轻 Omakase', '午餐约 ¥240/人', '建议预约', 'https://sushitokyo-ten.com/'],
  ],
}

const hotels = [
  ['性价比', 'Hotel Sunroute Plaza Shinjuku', '南口约 3 分钟 · 交通型基地', '约 ¥900–1,400/间夜', 'https://en.sotetsu-hotels.com/sunroute/plazashinjuku/'],
  ['舒适', 'Hotel Century Southern Tower', '南口约 3 分钟 · 26㎡起', '约 ¥1,300–2,000/间夜', 'https://global.southerntower.co.jp/'],
  ['景观', 'Keio Plaza Hotel Tokyo', '西口约 5 分钟 · 机场巴士', '约 ¥1,600–2,600/间夜', 'https://www.keioplaza.co.jp/en/'],
]

const preorder = [
  ['国际机票', '¥3,000–5,500', '现在开始盯价', '优先羽田、白天航班'],
  ['新宿酒店 5 晚', '¥1,500–4,200/人', '提前 3–5 个月', '双人同住分摊'],
  ['Omakase', '约 ¥418–2,020/人', '提前 1–2 个月', '严格按时开席'],
  ['箱根浪漫特快', '周游券约 ¥310 + 指定席', '开售后锁早班', '周游券不含特急券'],
  ['河口湖高速巴士', '往返约 ¥190', '开售后尽快', '去下吉田、河口湖回'],
]

const notes = [
  ['天气', '东京约 2–11℃，河口湖与箱根清晨常低于 0℃。羽绒 + 防风层 + 防滑鞋底。', CloudSun],
  ['票卡', 'Welcome Suica / TOURIST PASMO 做主卡。东京地铁票不覆盖 JR 与近郊私铁。', Ticket],
  ['日落', '东京 2/11 日落约 17:18。河口湖与箱根把户外观景放到 16:30 前。', Clock3],
  ['假日', '2/11 是日本建国纪念日，当天安排富士山并提前锁定往返座位；镰仓已前移至 2/10 平日。', CalendarDays],
  ['住宿', '全程住新宿最省换酒店成本：箱根小田急、河口湖巴士都从新宿出发。', Hotel],
  ['预案', '富士看天气、箱根看运况。若富士天气不佳，可与 2/9 箱根互换；东京日固定在离境前一天。', Route],
]

const iconMap = { plane: Plane, train: TrainFront, hotel: Hotel, landmark: Landmark, food: Utensils, foot: Footprints }

function Timeline({ day }) {
  return <div className="timeline">
    {day.stops.map((stop, index) => {
      const Icon = iconMap[stop.icon] || MapPin
      return <div className="timeline-row" key={`${day.day}-${stop.time}`}>
        <div className="time">{stop.time}</div>
        <div className={`timeline-marker ${day.tone}`}><Icon size={16} /></div>
        <div className="timeline-card">
          <div className="timeline-title"><strong>{stop.name}</strong><span>{stop.fee}</span></div>
          <p>{stop.detail}</p>
          {index < day.stops.length - 1 && <div className="connector" />}
        </div>
      </div>
    })}
  </div>
}

function OverviewMap({ active, setActive }) {
  const [zoom, setZoom] = useState(1)
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [dragStart, setDragStart] = useState(null)

  const cities = [
    { id: 'shanghai', name: '上海', sub: '往返起点', x: 130, y: 335, day: 0 },
    { id: 'fuji', name: '富士 · 河口湖', sub: 'D4 · 约 1h45', x: 495, y: 205, day: 3 },
    { id: 'tokyo', name: '东京 · 新宿', sub: '5 晚大本营', x: 690, y: 210, day: 4 },
    { id: 'narita', name: '成田 NRT', sub: '备选机场', x: 842, y: 126, day: 0 },
    { id: 'haneda', name: '羽田 HND', sub: '优先机场', x: 755, y: 292, day: 0 },
    { id: 'hakone', name: '箱根', sub: 'D2 · 约 80 min', x: 555, y: 370, day: 1 },
    { id: 'kamakura', name: '镰仓', sub: 'D3 · 约 60 min', x: 700, y: 390, day: 2 },
  ]

  const adjustZoom = amount => setZoom(value => Math.min(2.6, Math.max(1, Number((value + amount).toFixed(1)))))
  const resetMap = () => { setZoom(1); setPan({ x: 0, y: 0 }) }
  const handlePointerDown = event => {
    if (zoom === 1) return
    event.currentTarget.setPointerCapture(event.pointerId)
    setDragStart({ x: event.clientX - pan.x, y: event.clientY - pan.y })
  }
  const handlePointerMove = event => {
    if (!dragStart) return
    setPan({ x: event.clientX - dragStart.x, y: event.clientY - dragStart.y })
  }

  return <div className="overview-shell">
    <div className="overview-head">
      <div><span className="overview-label"><Map size={15}/> CITY OVERVIEW</span><h3>上海与东京近郊 · 城市总览</h3><p>放大查看东京、箱根、镰仓与富士之间的位置关系；点击目的地会同步下方当天路线。</p></div>
      <div className="zoom-controls" aria-label="地图缩放控件">
        <button onClick={() => adjustZoom(-0.2)} disabled={zoom <= 1} aria-label="缩小地图"><Minus size={16}/></button>
        <span>{Math.round(zoom * 100)}%</span>
        <button onClick={() => adjustZoom(0.2)} disabled={zoom >= 2.6} aria-label="放大地图"><Plus size={16}/></button>
        <button onClick={resetMap} aria-label="重置地图"><RotateCcw size={15}/></button>
      </div>
    </div>
    <div className={`overview-viewport ${dragStart ? 'dragging' : ''}`}>
      <div
        className="overview-canvas"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})` }}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={() => setDragStart(null)}
        onPointerCancel={() => setDragStart(null)}
      >
        <svg viewBox="0 0 1000 520" role="img" aria-label="上海、东京、箱根、镰仓与富士山城市交通总览图">
          <defs>
            <pattern id="overviewGrid" width="50" height="50" patternUnits="userSpaceOnUse"><path d="M 50 0 L 0 0 0 50" fill="none" stroke="rgba(26,64,78,.08)" strokeWidth="1"/></pattern>
            <marker id="arrowhead" markerWidth="8" markerHeight="8" refX="6" refY="3" orient="auto"><path d="M0,0 L0,6 L7,3 z" fill="#dc735f"/></marker>
          </defs>
          <rect width="1000" height="520" fill="url(#overviewGrid)"/>
          <path className="map-land" d="M414 85 C475 59 570 56 632 82 C690 107 730 103 778 77 C833 47 916 72 949 117 L945 430 C854 459 783 435 735 455 C652 489 568 469 507 434 C456 404 405 361 379 304 C354 249 361 153 414 85Z"/>
          <path className="coast-line" d="M586 111 C629 134 616 179 651 206 C682 229 720 217 749 245 C782 278 758 323 796 351 C824 372 854 370 881 398"/>
          <path className="flight-line" d="M153 318 Q 382 58 668 193" markerEnd="url(#arrowhead)"/>
          <text className="flight-label" x="354" y="112">上海 ⇄ 东京 · 直飞约 2.5–3.5h</text>
          <path className="city-route" d="M680 222 Q 590 246 510 215"/><text className="route-time" x="559" y="207">高速巴士</text>
          <path className="city-route" d="M679 226 Q 612 300 561 354"/><text className="route-time" x="590" y="311">小田急</text>
          <path className="city-route" d="M694 229 Q 704 298 701 372"/><text className="route-time" x="711" y="316">JR</text>
          <path className="airport-route" d="M705 220 Q 735 253 753 279"/>
          <path className="airport-route dashed" d="M706 201 Q 778 151 828 132"/>
          {cities.map(city => <g
            className={`overview-city ${days[active].day === days[city.day].day ? 'active' : ''}`}
            key={city.id}
            transform={`translate(${city.x} ${city.y})`}
            role="button"
            tabIndex="0"
            onClick={() => setActive(city.day)}
            onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') setActive(city.day) }}
          >
            <circle r="12"/><circle className="city-core" r="4"/>
            <text className="city-name" x="18" y="-2">{city.name}</text>
            <text className="city-sub" x="18" y="15">{city.sub}</text>
          </g>)}
          <g className="overview-fuji" transform="translate(445 155)"><path d="M0 56 L38 0 L76 56 Z"/><path d="M25 20 L38 0 L53 22 L45 18 L38 27 L31 18 Z"/></g>
        </svg>
      </div>
      {zoom > 1 && <div className="drag-hint"><Maximize2 size={13}/> 拖动画布查看细节</div>}
    </div>
    <div className="overview-legend"><span><i className="legend-flight"/>国际航线</span><span><i className="legend-rail"/>近郊往返</span><small>地理位置为旅行规划级示意，交通时间以当日班次为准</small></div>
  </div>
}

function RouteMap({ active }) {
  const [selectedStop, setSelectedStop] = useState(0)
  const day = days[active]
  const map = routeMaps[day.day]
  const linePoints = map.points.map(point => `${point[1]},${point[2]}`).join(' ')
  const safeStop = Math.min(selectedStop, map.points.length - 1)

  return <div className="route-map-block">
    <div className="map-title map-title-outside"><MapPin size={15}/><div><strong>{map.area}</strong><small>{map.points.length} 个关键节点 · 按实际游览顺序</small></div></div>
    <div className="route-map detailed-map" aria-label={`${day.day} 当天景点路线图`}>
      <div className="map-wash" />
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
        <polyline className="map-line active detail-line" points={linePoints} />
        {map.points.map((point, index) => index < map.points.length - 1 && <circle key={index} cx={(point[1] + map.points[index + 1][1]) / 2} cy={(point[2] + map.points[index + 1][2]) / 2} r="1.2" className="route-dot" />)}
      </svg>
      {map.points.map((point, index) => <button key={`${day.day}-${point[0]}`} className={`map-node detail-node ${safeStop === index ? 'active' : ''}`} style={{left: `${point[1]}%`, top: `${point[2]}%`}} onClick={() => setSelectedStop(index)}>
        <i>{index + 1}</i><span>{point[0]}</span><small>{point[3]}</small>
      </button>)}
      <div className="selected-stop"><span>路线节点 {safeStop + 1}/{map.points.length}</span><strong>{map.points[safeStop][0]}</strong><small>{map.points[safeStop][3]} · 点击其他节点查看当日动线</small></div>
      <div className="map-legend"><span>实线 = 当日行进顺序</span><span>·</span><span>景点位置为路线级示意</span></div>
    </div>
  </div>
}

function RecommendationPanel({ day }) {
  const restaurants = dailyDining[day.day]
  return <div className="recommend-panel">
    <div className="recommend-title"><Utensils size={17}/><div><strong>当天顺路饭店</strong><small>价格均为人民币估算</small></div></div>
    <div className="restaurant-grid">{restaurants.map(([name, type, price, booking, url]) => <a href={url} target="_blank" rel="noreferrer" key={name}>
      <div><span>{type}</span><ExternalLink size={12}/></div><strong>{name}</strong><p>{price}</p><small>{booking}</small>
    </a>)}</div>
    <div className="stay-strip"><Hotel size={16}/><div><span>{day.day === 'D6' ? '返程日前一晚' : '当天住宿'}</span><strong>{day.day === 'D6' ? '继续住新宿，上午退房' : '新宿连住 · 不搬酒店'}</strong></div><p>首选 Century Southern Tower；预算优先选 Sunroute，景观优先选 Keio Plaza。</p></div>
  </div>
}

function App() {
  const [active, setActive] = useState(0)
  const [tier, setTier] = useState('value')
  const [expanded, setExpanded] = useState(null)
  const omakase = { value: 418, mid: 1136, high: 2019 }[tier]
  const omakaseLabel = { value: '亲民板前', mid: '中高端', high: '高端 + 服务费' }[tier]
  const localTotal = useMemo(() => 3350 + omakase, [omakase])

  useEffect(() => {
    if (!window.location.hash) return
    const timer = window.setTimeout(() => document.querySelector(window.location.hash)?.scrollIntoView(), 80)
    return () => window.clearTimeout(timer)
  }, [])

  return <main className="app-container">
    <div className="global-bg" style={{ backgroundImage: `url(${tokyoBg})` }} />
    <header className="hero" style={{ backgroundImage: `url(${fujiHero})` }}>
      <nav className="topbar">
        <a className="brand" href="#top"><span className="brand-mark">東</span><span>东京雪见</span></a>
        <div className="nav-links"><a href="#route">路线</a><a href="#days">日程</a><a href="#stay">住宿</a><a href="#budget">预算</a><a href="#notes">贴士</a></div>
        <button className="print-btn" onClick={() => window.print()}><Printer size={15}/>打印攻略</button>
      </nav>
      <div id="top" className="hero-inner">
        <div className="eyebrow"><Sparkles size={14}/> 2027 春节 · 六日四城 · 全页人民币</div>
        <h1>东京雪见<br/><em>Tokyo, in winter light.</em></h1>
        <p className="hero-copy">上海往返东京，四个完整日分别交给东京、箱根、镰仓与富士。以新宿为大本营，把换酒店的时间还给风景。</p>
        <div className="hero-stats">
          <div><span>日期</span><strong>02.08 → 02.13</strong><small>6 天 · 春节档</small></div>
          <div><span>航线</span><strong>上海 ⇄ 东京</strong><small>优先羽田 HND</small></div>
          <div><span>大本营</span><strong>新宿 · 5 晚</strong><small>三条近郊线直出</small></div>
          <div><span>核心体验</span><strong>4 个主题日</strong><small>城 · 山 · 海 · 富士</small></div>
          <div><span>每人总预算</span><strong>¥8,300–14,700</strong><small>人民币 · 含国际机票</small></div>
        </div>
      </div>
    </header>

    <section className="section intro">
      <div className="section-heading"><div><span className="kicker">ROUTE LOGIC</span><h2>为什么全程住新宿</h2></div><p>小田急去箱根、高速巴士去河口湖、JR 去镰仓；三条近郊线都能从新宿高效发车。东京市内日则用山手线连接秋叶原与原宿。</p></div>
      <div className="logic-grid">
        <div className="logic-main"><div className="logic-number">0</div><div><strong>次搬酒店</strong><p>每天轻装出发，省下至少 4–6 小时的收拾、寄存与入住成本。</p></div></div>
        <div className="logic-card"><TrainFront/><strong>箱根</strong><span>小田急 · 约 80 min</span></div>
        <div className="logic-card"><MapPin/><strong>河口湖</strong><span>高速巴士 · 约 1h45</span></div>
        <div className="logic-card"><Route/><strong>镰仓</strong><span>JR · 约 60 min</span></div>
      </div>
    </section>

    <section className="section preorder-section">
      <div className="section-heading"><div><span className="kicker">PRE-BOOKING · CNY</span><h2>先锁这 5 项</h2></div><p>机票与酒店决定成本，指定席与板前席决定体验。全表按人民币显示，未来班次与价格以 2027 年实际开放为准。</p></div>
      <div className="table-wrap"><table><thead><tr><th>项目</th><th>参考预算</th><th>建议时机</th><th>关键提醒</th></tr></thead><tbody>{preorder.map(row => <tr key={row[0]}>{row.map((cell, i) => <td key={cell} data-label={['项目','参考预算','建议时机','提醒'][i]}>{i===0 && <Check size={14}/>} {cell}</td>)}</tr>)}</tbody></table></div>
    </section>

    <section id="route" className="section route-section">
      <div className="section-heading"><div><span className="kicker">INTERACTIVE ROUTE</span><h2>城市总览 + 每日精细路线</h2></div><p>先看跨城位置关系，再切换日期查看当天景点顺序。总览图支持放大、缩小与拖动。</p></div>
      <OverviewMap active={active} setActive={setActive}/>
      <div className="daily-map-heading"><span>DAILY ROUTES</span><h3>逐日景点路线</h3><p>点击日期或地图节点，快速核对当天动线。</p></div>
      <div className="day-tabs">{days.map((day, i) => <button key={day.day} className={active === i ? 'active' : ''} onClick={() => setActive(i)}><span>{day.day}</span>{day.date}</button>)}</div>
      <RouteMap active={active}/>
      <div className={`focus-card tone-${days[active].tone}`}>
        <div className="focus-top"><div><span>{days[active].day} · {days[active].date} {days[active].weekday}</span><h3>{days[active].title}</h3><p>{days[active].subtitle}</p></div><div className="focus-total"><span>当日个人预算</span><strong>{days[active].total}</strong></div></div>
        <div className="focus-tags">{days[active].tags.map(tag => <span key={tag}>{tag}</span>)}<span><TrainFront size={13}/>{days[active].transit}</span></div>
        <Timeline day={days[active]}/>
        <RecommendationPanel day={days[active]} />
        <div className="day-note"><Info size={16}/><span>{days[active].note}</span><a href={days[active].source} target="_blank" rel="noreferrer">官方参考 <ExternalLink size={13}/></a></div>
      </div>
    </section>

    <section id="days" className="section all-days">
      <div className="section-heading"><div><span className="kicker">6 DAYS BREAKDOWN</span><h2>六日卡片总览</h2></div><p>展开任一天查看详细时刻；现场照着时间块走，也可以直接打印。</p></div>
      <div className="day-grid">{days.map((day, i) => <article className={`day-card ${expanded === i ? 'expanded' : ''}`} key={day.day}>
        <button className="day-card-head" onClick={() => setExpanded(expanded === i ? null : i)}>
          <span className={`day-chip ${day.tone}`}>{day.day}</span><span className="day-date">{day.date}<small>{day.weekday}</small></span><ChevronDown className="chevron" size={18}/>
        </button>
        <h3>{day.title}</h3><p>{day.subtitle}</p>
        <div className="mini-route"><Route size={14}/>{day.transit}</div>
        <div className="mini-stops">{day.stops.slice(0, expanded === i ? day.stops.length : 3).map(stop => <div key={stop.time}><time>{stop.time.split('–')[0]}</time><span>{stop.name}</span><b>{stop.fee}</b></div>)}</div>
        <button className="expand-btn" onClick={() => {setExpanded(expanded === i ? null : i); setActive(i)}}>{expanded === i ? '收起详情' : `展开全部 ${day.stops.length} 项`} <ArrowRight size={14}/></button>
      </article>)}</div>
    </section>

    <section id="stay" className="section hotel-section">
      <div className="section-heading"><div><span className="kicker">WHERE TO STAY</span><h2>新宿连住的三档选择</h2></div><p>每天不换酒店更适合这条放射状路线。价格为 2027 春节档人民币规划区间，实际下单时复核。</p></div>
      <div className="hotel-grid">{hotels.map(([level,name,location,price,url], index) => <a href={url} target="_blank" rel="noreferrer" key={name} className={index === 1 ? 'recommended' : ''}>
        <div className="hotel-level">{index === 1 && <Sparkles size={13}/>} {level}</div><h3>{name}</h3><p><MapPin size={14}/>{location}</p><strong>{price}</strong><span>查看官网 <ExternalLink size={12}/></span>
      </a>)}</div>
      <div className="hotel-note"><Hotel size={18}/><div><strong>想把箱根改成住一晚？</strong><p>Aura Tachibana 约 ¥1,800–3,000/间夜；强罗雪月花约 ¥2,200–3,800/间夜。主方案仍建议新宿连住。</p></div></div>
    </section>

    <section id="budget" className="budget-section">
      <div className="section budget-inner">
        <div className="budget-copy"><span className="kicker light">BUDGET LAB</span><h2>一顿 Omakase，决定预算的浪漫程度</h2><p>以下为每人日本当地消费估算，不含国际机票与购物。交通已按推荐票券组合，住宿按双人入住分摊。</p>
          <div className="tier-switch">
            {[['value','亲民 ¥418'],['mid','中高端 ¥1,136'],['high','高端 ¥2,019']].map(([key,label]) => <button key={key} className={tier===key?'active':''} onClick={() => setTier(key)}>{label}</button>)}
          </div>
          <div className="budget-total"><span>日本当地预算 · {omakaseLabel}</span><strong>约 ¥{localTotal.toLocaleString()}</strong><small>人民币估算 · 日元原价按 100 日元 ≈ 4.37 元换算</small></div>
        </div>
        <div className="budget-breakdown">
          {[['住宿分摊','¥1,500–4,200','5 晚新宿'],['地面交通','约 ¥920','机场 + 三条近郊'],['景点门票','约 ¥140','含雕刻之森与可选缆车'],['普通餐食','约 ¥790','不含 omakase'],['Omakase',`¥${omakase.toLocaleString()}`,omakaseLabel]].map(([name,price,sub],i)=><div key={name}><span className="budget-index">0{i+1}</span><div><strong>{name}</strong><small>{sub}</small></div><b>{price}</b></div>)}
        </div>
      </div>
    </section>

    <section id="notes" className="section notes-section">
      <div className="section-heading"><div><span className="kicker">FIELD NOTES</span><h2>出发前最后看一遍</h2></div><p>这六条比“多塞一个景点”更重要。</p></div>
      <div className="notes-grid">{notes.map(([title,text,Icon])=><article key={title}><div className="note-icon"><Icon size={20}/></div><h3>{title}</h3><p>{text}</p></article>)}</div>
      <div className="disclaimer"><Info size={18}/><p><strong>价格口径：</strong>交通与景点为 2026 年 9 月查得的官方公开价，用于规划 2027 年 2 月行程；日本交通票价、营业时间、班次与航班可能调整。建议出发前 2 周逐项复核。机票、住宿与餐饮为预算区间，不代表锁价。</p></div>
    </section>

    <footer><div><span className="brand-mark">東</span><strong>东京雪见 · 2027 春节六日行</strong></div><p>上海 ⇄ 东京 · 新宿大本营 · 最后更新 2026.09.08</p><a href="#top">回到顶部 ↑</a></footer>
  </main>
}

export default App
