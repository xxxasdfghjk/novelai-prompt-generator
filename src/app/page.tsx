import HeaderMenu from '@/uiparts/HeaderMenu'
import SideBar from '@/uiparts/SideBar'
import VariableTypeList from '@/uiparts/VariableTypeList'
import Content from '@/uiparts/Content'
export default function Home() {
  return (
    <section className="flex flex-row justify-center">
      <SideBar title="Variable Type List">
        <VariableTypeList />
      </SideBar>
      <Content>
        <HeaderMenu />
      </Content>
    </section>
  )
}
