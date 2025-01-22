import React, { useState, PropsWithChildren, Children } from 'react';
import style  from '../style/mystyle.module.css'
import { useRef,useEffect } from 'react';
import { MenuItem } from '../pages/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faAngleRight, faL } from '@fortawesome/free-solid-svg-icons'
import { faAngleLeft } from '@fortawesome/free-solid-svg-icons'




type MenuProps = {
    items: MenuItem[]; 
    cardPerView: number
};
const MenuSlider : React.FC<PropsWithChildren<MenuProps>>  = (props) => {

    const listElementRef = useRef<HTMLLIElement>(null); 
    const carouselElementRef = useRef<HTMLUListElement>(null); 
    const [chilldrenList, setChildrenList] = useState<MenuItem[]>([...props.items])
    const [isTransition,setTransition] = useState(true)
    const liElementSizeRef = useRef(0);

    useEffect(() => {
        setChildrenList(list => [
            ...props.items.slice(-props.cardPerView),
            ...list,
            ...props.items.slice(props.cardPerView)
        ]);
        if (listElementRef.current) {
            liElementSizeRef.current= listElementRef.current.offsetWidth
        }
    }, []);
    useEffect(() => {
        if (listElementRef.current) {
            liElementSizeRef.current = listElementRef.current.offsetWidth
        }
    },[chilldrenList]) 

    const handleClick = (type: boolean) => {
        if(carouselElementRef.current) carouselElementRef.current.scrollLeft += type === false ? -liElementSizeRef.current : liElementSizeRef.current
    } 
    const infiniteScroll = async () => {
         const current  = carouselElementRef.current
         if(current === null) return;

         if(current.scrollLeft === 0)
         {
            setTransition(prev => false)
            setTimeout(() => setTransition(prev => {
                current.scrollLeft = current.scrollWidth - (2 * current.offsetWidth)
                return true
            }),0)
         }
         else if (Math.ceil(current.scrollLeft) === current.scrollWidth - current.offsetWidth)
         {
            setTransition(prev => false)
            setTimeout(() => setTransition(prev => {
                current.scrollLeft = current.offsetWidth
                return true
            }),0)
         }
    }
    return (<>
        <div className={style.MenuSlider}>
            <header>
                {props.children}
            </header>
            <div className={[style.iconLeft, style.icon].join(' ')} onClick={(e) => handleClick(false)} >
                <FontAwesomeIcon icon={faAngleLeft}  />
            </div>
            <ul className={[style.menuCarousel, isTransition ? '' : style.noTransition].join(" ")} ref={carouselElementRef} onScroll={infiniteScroll}> 
                    {chilldrenList.map((item,index) =>
                        <li key={index} className={style.card} ref={index === 0 ? listElementRef : null}>
                            <div className={style.cardPhoto}>
                                <img src={item.img}></img>
                            </div>
                            <div className='flex justify-stretch items-center flex-col px-5 w-full h-full'>
                                <h2 className='text-2xl font-bold py-2'>{item.label}</h2>
                                <span className='inline-flex text-lg px-2 pb-2 grow'>{item.desc}</span>
                                <button onClick={item.onClick} className="w-1/2 text-lg font-semibold text-white bg-blue-700 hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 rounded-lg text-sm px-10 py-2 text-center me-2 mb-4 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Graj</button>
                            </div>
                            
                        </li>
                    )}
            </ul>
            <div className={[style.iconRight, style.icon].join(' ')} onClick={(e) => handleClick(true)} > 
                <FontAwesomeIcon icon={faAngleRight} />
            </div>
        </div>
    </>)
}
export default MenuSlider