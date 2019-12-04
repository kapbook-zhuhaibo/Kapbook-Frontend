// ref: https://umijs.org/config/
export default {
    treeShaking: true,
    cssLoaderOptions:{
        localIdentName:'[local]'
    },
    routes: [
        {
            path: '/', component: '../layouts/index',
            routes: [
                {
                    path: '/',
                    component: '../pages/index',
                },
                {
                    path: '/equityPlan',
                    component: '../pages/equityPlan',
                    routes:[
                        {path: '/equityPlan/Details', component: '../pages/equityPlan/details'},
                        {path: '/equityPlan/equityPool', component: '../pages/equityPlan/equityPool'},
                        {path: '/equityPlan/template', component: '../pages/equityPlan/template'},
                        {path: '/equityPlan/exercise', component: '../pages/equityPlan/exercise'}
                    ]
                }
            ],
        }
    ],
    plugins: [
        [ 'umi-plugin-react',
            {
                antd: true,
                dva: true,
                dynamicImport: { webpackChunkName: true },
                title: 'Kapbook-Frontend',
                dll: false,
                routes: {
                    exclude: [
                        /models\//,
                        /services\//,
                        /model\.(t|j)sx?$/,
                        /service\.(t|j)sx?$/,
                        /components\//,
                    ],
                },
            },
        ],
    ],
    theme: { "primary-color": "#4d9edb" },
    proxy: {
        '/api': {
          target: 'http://web.kapbook.com',
          pathRewrite: { '^/api': '' },
          changeOrigin: true
        }
    },
};
