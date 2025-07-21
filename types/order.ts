import { UserType, User } from './user'

export const enum OrderStatus {
  PENDING = 'pending', // 待接单
  ACCEPTED = 'accepted', // 已接单
  ARRIVED_PASSENGER_POSITION = 'arrived_passenger_position', // 司机到达乘客位置
  PICKUP_PASSENGER = 'pickup_passenger', // 司机接到乘客
  DRIVING = 'driving', // 司机开始行驶
  ARRIVED_DESTINATION = 'arrived_destination', // 司机到达目的地
  CANCELED = 'canceled', // 订单取消
  PRE_PAY = 'pre_pay', // 待支付
  PAID = 'paid', // 支付完成
  PAY_FAILED = 'pay_failed', // 支付失败
  PAY_EXPIRED = 'pay_expired', // 支付过期
  PAY_REFUNDED = 'pay_refunded', // 支付退款
}

// 订单类型 OrderType
export const enum OrderType {
  IMMEDIATE = 'immediate', // 即时订单
  HELPCALL = 'helpcall', // 帮人叫车
  CALLMULTI = 'callmulti', // 叫多辆车
  DELIVERY = 'delivery', // 取送车
  ROUNDTRIP = 'roundtrip', // 接送
  APPOINTMENT = 'appointment', // 预约
}

// 实际价格明细
export interface ActualPrice {
  price_rule: PriceRule
  total_price: number // 总价
  base_price: number // 起步价
  distance_price: number // 里程费
  is_long_distance: boolean // 是否远途
  long_distance_price: number // 远途费
  wait_price: number // 等待费
  cancel_price: number // 取消费
  is_temp_adjust_price: boolean // 是否临时调价
  temp_adjust_price: number // 临时调价金额
  append_prices: number[] // 追加金额
}

// 取消信息
export interface Cancel {
  canceled: boolean
  cancel_by_user_id: string // 取消人
  cancel_timestamp: number // 取消时间
  cancel_reason: string // 取消原因
  cancel_by_user_type: UserType
}

// 订单信息
export interface Order {
  id: string
  wx_transaction_id: string // 微信支付订单号
  user_id: string // 下单用户id
  route: DrivingRoute // 路线
  estimated_price: number // 预估价格（单位：分）
  actual_price: ActualPrice // 实际价格
  estimated_duration_second: number // 预估时长（单位：秒）
  actual_duration_second: number // 实际时长（单位：秒）
  estimated_distance_meter: number // 预估距离（单位：米）
  actual_distance_meter: number // 实际距离（单位：米）
  status: OrderStatus // 状态
  created_at: number // 创建时间
  updated_at: number // 更新时间
  driver_id: string // 司机id
  driver: User
  passenger_name: string // 乘客姓名
  passenger_phone: string // 乘客电话
  departure_timestamp: number // 计划出发时间
  arrival_timestamp: number // 计划到达时间
  cancel: Cancel
  type: OrderType // 订单类型
  pay_success_time: string // 支付完成时间
  passenger_place_order_timestamp: number // 乘客下单时间
  driver_accept_order_timestamp: number // 司机接单时间
  driver_arrived_passenger_position_timestamp: number // 司机到达乘客位置时间
  driver_pickup_passenger_timestamp: number // 司机接到乘客时间
  driver_start_driving_timestamp: number // 司机开始行驶时间
  driver_arrived_destination_timestamp: number // 司机到达目的地时间
}

// 路线信息
export interface DrivingRoute {
  src_latitude?: number
  src_longitude?: number
  src_name?: string
  dest_latitude?: number
  dest_longitude?: number
  dest_name?: string
}

export interface PriceRule {
  start_hour: number
  start_minute: number
  start_second: number
  end_hour: number
  end_minute: number
  end_second: number
  base_distance_km: number // 起步距离
  base_price: number // 起步价格
  per_km_price: number // 每公里价格
  wait_price_base_minute: number // 等待费起步时间
  wait_price_per_minute_price: number // 等待费每分钟价格
  long_distance_base_km: number // 远途起步公里数
  long_distance_fee_ratio: number // 远途费比例百分比, 0~100，保留整数
  cancel_price_base_minute: number // 取消费起步接单分钟
  cancel_price_per_minute_price: number // 取消费每分钟价格
  cancel_price_max_limit: number // 取消费最大限制
  temp_price_ratio: number // 临时调价比例
  temp_adjust_reason: string
}

export interface DeliveryInfo {
  src_contact_name: string
  src_contact_phone: string
  dest_contact_name: string
  dest_contact_phone: string
}
