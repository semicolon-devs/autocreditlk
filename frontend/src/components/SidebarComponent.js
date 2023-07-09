import { useState } from "react";
import { Link } from "react-router-dom";
import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import {
  MenuIcon,
  HomeIcon,
  SettingsIcon,
  LogoutIcon,
  GroupAddIcon,
  ManageAccountsIcon,
  PersonAddIcon,
  InsightsIcon,
  AdminDashboardIcon,
} from "./Icon";
import { menuClasses } from "../utils/utilityClasses";

const themes = {
  sidebar: {
    backgroundColor: "#581c87",
    color: "#faf5ff",
  },
  menu: {
    menuContent: "#581c87",
    icon: "#faf5ff",
    hover: {
      backgroundColor: "#3b0764",
      color: "#f3e8ff",
    },
    disabled: {
      color: "#a855f7",
    },
  },
};

const hexToRgba = (hex, alpha) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const SidebarComponent = () => {
  const [collapsed, setCollapsed] = useState(true);
  // const [toggled, setToggled] = useState(false);

  const menuItemStyles = {
    root: {
      fontSize: "13px",
      fontWeight: 400,
    },
    icon: {
      color: themes.menu.icon,
      [`&.${menuClasses.disabled}`]: {
        color: themes.menu.disabled.color,
      },
    },
    SubMenuExpandIcon: {
      color: "#faf5ff",
    },
    subMenuContent: function ({ level }) {
      return {
        backgroundColor:
          level === 0
            ? hexToRgba(themes.menu.menuContent, !collapsed ? 0.4 : 1)
            : "transparent",
      };
    },
    button: {
      [`&.${menuClasses.disabled}`]: {
        color: themes.menu.disabled.color,
      },
      "&:hover": {
        backgroundColor: themes.menu.hover.backgroundColor,
        color: themes.menu.hover.color,
      },
      padding: "10px",
    },
    label: function ({ open }) {
      return {
        fontWeight: open ? 600 : undefined,
      };
    },
  };

  return (
    <Sidebar
      collapsed={collapsed}
      // toggled={toggled}
      collapsedWidth="60px"
      backgroundColor={hexToRgba(themes.sidebar.backgroundColor, 1)}
      rootStyles={{
        color: themes.sidebar.color,
      }}
      style={{ border: "none" }}
    >
      <Menu menuItemStyles={menuItemStyles}>
        <MenuItem
          className="menu"
          icon={<MenuIcon />}
          onClick={() => setCollapsed(!collapsed)}
        >
          {/* <h2>Auto Credit</h2> */}
        </MenuItem>
        <MenuItem
          icon={<HomeIcon />}
          component={<Link to="/" className="link" />}
        >
          Home
        </MenuItem>
        <SubMenu label="Admin Dashboard" icon={<AdminDashboardIcon />}>
          <MenuItem icon={<InsightsIcon />}> Insights </MenuItem>
          <MenuItem
            icon={<PersonAddIcon />}
            component={<Link to="/add-customer" className="link" />}
          >
            Add Customer
          </MenuItem>
          <MenuItem icon={<ManageAccountsIcon />}> Manage Users </MenuItem>
        </SubMenu>
        <MenuItem
          icon={<SettingsIcon />}
          component={<Link to="/account-settings" className="link" />}
        >
          Account Settings
        </MenuItem>
        <MenuItem icon={<LogoutIcon />}> Log out </MenuItem>
      </Menu>
    </Sidebar>
  );
};

export default SidebarComponent;
