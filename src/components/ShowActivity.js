import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { getDataFromServer,sendDataToServer } from "./DataSender";
import { Map, Marker } from "pigeon-maps";
import { Link } from "react-router-dom";
import {Typography, Grid,Container,Chip,IconButton} from '@material-ui/core';
import Carousel from 'react-material-ui-carousel';
import useStyles from "../styles";
import {DeleteForever as DeleteForeverIcon, Edit as EditIcon} from '@material-ui/icons';
import {Button,Dialog,DialogActions,DialogContent,DialogContentText,DialogTitle} from '@material-ui/core';
import { useHistory } from "react-router-dom";

const ShowActivity = () => {
    const [loggedIn,setLoggedIn]=useState(true);
    const [open, setOpen] = useState(false);
    
    
    const history = useHistory();

    const classes = useStyles();
    const {activityId} = useParams();
    const [activityData,setActivityData]=useState();
    const [loading,setLoading]=useState(true);

    const deleteItemFromDataBase = async () => {
        const result = await sendDataToServer({route:`activities/${activityId}`,reqMethod:'DELETE'});
        if (result.status===200){
            history.push(`/activities`);
            console.log('deleted successfully',result);
        }else{
            console.log('something went wrong...',result);
        }
    }
    useEffect(()=>{
        setLoggedIn(true);//JFF
        const getData = async () => {
            setLoading(true);
            const resAct = await getDataFromServer({route:'activities',id:activityId});
            console.log(resAct);
            setActivityData(resAct);
            setLoading(false);
        }
        getData();
    },[activityId]);

    if (loading)return <p>Loading...</p>
    return (<Container maxWidth='md' className={classes.cardGrid} >
                <Grid container spacing={4}>
                    <Grid item xs={12} sm={6} md={4}>
                        <Map height={300} defaultCenter={activityData.coords} defaultZoom={16}>
                            <Marker width={50} anchor={activityData.coords} />
                        </Map>
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                        <Typography gutterBottom variant='h5'>
                            {activityData.activityName}
                        </Typography>
                        <Typography variant="subtitle1">
                            {activityData.description}
                        </Typography>
                        <Typography variant="body2"  color="textSecondary">
                            Category: {activityData.category}<br/>
                            Subcategory:{activityData.subCategory}<br/>
                            Duration:{activityData.durationText}<br/>
                            {activityData.time && <>Time information: {activityData.time}</>} <br/>
                            {activityData.age===0 || !activityData.age ? <>Minimal age not set</> : <>Minimal age {activityData.age}</>}    
                        </Typography>
                        <Typography variant="body2">
                            Address: {activityData.address},<br/>
                            <Link className={classes.notALink} to={`/activities/cities/${activityData.cityId}`}>{activityData.cityName}</Link>,{' '}
                            <Link className={classes.notALink} to={`/activities/regions/${activityData.regionId}`}>{activityData.regionName}</Link>
                        </Typography>
                    </Grid>
            </Grid>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={6}>
                <Carousel indicators={true}>
                    {/* {picture.map( (item, i) => <img key={i} src={item} /> )} */}
                    {activityData.picture.map((url,idx)=>(<div key={`imgKey${idx}`} className={classes.imageContainer} style={{backgroundImage:`url(${url})`}}>
                    </div>
                    ))}
                </Carousel> 
                </Grid>
            </Grid>
            <Grid container spacing={4}>
                <Grid item xs={12} sm={6} md={4}>
                    <Chip clickable variant="outlined" color="primary" size="small" label={activityData.subCategory} component={Link} to={`/activities/subcategories/${activityData.subCategoryId}`} />
                    <Chip clickable variant="outlined" color="primary" size="small" label={activityData.category} component={Link} to={`/activities/categories/${activityData.categoryId}`} />
                    <Chip clickable variant="outlined" color="primary" size="small" label={activityData.durationText} component={Link} to={`/activities/durations/${activityData.durationId}`} />
                </Grid>
            </Grid>
            {loggedIn && (<><Grid container spacing={4}>
                <IconButton color="inherit" aria-label="Edit activity" component={Link} to={`/editactivity/${activityId}`} edge="start">
                    <EditIcon />
                </IconButton>
                <IconButton color="inherit" aria-label="Delete activity" onClick={()=>setOpen(true)} component={Link} edge="start">
                    <DeleteForeverIcon />
                </IconButton>
            </Grid>
            
            <Dialog open={open} onClose={()=>setOpen(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
                <DialogTitle id="alert-dialog-title">{"Confirmation required"}</DialogTitle>
            <DialogContent>
                <DialogContentText id="alert-dialog-description">
                    Are you sure you want to delete this activity?
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
        </Container>)
};
export default ShowActivity

/* <img  src= alt={url} width='200px' height='100px' /> */