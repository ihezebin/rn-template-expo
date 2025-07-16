export const enum UserType {
  PASSENGER = 'passenger', // 乘客
  DRIVER = 'driver', // 司机
  ADMIN = 'admin', // 管理员
  SYSTEM = 'system', // 系统账户
}

export interface User {
  id: string
  username: string
  phone?: string
  created_at: number
  updated_at: number
  deleted_at: number
  avatar: string
  type: UserType[]
  real_name: string // 真实姓名
  id_card: string // 身份证号
  id_card_front_url: string // 身份证正面
  id_card_back_url: string // 身份证反面
  wx_openid?: string
  driving_years?: number
  order_count?: number
}
