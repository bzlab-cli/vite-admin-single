/*
 * @Author: jrucker
 * @Description:
 * @Date: 2021/10/25 18:56:51
 * @LastEditors: jrucker
 * @LastEditTime: 2022/11/22 18:33:35
 */

/**
 * 加载组件
 * @param {*} view
 * @returns
 */
const modules = import.meta.glob('/src/views/**/*.vue')

/**
 * 过滤显示菜单路由
 * @param {*} routers
 * @param {*} isRewrite
 * @returns
 */
export const filterAsyncRouter = (routers, layout) => {
  // 遍历后台传来的路由字符串，转换为组件对象
  return routers.filter(item => {
    item.path = item.menuUrl
    if (item.menuComponents === 'Layout') {
      item.redirect = 'noredirect'
    }

    item.meta = {
      title: item.menuName,
      icon: item.menuIcon,
      hidden: item.hiddenFlag === 0
    }

    if (item.menuType === 1) {
      item.meta.alwaysShow = true
    }

    if (item.menuComponents) {
      if (item.menuComponents === 'Layout') {
        item.component = layout
      } else {
        item.name = item.menuRoute
        item.component = modules['/src/views/' + item.menuComponents]
      }
    }

    if (item.childTreeList && item.childTreeList.length) {
      console.log('333')

      item.children = filterAsyncRouter(item.childTreeList, layout)
    }

    filterProps(item)
    return true
  })
}

/**
 * 过滤不需要的属性
 * @param {*} item
 */
function filterProps(item) {
  const filterPropsList = [
    'childTreeList',
    'id',
    'menuSort',
    'createUser',
    'menuComponents',
    'menuIcon',
    'menuName',
    'menuRoute',
    'menuSource',
    'menuUrl',
    'parentId',
    'remarks',
    'createTime',
    'updateTime',
    'updateUser'
  ]
  filterPropsList.map(name => {
    delete item[name]
  })
}
