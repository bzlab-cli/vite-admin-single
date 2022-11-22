/*
 * @Author: jrucker
 * @Description:
 * @Date: 2021/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2022/11/22 17:57:52
 */

import ElementPlus from 'element-plus'
import 'element-plus/lib/theme-chalk/index.css'
import zhCn from 'element-plus/es/locale/lang/zh-cn'
import { useAppStore } from '@/store/modules/app'

export default function loadComponent(app: any) {
  app.use(ElementPlus, { size: useAppStore().size, locale: zhCn })
}
