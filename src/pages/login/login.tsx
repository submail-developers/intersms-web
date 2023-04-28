import React, { FC } from "react";
import { NavLink } from 'react-router-dom';


const Fn: FC = () => {
  return (
    <div>
      <NavLink to='/console/customer/sendlist'>login</NavLink>
    </div>
  );
};

export default Fn;