import { getDataFromServer,sendDataToServer } from "./DataSender";
import Pagination from '@material-ui/lab/Pagination';
import { useContext,useEffect, useState } from "react";
import { Grid,Container, Typography,IconButton} from "@material-ui/core";
import useStyles from "../styles";
import { Link } from "react-router-dom";
import {Button,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle,CircularProgress} from '@material-ui/core';
import {DeleteForever as DeleteForeverIcon, Edit as EditIcon} from '@material-ui/icons';
import { useHistory } from "react-router-dom";
import LoginContext from "./LoginContext";

const pageInfos = {
    '/cities':{
        route:'cities',
        headerText:'cities',
        dbCol:'name',
        editorRoute:'editcity',
    },
    '/regions':{
        route:'regions',
        headerText:'regions',
        dbCol:'regionName',
        editorRoute:'editregion',
    },
    '/subcategories':{
        route:'subcategories',
        headerText:'subcategories',
        dbCol:'subCategory',
        editorRoute:'editsubcategory',
    },
    '/categories':{
        route:'categories',
        headerText:'categories',
        dbCol:'category',
        editorRoute:'editcategory',
    },
    '/durations':{
        route:'duration',
        headerText:'duration',
        dbCol:'durationText',
        editorRoute:'editduration',
    }
};

const ListBrowser = ({match}) => {
    const classes = useStyles();
    const perPage=20;
    const [page,setPage]=useState(0);
    const [listOfItems,setListOfItems]=useState();
    const [loading,setLoading]=useState(true);
    const {isLoggedIn} = useContext(LoginContext);

    const [itemToDelete,setItemToDelete]=useState();
    const [open, setOpen] = useState(false);
    const history = useHistory();
    const deleteItemFromDataBase = async () => {
        console.log('delete',itemToDelete);
        const result = await sendDataToServer({route:`${itemToDelete.route}/${itemToDelete.item}`,reqMethod:'DELETE'});
        if (result.status===200){
            history.push(itemToDelete.route);
            console.log('deleted successfully',result);
            setOpen(false)
        }else{
            console.log('something went wrong...',result);
        }
    }

    useEffect(()=>{

        const getData = async () => {
            const res = await getDataFromServer({route:pageInfos[match.path].route,limit:perPage,skip:perPage*page});
            setListOfItems(res);
            setLoading(false);
        }
        getData();
    },[match,page])

    if (loading)return <div style={{display: 'flex', justifyContent: 'center'}}><CircularProgress /></div>

    return (<>
        <Container maxWidth='md'>
          <Typography variant='h4' align='center' color='textPrimary' gutterBottom>
              Browse {pageInfos[match.path].headerText}
          </Typography>
        </Container>
        <Container maxWidth='md' className={classes.cardGrid} >
            <Grid container spacing={4}>
                {listOfItems.items.map((item,idx)=> 
                <Grid item xs={6} sm={6} md={3} key={`lstKey${idx}`}>
                <Link to={`/activities${match.path}/${item.id}`} className={classes.notALink} >{item[pageInfos[match.path].dbCol]}</Link>
                {isLoggedIn && (<><br/>
                    <IconButton color="inherit" aria-label="Edit activity" component={Link} to={`/${pageInfos[match.path].editorRoute}/${item.id}`} edge="start">
                        <EditIcon />
                    </IconButton>
                    <IconButton color="inherit" aria-label="Delete activity" onClick={()=>{
                        setItemToDelete({route:pageInfos[match.path].route,item:item.id});
                        setOpen(true);
                    }} edge="start">
                        <DeleteForeverIcon />
                    </IconButton>
                </>
                )}
                </Grid>
                )}
            </Grid>
        </Container>
        <Container maxWidth='md'>
            <Grid container justifyContent = "center">
                <Pagination count={Math.ceil(listOfItems.total/perPage)} shape="rounded" page={page+1} onChange={(e,newPage) => setPage(newPage-1)} />
            </Grid>
        </Container>

        {isLoggedIn && (<>            
            <Dialog open={open} onClose={()=>setOpen(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"Confirmation required"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this item?
                </DialogContentText>
            </DialogContent>
        <DialogActions>
          <Button onClick={()=>setOpen(false)} color="primary">
            Disagree
          </Button>
          <Button onClick={deleteItemFromDataBase} color="primary" autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>

            </>
            )}

        </>)
}

export default ListBrowser