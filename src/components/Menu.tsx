import React from 'react';
import style  from '../style/mystyle.module.css'
import { MenuItem } from '../pages/types';
type MenuProps = {
    items: MenuItem[];
    title?: string
};

const Menu: React.FC<MenuProps> = ({ items,title }) => {
    return (
        <div className={style.menu}>
            {title && <h1 className='text-xl' >{title}</h1> }  
            {items.map((item) => (
                <a key={item.id} onClick={item.onClick} className={`${style.menuItem} ${item.disabled ? 'disabled-link' : ''}`}>
                    {item.label}
                </a>
            ))}
        </div>
    );
};

export default Menu;
