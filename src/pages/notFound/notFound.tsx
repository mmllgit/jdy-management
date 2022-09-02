import React from "react";
import styles from "./notFound.module.less";

const NotFound: React.FC = () => {
  return (
    <div className={styles['center']}>
      <img src={require("../../assets/notFound/NF.png")} alt='404'/>
      <h3>您的页面已丢失</h3>
    </div>
  );
};

export default NotFound  
