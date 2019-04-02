import axios from 'axios'
import Cookies from 'js-cookie'

import {
  Message
} from 'element-ui'
import {
  getLang
} from './utils'
var message_arr = [
  "UNDEFINE_ERROR",
  "PARAMS_ERROR",
  "LANG_NO_LOGIN",
  "LANG_SMSCODE_ERR_TIP",
  "LANG_SMSCODE_NULL_TIP",
  "LANG_SEC_PWD_TIP",
  "LANG_GOOGLE_CODE_NULL",
  "LANG_GOOGLE_CODE_ERROR",
  "LANG_AUTH_IDENTITY_FIRST",
  "LANG_MAIL_NULL_TIP",
  "LANG_PWD_NULL_TIP",
  "LANG_ALREADY_REG_FINDPWD",
  "LANG_ACCOUNT_LOCKED",
  "LANG_PLEASE_LOGIN_AFTER_REGISTRATION",
  "LANG_OLD_PWD_ERR_TIP",
  "LANG_PWD_SAME_TIP",
  "LANG_ILLEGAL_FROM",
  "LANG_M_NAME_ERROR_TIP",
  "LANG_ILLEGAL_CHECK_CODE",
  "LANG_ILLEGAL_GT_CHECK_CODE",
  "LANG_ACCOUNT_NOT_EXIST",
  "LANG_MAIL_FAIL",
  "LANG_OLD_GOOGLE_CODE_ERROR",
  "LANG_UNDEFINED_ERROR",
  "LANG_ALI_OSS_ERROR",
  "LANG_ID_NUM_ALREADY_EXIST",
  "LANG_AUTH_IDENTITY_SUB_SUCCESS",
  "LANG_ILLEGAL_ID",
  "LANG_API_TOKEN_NOT_EXIST",
  "LANG_API_LABEL_ERR",
  "LANG_API_PRIVILEGE_ERR",
  "LANG_INVALID_NAME",
  "LANG_ILLEGAL_CURRENCY",
  "LANG_CANNOT_WITHDRAW",
  "LANG_ILLEGAL_ADDRESS",
  "LANG_WITHDRAW_ADDR_NULL_TIP",
  "LANG_WITHDRAW_LABEL_NULL_TIP",
  "LANG_ILLEGAL_AMOUNT",
  "LANG_WITHDRAW_AMOUNT_MIN_THAN_MIN_TIP",
  "LANG_STOP_EX",
  "LANG_ILLEGAL_WITHDRAW_ID",
  "LANG_ILLEGAL_WITHDRAW_STATUS",
  "LANG_REPEAT_ADDRESS",
  "LANG_ILLEGAL_STATUS",
  "LANG_ILLEGAL_REJECT_REASON",
  "LANG_ILLEGAL_TRADE_PAIR",
  "LANG_ORDER_DOES_NOT_EXIST",
  "LANG_MARKET_ORDER_CANNOT_BE_CANCELLED",
  "LANG_ORDER_IS_DONE_OR_CANCELED",
  "LANG_ILLEGAL_SYMBOL",
  "LANG_ILLEGAL_ORDER_ID",
  "LANG_ILLEGAL_PRICE",
  "LANG_ILLEGAL_O_PRICE_TYPE",
  "LANG_ILLEGAL_O_TYPE",
  "LANG_ILLEGAL_SOURCE",
  "LANG_SYMBOL_NOT_OPEN_TRADE_RANK",
  "LANG_SYMBOL_OPEN_TRADE_RANK",
  "LANG_ILLEGAL_ADS_TYPE",
  "LANG_SYMBOL_NOT_TRADE_RANK_DATA",
  "LANG_TRADE_RANK_NOT_END_NOT_REWORD",
  "LANG_REWORD_HAS_SEND",
  "PASSWORD_ERROR",
  "LANG_INVALID_EMAIL_OR_PASSWORD",
  "API_ACCESS_COUNT_MAX",
  "LANG_API_COUNT_MAX_3",
  "API_NOT_EXISTS",
  "LANG_ILLEGAL_IP",
  "API_NO_PRIVILEGE",
  "LANG_LITTLE_THAN_MIN_BUYVOLUME_TIP",
  "LANG_LITTLE_THAN_MIN_BUYAMOUNT_TIP",
  "LANG_LITTLE_THAN_MIN_SELLVOLUME_TIP",
  "NOT_SUFFICIENT_FUNDS",
  "LANG_ERROR_A_TYPE",
  "LANG_ORDER_NOT_EXISTS",
  "LANG_ORDER_ALREADY_CONFIRMED",
  "LANG_ILLEGAL_ADS_ID",
  "LANG_ILLEGAL_ACCOUNT_TYPE",
  "LANG_WAITING_ORDER_CONFIRM_MAX_THAN_2",
  "LANG_WAITING_ORDER_MAX_THAN_2",
  "LANG_ACCOUNT_HAS_PROBLEM",
  "LANG_POOL_NO_ADDRESS_EXISTS",
  "LANG_ADDRESS_ALREADY_EXISTS",
  "LANG_WITHDRAW_STATUS_IS_NOT_WATTING",
  "LANG_CREATE_ORDER_FAIL",
  "LANG_ACCOUNT_FUNDS_PROBLEM",
  "LANG_CANCEL_ORDER_ERROR",
  "LANG_ORDER_TRADE_ERROR",
  "LANG_FIND_CONDITION_NOT_NULL",
  "PASSWORD_ERROR",
  "PLEASE_SELECT_CURRENCY",
  "TRADE_AREA_HAS_NUMBER_ONE_SYMBOL",
  "BASE_CURRENCY_NOT_EXISTS",
  "QUOTE_CURRENCY_NOT_EXISTS",
  "ACCESS_HAS_BEEN_DENIED",
  "DEL_COLUMN_TIP",
  "SEND_AUDIT_ARTICLE_TIP",
  "AUDIT_ARTICLE_TIP",
  "BASE_AND_QUOTE_CURRENCY_NOT_CONSISTENT",
  "ORDER_STATUS_NOT_CONFIRM",
  "ADS_HAS_USED_NOT_DELETE",
  "ACCOUNT_HAS_LOCKED",
  "ACCOUNT_OR_PASSWORD_ERROR",
  "LOGIN_INFO_ERROR",
  "PLEASE_SELECT_SYMBOL",
  'TOKEN_NOT_EXISTS',
  "LANG_LIMIT_FREQUENCY_OPERTION",
  "LANG_SMSCODE_EXPIRE_TIP",
  "LANG_LOGIN_TOKEN_EXPIRE",
  "LANG_DATA_TOO_LONG",
  "LANG_DATA_TOO_BIG",
  "LANG_DATA_ERROR",
  "LANG_REQ_METHOD_NOT_EXIST",
  "LANG_CAST_TYPE_EXCEPTION",
  "LANG_REQ_PARAM_ERROR",
  "LANG_LIMIT_OPERTION"
];
var message_arr_zh = [
  "未知错误",
  "参数错误",
  "请先登录",
  "验证码错误",
  "验证码必填",
  "资金密码错误",
  "谷歌验证码为空",
  "谷歌验证码错误",
  "请先完成实名认证",
  "请输入邮箱",
  "请输入密码",
  "该账号已注册",
  "该账号已锁定",
  "该账号未完成注册",
  "原密码错误",
  "安全密码和登录密码不能一致",
  "请求来源非法",
  "账号格式错误",
  "图片验证码错误",
  "按钮证码错误",
  "账号不存在",
  "发送验证码失败",
  "原谷歌验证码错误",
  "原谷歌验证码错误",
  "获取上传信息失败",
  "证件号已经存在",
  "身份认证申请提交成功",
  "错误的ID",
  "ApiToken不存在",
  "Api标签不能为空",
  "Api权限不能为空",
  "请输入用户名",
  "不存在的币种",
  "暂停提现",
  "不存在的地址",
  "提现地址必填",
  "提现标签必填",
  "错误的数量",
  "提现金额小于最低提现额",
  "暂停交易",
  "错误的提现ID",
  "提现状态不为待处理，不能取消",
  "重复添加地址",
  "错误的提现状态",
  "拒绝提现",
  "错误的交易对",
  "订单不存在",
  "市价单不允许取消",
  "订单已成交或已经取消",
  "错误的交易对",
  "错误的订单ID",
  "错误的价格",
  "错误的价格类型",
  "错误的订单类型",
  "错误的订单来源",
  "该交易对没有开启交易排名",
  "该交易对已开启交易排名",
  "广告类型错误",
  "该交易对没有交易排名数据",
  "交易排名没有结束不能发送奖励!",
  "该交易排名奖励已发放不能重复发送!",
  "对不起您输入的当前密码有误！",
  "账号或密码错误",
  "api访问过于频繁",
  "api数量不能超过3个",
  "api不存在",
  "ip地址不合法",
  "api没有权限",
  "数量小于最小买入数量",
  "总额小于最小买入总额",
  "数量小于最小卖出数量",
  "账户资金不足",
  "错误的账户类型(只支持 银行卡 支付宝 微信)",
  "订单不存在",
  "订单不是待付款状态",
  "广告ID不存在",
  "请完善对应的收款设置",
  "超过两个订单待处理，不能再添加新订单",
  "超过两个订单未付款，不能再添加新订单",
  "该用户账户可疑，冻结余额大于总金额",
  "该币种地址不存在",
  "该币种地址已存在",
  "提现正在处理中",
  "创建订单失败",
  "账户资金错误",
  "取消订单异常",
  "订单交易异常",
  "查询条件不能为空",
  "对不起，您输入的当前密码有误！",
  "请选择币种！",
  "该交易区已有排名第一的交易!",
  "基础货币不存在!",
  "基础货币不存在!",
  "您没有访问此页面的权限！",
  "本栏目已经使用，不能删除，您可以修改它的是否启用为“否”！",
  "只有状态为新建的文章才可以送审，修改文章可以使文章状态变成新建！",
  "只有状态为待审核的文章才可以审核！",
  "基础货币和计价货币不能一致 ！",
  "该订单状态不为未确认 ！",
  "本广告主已经使用，不能删除！",
  "对不起，您的账号已被锁定,请与管理员联系！",
  "您输入的用户名或密码错误！",
  "用户登录信息错误！",
  "请选择交易对！",
  "登录出错，请重新登录",
  "短信操作过于频繁，请稍后再试！",
  "验证码已失效! ",
  "页面失效，请重新登录！",
  "数据太长！",
  "数据太大！",
  "数据异常！",
  "请求的方法不存在！",
  "类型转换错误！",
  "请求参数类型不正确！",
  "已经达到操作限制，不能进行操作"
];
var message_arr_en = [
  'unknown mistake',
  'Parameter error',
  'please log in first',
  'Verification code error',
  'Verification code required',
  'Capital password error',
  'Google verification code is empty',
  'Google verification code error',
  'Please complete the real name certification first.',
  'please input your email',
  'Please enter your password',
  'This account is already registered',
  'The account is locked',
  'The account has not been registered',
  'The original password is wrong',
  'The security password and login password cannot be the same.',
  'Illegal request source',
  'Account format error',
  'Image verification code error',
  'Button certificate error',
  'Account does not exist',
  'Send verification code failed',
  'Original Google verification code error',
  'Original Google verification code error',
  'Failed to get upload information',
  'The document number already exists',
  'Successfully submitted the identity application',
  'Wrong ID',
  'ApiToken does not exist',
  'Api tag cannot be empty',
  'Api permission cannot be empty',
  'please enter user name',
  'Non-existent currency',
  'Suspension withdrawal',
  'Address that does not exist',
  'Cash withdrawal address is required',
  'Cash withdrawal label is required',
  'Number of errors',
  'The amount of cash raised is less than the minimum withdrawal amount',
  'Suspend trading',
  'Wrong withdrawal ID',
  'The withdrawal status is not pending and cannot be cancelled.',
  'Repeat adding addresses',
  'Wrong withdrawal status',
  'Refuse to withdraw cash',
  'Wrong transaction pair',
  'Order does not exist',
  'Market order is not allowed to cancel',
  'Order has been cancelled or cancelled',
  'Wrong transaction pair',
  'Bad order ID',
  'Wrong price',
  'Wrong price type',
  'Wrong order type',
  'Wrong order source',
  'The transaction does not open the transaction ranking',
  'The transaction ranks the opened trades',
  'Ad type error',
  'The transaction has no transaction ranking data',
  'The transaction ranking is not over and the reward cannot be sent.',
  'The transaction ranking award has been issued and cannot be sent repeatedly',
  'Sorry, the current password you entered is incorrect!',
  'Incorrect username or password',
  'Api access is too frequent',
  'The number of apis cannot exceed 3',
  'Api does not exist',
  'Ip address is illegal',
  'Api does not have permission',
  'The quantity is less than the minimum purchase quantity',
  'Total is less than the minimum purchase amount',
  'The quantity is less than the minimum sold quantity',
  'Insufficient account funds',
  'Wrong account type (only support bank card Alipay WeChat)',
  'Order does not exist',
  'Order is not pending status',
  'Ad ID does not exist',
  'Please improve the corresponding payment settings',
  'More than two orders are pending, no new orders can be added',
  'More than two orders have not been paid, no new orders can be added',
  'The user account is suspicious and the frozen balance is greater than the total amount',
  'The currency address does not exist',
  'The currency address already exists',
  'Withdrawal is in progress',
  'Create order failed',
  'Account funding error',
  'Cancel order exception',
  'Order transaction is abnormal',
  'The query condition cannot be empty',
  'Sorry, the current password you entered is incorrect!',
  'Please choose a currency!',
  'The trading zone has the number one trade',
  'Base currency does not exist',
  'Base currency does not exist',
  'You do not have permission to access this page!',
  'This section is already in use and cannot be deleted. You can modify whether it is enabled as "No"!',
  'Only articles with a new status can be submitted for review. Modifying an article can make the status of the article new!',
  'Only articles with a status of pending review can be reviewed!',
  'The base currency and the denomination currency are not consistent',
  'The order status is not unconfirmed',
  'This advertiser has been used and cannot be deleted!',
  'Sorry, your account has been locked.',
  'The username or password you entered is incorrect!',
  'User login information is wrong!',
  'Please choose the deal pair!',
  'Login error, please log in again',
  'SMS operation is too frequent, please try again later!',
  'Verification code has expired',
  'The page is invalid, please log in again',
  'The data is too long!',
  'The data is too big!',
  'The data is abnormal!',
  'The requested method does not exist!',
  'Type conversion error!',
  'Request parameter type is incorrect!',
  'The operating limit has been reached and cannot be operated'
];

