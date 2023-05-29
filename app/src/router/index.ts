import { createRouter, createWebHashHistory, RouteRecordRaw } from "vue-router"

const routes: Array<RouteRecordRaw> = [
    {
        path: "/",
        redirect: "/home",
        component: () => import("../layout/layout.vue"),
        children: [
            {
                path: "/home",
                name: "home",
                component: () => import("../views/home.vue")
            },
            {
                path: "/settings",
                name: "settings",
                component: () => import("../views/settings.vue")
            },
        ]
    }
]

const router = createRouter({
    history: createWebHashHistory(),
    routes,
})

router.beforeEach(() => {
    setTimeout(() => {
        window.scrollTo(0, 0)
    }, 100)
})

export default router