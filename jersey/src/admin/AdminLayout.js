// // AdminLayout.js
// import React from 'react';
// import Header from './components/Header';
// import Sidebar from './components/Sidebar';
// import { Outlet } from 'react-router-dom';

// const AdminLayout = () => {
//   return (
//     <div >
//       <Header />
//       <div className="d-flex m-0">
//   <Sidebar />
//   <main className="flex-grow-1 p-4" style={{ background: '#f8f9fc', minHeight: '100vh',}}>
//     <Outlet />
//   </main>
//       </div>
//     </div>
//   );
// };

// export default AdminLayout;
// AdminLayout.js
import React from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import { Outlet } from 'react-router-dom';

const AdminLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Header />
      <div style={{ display: 'flex', flex: 1 }}>
        <Sidebar />
        <main style={{
          flexGrow: 1,
          background: '#f8f9fc',
          padding: '2rem',
          overflowY: 'auto',
        }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