var service = axios.create({

  withCredentials: true,
  // headers: {
  //   'Access-Control-Allow-Origin': 'http://localhost:8080'
  // }

})

service.interceptors.request.use(
  config => {
    config.headers['ZZEX_TOKEN'] = Cookies.get('ZZEX_TOKEN')
    return config
  },

)

service.interceptors.response.use(
  response => {
    let lang = getLang()
    if (!lang) {
      lang = 'zh'
    }
    if (response.data) {
      const res = response.data
      if (res.success === 1) {
        return res
      }
      if (res.state === 1) {
        return response.data
      } else if (res.state === -1) {
        if (res.msg === 'LANG_NO_LOGIN') {
          return res
        }
        let index = message_arr.indexOf(res.msg)
        if (lang == 'zh') {
          Message({
            message: message_arr_zh[index],
            type: 'error',
            duration: 3000,
            showClose: true
          })
        } else {
          Message({
            message: message_arr_en[index],
            type: 'error',
            duration: 3000,
            showClose: true
          })
        }

        return res
      } else {
        return res
      }
    } else {
      return response.data
    }
  },
  error => {
    // for debug
    // Message({
    //   message: error.message,
    //   type: 'error',
    //   duration: 5 * 1000
    // })
    return Promise.reject(error)
  }
)

export default service