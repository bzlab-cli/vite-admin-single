/*
 * @Author: jrucker
 * @Description:
 * @Date: 2021/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2022/08/25 10:29:55
 */

import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useStore } from '@/store'

export default function loadComponent(app: any) {
  app.use(ElementPlus, { size: useStore().state.app.size, locale: zhCn })
}
