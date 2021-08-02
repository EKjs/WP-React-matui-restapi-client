import {makeStyles} from '@material-ui/core/styles'

const drawerWidth = 240;

const useStyles = makeStyles((theme)=>({
  container:{
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(10,0,6)
    /* paddingTop:'100px' */
  },
  imageContainer:{
    objectFit: 'cover',
    minHeight: '200px',
    width:'auto',
    maxHeight: '500px',
    backgroundRepeat:'no-repeat',
    backgroundSize:'100%',
  },

  icon:{
    marginRight:'20px',
  },
  buttons:{
    marginTop:'40px',
  },
  cardGrid:{
    padding:'20px 0',
  },
  card:{
    height:'100%',
    display:'flex',
    flexDirection:'column',
  },
  cardMedia:{
    paddingTop:'56.25%',
  },
  cardContent:{
  flexGrow:1,
  },
  notALink:{
    textDecoration:'none',
    color:theme.palette.text.primary,
  },


  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },


  input: {
    marginLeft: theme.spacing(1),
    flex: 1,
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },

}));

export default useStyles