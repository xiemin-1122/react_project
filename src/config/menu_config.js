// 项目的菜单配置
import { HomeOutlined,AppstoreOutlined,BarsOutlined,ToolOutlined,
    UserOutlined,SafetyOutlined,AreaChartOutlined,BarChartOutlined,LineChartOutlined,
    PieChartOutlined,WindowsOutlined} from '@ant-design/icons';
const menuList = [
    {
      title: '首页', // 菜单标题名称
      key: 'home', // 对应的key
      path:'/admin/home', //对应的path
      icon: <HomeOutlined />, // 图标名称
      isPublic: true, // 公开的
    },
    {
      title: '商品',
      key: 'prod_about',
      icon: <AppstoreOutlined />,
      children: [ // 子菜单列表
        {
          title: '品类管理',
          key: 'category',
          path:'/admin/prod_about/category',
          icon: <BarsOutlined />,
        },
        {
          title: '商品管理',
          key: 'product',
          path:'/admin/prod_about/product',
          icon: <ToolOutlined/>
        },
      ]
    },
  
    {
      title: '用户管理',
      key: 'user',
      path:'/admin/user',
      icon: <UserOutlined/>
    },
    {
      title: '角色管理',
      key: 'role',
      path:'/admin/role',
      icon: <SafetyOutlined/>,
    },
  
    {
      title: '图形图表',
      key: 'charts',
      icon: <AreaChartOutlined />,
      children: [
        {
          title: '柱形图',
          key: 'bar',
          path:'/admin/charts/bar',
          icon: <BarChartOutlined />
        },
        {
          title: '折线图',
          key: 'line',
          path:'/admin/charts/line',
          icon: <LineChartOutlined />
        },
        {
          title: '饼图',
          key: 'pie',
          path:'/admin/charts/pie',
          icon: <PieChartOutlined />
        },
      ]
    },
  
    
  ]
  
  export default menuList