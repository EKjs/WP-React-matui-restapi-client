import {useContext, useState } from 'react';
import clsx from 'clsx';
import {Typography, AppBar,IconButton, Drawer, List,ListItem, ListItemIcon,ListItemText,Divider, Toolbar,FormControlLabel,Switch} from '@material-ui/core';
import {Menu as MenuIcon,ChevronLeft as ChevronLeftIcon,ChevronRight as ChevronRightIcon,FindInPage as FindInPageIcon,DirectionsRun as DirectionsRunIcon,LocationCity as LocationCityIcon,Explore as ExploreIcon,Category as CategoryIcon,AccessTime as AccessTimeIcon ,Subject as SubjectIcon} from '@material-ui/icons/';
import {NoteAdd as NoteAddIcon, AddBox as AddBoxIcon, AddLocation as AddLocationIcon, PostAdd as PostAddIcon, AddPhotoAlternate as AddPhotoAlternateIcon, AlarmAdd as AlarmAddIcon} from '@material-ui/icons';
import { useTheme } from '@material-ui/core/styles';
import useStyles from "../styles";

import { Link as RouterLink } from "react-router-dom";

import LoginContext from "./LoginContext";

const NavbarComp = () => {
  const {isLoggedIn, setIsLoggedIn} = useContext(LoginContext);
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = useState(false);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  return (<>
    <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap>
            Activities for everyone!
          </Typography>
        </Toolbar>
      </AppBar>

<Drawer
variant="permanent"
className={clsx(classes.drawer, {
  [classes.drawerOpen]: open,
  [classes.drawerClose]: !open,
})}
classes={{
  paper: clsx({
    [classes.drawerOpen]: open,
    [classes.drawerClose]: !open,
  }),
}}
>
<div className={classes.toolbar}>
  <IconButton onClick={handleDrawerClose}>
    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
  </IconButton>
</div>
<Divider />
<List>
    <ListItem button component={RouterLink} to="/" >
      <ListItemIcon><FindInPageIcon/></ListItemIcon>
      <ListItemText primary="Main page" />
    </ListItem>
    <ListItem button component={RouterLink} to="/activities" >
      <ListItemIcon><DirectionsRunIcon/></ListItemIcon>
      <ListItemText primary="Activities" />
    </ListItem>
</List>
<Divider />
<List>
    <ListItem button component={RouterLink} to="/cities" >
      <ListItemIcon><LocationCityIcon/></ListItemIcon>
      <ListItemText primary="Cities" />
    </ListItem>
    <ListItem button component={RouterLink} to="/regions" >
      <ListItemIcon><ExploreIcon/></ListItemIcon>
      <ListItemText primary="Regions" />
    </ListItem>
    <ListItem button component={RouterLink} to="/categories" >
      <ListItemIcon><CategoryIcon/></ListItemIcon>
      <ListItemText primary="Categories" />
    </ListItem>
    <ListItem button component={RouterLink} to="/subcategories" >
      <ListItemIcon><SubjectIcon/></ListItemIcon>
      <ListItemText primary="Subategories" />
    </ListItem>
    <ListItem button component={RouterLink} to="/durations" >
      <ListItemIcon><AccessTimeIcon/></ListItemIcon>
      <ListItemText primary="Duration" />
    </ListItem>
</List>
{isLoggedIn && (<><Divider />
  <List>
    <ListItem button component={RouterLink} to="/newactivity" >
      <ListItemIcon><AddBoxIcon/></ListItemIcon>
      <ListItemText primary="Add activity" />
    </ListItem>
    <ListItem button component={RouterLink} to="/newcity" >
      <ListItemIcon><AddLocationIcon/></ListItemIcon>
      <ListItemText primary="Add city" />
    </ListItem>
    <ListItem button component={RouterLink} to="/newregion" >
      <ListItemIcon><AddPhotoAlternateIcon/></ListItemIcon>
      <ListItemText primary="Add region" />
    </ListItem>
    <ListItem button component={RouterLink} to="/newcategory" >
      <ListItemIcon><NoteAddIcon/></ListItemIcon>
      <ListItemText primary="Add category" />
    </ListItem>
    <ListItem button component={RouterLink} to="/newsubcategory" >
      <ListItemIcon><PostAddIcon/></ListItemIcon>
      <ListItemText primary="Add sub-category" />
    </ListItem>
    <ListItem button component={RouterLink} to="/newduration" >
      <ListItemIcon><AlarmAddIcon/></ListItemIcon>
      <ListItemText primary="Add duration" />
    </ListItem>
</List></>
)}

<FormControlLabel control={<Switch checked={isLoggedIn} onChange={()=>setIsLoggedIn(!isLoggedIn)} aria-label="login switch" />} />
</Drawer></>
  )

}
export default NavbarComp