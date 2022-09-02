import React from "react";
import { Outlet } from "react-router-dom";

const StaffManage: React.FC = () => {
  return (
    <div>
      <Outlet></Outlet>
    </div>
  );
};

export default StaffManage
