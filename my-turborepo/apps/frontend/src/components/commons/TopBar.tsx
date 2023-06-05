import { FC, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import backArrow from '../../assets/images/arrow-icon.png';
import menuIcon from '../../assets/images/menu-icon.png';

export type MenuItem = {
  name: string;
  onClick: () => void;
};

type TopBarProps = {
  title: string;
  subtitle?: string;
  menuItems?: MenuItem[];
  hideBackButton?: boolean;
  backRoute: string; // todo set to optional, now mandatory to show where it is missing
};

const TopBar: FC<TopBarProps> = ({
  title,
  subtitle,
  menuItems,
  hideBackButton,
  backRoute,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  let padding;
  if (subtitle) {
    padding = 'px-0 py-0 mt-0 ml-2';
  } else {
    padding = 'p-0 mt-5 ml-2';
  }

  const onMenuClick = () => {
    setMenuOpen((prev) => !prev);
  };

  const onBackClick = () => {
    backRoute != undefined
      ? navigate(backRoute)
      : console.log('Error: missing back route');
  };

  return (
    <div className="bg-default-green w-screen h-20 rounded-b-lg absolute inset-x-0 top-0 flex">
      <div className="mr-4">
        {!hideBackButton && (
          <button
            className="bg-transparent p-0 m-0 mr-4"
            onClick={() => onBackClick()}
          >
            <img
              src={backArrow}
              alt="back"
              className="h-4 w-2 absolute top-7 left-4"
            />
          </button>
        )}
      </div>
      <div className="truncate mr-16">
        {subtitle && (
          <h2 className="text-white-smoke px-0 py-0 mt-2 ml-2 truncate">
            {subtitle}
          </h2>
        )}
        <h1 className={'text-white-smoke text-left truncate ' + padding}>
          {title}
        </h1>
      </div>
      <div>
        {menuItems && (
          <button
            className="bg-transparent p-0 m-0"
            type="button"
            onClick={() => onMenuClick()}
          >
            <img
              src={menuIcon}
              alt="menu"
              className="h-8 w-8 absolute top-5 right-4"
            />
          </button>
        )}
        {menuOpen && (
          <div className="absolute top-16 right-4 w-36 h-fit bg-white-smoke rounded-lg shadow-lg text-dark-grey text-sm p-3 z-40">
            <ul className="flex flex-col gap-2">
              {menuItems?.map((item, index) => (
                <li
                  key={index}
                  className="py-1 cursor-pointer"
                  onClick={item.onClick}
                >
                  {item.name}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default TopBar;
