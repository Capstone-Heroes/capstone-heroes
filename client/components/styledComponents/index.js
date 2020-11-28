import styled from 'styled-components'

export const Card = styled.div`
  box-shadow: 4px 4px 3px #f6f6f3;
  border-radius: 16px;
  border: 1px solid #e4e4dc;
  padding: 10px;
`

export const Container = styled.div`
  display: flex;
  padding: 8px;
`

export const ThreeQuartContainer = styled(Container)`
  width: 85%;
  align-self: center;
`

export const RowContainer = styled(Container)`
  flex-flow: row wrap;
`

export const ColumnContainer = styled(Container)`
  flex-flow: column nowrap;
  flex: 0 1 50%;
`

export const Sidebar = styled(ColumnContainer)`
  flex: 0 2 25%;
  padding-right: 30px;
`

export const SidebarRight = styled(Sidebar)`
  padding-left: 50px;
  padding-right 10px;
`

