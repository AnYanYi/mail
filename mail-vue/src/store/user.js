import { defineStore } from 'pinia'
import {loginUserInfo} from "@/request/my.js";

/**
 * 用户状态管理 Store
 * 管理当前登录用户的信息和状态
 */
export const useUserStore = defineStore('user', {
    state: () => ({
        user: {},
        refreshList: 0,
    }),
    actions: {
        refreshUserList() {
            loginUserInfo().then(user => {
                this.refreshList ++
            })
        },
        refreshUserInfo() {
            loginUserInfo().then(user => {
                this.user = user
            })
        }
    }
})