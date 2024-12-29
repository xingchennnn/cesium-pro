import { NavigationEnum, TabType } from '@/enums/TabTypeEnums';
import { defineStore } from 'pinia'
/**
 * 面板管理状态机
 */
export const usePanelStore = defineStore('panel', {
    state: () => ({
        /**
         * 当前面板
         */
        currentPanel: NavigationEnum.SHARED_WORKSTATIONS, //默认面板
        /**
         * 当前TAB
         */
        currentTab: TabType.SERVICE_APPOINTMENT, // 默认tab
    }),
    actions: {
        setCurrentPanel(panel: NavigationEnum) {
            this.currentPanel = panel;
        },
        setCurrentTab(tab: TabType) {
            this.currentTab = tab;
        }
    },
    getters: {
        getCurrentPanel: (state) => {
            return state.currentPanel;
        },
        getCurrentTab: (state) => {
            return state.currentTab;
        }
    },
});