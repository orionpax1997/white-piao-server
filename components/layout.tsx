import Navbar from '@/components/navbar';
const Layout: React.FC = ({ children }) => (
  <div className="container mx-auto min-h-screen">
    <Navbar />
    <div className="flex flex-col justify-around h-[calc(100vh-66px)]">{children}</div>
  </div>
);

export default Layout;
