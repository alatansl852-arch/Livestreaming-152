import Sidebar from '../Sidebar';

export default function SidebarExample() {
  return (
    <div className="h-screen">
      <Sidebar onNavigate={() => console.log('Navigated')} />
    </div>
  );
}
