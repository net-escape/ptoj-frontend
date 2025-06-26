import type { RouteRecordRaw } from 'vue-router'

import ContestList from '@/views/ContestList.vue'
import Contest from '@/views/Contest/Contest.vue'
import ContestOverview from '@/views/Contest/ContestOverview.vue'
import ContestProblem from '@/views/Contest/ContestProblem.vue'
import ContestRanklist from '@/views/Contest/ContestRanklist.vue'
import ContestStatus from '@/views/Contest/ContestStatus.vue'
import ContestSubmit from '@/views/Contest/ContestSubmit.vue'

const ContestCreate = () => import('@/views/Admin/ContestCreate.vue')
const ContestEdit = () => import('@/views/Contest/ContestEdit.vue')

const contestRoutes: Array<RouteRecordRaw> = [
  {
    path: '/contest',
    name: 'contestList',
    component: ContestList,
    meta: { title: 'Contest List' },
  },
  {
    path: '/contest/create',
    name: 'contestCreate',
    component: ContestCreate,
    meta: { title: 'Admin', requiresAdmin: true },
  },
  {
    path: '/contests/:cid',
    component: Contest,
    meta: { requiresLogin: true },
    children: [
      {
        path: '',
        name: 'contestOverview',
        component: ContestOverview,
        meta: { title: 'Contest Info', requiresLogin: true },
      },
      {
        path: 'problem/:id',
        name: 'contestProblem',
        component: ContestProblem,
        meta: { title: 'Contest Info', requiresLogin: true },
      },
      {
        path: 'problem/:id/submit',
        name: 'contestSubmit',
        component: ContestSubmit,
        meta: { title: 'Contest Info', requiresLogin: true },
      },
      {
        path: 'status',
        name: 'contestStatus',
        component: ContestStatus,
        meta: { title: 'Contest Info', requiresLogin: true },
      },
      {
        path: 'ranklist',
        name: 'contestRanklist',
        component: ContestRanklist,
        meta: { title: 'Contest Info', requiresLogin: true },
      },
      {
        path: 'edit',
        name: 'contestEdit',
        meta: { title: 'Admin', requiresAdmin: true },
        component: ContestEdit,
      },
    ],
  },
]

export default contestRoutes
